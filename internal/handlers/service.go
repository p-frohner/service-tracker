package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"service-tracker/pkg/api"
	"sync"
	"time"
)

type Server struct {
	Vehicles map[string]api.Vehicle
	// Records  map[string]map[string]api.MaintenanceRecord
	Mu sync.Mutex
}

func NewServer() *Server {
	return &Server{
		Vehicles: make(map[string]api.Vehicle),
		// Records:  make(map[string]map[string]api.MaintenanceRecord),
		Mu: sync.Mutex{},
	}
}

// GetVehicles handles GET /vehicles
// It retrieves all vehicles currently stored in the in-memory map.
func (s *Server) GetVehicles(w http.ResponseWriter, r *http.Request) {
	s.Mu.Lock()
	defer s.Mu.Unlock()

	// Convert the map of Vehicle structs to a slice of Vehicle structs.
	vehicles := make([]api.Vehicle, 0, len(s.Vehicles))
	for _, v := range s.Vehicles {
		vehicles = append(vehicles, v)
	}

	// Set the Content-Type header and status code (200 OK).
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode the slice of vehicles to the response writer.
	if err := json.NewEncoder(w).Encode(vehicles); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

// PostVehicles handles POST /vehicles
// It create the vehicle and stores it in the in-memory map.
func (s *Server) PostVehicles(w http.ResponseWriter, r *http.Request) {
	var newVehicle api.Vehicle

	// If request body is invalid, return an error
	err := json.NewDecoder(r.Body).Decode(&newVehicle)
	if err != nil {
		http.Error(w, "Invalid request body or JSON format", http.StatusBadRequest)
		return
	}

	idString := fmt.Sprintf("veh-%d", time.Now().UnixNano())
	newVehicle.Id = &idString // Assign the memory address of the string

	s.Mu.Lock()
	s.Vehicles[*newVehicle.Id] = newVehicle
	s.Mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(newVehicle)
}
