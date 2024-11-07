package main

import (
	"log"

	"github.com/NirnayK/beat-bridge/backend/config"
	"github.com/NirnayK/beat-bridge/backend/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
    // Load config
    cfg := config.LoadConfig()

    // Initialize Fiber app
    app := fiber.New()

    // Set up routes
    routes.SetupRoutes(app)

    // Start the server
    log.Printf("Server running on %s", cfg.ServerAddress)
    if err := app.Listen(cfg.ServerAddress); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
