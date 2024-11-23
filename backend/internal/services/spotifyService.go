package services

import (
	"beat-bridge/internal/constants"
	"beat-bridge/internal/models"
	"beat-bridge/internal/processors"
	"encoding/base64"
	"fmt"

	"github.com/rs/zerolog/log"
)

// GetAuthToken retrieves the Spotify authentication token
func GetAuthToken(headerData *models.SpotfyRequestHeader, tokenResponse *models.SpotifyAccessTokenResponse) error {
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

// GetSpotifyAuthHeader retrieves the Spotify authorization header
func GetSpotifyAuthHeader(headers *models.SpotfyRequestHeader) (map[string]string, error) {
	var tokenResponse models.SpotifyAccessTokenResponse
	if err := GetAuthToken(headers, &tokenResponse); err != nil {
		return nil, err
	}

	header := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", tokenResponse.AccessToken),
		"Content-Type":  "application/json",
	}
	return header, nil
}

// AllSpotifyPlaylists retrieves all Spotify playlists
func AllSpotifyPlaylists(headers *models.SpotfyRequestHeader) (*models.SpotifyAllPlaylistsResponse, error) {
	spotifyHeader, err := GetSpotifyAuthHeader(headers)
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
	spotifyHeader, err := GetSpotifyAuthHeader(headers)
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
