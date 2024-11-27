package processors

import (
	"beat-bridge/internal/models"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
)

// Base Request Function
func DoRequest(method, urlStr string, headers map[string]string, data interface{}, params map[string]string) ([]byte, error) {
	req := fasthttp.AcquireRequest()
	resp := fasthttp.AcquireResponse()
	defer fasthttp.ReleaseRequest(req)
	defer fasthttp.ReleaseResponse(resp)

	// Add query parameters to the URL
	if len(params) > 0 {
		parsedURL, err := url.Parse(urlStr)
		if err != nil {
			return nil, err
		}
		query := parsedURL.Query()
		for key, value := range params {
			query.Set(key, value)
		}
		parsedURL.RawQuery = query.Encode()
		urlStr = parsedURL.String()
	}

	req.SetRequestURI(urlStr)
	req.Header.SetMethod(strings.ToUpper(method))

	// Add headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Prepare the request body
	if data != nil {
		if headers["Content-Type"] == "application/x-www-form-urlencoded" {
			formData := url.Values{}
			for key, value := range data.(map[string]string) {
				formData.Set(key, value)
			}
			req.SetBody([]byte(formData.Encode()))
		} else {
			jsonData, err := json.Marshal(data)
			if err != nil {
				return nil, err
			}
			req.SetBody(jsonData)
		}
	}

	// Perform the HTTP request
	client := &fasthttp.Client{}
	err := client.Do(req, resp)
	if err != nil {
		return nil, err
	}

	// Check for non-200 status codes
	if resp.StatusCode() != fasthttp.StatusOK {
		return nil, fmt.Errorf("request failed with status code %d: %s", resp.StatusCode(), string(resp.Body()))
	}

	return resp.Body(), nil

}

// PerformRequest sends an HTTP request using fasthttp with the specified method, URL, headers, body, and query parameters.
func PerformRequest(method, urlStr string, headers map[string]string, data interface{}, params map[string]string, v interface{}) error {
	body, err := DoRequest(method, urlStr, headers, data, params)
	if err != nil {
		return err
	}

	// Unmarshal the response body into the provided struct
	if v != nil {
		if err := json.Unmarshal(body, v); err != nil {
			return err
		}
	}

	return nil
}

func download_songs(track models.PlaylistTrackObject) (string, error) {
	newUUID := uuid.New().String()

	// Create a temporary directory for processing
	tempDir, err := os.MkdirTemp("", newUUID)
	if err != nil {
		return "", fmt.Errorf("failed to create temporary directory: %w", err)
	}
	defer func() {
		if err := os.RemoveAll(tempDir); err != nil {
			fmt.Printf("Failed to remove temporary directory: %v\n", err)
		}
	}()

	// Channels for capturing results
	searchResultChan := make(chan interface{}, 1)
	searchErrorChan := make(chan error, 1) // Channel for search errors
	imageDownloadErrChan := make(chan error, 1)

	// Start the search process in a goroutine
	go func() {
		defer close(searchResultChan)
		defer close(searchErrorChan)
		searchResult, err := search(&track) // capture error if any
		if err != nil {
			searchErrorChan <- fmt.Errorf("search failed for track: %s, error: %w", track.Track.Name, err)
			return
		}
		searchResultChan <- searchResult
	}()

	// Start the image download process
	go func() {
		defer close(imageDownloadErrChan)
		imageDownloadErr := download_image(&track, tempDir)
		imageDownloadErrChan <- imageDownloadErr
	}()

	// Wait for the search result or error
	select {
	case searchResult := <-searchResultChan:
		if searchResult == nil {
			return "", fmt.Errorf("search returned nil result for track: %s", track.Track.Name)
		}
	case err := <-searchErrorChan:
		return "", err // Propagate search error
	}

	// Wait for image download result
	imageDownloadErr := <-imageDownloadErrChan
	if imageDownloadErr != nil {
		return "", fmt.Errorf("failed to download image for track: %s, error: %w", track.Track.Name, imageDownloadErr)
	}

	// Process the search result to download the song
	songPath := filepath.Join(tempDir, fmt.Sprintf("%s.mp3", track.Track.Name))
	if err := download_song(searchResult, songPath); err != nil {
		return "", fmt.Errorf("failed to download song for track: %s, error: %w", track.Track.Name, err)
	}

	// Encode the song details
	encodedSongPath := filepath.Join(tempDir, fmt.Sprintf("%s_encoded.mp3", track.Track.Name))
	if err := encode_song(songPath, encodedSongPath); err != nil {
		return "", fmt.Errorf("failed to encode song for track: %s, error: %w", track.Track.Name, err)
	}

	// Upload the image and song to MinIO
	imagePath := filepath.Join(tempDir, fmt.Sprintf("%s.jpg", track.Track.Name))
	imageMinioURL, err := upload_to_minio(imagePath, "images/")
	if err != nil {
		return "", fmt.Errorf("failed to upload image to MinIO: %w", err)
	}

	songMinioURL, err := upload_to_minio(encodedSongPath, "songs/")
	if err != nil {
		return "", fmt.Errorf("failed to upload song to MinIO: %w", err)
	}

	// Save the song details in the database
	if err := save_to_database(track, songMinioURL, imageMinioURL); err != nil {
		return "", fmt.Errorf("failed to save song details to database: %w", err)
	}

	// Return the MinIO URL for the uploaded song
	return songMinioURL, nil
}
