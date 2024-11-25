package models

type SongResponse struct {
    Status  string `json:"status"`
    Data    SongData `json:"data"`
}

type SongData struct {
    Songs   []Song   `json:"songs"`
}

type Song struct {
    ID             string       `json:"id"`
    Name           string       `json:"name"`
    Subtitle       string       `json:"subtitle"`
    Type           string       `json:"type"`
    Image          []Image      `json:"image"`
    Language       string       `json:"language"`
    Year           int          `json:"year"`
    Explicit       bool         `json:"explicit"`
    ArtistMap      ArtistMap    `json:"artist_map"`
    Album          string       `json:"album"`
    AlbumID        string       `json:"album_id"`
    Label          string       `json:"label"`
    Kbps320        bool         `json:"320kbps"`
    DownloadURL    []Download   `json:"download_url"`
    Duration       int          `json:"duration"`
}

type Image struct {
    Quality string `json:"quality"`
    Link    string `json:"link"`
}

type ArtistMap struct {
    Artists         []Artist `json:"artists"`
    FeaturedArtists []Artist `json:"featured_artists"`
    PrimaryArtists  []Artist `json:"primary_artists"`
}

type Artist struct {
    ID    string   `json:"id"`
    Name  string   `json:"name"`
}

type Download struct {
    Quality string `json:"quality"`
    Link    string `json:"link"`
}
