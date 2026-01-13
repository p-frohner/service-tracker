package handlers

import (
	"net/http"
	"service-tracker/internal/api"
	"service-tracker/internal/db"

	"github.com/jackc/pgx/v5/pgtype"
)

func (s *Server) GetVehicles(w http.ResponseWriter, r *http.Request) {
	dbVehicles, err := s.Queries.ListVehicles(r.Context())
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not fetch vehicles from database")
		return
	}

	vehicles := make([]api.Vehicle, 0, len(dbVehicles))

	for _, v := range dbVehicles {
		idStr := uuidToString(v.ID)

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
	id, err := stringToUUID(vehicleId)
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
	id, err := stringToUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	v, err := s.Queries.GetVehicle(r.Context(), id)
	if err != nil {
		s.writeError(w, http.StatusNotFound, "Vehicle not found")
		return
	}

	idStr := uuidToString(v.ID)
	response := api.Vehicle{
		Id:    &idStr,
		Make:  v.Make,
		Model: v.Model,
		Year:  int(v.Year),
	}

	s.writeJSON(w, http.StatusOK, response)
}

func (s *Server) PutVehiclesVehicleId(w http.ResponseWriter, r *http.Request, vehicleId string) {
	id, err := stringToUUID(vehicleId)
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

func (s *Server) GetVehiclesVehicleIdMaintenance(w http.ResponseWriter, r *http.Request, vehicleId string) {
}

func (s *Server) GetVehiclesVehicleIdMaintenanceRecordId(w http.ResponseWriter, r *http.Request, vehicleId string, maintenanceRecordId string) {
}

func (s *Server) DeleteVehiclesVehicleIdMaintenanceRecordId(w http.ResponseWriter, r *http.Request, vehicleId string, maintenanceRecordId string) {
}

func (s *Server) PutVehiclesVehicleIdMaintenanceRecordId(w http.ResponseWriter, r *http.Request, vehicleId string, maintenanceRecordId string) {
}

func (s *Server) PostVehiclesVehicleIdMaintenance(w http.ResponseWriter, r *http.Request, vehicleId string) {
	vehUUID, err := stringToUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid vehicle ID format")
		return
	}

	_, err = s.Queries.GetVehicle(r.Context(), vehUUID)
	if err != nil {
		s.writeError(w, http.StatusNotFound, "Vehicle not found")
		return
	}

	var newRecord api.MaintenanceRecord
	if err := s.parseJSON(w, r, &newRecord); err != nil {
		return
	}

	params := db.CreateMaintenanceRecordParams{
		VehicleID:   vehUUID,
		Date:        pgtype.Date{Time: newRecord.Date.Time, Valid: true},
		Description: newRecord.Description,
		Mileage:     int32(newRecord.Mileage),
		Cost:        newRecord.Cost,
		Notes:       newRecord.Notes,
	}

	created, err := s.Queries.CreateMaintenanceRecord(r.Context(), params)
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not create maintenance record")
		return
	}

	idStr := uuidToString(created.ID)
	response := api.MaintenanceRecord{
		Id:          &idStr,
		Date:        newRecord.Date,
		Description: created.Description,
		Mileage:     int(created.Mileage),
		Cost:        created.Cost,
		Notes:       created.Notes,
	}

	s.writeJSON(w, http.StatusCreated, response)
}
