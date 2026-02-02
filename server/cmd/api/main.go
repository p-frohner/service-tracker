package main

import (
	"context"
	"log"
	"service-tracker/internal/config"
	"service-tracker/internal/handlers"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Configuration error: %v", err)
	}

	ctx := context.Background()

	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}

	log.Println("Successfully connected to the database!")

	server := handlers.NewServer(pool)

	log.Printf("Service Tracker Server starting on :%s", cfg.Port)
	if err := server.Start(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
