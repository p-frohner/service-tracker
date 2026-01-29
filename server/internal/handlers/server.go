package handlers

import (
	"net/http"
	"os"
	"service-tracker/internal/api"
	"service-tracker/internal/db"
	"service-tracker/internal/storage"

	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	Pool       *pgxpool.Pool
	Queries    *db.Queries
	Hub        *Hub
	ImageStore *storage.ImageStore
}

func NewServer(pool *pgxpool.Pool) *Server {
	hub := NewHub()
	go hub.Run()

	storagePath := os.Getenv("IMAGE_STORAGE_PATH")
	if storagePath == "" {
		storagePath = "./storage/images"
	}

	return &Server{
		Pool:       pool,
		Queries:    db.New(pool),
		Hub:        hub,
		ImageStore: storage.NewImageStore(storagePath),
	}
}

func (s *Server) Routes() http.Handler {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(middleware.Logger)

	// WebSocket endpoint
	r.Get("/ws", s.HandleWebSocket)

	// Static image serving
	r.Get("/images/{vehicleId}/{filename}", s.ServeImage)

	// TODO: Restrict for dev only
	r.Post("/dev/vehicles/{vehicleId}/generate-maintenance", s.GenerateMockMaintenanceRecords)

	// Register OpenAPI generated routes
	api.HandlerFromMux(s, r)

	return r
}

func (s *Server) Start(addr string) error {
	srv := &http.Server{
		Addr:         addr,
		Handler:      s.Routes(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	return srv.ListenAndServe()
}
