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
func GetAuthToken(header_map map[string][] string) (interface{}, error) {
    clientID := header_map["clientID"][0]
    clientSecret := header_map["clientSecret"]
    authString := fmt.Sprintf("%s:%s", clientID, clientSecret)
    authBase64 := base64.StdEncoding.EncodeToString([]byte(authString))
    url := constants.SpotifyApiToken
    headers := map[string]string{
        "Authorization": fmt.Sprintf("Basic %s", authBase64),
        "Content-Type":  "application/x-www-form-urlencoded",
    }
    data := map[string]string{"grant_type": "client_credentials"}

    request, err := processors.CreateRequest("POST", url, headers, data, nil)
    if err != nil {
        log.Error().Err(err).Msg("Failed to create request")
        return nil, err
    }

    response, err := processors.DoRequest(request, &models.SpotifyAccessTokenResponse{})
    if err != nil {
        log.Error().Err(err).Msg("Failed to get auth token")
        return nil, err
    }

    log.Info().Msg("Successfully retrieved auth token")
    return response, nil
}

// GetSpotifyAuthHeader retrieves the Spotify authorization header
func GetSpotifyAuthHeader(header_map map[string][]string) (map[string] string, error) {
    token, err := GetAuthToken(header_map)
    if err != nil {
        return "", err
    }
    header := make(map[string] string)
    header["Authorization"] = fmt.Sprintf("Bearer %s", token.(*models.SpotifyAccessTokenResponse).AccessToken)
    return header, nil
}

// AllSpotifyPlaylists retrieves all Spotify playlists
func AllSpotifyPlaylists(header_map map[string][] string) (interface{}, error) {
    header, err := GetSpotifyAuthHeader(header_map)
    if err != nil {
        return nil, err
    }

    url := fmt.Sprintf(constants.SpotifyUserPlaylistListURL, header_map["userID"])
    request, err := processors.CreateRequest("GET", url, header, nil, nil)
    // Add your logic to fetch all Spotify playlists here
    log.Info().Msg("Successfully retrieved Spotify auth header")
    return nil, nil
}
