package services

import "spotify-next/backend/internal/processors"

func FetchSaavnData(id string) (string, error) {
    return processors.ProcessSaavnData(id)
}
