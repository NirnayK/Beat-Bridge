package config

import (
    "github.com/minio/minio-go/v7"
    "github.com/minio/minio-go/v7/pkg/credentials"
)

type Config struct {
    ServerAddress string
    // DatabaseURL   string
    MinioClient   *minio.Client
}

func LoadConfig() Config {
    endpoint := os.Getenv("MINIO_SERVER_ADDRESS")
    accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
    secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
    useSSL := true

    // Initialize minio client object.
    minioClient, err := minio.New(endpoint, &minio.Options{
            Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
            Secure: useSSL,
    })
    if err != nil {
            log.Fatalln(err)
    }

    log.Printf("%#v\n", minioClient) // minioClient is now set up

    return Config{
        ServerAddress: os.Getenv("BACKEND_SERVER_ADDRESS"),
        // DatabaseURL:   os.Getenv("DATABASE_URL"),
        MinioClient:   minioClient,
    }
}

func LoadMinio