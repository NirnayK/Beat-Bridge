package main

import (
	"os"
	"time"

	"beat-bridge/config"
	"beat-bridge/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
    // Set up zerolog
    zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
    log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr,  TimeFormat: time.RFC3339})

    // Load config
    cfg := config.LoadConfig()

    // Initialize Fiber app
    app := fiber.New()

    // Set up routes
    // routes.AllSourcesRoutes(app)
    routes.SpotifyRoutes(app)
    // routes.YouTubeRoutes(app)
    // routes.EncodeRoutes(app)

    // Start the server
    log.Info().Msgf("Server running on %s", cfg.ServerAddress)
    if err := app.Listen(cfg.ServerAddress); err != nil {
        log.Fatal().Err(err).Msg("Failed to start server")
    }
}
