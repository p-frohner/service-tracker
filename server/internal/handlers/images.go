package handlers

import (
	"net/http"
	"os"
	"regexp"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

var validFilename = regexp.MustCompile(`^[a-f0-9]{64}\.(jpg|jpeg|png|gif|webp)$`)

// ServeImage serves locally stored vehicle images
func (s *Server) ServeImage(w http.ResponseWriter, r *http.Request) {
	vehicleID := chi.URLParam(r, "vehicleId")
	filename := chi.URLParam(r, "filename")

	// Validate UUID format to prevent path traversal
	if _, err := uuid.Parse(vehicleID); err != nil {
		s.writeError(w, http.StatusBadRequest, "Invalid vehicle ID")
		return
	}

	// Validate filename format (SHA256 hash + extension)
	if !validFilename.MatchString(filename) {
		s.writeError(w, http.StatusBadRequest, "Invalid filename")
		return
	}

	filePath := s.ImageStore.GetPath(vehicleID, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		s.writeError(w, http.StatusNotFound, "Image not found")
		return
	}

	// Set cache headers (1 year - images are immutable due to hash-based naming)
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")

	http.ServeFile(w, r, filePath)
}
