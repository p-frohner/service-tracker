package handlers

import (
	"service-tracker/internal/db"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	Pool    *pgxpool.Pool
	Queries *db.Queries
}

func NewServer(pool *pgxpool.Pool) *Server {
	return &Server{
		Pool:    pool,
		Queries: db.New(pool), // sqlc helper that links queries to the pool
	}
}
