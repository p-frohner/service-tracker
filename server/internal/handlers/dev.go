package handlers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"service-tracker/internal/db"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

var mockDescriptions = []string{
	"Oil change",
	"Tire rotation",
	"Brake inspection",
	"Air filter replacement",
	"Coolant flush",
	"Spark plug replacement",
	"Transmission fluid change",
	"Battery replacement",
	"Wheel alignment",
	"Brake pad replacement",
	"Serpentine belt replacement",
	"Cabin air filter replacement",
	"Power steering fluid flush",
	"Fuel filter replacement",
	"Timing belt replacement",
}

var mockNotes = []string{
	"Recommended follow-up in 6 months",
	"Found minor wear, monitoring",
	"All within spec",
	"Dealer service",
	"Used OEM parts",
	"Synthetic oil used",
	"Warranty service",
}

func (s *Server) GenerateMockMaintenanceRecords(w http.ResponseWriter, r *http.Request) {
	vehicleId := chi.URLParam(r, "vehicleId")

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

	count := 5
	if countStr := r.URL.Query().Get("count"); countStr != "" {
		if parsed, err := strconv.Atoi(countStr); err == nil && parsed > 0 && parsed <= 100 {
			count = parsed
		}
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	now := time.Now()
	baseMileage := 10000 + rng.Intn(150000)

	created := make([]map[string]any, 0, count)

	for i := 0; i < count; i++ {
		daysAgo := rng.Intn(7300)
		date := now.AddDate(0, 0, -daysAgo)

		description := mockDescriptions[rng.Intn(len(mockDescriptions))]

		mileage := baseMileage - (daysAgo * 23)
		if mileage < 1000 {
			mileage = 1000
		}

		costCents := 2500 + rng.Intn(47500)
		cost := fmt.Sprintf("$%.2f", float64(costCents)/100)

		var notes *string
		if rng.Float32() < 0.3 {
			n := mockNotes[rng.Intn(len(mockNotes))]
			notes = &n
		}

		params := db.CreateMaintenanceRecordParams{
			VehicleID:   vehUUID,
			Date:        pgtype.Date{Time: date, Valid: true},
			Description: description,
			Mileage:     int32(mileage),
			Cost:        &cost,
			Notes:       notes,
		}

		record, err := s.Queries.CreateMaintenanceRecord(r.Context(), params)
		if err != nil {
			s.writeError(w, http.StatusInternalServerError, "Failed to create record: "+err.Error())
			return
		}

		created = append(created, map[string]any{
			"id":          uuidToString(record.ID),
			"date":        date.Format("2006-01-02"),
			"description": description,
			"mileage":     mileage,
			"cost":        cost,
		})
	}

	s.writeJSON(w, http.StatusCreated, map[string]any{
		"message": fmt.Sprintf("Created %d mock maintenance records", count),
		"records": created,
	})
}
