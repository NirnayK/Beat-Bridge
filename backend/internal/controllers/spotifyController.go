package controllers

import (
	"beat-bridge/internal/models"
	"beat-bridge/internal/services"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

// GET Requests

func FetchSpotifyPlaylists(c *fiber.Ctx) error {
    headers := new(models.SpotfyRequestHeader)

    if err := c.ReqHeaderParser(headers); err != nil {
        return err
    }

    data, err := services.GetAllPlaylists(headers)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}

func FetchSpotifyPlaylistTracks(c *fiber.Ctx) error {
    headers := new(models.SpotfyRequestHeader)

    if err := c.ReqHeaderParser(headers); err != nil {
        return err
    }

    log.Info().Msg(c.Params("playlistID"))

    data, err := services.GetPlaylistTracks(headers, c.Params("playlistID"))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}

func DownloadSpotifyPlaylist(c *fiber.Ctx) error {
    headers := new(models.SpotfyRequestHeader)

    if err := c.ReqHeaderParser(headers); err != nil {
        return err
    }

    playlistID := c.Params("playlistID")
    log.Info().Msgf("Fetching playlist with ID: %s", playlistID)

    // Fetch all the songs in the playlist
    songs, err := services.DownloadPlaylist(headers, playlistID)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    // Set up streaming response
    c.Set("Content-Type", "application/octet-stream")
    c.Set("Content-Disposition", `attachment; filename="playlist_stream.txt"`)

    for data := range songs {
        if _, err := c.Write([]byte(data + "\n")); err != nil {
            return c.Status(fiber.StatusInternalServerError).SendString("Error while streaming data")
        }
    }

    return nil
}
