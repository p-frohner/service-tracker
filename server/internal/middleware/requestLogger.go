package middleware

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5/middleware"
)

// Our custom Logger middleware
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var bodyLog string

		// Check if there is a body to read (POST/PUT/PATCH)
		if r.Body != nil && r.Method != http.MethodGet {
			// Read the body into memory
			bodyBytes, err := io.ReadAll(r.Body)
			if err == nil {
				bodyLog = string(bodyBytes)
				r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) // IMPORTANT: Replace the body so the next handler can read it again
			}
		}

		start := time.Now()
		ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

		next.ServeHTTP(ww, r)

		log.Printf(
			"ID: %s | %s %s | STATUS: %d | BODY: %s | LATENCY: %v",
			middleware.GetReqID(r.Context()),
			r.Method,
			r.URL.Path,
			ww.Status(),
			bodyLog,
			time.Since(start),
		)
	})
}
