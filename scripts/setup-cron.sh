#!/bin/bash
# ============================================================
# CRON DE BACKUP SEMANAL
# Añade una tarea cron para backups automáticos cada domingo
# Uso: ./scripts/setup-cron.sh
# ============================================================

set -e

CRON_JOB="0 3 * * 0 cd /home/ubuntu/presupuestos-formaneria && ./scripts/backup.sh >> ./backups/cron.log 2>&1"

echo "=== Configurar Backup Automático ==="
echo ""
echo "Se añadirá el siguiente cron:"
echo "$CRON_JOB"
echo ""

read -p "¿Añadir al crontab? (s/n): " CONFIRM

if [ "$CONFIRM" = "s" ] || [ "$CONFIRM" = "S" ]; then
    # Mostrar cron actual
    echo ""
    echo "Crontab actual:"
    crontab -l 2>/dev/null || echo "(vacío)"
    
    # Añadir el nuevo cron (reemplazar si ya existe)
    (crontab -l 2>/dev/null | grep -v "backup.sh"; echo "$CRON_JOB") | crontab -
    
    echo ""
    echo -e "${GREEN}Cron añadido exitosamente${NC}"
    echo ""
    echo "Backups programados para:"
    crontab -l | grep backup
else
    echo "Operación cancelada"
fi
