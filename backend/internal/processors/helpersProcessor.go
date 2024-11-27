package processors

import (
	"beat-bridge/config"
	"beat-bridge/internal/constants"
	"beat-bridge/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"mime"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
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

func DownloadSongs(track models.PlaylistTrackObject) (string, error) {
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

	// Channels to capture errors and results
	imageUploadErrChan := make(chan error, 1)
	songUploadErrChan := make(chan error, 1)
	dbSaveErrChan := make(chan error, 1)
	imageURLChan := make(chan string, 1)
	songURLChan := make(chan string, 1)

	// Start the image download process in a goroutine
	go func() {
		defer close(imageURLChan)
		defer close(imageUploadErrChan)

		imagePath := filepath.Join(tempDir, fmt.Sprintf(constants.ImagePath, track.Track.Name))
		if err := DownloadImage(&track, tempDir); err != nil {
			imageUploadErrChan <- fmt.Errorf("failed to download image for track: %s, error: %w", track.Track.Name, err)
			return
		}

		imageMinioURL, err := MinioUpload(imagePath, constants.MinioImageBucket)
		if err != nil {
			imageUploadErrChan <- fmt.Errorf("failed to upload image to MinIO: %w", err)
			return
		}

		imageURLChan <- imageMinioURL
		imageUploadErrChan <- nil
	}()

	// Start the song encoding and upload process in a goroutine
	go func() {
		defer close(songUploadErrChan)
		defer close(songURLChan)

		songPath := filepath.Join(tempDir, fmt.Sprintf(constants.RawSongPath, track.Track.Name))
		encodedSongPath := filepath.Join(tempDir, fmt.Sprintf(constants.EncodedSongPath, track.Track.Name))

		// Search for the song
		songData, err := Search(&track)
		if err != nil {
			songUploadErrChan <- fmt.Errorf("failed to search for song: %w", err)
			return
		}

		// Download the song and encode it
		if err := DownloadSong(songData, songPath); err != nil {
			songUploadErrChan <- fmt.Errorf("failed to download song for track: %s, error: %w", track.Track.Name, err)
			return
		}

		if err := EncodeSong(songPath, encodedSongPath); err != nil {
			songUploadErrChan <- fmt.Errorf("failed to encode song for track: %s, error: %w", track.Track.Name, err)
			return
		}

		// Upload the encoded song to MinIO
		songMinioURL, err := MinioUpload(encodedSongPath, fmt.Sprintf(constants.MinioSongBucket, track.Track.Album.Name))
		if err != nil {
			songUploadErrChan <- fmt.Errorf("failed to upload song to MinIO: %w", err)
			return
		}

		// Send the song URL to the channel
		songURLChan <- songMinioURL
		songUploadErrChan <- nil
	}()

	// Start saving the song details in the database in a goroutine
	go func() {
		defer close(dbSaveErrChan)
		// Wait until we have the MinIO URLs (after uploads)
		imageUploadErr := <-imageUploadErrChan
		if imageUploadErr != nil {
			dbSaveErrChan <- imageUploadErr
			return
		}

		songUploadErr := <-songUploadErrChan
		if songUploadErr != nil {
			dbSaveErrChan <- songUploadErr
			return
		}

		// // Now save the song details to the database
		// if err := save_to_database(track, <-imageURLChan, <-songURLChan); err != nil {
		// 	dbSaveErrChan <- fmt.Errorf("failed to save song details to database: %w", err)
		// 	return
		// }

		// No error, send nil to the channel
		dbSaveErrChan <- nil
	}()

	select {
	case err = <-imageUploadErrChan:
		if err != nil {
			return "", err
		}
	case err = <-songUploadErrChan:
		if err != nil {
			return "", err
		}
	case err = <-dbSaveErrChan:
		if err != nil {
			return "", err
		}
	}

	return <-songURLChan, nil 
}

func getContentType(filePath string) string {
	// Get the file extension
	ext := filepath.Ext(filePath)

	// Look up the MIME type based on the extension
	contentType := mime.TypeByExtension(ext)

	// Fallback to "application/octet-stream" if the type can't be determined
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	return contentType
}

func MinioUpload(localFilePath, bucketName, destinationPath string) (string, error) {
	// Upload the file
	contentType := getContentType(localFilePath) // Adjust content type if necessary
	uploadInfo, err := config.MinioClient.FPutObject(context.Background(), bucketName, destinationPath, localFilePath, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to MinIO: %w", err)
	}

	log.Printf("Successfully uploaded %s to bucket %s with size %d\n", destinationPath, bucketName, uploadInfo.Size)

	// Construct the URL of the uploaded file
	fileURL := fmt.Sprintf("https://%s/%s/%s", os.Getenv("MINIO_ENDPOINT"), bucketName, destinationPath)

	return fileURL, nil
}
