# Service Tracker - Go Backend

This is the Go backend for the service tracker. It uses a contract-first and schema-first architecture to ensure the API and Database are always in sync.

## Tech Stack
 - Language: Go 1.21+
 - API Spec: OpenAPI 3.0 (located at [../openapi.yaml](../openapi.yaml))
 - Database: PostgreSQL (via Postgres.app or Docker)
 - Codegen: sqlc (SQL to Go) and oapi-codegen (OpenAPI to Go)
 - Hot Reload: Air

## Local Development

### Prerequisites
To run this project locally, you need to install:

 - Go (1.21+): The programming language runtime. [Install Go](https://go.dev/doc/install)
 - PostgreSQL (15+): The database engine. [Postgres App](https://postgresapp.com/) (Mac) or [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (Windows).
 - sqlc: For generating type-safe Go from SQL.

```go
go install [github.com/air-verse/air@latest](https://github.com/air-verse/air@latest)
```

### Database Setup (sqlc)
Ensure Postgres is running and the "service_tracker" database exists.

When you modify schema.sql (tables) or query.sql (queries), regenerate the database layer:

```
sqlc generate
```

### API Setup (oapi)
When you modify the OpenAPI specification (api.yaml), regenerate the server boilerplate:

```
oapi-codegen --config server.cfg.yaml ../openapi.yaml
```

### Run the Application with hot reload

```
air
```
