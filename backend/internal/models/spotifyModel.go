package models

// Request structs
type SpotifyUserPlaylistRequest struct {
    UserID string `json:"user_id" validate:"required"`
    Limit  int    `json:"limit" validate:"min=1,max=50,default=20"`
    Offset int    `json:"offset" validate:"min=0,max=100000,default=0"`
}

type SpotifyAlbumTracksRequest struct {
    ID     string `json:"id" validate:"required"`
    Market string `json:"market,omitempty"`
    Limit  int    `json:"limit" validate:"min=1,max=50,default=20"`
    Offset int    `json:"offset" validate:"min=0,default=0"`
}

type SpotifyUserSavedAlbumsRequest struct {
    Limit  int    `json:"limit" validate:"min=1,max=50,default=20"`
    Offset int    `json:"offset" validate:"min=0,default=0"`
    Market string `json:"market,omitempty"`
}

type SpotifyPlaylistTracksRequest struct {
    PlaylistID      string `json:"playlist_id" validate:"required"`
    Market          string `json:"market,omitempty"`
    Fields          string `json:"fields,omitempty"`
    Limit           int    `json:"limit" validate:"min=1,max=50,default=20"`
    Offset          int    `json:"offset" validate:"min=0,default=0"`
    AdditionalTypes string `json:"additional_types,omitempty"`
}

type SpotifyAccessTokenRequest struct {
    GrantType    string `json:"grant_type" validate:"required"`
    Code         string `json:"code" validate:"required"`
    RedirectURI  string `json:"redirect_uri" validate:"required"`
}

// Response structs
type SpotifyUserPlaylistResponse struct {
    Href     string                   `json:"href"`
    Next     *string                  `json:"next"`
    Items    []SimplifiedPlaylistObject `json:"items" validate:"required"`
}

type SpotifyAlbumTracksResponse struct {
    Href     string                  `json:"href" validate:"required"`
    Limit    int                     `json:"limit" validate:"required"`
    Next     *string                 `json:"next"`
    Offset   int                     `json:"offset" validate:"required"`
    Previous *string                 `json:"previous"`
    Total    int                     `json:"total" validate:"required"`
    Items    []SimplifiedTrackObject `json:"items" validate:"required"`
}

type SpotifyUserSavedAlbumsResponse struct {
    Href     string                  `json:"href" validate:"required"`
    Limit    int                     `json:"limit" validate:"required"`
    Next     *string                 `json:"next"`
    Offset   int                     `json:"offset" validate:"required"`
    Previous *string                 `json:"previous"`
    Total    int                     `json:"total" validate:"required"`
    Items    []SavedAlbumObject      `json:"items" validate:"required"`
}

type SpotifyAccessTokenResponse struct {
    AccessToken  string `json:"access_token" validate:"required"`
    TokenType    string `json:"token_type" validate:"required"`
    ExpiresIn    int    `json:"expires_in" validate:"required"`
}


type SavedAlbumObject struct {
    AddedAt string       `json:"added_at"`
    Album   AlbumObject  `json:"album"`
}

type SpotifyPlaylistTracksResponse struct {
    Href     string                  `json:"href" validate:"required"`
    Limit    int                     `json:"limit" validate:"required"`
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
    ExternalURLs  ExternalURLs      `json:"external_urls"`
    Href          string            `json:"href"`
    ID            string            `json:"id"`
    Images        []ImageObject     `json:"images"`
    Name          string            `json:"name"`
    Public        *bool             `json:"public"`
    Tracks        PlaylistTracks    `json:"tracks"`
}

type SimplifiedTrackObject struct {
    Artists         []SimplifiedArtistObject `json:"artists"`
    AvailableMarkets []string                `json:"available_markets"`
    DiscNumber      int                      `json:"disc_number"`
    DurationMs      int                      `json:"duration_ms"`
    Explicit        bool                     `json:"explicit"`
    ExternalURLs    ExternalURLs             `json:"external_urls"`
    Href            string                   `json:"href"`
    ID              string                   `json:"id"`
    IsPlayable      bool                     `json:"is_playable"`
    LinkedFrom      *LinkedTrackObject       `json:"linked_from,omitempty"`
    Name            string                   `json:"name"`
    PreviewURL      *string                  `json:"preview_url"`
    TrackNumber     int                      `json:"track_number"`
    Type            string                   `json:"type"`
    URI             string                   `json:"uri"`
    IsLocal         bool                     `json:"is_local"`
}

type SimplifiedArtistObject struct {
    ExternalURLs ExternalURLs `json:"external_urls"`
    Href         string       `json:"href"`
    ID           string       `json:"id"`
    Name         string       `json:"name"`
    Type         string       `json:"type"`
    URI          string       `json:"uri"`
}

type ExternalURLs struct {
    Spotify string `json:"spotify"`
}

type ImageObject struct {
    URL    string `json:"url"`
    Height int    `json:"height"`
    Width  int    `json:"width"`
}

type LinkedTrackObject struct {
    ExternalURLs ExternalURLs `json:"external_urls"`
    Href         string       `json:"href"`
    ID           string       `json:"id"`
    Type         string       `json:"type"`
    URI          string       `json:"uri"`
}

type PlaylistTracks struct {
    Href  string `json:"href"`
    Total int    `json:"total"`
}

type UserObject struct {
    DisplayName  string `json:"display_name"`
    ExternalURLs ExternalURLs `json:"external_urls"`
    Href         string `json:"href"`
    ID           string `json:"id"`
    Type         string `json:"type"`
    URI          string `json:"uri"`
}

type AlbumObject struct {
    AlbumType            string            `json:"album_type"`
    Artists              []SimplifiedArtistObject `json:"artists"`
    AvailableMarkets     []string          `json:"available_markets"`
    ExternalURLs         ExternalURLs      `json:"external_urls"`
    Href                 string            `json:"href"`
    ID                   string            `json:"id"`
    Images               []ImageObject     `json:"images"`
    Name                 string            `json:"name"`
    ReleaseDate          string            `json:"release_date"`
    ReleaseDatePrecision string            `json:"release_date_precision"`
    TotalTracks          int               `json:"total_tracks"`
    Type                 string            `json:"type"`
    URI                  string            `json:"uri"`
}

type ErrorResponse struct {
    Status  int    `json:"status" validate:"required"`
    Message string `json:"message" validate:"required"`
}
