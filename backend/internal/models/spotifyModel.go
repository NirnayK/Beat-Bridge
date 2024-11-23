package models

// Request structs
type SpotifyAccessTokenRequest struct {
    GrantType    string `json:"grant_type" validate:"required"`
    Code         string `json:"code" validate:"required"`
    RedirectURI  string `json:"redirect_uri" validate:"required"`
}

// Response structs
type SpotifyAccessTokenResponse struct {
    AccessToken  string `json:"access_token" validate:"required"`
    TokenType    string `json:"token_type" validate:"required"`
    ExpiresIn    int    `json:"expires_in" validate:"required"`
}

type SpotifyUserPlaylistResponse struct {
    Next     *string                  `json:"next"`
    Items    []SimplifiedPlaylistObject `json:"items" validate:"required"`
}

type SpotifyPlaylistTracksResponse struct {
    Next     *string                 `json:"next"`
    Offset   int                     `json:"offset" validate:"required"`
    Previous *string                 `json:"previous"`
    Total    int                     `json:"total" validate:"required"`
    Items    []PlaylistTrackObject   `json:"items" validate:"required"`
}

type PlaylistTrackObject struct {
    AddedAt string            `json:"added_at"`
    Track   SimplifiedTrackObject `json:"track"`
}

// Common structs
type SimplifiedPlaylistObject struct {
    Description   *string           `json:"description"`
    ID            string            `json:"id"`
    Images        []ImageObject     `json:"images"`
    Name          string            `json:"name"`
    Tracks        PlaylistTracks    `json:"tracks"`
}

type SimplifiedTrackObject struct {
    ALbum           AlbumObject              `json:"album"`
    Artists         []SimplifiedArtistObject `json:"artists"`
    DiscNumber      int                      `json:"disc_number"`
    DurationMs      int                      `json:"duration_ms"`
    Explicit        bool                     `json:"explicit"`
    ID              string                   `json:"id"`
    Name            string                   `json:"name"`
    TrackNumber     int                      `json:"track_number"`
}

type SimplifiedArtistObject struct {
    ID           string       `json:"id"`
    Name         string       `json:"name"`
    Type         string       `json:"type"`
}

type ImageObject struct {
    URL    string `json:"url"`
    Height int    `json:"height"`
    Width  int    `json:"width"`
}

type PlaylistTracks struct {
    Total int    `json:"total"`
}


type AlbumObject struct {
    Type                 string            `json:"type"`
    TotalTracks          int               `json:"total_tracks"`
    AlbumType            string            `json:"album_type"`
    Artists              []SimplifiedArtistObject `json:"artists"`
    Href                 string            `json:"href"`
    ID                   string            `json:"id"`
    Images               []ImageObject     `json:"images"`
    Name                 string            `json:"name"`
    ReleaseDate          string            `json:"release_date"`
    ReleaseDatePrecision string            `json:"release_date_precision"`
}

type ErrorResponse struct {
    Status  int    `json:"status" validate:"required"`
    Message string `json:"message" validate:"required"`
}
