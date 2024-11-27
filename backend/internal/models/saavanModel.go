package models

type SaavnSongIDResponse struct {
    Status  string `json:"status"`
    Data    struct {
        Songs   []SaavnSong `json:"songs"`
    } `json:"data"`
}

type SaavnSongSearchResponse struct {
    Status  string `json:"status"`
    Message string `json:"message"`
    Data    struct {
        Total   int          `json:"total"`
        Start   int          `json:"start"`
        Results []SaavnSong `json:"results"`
    } `json:"data"`
}

type SaavnAlbumSearchResponse struct {
    Status string `json:"status"`
    Data   struct {
        Total  int           `json:"total"`
        Start  int           `json:"start"`
        Results []SaavnAlbum `json:"results"`
    } `json:"data"`
}

type SaavnAlbumIDResponse struct {
    Status string     `json:"status"`
    Data   SaavnAlbum `json:"data"`
}

type SaavnArtistSearchResponse struct {
    Status string `json:"status"`
    Data  struct {
        Total   int           `json:"total"`
        Start   int           `json:"start"`
        Results []SaavnArtist `json:"results"`
    } `json:"data"`
}

type SaavnCommon struct {
    ID            string            `json:"id"`
    Name          string            `json:"name"`
    Type          string            `json:"type"`
    Image         []SaavnImage      `json:"image"`
    Language      string            `json:"language"`
    Year          int               `json:"year"`
    Explicit      bool              `json:"explicit"`
    ArtistMap     SaavnArtistMap    `json:"artist_map"`
    Duration      int               `json:"duration"`
    ReleaseDate   string            `json:"release_date"`
    ListCount     int               `json:"list_count"`
    ListType      string            `json:"list_type"`
}

type SaavnSong struct {
    SaavnCommon
    Album         string            `json:"album"`
    AlbumID       string            `json:"album_id"`
    AlbumURL      string            `json:"album_url"`
    Label         string            `json:"label"`
    Kbps320       bool              `json:"320kbps"`
    DownloadURL   []SaavnDownloadURL `json:"download_url"`
}

type SaavnAlbum struct {
    SaavnCommon
    SongCount     int               `json:"song_count"`
    Songs        []SaavnSong        `json:"songs"`
}

type SaavnImage struct {
    Quality string `json:"quality"`
    Link    string `json:"link"`
}

type SaavnArtist struct {
    ID    string       `json:"id"`
    Name  string       `json:"name"`
    URL   string       `json:"url"`
    Role  string       `json:"role"`
    Type  string       `json:"type"`
}

type SaavnDownloadURL struct {
    Quality string `json:"quality"`
    Link    string `json:"link"`
}

type SaavnArtistMap struct {
    Artists         []SaavnArtist `json:"artists"`
    FeaturedArtists []SaavnArtist `json:"featured_artists"`
    PrimaryArtists  []SaavnArtist `json:"primary_artists"`
}
