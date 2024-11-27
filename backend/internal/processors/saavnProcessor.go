package processors

import (
	"beat-bridge/internal/models"
	"log"
)


func Search(track *models.PlaylistTrackObject) (*models.SaavnSong, error) {
    // Search by name
    // Search album and then retrieve by album
    // Search artist and then retrieve by artist
}

func SearchBySongName(track *models.PlaylistTrackObject) (*models.SaavnSongSearchResponse, error) {
    // pass
}

func SearchByArtistName(track *models.PlaylistTrackObject) (*models.SaavnArtistSearchResponse, error) {

}

func SearchByAlbumName(track *models.PlaylistTrackObject) (*models.SaavnAlbumSearchResponse, error) {

}

func SearchBySongID(track *models.PlaylistTrackObject) (*models.SaavnSongSearchResponse, error) {
    // pass
}

func SearchByAlbumID(track *models.PlaylistTrackObject) (*models.SaavnAlbumSearchResponse, error) {

}

func FindBestMatch(SearchResults *[]models.SaavnSong, track *models.PlaylistTrackObject) (*models.SaavnSong, error) {
    // pass
}

func DownloadSong(song *models.SaavnSong, songPath string) error {
    log.Printf("Downloading song for track: %s\n", song.Name)
    return nil
}
