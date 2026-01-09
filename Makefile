.PHONY: help install build-all run-server run-client generate reset-db

# The 'help' target will automatically scan this file and print anything with a double hash (##)
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for both server and client
	cd server && go mod download
	cd client && npm install

generate: ## Run codegen for the server (sqlc and oapi-codegen)
	cd server && sqlc generate
	cd server && oapi-codegen -config config.yaml api.yaml > internal/api/api.gen.go

run-server: ## Run the Go backend locally
	cd server && go run ./cmd/api/main.go

run-client: ## Run the React frontend locally
	cd client && npm run dev

docker-up: ## Start everything via Docker Compose (including DB)
	docker compose up --build

docker-down: ## Stop all Docker services
	docker compose down

reset-db: ## Wipe the Docker database volume and restart (Use with caution!)
	docker compose down -v
	docker compose up -d db