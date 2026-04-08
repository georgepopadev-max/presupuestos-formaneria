#!/bin/bash
# ============================================================
# SCRIPT DE RESTAURACIÓN DE BACKUP
# Uso: ./scripts/restore.sh backups/backup_20260408_120000.sql.gz
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}Error: Debes especificar el archivo de backup${NC}"
    echo "Uso: $0 <archivo_backup.sql.gz>"
    echo ""
    echo "Backups disponibles:"
    ls -la backups/backup_*.sql.gz 2>/dev/null || echo "No hay backups en la carpeta backups/"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: El archivo $BACKUP_FILE no existe${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Restaurar Base de Datos ===${NC}"
echo -e "${YELLOW}AVISO: Esto sobrescribirá la base de datos actual${NC}"
echo -e "${YELLOW}Backup a restaurar: $BACKUP_FILE${NC}"
echo ""

read -p "¿Estás seguro? (escribe 'SI' para continuar): " CONFIRM

if [ "$CONFIRM" != "SI" ]; then
    echo "Operación cancelada"
    exit 0
fi

# Configuración
DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-postgres}"
DB_USER="${DATABASE_USER:-postgres}"
DB_PASSWORD="${DATABASE_PASSWORD:-}"

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: DATABASE_PASSWORD no está definida${NC}"
    exit 1
fi

export PGPASSWORD="$DB_PASSWORD"

# Descomprimir y restaurar
echo "Descomprimiendo backup..."
gunzip -f "$BACKUP_FILE"
BACKUP_UNCOMPRESSED="${BACKUP_FILE%.gz}"

if [ $? -eq 0 ]; then
    echo "Restaurando base de datos..."
    pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -c \
        -v \
        "$BACKUP_UNCOMPRESSED"
    
    echo -e "${GREEN}=== Restauración completada ===${NC}"
    
    # Volver a comprimir
    gzip "$BACKUP_UNCOMPRESSED"
else
    echo -e "${RED}Error al descomprimir${NC}"
    exit 1
fi
