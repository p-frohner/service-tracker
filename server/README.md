# Go Back End

Start the server:

```go run cmd/api/main.go```

Generate types from the openapi spec:

```oapi-codegen --config server.cfg.yaml ../openapi.yaml```

Ensure .mod file references are accurate

```go mod tidy```

Clean cache

```go clean -cache```
