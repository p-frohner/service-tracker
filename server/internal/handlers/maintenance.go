package handlers

import (
	"net/http"
	"service-tracker/internal/api"
	"service-tracker/internal/db"

	"github.com/jackc/pgx/v5/pgtype"
)

func (s *Server) ListMaintenanceRecords(w http.ResponseWriter, r *http.Request, vehicleId string) {
}

func (s *Server) GetMaintenanceRecord(w http.ResponseWriter, r *http.Request, vehicleId string, maintenanceRecordId string) {
}

func (s *Server) DeleteMaintenanceRecord(w http.ResponseWriter, r *http.Request, vehicleId string, maintenanceRecordId string) {
}

func (s *Server) UpdateMaintenanceRecord(w http.ResponseWriter, r *http.Request, vehicleId string, maintenanceRecordId string) {
}

func (s *Server) CreateMaintenanceRecord(w http.ResponseWriter, r *http.Request, vehicleId string) {
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
