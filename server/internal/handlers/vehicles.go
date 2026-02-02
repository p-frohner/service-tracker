package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"service-tracker/internal/api"
	"service-tracker/internal/db"
	"strings"
	"time"
)

type SerperRequest struct {
	Q string `json:"q"`
}

type SerperResponse struct {
	Images []struct {
		ImageUrl string `json:"imageUrl"`
		Title    string `json:"title"`
	} `json:"images"`
}

func (s *Server) CreateVehicle(w http.ResponseWriter, r *http.Request) {
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

func (s *Server) GetVehicle(w http.ResponseWriter, r *http.Request, vehicleId string) {
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

func (s *Server) GetVehicleImages(w http.ResponseWriter, r *http.Request, vehicleId string) {
	id, err := stringToUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid vehicle ID format")
		return
	}

	dbImages, err := s.Queries.GetVehicleImages(r.Context(), id)
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "Could not fetch images")
		return
	}

	images := make([]api.VehicleImage, 0, len(dbImages))
	for _, img := range dbImages {
		imgID := int(img.ID)
		// Return full path for local serving
		filename := fmt.Sprintf("/images/%s/%s", vehicleId, img.Filename)
		images = append(images, api.VehicleImage{
			Id:       &imgID,
			Filename: filename,
		})
	}

	s.writeJSON(w, http.StatusOK, images)
}

func (s *Server) FetchVehicleImages(w http.ResponseWriter, r *http.Request, vehicleId string) {
	id, err := stringToUUID(vehicleId)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid vehicle ID format")
		return
	}

	vehicle, err := s.Queries.GetVehicle(r.Context(), id)
	if err != nil {
		s.writeError(w, http.StatusNotFound, "Vehicle not found")
		return
	}

	bgCtx := context.Background()
	go s.fetchAndStoreVehicleImages(bgCtx, vehicle)

	w.WriteHeader(http.StatusAccepted)
}

func (s *Server) DeleteVehicle(w http.ResponseWriter, r *http.Request, vehicleId string) {
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

	// Clean up local image files
	if err := s.ImageStore.Delete(vehicleId); err != nil {
		log.Printf("Failed to delete image files for vehicle %s: %v", vehicleId, err)
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) ListVehicles(w http.ResponseWriter, r *http.Request) {
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

	s.writeJSON(w, http.StatusOK, vehicles)
}

func (s *Server) UpdateVehicle(w http.ResponseWriter, r *http.Request, vehicleId string) {
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

// fetchAndStoreVehicleImages looks up images, downloads them locally, and notifies the FE via websocket
func (s *Server) fetchAndStoreVehicleImages(ctx context.Context, v db.Vehicle) {
	ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	vehicleID := uuidToString(v.ID)
	const targetCount = 6 // 2 Rows
	const fetchLimit = 10 // Default number, also account for download failures

	imageURLs, err := s.searchCarImages(v.Make, v.Model, fmt.Sprintf("%d", v.Year), fetchLimit)
	if err != nil {
		log.Printf("Background image search failed: %v", err)
		return
	}

	var savedFilenames []string
	for _, imageURL := range imageURLs {
		// Stop once we have enough images
		if len(savedFilenames) >= targetCount {
			break
		}

		// Download image locally
		filename, err := s.ImageStore.Download(ctx, vehicleID, imageURL)
		if err != nil {
			log.Printf("Failed to download image: %v", err)
			continue
		}

		// Store filename in database
		err = s.Queries.AddVehicleImage(ctx, db.AddVehicleImageParams{
			VehicleID: v.ID,
			Filename:  filename,
		})
		if err != nil {
			log.Printf("Failed to save image filename: %v", err)
			continue
		}
		savedFilenames = append(savedFilenames, fmt.Sprintf("/images/%s/%s", vehicleID, filename))
	}

	if len(savedFilenames) > 0 {
		notification := map[string]any{
			"type":       "IMAGES_READY",
			"vehicle_id": v.ID,
			"filenames":  savedFilenames,
		}
		msg, _ := json.Marshal(notification)
		s.Hub.broadcast <- msg
	}
}

// searchCarImages finds images using Serper API
func (s *Server) searchCarImages(brand, model, year string, limit int) ([]string, error) {
	url := "https://google.serper.dev/images"

	// Create a query for high-quality results
	query := fmt.Sprintf("%s %s %s high resolution", year, brand, model)
	// Use json.Marshal to safely escape special characters and prevent JSON injection
	payloadBytes, _ := json.Marshal(SerperRequest{Q: query})
	payload := strings.NewReader(string(payloadBytes))

	req, _ := http.NewRequest("POST", url, payload)
	req.Header.Add("X-API-KEY", os.Getenv("SERPER_API_KEY"))
	req.Header.Add("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var result SerperResponse
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Images) == 0 {
		return nil, fmt.Errorf("no images found")
	}

	// Return up to 'limit' image URLs
	count := min(len(result.Images), limit)
	urls := make([]string, count)
	for i := range count {
		urls[i] = result.Images[i].ImageUrl
	}

	return urls, nil
}
