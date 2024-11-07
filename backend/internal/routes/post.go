package routes

import (
	"spotify-next/backend/internal/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupPostRoutes(app *fiber.App) {
    app.Post("/encode", controllers.EncodeMusic)
}
