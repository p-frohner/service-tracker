package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"service-tracker/internal/handlers"
	"service-tracker/pkg/api"

	"github.com/go-chi/chi/v5"
)

func main() {
	// Initialize handler implementation
	appServer := handlers.NewServer()

	// Use the generated wrapper to create a Chi router
	router := chi.NewRouter()

	// This generated function connects the chi router to your ServerInterface implementation
	api.HandlerFromMux(appServer, router)

	// Define the port (using the port you set in OpenAPI, e.g., 8080)
	port := "8080"
	serverAddr := fmt.Sprintf(":%s", port)

	// Set up the HTTP server configuration
	s := &http.Server{
		Addr:         serverAddr,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	// Start the server
	log.Printf("Service Tracker Server starting on http://localhost%s", serverAddr)

	if err := s.ListenAndServe(); err != http.ErrServerClosed {
		// Log a fatal error if the server fails to start
		log.Fatalf("Server failed: %v", err)
	}
}
