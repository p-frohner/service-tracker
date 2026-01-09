package handlers

import (
	"encoding/json"
	"net/http"
	"service-tracker/internal/db"
	"service-tracker/pkg/api"
)

// Handler for GET /vehicles
func (s *Server) GetVehicles(w http.ResponseWriter, r *http.Request) {
	dbVehicles, err := s.Queries.ListVehicles(r.Context())
	if err != nil {
		s.errorResponse(w, http.StatusInternalServerError, "Could not fetch vehicles from database")
		return
	}

	// Convert the map of Vehicle structs to a slice of Vehicle structs.
	vehicles := make([]api.Vehicle, 0, len(dbVehicles))

	for _, v := range dbVehicles {
		idStr := fromUUID(v.ID) // Convert pgtype.UUID to string for the frontend

		vehicles = append(vehicles, api.Vehicle{
			Id:    &idStr,
			Make:  v.Make,
			Model: v.Model,
			Year:  int(v.Year),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(vehicles)
}

// Handler for POST /vehicles
func (s *Server) PostVehicles(w http.ResponseWriter, r *http.Request) {
	var newVehicle api.Vehicle

	if err := s.validateRequest(w, r, &newVehicle); err != nil {
		return
	}

	params := db.CreateVehicleParams{
		Make:  newVehicle.Make,
		Model: newVehicle.Model,
		Year:  int32(newVehicle.Year),
	}
	createdVehicle, err := s.Queries.CreateVehicle(r.Context(), params)

	if err != nil {
		s.errorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(createdVehicle)
}

func (s *Server) DeleteVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
}

func (s *Server) GetVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
}

func (s *Server) PutVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
}
