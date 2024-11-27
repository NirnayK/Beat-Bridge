package config

import (
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var (
    MinioClient *minio.Client
)

type Config struct {
    ServerAddress string
    // DatabaseURL   string
}

func LoadConfig() Config {
    LoadMinioClient()
    return Config{
        ServerAddress: os.Getenv("BACKEND_SERVER_ADDRESS"),
        // DatabaseURL:   os.Getenv("DATABASE_URL"),
    }
}

func LoadMinioClient() {
    endpoint := os.Getenv("MINIO_SERVER_ADDRESS")
    accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
    secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
    useSSL := true

    // Initialize minio client object.
    MinioClient, err := minio.New(endpoint, &minio.Options{
            Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
            Secure: useSSL,
    })
    if err != nil {
            log.Fatalln(err)
    }

    log.Printf("%#v\n", MinioClient) // minioClient is now set up
}
