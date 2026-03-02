.PHONY: help install build-all run-server run-client generate reset-db check-env

-include .env
export

# The 'help' target will automatically scan this file and print anything with a double hash (##)
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for both server and client
	cd server && go mod download
	go install github.com/air-verse/air@latest
	cd client && npm install

generate: ## Run codegen for the server (sqlc and oapi-codegen)
	cd server && sqlc generate
	cd server && oapi-codegen --config server.cfg.yaml ../openapi.yaml

check-env: ## Validate required environment variables
	@test -n "$(SERPER_API_KEY)" || (echo "Error: SERPER_API_KEY is not set. Please set it in your .env file."; exit 1)
	@echo "Environment OK"

run-server: check-env ## Run the Go backend with hot reload (Air)
	cd server && air --build.cmd "go build -o tmp/main ./cmd/api/main.go" --build.bin "./tmp/main"

run-client: ## Run the React frontend client
	cd client && npm run dev

docker-up: check-env ## Start everything via Docker Compose (including DB)
	docker compose up --build

docker-down: ## Stop all Docker services
	docker compose down

reset-db: ## Wipe the Docker database volume and restart (Use with caution!)
	docker compose down -v
	docker compose up -d db