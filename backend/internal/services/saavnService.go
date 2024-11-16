package services

import "beat-bridge/internal/processors"

func FetchSaavnData(id string) (string, error) {
    return processors.ProcessSaavnData(id)
}
