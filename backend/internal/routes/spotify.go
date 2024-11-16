package routes

import (
	"beat-bridge/internal/controllers"

	"github.com/gofiber/fiber/v2"
)

func SpotifyRoutes(app *fiber.App) {
    // GET routes
    app.Get("api/v1/spotify/all_playlist", controllers.GetSpotifyPlaylistList)

}