package controllers

import (
    "github.com/gofiber/fiber/v2"
    "beat-bridge/internal/services"
)

// GET Requests

func GetSpotifyPlaylistList(c *fiber.Ctx) error {
    headers := c.GetReqHeaders()
    data, err := services.AllSpotifyPlaylists(headers)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}
