package config

import (
	"errors"
	"os"
)

type Config struct {
	DatabaseURL  string
	Port         string
	SerperAPIKey string
}

func Load() (*Config, error) {
	serperAPIKey := os.Getenv("SERPER_API_KEY")
	if serperAPIKey == "" {
		return nil, errors.New("SERPER_API_KEY is required")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgres@localhost:5432/service_tracker"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		DatabaseURL:  databaseURL,
		Port:         port,
		SerperAPIKey: serperAPIKey,
	}, nil
}
