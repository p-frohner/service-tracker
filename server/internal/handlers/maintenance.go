package handlers

import (
	"net/http"
	"service-tracker/internal/api"
	"service-tracker/internal/db"

	"github.com/jackc/pgx/v5/pgtype"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

func (s *Server) ListMaintenanceRecords(w http.ResponseWriter, r *http.Request, vehicleId string) {
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

	dbRecords, err := s.Queries.ListMaintenanceRecordsByVehicle(r.Context(), vehUUID)
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not fetch maintenance records")
		return
	}

	records := make([]api.MaintenanceRecord, 0, len(dbRecords))
	for _, r := range dbRecords {
		idStr := uuidToString(r.ID)
		records = append(records, api.MaintenanceRecord{
			Id:          &idStr,
			Date:        openapi_types.Date{Time: r.Date.Time},
			Description: r.Description,
			Mileage:     int(r.Mileage),
			Cost:        r.Cost,
			Notes:       r.Notes,
		})
	}

	s.writeJSON(w, http.StatusOK, records)
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
