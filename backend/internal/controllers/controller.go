package controllers

import (
    "github.com/gofiber/fiber/v2"
    "spotify-next/backend/internal/services"
)

func GetSpotifyData(c *fiber.Ctx) error {
    id := c.Params("id")
    data, err := services.FetchSpotifyData(id)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}

// Similar methods for other services like Saavn and YouTube.
