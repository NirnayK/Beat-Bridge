package processors

import (
	"beat-bridge/internal/models"
	"fmt"
	"os"
	"path/filepath"
)

func download_image(track *models.PlaylistTrackObject, folder string) error {
	images := track.Track.Album.Images
	if len(images) == 0 {
		return fmt.Errorf("no images found for track %s", track.Track.Name)
	}
	var image_url string
	width := 0

	for _, image := range images {
		if image.Width > width {
			image_url = image.URL
			width = image.Width
		}
	}
	if image_url == "" {
		return fmt.Errorf("no images found for track %s", track.Track.Name)
	}

	data, err := DoRequest("GET", image_url, nil, nil, nil)
	if err != nil {
		return err
	}

	filepath := filepath.Join(folder, fmt.Sprintf("%s.png", track.Track.Name))
	file, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	if _, err := file.Write(data); err != nil {
		return err
	}

	return nil
}
