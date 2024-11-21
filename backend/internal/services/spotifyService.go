package services

import (
	"beat-bridge/internal/constants"
	"beat-bridge/internal/models"
	"beat-bridge/internal/processors"
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/rs/zerolog/log"
)

// GetAuthToken retrieves the Spotify authentication token
func GetAuthToken(header_data *models.SpotfyRequestHeader) (interface{}, error) {
    clientID := header_data.ClientID
    clientSecret := header_data.ClientSecret
    authString := fmt.Sprintf("%s:%s", clientID, clientSecret)
    authBase64 := base64.StdEncoding.EncodeToString([]byte(authString))
    url := constants.SpotifyApiToken
    headers := map[string]string{
        "Authorization": fmt.Sprintf("Basic %s", authBase64),
        "Content-Type":  "application/x-www-form-urlencoded",
    }
    data := map[string]string{"grant_type": "client_credentials"}

    response, err := processors.PerformRequest("POST", url, headers, data, nil)
    if err != nil {
        log.Error().Err(err).Msg("Failed to create request")
        return nil, err
    }

    var tokenResponse models.SpotifyAccessTokenResponse
    if err := json.Unmarshal(response.Body(), &tokenResponse); err != nil {
		return nil, err
	}

    log.Info().Msg("Successfully retrieved auth token")
    return tokenResponse.AccessToken, nil
}

// GetSpotifyAuthHeader retrieves the Spotify authorization header
func GetSpotifyAuthHeader(headers *models.SpotfyRequestHeader) (map[string] string, error) {
    token, err := GetAuthToken(headers)
    if err != nil {
        return nil, err
    }
    header := make(map[string] string)
    header["Authorization"] = fmt.Sprintf("Bearer %s", token.(*models.SpotifyAccessTokenResponse).AccessToken)
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
        response, err := processors.PerformRequest("GET", url, spotifyHeader, nil, nil)
        if err != nil {
            log.Error().Err(err).Msg("Failed to create request")
            return nil, err
        }

        if err := json.Unmarshal(response.Body(), &playlistResponse); err != nil {
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
