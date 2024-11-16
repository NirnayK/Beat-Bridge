package services

import "beat-bridge/internal/processors"

func FetchYouTubeData(id string) (string, error) {
    return processors.ProcessYouTubeData(id)
}
