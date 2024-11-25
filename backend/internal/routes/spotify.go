package routes

import (
	"beat-bridge/internal/controllers"

	"github.com/gofiber/fiber/v2"
)

func SpotifyRoutes(app *fiber.App) {
    // GET routes
    app.Get("api/spotify/playlists", controllers.FetchSpotifyPlaylists)
	app.Get("api/spotify/playlist/:playlistID/tracks", controllers.FetchSpotifyPlaylistTracks)
	app.Get("api/spotify/playlist/:playlistID/download", controllers.FetchSpotifyPlaylistTrack)
}