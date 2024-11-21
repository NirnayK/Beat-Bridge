package controllers

import (
	"beat-bridge/internal/models"
	"beat-bridge/internal/services"

	"github.com/gofiber/fiber/v2"
)

// GET Requests

func GetSpotifyPlaylistList(c *fiber.Ctx) error {
    headers := new(models.SpotfyRequestHeader)

    if err := c.ReqHeaderParser(headers); err != nil {
        return err
    }

    data, err := services.AllSpotifyPlaylists(headers)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}
