package services

import "spotify-next/backend/internal/processors"

func FetchYouTubeData(id string) (string, error) {
    return processors.ProcessYouTubeData(id)
}
