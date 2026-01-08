package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

func (s *Server) validateRequest(w http.ResponseWriter, r *http.Request, v interface{}) error {
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

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)

		// return the JSON with the "message" property the frontend expects
		json.NewEncoder(w).Encode(map[string]string{
			"message": errorDetail,
		})
		return err
	}
	return nil
}
