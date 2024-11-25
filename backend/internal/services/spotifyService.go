package services

import (
	"beat-bridge/internal/constants"
	"beat-bridge/internal/models"
	"beat-bridge/internal/processors"
	"encoding/base64"
	"fmt"

	"github.com/rs/zerolog/log"
)

// FetchSpotifyToken retrieves the Spotify authentication token
func FetchSpotifyToken(headerData *models.SpotfyRequestHeader, tokenResponse *models.SpotifyAccessTokenResponse) error {
	headerData.Initialize()
	clientID := headerData.ClientID
	clientSecret := headerData.ClientSecret
	authString := fmt.Sprintf("%s:%s", clientID, clientSecret)
	authBase64 := base64.StdEncoding.EncodeToString([]byte(authString))
	url := constants.SpotifyApiToken

	headers := map[string]string{
		"Authorization": fmt.Sprintf("Basic %s", authBase64),
		"Content-Type":  "application/x-www-form-urlencoded",
	}

	data := map[string]string{"grant_type": "client_credentials"}

	if err := processors.PerformRequest("POST", url, headers, data, nil, tokenResponse); err != nil {
		log.Error().Err(err).Msg("Failed to create request")
		return err
	}

	log.Info().Msg("Successfully retrieved auth token")
	return nil
}

// SpotifyAuthHeader retrieves the Spotify authorization header
func SpotifyAuthHeader(headers *models.SpotfyRequestHeader) (map[string]string, error) {
	var tokenResponse models.SpotifyAccessTokenResponse
	if err := FetchSpotifyToken(headers, &tokenResponse); err != nil {
		return nil, err
	}

	header := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", tokenResponse.AccessToken),
		"Content-Type":  "application/json",
	}
	return header, nil
}

// GetAllPlaylists retrieves all Spotify playlists
func GetAllPlaylists(headers *models.SpotfyRequestHeader) (*models.SpotifyAllPlaylistsResponse, error) {
	spotifyHeader, err := SpotifyAuthHeader(headers)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf(constants.SpotifyUserPlaylistListURL, headers.UserID)

	var allPlaylists []models.SimplifiedPlaylistObject
	var playlistResponse models.SpotifyUserPlaylistResponse

	for {
		if err := processors.PerformRequest("GET", url, spotifyHeader, nil, nil, &playlistResponse); err != nil {
			log.Error().Err(err).Msg("Failed to create request")
			return nil, err
		}

		allPlaylists = append(allPlaylists, playlistResponse.Items...)

		if playlistResponse.Next == nil || *playlistResponse.Next == "" {
			break
		}

		url = *playlistResponse.Next
	}

	log.Info().Msg("Successfully retrieved all Spotify playlists")
	return &models.SpotifyAllPlaylistsResponse{Playlists: allPlaylists}, nil
}

// GetPlaylistTracks retrieves all tracks from a Spotify playlist
func GetPlaylistTracks(headers *models.SpotfyRequestHeader, playlistID string) (*[]models.PlaylistTrackObject, error) {
	spotifyHeader, err := SpotifyAuthHeader(headers)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf(constants.SpotifyPlaylistTracksURL, playlistID)

	var allTracks []models.PlaylistTrackObject
	var trackResponse models.SpotifyPlaylistTracksResponse

	for {
		if err := processors.PerformRequest("GET", url, spotifyHeader, nil, nil, &trackResponse); err != nil {
			log.Error().Err(err).Msg("Failed to create request")
			return nil, err
		}

		allTracks = append(allTracks, trackResponse.Items...)

		if trackResponse.Next == nil || *trackResponse.Next == "" {
			break
		}

		url = *trackResponse.Next
	}

	log.Info().Msg("Successfully retrieved all tracks from Spotify playlist")
	return &allTracks, nil
}

func DownloadPlaylist(headers *models.SpotfyRequestHeader, playlistID string) (<-chan string, error) {
    allTracks, err := GetPlaylistTracks(headers, playlistID)
    if err != nil {
        return nil, err
    }

    // Create a channel to stream data
    dataChannel := make(chan string)

    // Create a worker pool with a maximum of 10 concurrent workers
    workerCount := len(*allTracks)
    jobs := make(chan models.PlaylistTrackObject, len(*allTracks))
    done := make(chan bool)

    // Worker function that processes the songs
    worker := func() {
        for track := range jobs {
            trackData, err := processors.download_songs(track)
            if err != nil {
                log.Error().Err(err).Msgf("Failed to process track: %s", track.Track.Name)
                continue
            }
            dataChannel <- trackData
        }
        done <- true
    }

    // Launch workers
    for i := 0; i < workerCount; i++ {
        go worker()
    }

    // Distribute the tracks among workers
    go func() {
        for _, track := range *allTracks {
            jobs <- track
        }
        close(jobs)
    }()

    // Close the dataChannel once all workers are done
    go func() {
        for i := 0; i < workerCount; i++ {
            <-done
        }
        close(dataChannel)
    }()

    return dataChannel, nil
}
