package processors

import (
	"beat-bridge/internal/models"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/valyala/fasthttp"
)


func search(track *models.PlaylistTrackObject) (*models.SearchResponse, error) {
    // search by name
    // search artist and then retrieve by artist
    // search album and then retrieve by album
}

func searchBySongName(track *models.PlaylistTrackObject) (*models.SearchResponse, error) {
    // pass
}

func searchByArtist(track *models.PlaylistTrackObject) (*models.SearchResponse, error) {

}

func searchByAlbum(track *models.PlaylistTrackObject) (*models.SearchResponse, error) {

}

func findBestMatch(searchResults *models.SearchResponse) (*models.SearchResult, error) {
    // pass
}

func downloadSong(song *models.SearchResult) error {
    // pass
}

