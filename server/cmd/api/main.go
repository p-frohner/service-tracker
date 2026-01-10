package main

import (
	"context"
	"log"
	"os"
	"service-tracker/internal/handlers"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:postgres@localhost:5432/service_tracker"
	}

	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}

	log.Println("Successfully connected to the database!")

	server := handlers.NewServer(pool)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Service Tracker Server starting on :%s", port)
	if err := server.Start(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
