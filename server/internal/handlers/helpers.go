package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"
)

func uuidToString(u pgtype.UUID) string {
	buf, _ := u.MarshalJSON()
	return strings.Trim(string(buf), `"`)
}

func stringToUUID(s string) (pgtype.UUID, error) {
	var u pgtype.UUID
	err := u.UnmarshalJSON([]byte(`"` + s + `"`))
	return u, err
}

// writeJSON handles the standard success response
func (s *Server) writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

// respond in a standardized error format
func (s *Server) writeError(w http.ResponseWriter, status int, message string) {
	s.writeJSON(w, status, map[string]string{"message": message})
}

// decodes and validates the JSON request body and rerturns an error response if invalid
func (s *Server) parseJSON(w http.ResponseWriter, r *http.Request, v any) error {
	err := json.NewDecoder(r.Body).Decode(v)

	if err != nil {
		var unmarshalErr *json.UnmarshalTypeError
		var errorDetail string

		if errors.As(err, &unmarshalErr) {
			errorDetail = fmt.Sprintf("Field '%s' expects a %s, but %s was provided!",
				unmarshalErr.Field, unmarshalErr.Type, unmarshalErr.Value)
		} else {
			errorDetail = "Invalid JSON format: " + err.Error()
		}

		s.writeError(w, http.StatusBadRequest, errorDetail)

		return err
	}
	return nil
}
