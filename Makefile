.PHONY: check-docker pull fe be up down test

ifeq ($(OS),Windows_NT)
    DEVNULL := NUL
else
    DEVNULL := /dev/null
endif

# Fail fast with a clear message when the Docker daemon is unavailable.
ifeq ($(OS),Windows_NT)
check-docker:
	@docker info >$(DEVNULL) 2>&1 || ( \
		echo. & \
		echo ERROR: Docker is not running. & \
		echo Start Docker Desktop, wait until it shows "Engine running", then retry. & \
		exit /b 1 \
	)
else
check-docker:
	@docker info >$(DEVNULL) 2>&1 || ( \
		echo "" && \
		echo "ERROR: Docker is not running. Start Docker, then retry." && \
		exit 1 \
	)
endif

# Pull base images before the first build (compose services are built locally).
pull: check-docker
	docker pull mcr.microsoft.com/dotnet/sdk:10.0
	docker pull mcr.microsoft.com/dotnet/aspnet:10.0
	docker pull node:24-alpine
	docker pull nginx:alpine

# Build and run ONLY the frontend container (http://localhost:3000).
# --no-deps keeps this from also starting the backend.
fe: check-docker pull
	docker compose up --build --no-deps frontend

# Build and run ONLY the backend container (http://localhost:8080).
be: check-docker pull
	docker compose up --build backend

# Convenience: run the full stack together.
up: check-docker pull
	docker compose up --build

down:
	docker compose down

# Run backend integration tests.
test:
	cd backend && dotnet test
