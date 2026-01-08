# Service Tracker - Go Backend

This is the Go backend for the service tracker. It uses a contract-first and schema-first architecture to ensure the API and Database are always in sync.

## Tech Stack
 - Language: Go 1.21+
 - API Spec: OpenAPI 3.0
 - Database: PostgreSQL (via Postgres.app)
 - Codegen: sqlc (SQL to Go) and oapi-codegen (OpenAPI to Go)

### Database Setup
Ensure Postgres is running and the service_tracker database exists.

Run this whenever you modify schema.sql or query.sql:

```
sqlc generate
```

### API Setup
Generate Server Boilerplate: Run this whenever you modify the root openapi.yaml:

```
oapi-codegen --config server.cfg.yaml ../openapi.yaml
```

### Run the Application

```
go run cmd/api/main.go 
```
