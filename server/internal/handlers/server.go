package handlers

import (
	"service-tracker/pkg/api"
	"sync"
)

type Server struct {
	Vehicles map[string]api.Vehicle
	Mu       sync.Mutex
}

func NewServer() *Server {
	return &Server{
		Vehicles: make(map[string]api.Vehicle),
		Mu:       sync.Mutex{},
	}
}
