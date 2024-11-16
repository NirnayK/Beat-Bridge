package controllers

import (
	"beat-bridge/internal/services"

	"github.com/gofiber/fiber/v2"
)

// YouTube controllers
func GetYouTubePlaylist(c *fiber.Ctx) error {
    id := c.Params("id")
    data, err := services.FetchYouTubePlaylist(id)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}

func GetAllYouTubePlaylists(c *fiber.Ctx) error {
    data, err := services.FetchAllYouTubePlaylists()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}

func GetYouTubeSong(c *fiber.Ctx) error {
    id := c.Params("id")
    data, err := services.FetchYouTubeSong(id)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}

func GetAllYouTubeSongs(c *fiber.Ctx) error {
    data, err := services.FetchAllYouTubeSongs()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(data)
}