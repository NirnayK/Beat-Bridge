# Beat Bridge

Beat Bridge is a web application that integrates with various music streaming services like Spotify, Saavn, and YouTube to provide a unified experience for managing playlists and songs.

## Features

- Fetch and display playlists from Spotify and YouTube.
- Fetch and display songs from Spotify and YouTube.
- Unified interface for managing music across multiple platforms.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/beat-bridge.git
    cd beat-bridge
    ```

2. Install dependencies:
    ```sh
    go mod tidy
    ```

3. Set up environment variables:
    ```sh
    export SPOTIFY_CLIENT_ID=your_spotify_client_id
    export SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    export YOUTUBE_API_KEY=your_youtube_api_key
    ```

4. Run the application:
    ```sh
    go run main.go
    ```

## Configuration

The application uses a configuration file to manage settings. The configuration file is located at `config/config.go`.

## Routes

### Spotify Routes

- `GET /spotify/playlist/:id` - Fetch a Spotify playlist by ID.
- `GET /spotify/all_playlist` - Fetch all Spotify playlists.
- `GET /spotify/song/:id` - Fetch a Spotify song by ID.
- `GET /spotify/all_songs` - Fetch all Spotify songs.

### YouTube Routes

- `GET /youtube/playlist/:id` - Fetch a YouTube playlist by ID.
- `GET /youtube/all_playlist` - Fetch all YouTube playlists.
- `GET /youtube/song/:id` - Fetch a YouTube song by ID.
- `GET /youtube/all_songs` - Fetch all YouTube songs.

## Logging

The application uses `zerolog` for logging. Logs are output to the console with a specific time format.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.