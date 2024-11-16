package constants

const (
	    // Base URLs
	SpotifyBaseURL = "https://api.spotify.com/v1"

	// Spotify URLs
	SpotifyApiToken             = "https://accounts.spotify.com/api/token"
	SpotifyUserPlaylistListURL  = SpotifyBaseURL + "/users/%s/playlists"
	SpotifyUserAlbumListURL     = SpotifyBaseURL + "/me/albums"
	SpotifyAlbumTracksURL       = SpotifyBaseURL + "/albums/%s/tracks"
	SpotifyPlaylistTracksURL    = SpotifyBaseURL + "/playlists/%s/tracks"
)