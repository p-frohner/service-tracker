# Service Tracker - Go Backend

This is the Go backend for the service tracker. It uses a contract-first and schema-first architecture to ensure the API and Database are always in sync.

## Tech Stack
 - Language: Go 1.21+
 - API Spec: OpenAPI 3.0 (located at [../openapi.yaml](../openapi.yaml))
 - Database: PostgreSQL (via Postgres.app or Docker)
 - Codegen: sqlc (SQL to Go) and oapi-codegen (OpenAPI to Go)
 - Hot Reload: Air

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | No (has default) |
| `IMAGE_STORAGE_PATH` | Local path for storing vehicle images | Yes |
| `SERPER_API_KEY` | API key for image search ([serper.dev](https://serper.dev)) | Yes |
| `PORT` | Server port (default: 8080) | No |

## Local Development

> If you're using Docker (`make docker-up` from the project root), you can skip this section entirely.

### Prerequisites

To run natively, install:

 - Go (1.21+): The programming language runtime. [Install Go](https://go.dev/doc/install)
 - PostgreSQL (15+): The database engine. [Postgres App](https://postgresapp.com/) (Mac) or [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (Windows).
 - Air (hot reload):
   ```
   go install github.com/air-verse/air@latest
   ```

### Database Setup

Create the database and load the schema:

```
createdb service_tracker
psql service_tracker < schema.sql
```

The server defaults to `postgres://postgres:postgres@localhost:5432/service_tracker`. Override by setting `DATABASE_URL` in the root `.env` file.

### Codegen

When you modify `schema.sql` or `query.sql`, regenerate the database layer:

```
sqlc generate
```

When you modify the OpenAPI spec (`../openapi.yaml`), regenerate the server boilerplate:

```
oapi-codegen --config server.cfg.yaml ../openapi.yaml
```

### Run the Application

Start the database then run the following command:

```
make -C .. run-server
```
