package models

import "os"

type SpotfyRequestHeader struct {
	ClientID     string `json:"clientID"`
	ClientSecret string `json:"clientSecret"`
	UserID       string `json:"userID"`
}

func (h *SpotfyRequestHeader) Initialize() {
    if h.ClientID == "" {
        h.ClientID = os.Getenv("SPOTIFY_CLIENT_ID")
    }
    if h.ClientSecret == "" {
        h.ClientSecret = os.Getenv("SPOTIFY_CLIENT_SECRET")
    }
    if h.UserID == "" {
        h.UserID = os.Getenv("SPOTIFY_USER_ID")
    }
}

type SpotifyAllPlaylistsResponse struct {
	Playlists []SimplifiedPlaylistObject `json:"items"`
}
