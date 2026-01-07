package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"service-tracker/pkg/api"
	"time"
)

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

	// Validate the request body
	if err := s.validateRequest(w, r, &newVehicle); err != nil {
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

// DeleteVehiclesVehicleId handles DELETE /vehicles/{vehicleId}
func (s *Server) DeleteVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	s.Mu.Lock()
	defer s.Mu.Unlock()

	// Check if the vehicle exists
	if _, exists := s.Vehicles[vehicleId]; !exists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	// Remove from the map
	delete(s.Vehicles, vehicleId)

	// 204 No Content is the standard response for a successful deletion
	w.WriteHeader(http.StatusNoContent)
}

// GetVehiclesVehicleId handles GET /vehicles/{vehicleId}
func (s *Server) GetVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	s.Mu.Lock()
	defer s.Mu.Unlock()

	vehicle, exists := s.Vehicles[vehicleId]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vehicle)
}

// PutVehiclesVehicleId handles PUT /vehicles/{vehicleId}
func (s *Server) PutVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	var updatedVehicle api.Vehicle

	// Validate the request body
	if err := s.validateRequest(w, r, &updatedVehicle); err != nil {
		return
	}

	s.Mu.Lock()
	defer s.Mu.Unlock()

	if _, exists := s.Vehicles[vehicleId]; !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	// Ensure the ID in the body matches the URL or stay consistent
	updatedVehicle.Id = &vehicleId
	s.Vehicles[vehicleId] = updatedVehicle

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedVehicle)
}
