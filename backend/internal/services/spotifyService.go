package services

import "spotify-next/backend/internal/processors"

func FetchSpotifyData(id string) (string, error) {
    return processors.ProcessSpotifyData(id)
}
