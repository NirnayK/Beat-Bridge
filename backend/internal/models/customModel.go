package models

type SpotfyRequestHeader struct {
	ClientID     string `json:"clientID"`
	ClientSecret string `json:"clientSecret"`
	UserID       string `json:"userID"`
}

type SpotifyAllPlaylistsResponse struct {
	Playlists []SimplifiedPlaylistObject `json:"items"`
}
