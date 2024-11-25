package constants

const (
	// Base URLs
	SaavnBaseURL = "http://localhost:3000/"
	
	// Query Search
	SaavnSongQueryURL = SaavnBaseURL + "search/songs"
	SaavnAlbumQueryURL = SaavnBaseURL + "search/albums"
	SaavnPlaylistQueryURL = SaavnBaseURL + "search/artists"

	// ID Search
	SaavnSongIdURL = SaavnBaseURL + "song"
	SaavnAlbumIdURL = SaavnBaseURL + "album"
	SaavnArtistIdURL = SaavnBaseURL + "artist"
)