.PHONY: help install dev:server dev:client dev:all build test lint db:migrate db:seed docker:up docker:down

# Colores para output
BOLD := $(shell tput bold)
GREEN := $(shell tput setaf 2)
YELLOW := $(shell tput setaf 3)
RESET := $(shell tput sgr0)

#，默认目标
help:
	@echo ""
	@echo "${BOLD}Presupuestos Formanería - Comandos disponibles${RESET}"
	@echo ""
	@echo "  ${GREEN}install${RESET}       Instalar dependencias (server + client)"
	@echo "  ${GREEN}dev:server${RESET}    Iniciar servidor en desarrollo"
	@echo "  ${GREEN}dev:client${RESET}    Iniciar cliente en desarrollo"
	@echo "  ${GREEN}dev:all${RESET}       Iniciar todo en desarrollo"
	@echo ""
	@echo "  ${GREEN}build${RESET}         Compilar para producción"
	@echo "  ${GREEN}test${RESET}          Ejecutar tests"
	@echo "  ${GREEN}lint${RESET}         Verificar código"
	@echo ""
	@echo "  ${GREEN}db:migrate${RESET}    Ejecutar migraciones de BD"
	@echo "  ${GREEN}db:seed${RESET}       Poblar BD con datos iniciales"
	@echo ""
	@echo "  ${GREEN}docker:up${RESET}     Iniciar contenedores Docker"
	@echo "  ${GREEN}docker:down${RESET}   Detener contenedores Docker"
	@echo ""

# Instalar todas las dependencias
install:
	@echo "${YELLOW}Installing server dependencies...${RESET}"
	@cd server && npm install
	@echo "${YELLOW}Installing client dependencies...${RESET}"
	@cd client && npm install
	@echo "${GREEN}✓${RESET} Dependencias instaladas"

# Desarrollo
dev:dev:all

dev:server:
	@cd server && npm run dev

dev:client:
	@cd client && npm run dev

dev:all:
	@echo "${YELLOW}Iniciando servidor y cliente en paralelo...${RESET}"
	@cd server && npm run dev &
	@cd client && npm run dev

# Build
build:
	@echo "${YELLOW}Building...${RESET}"
	@cd client && npm run build
	@echo "${GREEN}✓${RESET} Build completado"

# Tests
test:
	@cd server && npm test
	@cd client && npm test

# Lint
lint:
	@cd server && npm run lint
	@cd client && npm run lint

# Base de datos
db:migrate:
	@cd server && npm run db:migrate

db:seed:
	@cd server && npm run db:seed

# Docker
docker:up:
	docker compose up -d
	@echo "${GREEN}✓${RESET} Contenedores iniciados. Esperando BD..."
	@sleep 5
	@docker compose ps

docker:down:
	docker compose down
	@echo "${YELLOW}✓${RESET} Contenedores detenidos"
