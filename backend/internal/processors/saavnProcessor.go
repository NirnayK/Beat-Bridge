package processors

import (
	"beat-bridge/internal/models"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/valyala/fasthttp"
)


func search(track *models.PlaylistTrackObject) (*models.SaavnSong, error) {
    // search by name
    // search album and then retrieve by album
    // search artist and then retrieve by artist
}

func searchBySongName(track *models.PlaylistTrackObject) (*models.SaavnSongSearchResponse, error) {
    // pass
}

func searchByArtistName(track *models.PlaylistTrackObject) (*models.SaavnArtistSearchResponse, error) {

}

func searchByAlbumName(track *models.PlaylistTrackObject) (*models.SaavnAlbumSearchResponse, error) {

}

func searchBySongID(track *models.PlaylistTrackObject) (*models.SaavnSongSearchResponse, error) {
    // pass
}

func searchByAlbumID(track *models.PlaylistTrackObject) (*models.SaavnAlbumSearchResponse, error) {

}

func findBestMatch(searchResults *[]models.SaavnSong, track *models.PlaylistTrackObject) (*models.SaavnSong, error) {
    // pass
}

func downloadSong(song *models.SaavnSong) error {
    // pass
}
