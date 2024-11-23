package config

type Config struct {
    ServerAddress string
    // DatabaseURL   string
}

func LoadConfig() Config {
    return Config{
        ServerAddress: "localhost:8000",
        // DatabaseURL:   os.Getenv("DATABASE_URL"),
    }
}
