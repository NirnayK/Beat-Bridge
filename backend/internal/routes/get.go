package routes

import (
    "github.com/gofiber/fiber/v2"
    "spotify-next/backend/internal/controllers"
)

func SetupGetRoutes(app *fiber.App) {
    app.Get("/spotify/:id", controllers.GetSpotifyData)
    // Add routes for Saavn and YouTube as needed
}
