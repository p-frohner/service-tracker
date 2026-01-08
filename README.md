# 🏎️ Service tracker

Exploring Golang by building Service Tracker—a simple Go + React app to manage vehicle maintenance history and costs. Yes, I realized a few days in how misleading the name sounds for a dev project! 🤷‍♂️

## Prerequisites
To run this project locally, you need to install:

 - Node. js (v14 or later)
 - npm or yarn (for managing dependencies)
 - Go (1.21+): The programming language runtime. [Install Go](https://go.dev/doc/install)
 - PostgreSQL (15+): The database engine. [Postgres App](https://postgresapp.com/) (Mac) or [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (Windows).
 - sqlc: For generating type-safe Go from SQL.

```go
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
```

## How it works
To learn more about the server or the client:

[Server README.MD](server/README.md)

[Client README.MD](client/README.md)


## A long way to *Go*

- consider using docker
- authentication
- need to improve CORS handling

