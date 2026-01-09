package handlers

import (
	"net/http"
	"service-tracker/internal/db"
	"service-tracker/pkg/api"
)

func (s *Server) GetVehicles(w http.ResponseWriter, r *http.Request) {
	dbVehicles, err := s.Queries.ListVehicles(r.Context())
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not fetch vehicles from database")
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

	s.writeJSON(w, http.StatusCreated, vehicles)
}

func (s *Server) PostVehicles(w http.ResponseWriter, r *http.Request) {
	var newVehicle api.Vehicle

	if err := s.parseJSON(w, r, &newVehicle); err != nil {
		return
	}

	params := db.CreateVehicleParams{
		Make:  newVehicle.Make,
		Model: newVehicle.Model,
		Year:  int32(newVehicle.Year),
	}
	createdVehicle, err := s.Queries.CreateVehicle(r.Context(), params)

	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Database error")
		return
	}

	s.writeJSON(w, http.StatusCreated, createdVehicle)
}

func (s *Server) DeleteVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	id, err := toUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid vehicle ID format")
		return
	}

	err = s.Queries.DeleteVehicle(r.Context(), id)
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not delete vehicle")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) GetVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	id, err := toUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	v, err := s.Queries.GetVehicle(r.Context(), id)
	if err != nil {
		s.writeError(w, http.StatusNotFound, "Vehicle not found")
		return
	}

	idStr := fromUUID(v.ID)
	response := api.Vehicle{
		Id:    &idStr,
		Make:  v.Make,
		Model: v.Model,
		Year:  int(v.Year),
	}

	s.writeJSON(w, http.StatusOK, response)
}

func (s *Server) PutVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	id, err := toUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid vehicle ID format")
		return
	}

	var updateData api.Vehicle
	if err := s.parseJSON(w, r, &updateData); err != nil {
		return
	}

	params := db.UpdateVehicleParams{
		ID:    id,
		Make:  updateData.Make,
		Model: updateData.Model,
		Year:  int32(updateData.Year),
	}

	updatedVehicle, err := s.Queries.UpdateVehicle(r.Context(), params)
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not update vehicle")
		return
	}

	s.writeJSON(w, http.StatusOK, updatedVehicle)
}
