package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"service-tracker/internal/handlers"
	"service-tracker/internal/middleware"
	"service-tracker/pkg/api"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()

	connStr := os.Getenv("DATABASE_URL") // from docker-compose.yml
	if connStr == "" {
		connStr = "postgres://postgres:postgres@localhost:5432/service_tracker" // default to local postgres for dev
	}

	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	err = pool.Ping(ctx)
	if err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}

	log.Println("Successfully connected to the database!")

	// Create the server and apply the handlers
	server := handlers.NewServer(pool)
	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	router.Use(middleware.RequestLogger)

	api.HandlerFromMux(server, router)

	// Set up and start the HTTP server
	port := "8080"
	serverAddr := fmt.Sprintf(":%s", port)

	s := &http.Server{
		Addr:         serverAddr,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	log.Printf("Service Tracker Server starting on http://localhost%s", serverAddr)

	if err := s.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}
}
