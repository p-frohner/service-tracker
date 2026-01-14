package storage

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const (
	maxImageSize = 10 * 1024 * 1024 // 10MB
	httpTimeout  = 10 * time.Second
)

type ImageStore struct {
	baseDir string
	client  *http.Client
}

func NewImageStore(baseDir string) *ImageStore {
	return &ImageStore{
		baseDir: baseDir,
		client: &http.Client{
			Timeout: httpTimeout,
		},
	}
}

// Download fetches an image from the given URL and stores it locally.
// Returns the generated filename (hash-based) on success.
func (s *ImageStore) Download(ctx context.Context, vehicleID, url string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return "", fmt.Errorf("creating request: %w", err)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("fetching image: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	contentType := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		return "", fmt.Errorf("invalid content type: %s", contentType)
	}

	ext := extensionFromContentType(contentType)

	// Create vehicle directory
	vehicleDir := filepath.Join(s.baseDir, vehicleID)
	if err := os.MkdirAll(vehicleDir, 0755); err != nil {
		return "", fmt.Errorf("creating directory: %w", err)
	}

	// Read image with size limit
	limitedReader := io.LimitReader(resp.Body, maxImageSize+1)
	data, err := io.ReadAll(limitedReader)
	if err != nil {
		return "", fmt.Errorf("reading image: %w", err)
	}
	if len(data) > maxImageSize {
		return "", fmt.Errorf("image exceeds maximum size of %d bytes", maxImageSize)
	}

	// Generate hash-based filename
	hash := sha256.Sum256(data)
	filename := hex.EncodeToString(hash[:]) + ext

	// Atomic write: temp file then rename
	finalPath := filepath.Join(vehicleDir, filename)
	tmpPath := finalPath + ".tmp"

	if err := os.WriteFile(tmpPath, data, 0644); err != nil {
		return "", fmt.Errorf("writing temp file: %w", err)
	}

	if err := os.Rename(tmpPath, finalPath); err != nil {
		os.Remove(tmpPath)
		return "", fmt.Errorf("renaming temp file: %w", err)
	}

	return filename, nil
}

// Delete removes all images for a vehicle.
func (s *ImageStore) Delete(vehicleID string) error {
	vehicleDir := filepath.Join(s.baseDir, vehicleID)
	if err := os.RemoveAll(vehicleDir); err != nil {
		return fmt.Errorf("removing vehicle images: %w", err)
	}
	return nil
}

// GetPath returns the full filesystem path for an image.
func (s *ImageStore) GetPath(vehicleID, filename string) string {
	return filepath.Join(s.baseDir, vehicleID, filename)
}

func extensionFromContentType(contentType string) string {
	switch {
	case strings.Contains(contentType, "jpeg"):
		return ".jpg"
	case strings.Contains(contentType, "png"):
		return ".png"
	case strings.Contains(contentType, "gif"):
		return ".gif"
	case strings.Contains(contentType, "webp"):
		return ".webp"
	default:
		return ".jpg"
	}
}
