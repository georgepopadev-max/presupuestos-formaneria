#!/bin/bash
# ============================================================
# SCRIPT DE BACKUP PARA PRESUPUESTOS-FORMANERIA
# Uso: ./scripts/backup.sh
# ============================================================

set -e

# Configuración
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Backup de Base de Datos ===${NC}"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Obtener variables de entorno o usar valores por defecto
DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-postgres}"
DB_USER="${DATABASE_USER:-postgres}"
DB_PASSWORD="${DATABASE_PASSWORD:-}"

# Verificar que tenemos las variables necesarias
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: DATABASE_PASSWORD no está definida${NC}"
    echo "Ejporta la variable o configúrala en .env"
    exit 1
fi

# Exportar password para pg_dump
export PGPASSWORD="$DB_PASSWORD"

# Crear el backup
BACKUP_PATH="${BACKUP_DIR}/${FILENAME}"
echo "Creando backup: $BACKUP_PATH"

pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -F c \
    -b \
    -v \
    -f "$BACKUP_PATH"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backup creado exitosamente${NC}"
else
    echo -e "${RED}Error al crear el backup${NC}"
    exit 1
fi

# Comprimir el backup para ahorrar espacio
echo "Comprimiendo backup..."
gzip "$BACKUP_PATH"
COMPRESSED_PATH="${BACKUP_PATH}.gz"

# Mostrar tamaño del backup
SIZE=$(du -h "$COMPRESSED_PATH" | cut -f1)
echo "Tamaño del backup: $SIZE"

# Limpiar backups antiguos (más antiguos de RETENTION_DAYS)
echo "Limpiando backups antiguos (más de $RETENTION_DAYS días)..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}=== Backup completado ===${NC}"
echo "Backup guardado en: $COMPRESSED_PATH"

# Mostrar cuántos backups hay
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" | wc -l)
echo "Total de backups disponibles: $BACKUP_COUNT"
