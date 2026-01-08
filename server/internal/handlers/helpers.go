package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/jackc/pgx/v5/pgtype"
)

func fromUUID(u pgtype.UUID) string {
	return fmt.Sprintf("%x-%x-%x-%x-%x", u.Bytes[0:4], u.Bytes[4:6], u.Bytes[6:8], u.Bytes[8:10], u.Bytes[10:12])
}

func toUUID(s string) pgtype.UUID {
	var u pgtype.UUID
	u.UnmarshalJSON([]byte(`"` + s + `"`))
	return u
}

// respond in a standardized error format
func (s *Server) errorResponse(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"message": message})
}

// decodes and validates the JSON request body and rerturns an error response if invalid
func (s *Server) validateRequest(w http.ResponseWriter, r *http.Request, v any) error {
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

		s.errorResponse(w, http.StatusBadRequest, errorDetail)

		return err
	}
	return nil
}
