# Backup de Base de Datos

## Resumen

Este proyecto incluye scripts para hacer backups automáticos y manuales de la base de datos PostgreSQL.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `scripts/backup.sh` | Crea un backup comprimido (.sql.gz) |
| `scripts/restore.sh` | Restaura un backup existente |
| `scripts/setup-cron.sh` | Configura backup automático semanal |

## Uso rápido

### Backup manual

```bash
# Configurar variables de entorno (o editar .env)
export DATABASE_HOST="your-db-host"
export DATABASE_PORT="5432"
export DATABASE_NAME="postgres"
export DATABASE_USER="postgres"
export DATABASE_PASSWORD="your-password"

# Crear backup
./scripts/backup.sh
```

### Restaurar backup

```bash
./scripts/restore.sh backups/backup_20260408_120000.sql.gz
```

### Configurar backup automático

```bash
./scripts/setup-cron.sh
```

Esto añadirá un cron que ejecuta el backup cada **domingo a las 3:00 AM**.

## Dónde se guardan los backups

Los backups se guardan en `backups/` con formato:
```
backups/
├── backup_20260408_120000.sql.gz
├── backup_20260415_120000.sql.gz
└── ...
```

## Retención

- Los backups anteriores a **30 días** se borran automáticamente
- Puedes cambiar `RETENTION_DAYS` en `backup.sh`

## Backup a la nube (opcional)

### Google Drive

Instala `rclone` y configura:

```bash
# Configurar rclone
rclone config

# Añadir al script de backup (al final)
rclone copy "$COMPRESSED_PATH" google-drive:backups-formaneria/
```

### Amazon S3

```bash
# Añadir al script de backup
aws s3 cp "$COMPRESSED_PATH" s3://tu-bucket/backups/
```

## En Render

Si usas Render PostgreSQL, los backups automáticos requieren el plan **$9/mes**.

Alternativa gratis: hacer backup manual con este script o usar `rclone` para subir a Google Drive.

## Verificar un backup

```bash
# Listar contenido del backup
gunzip -c backups/backup_20260408_120000.sql.gz | head -20

# Verificar integridad
gunzip -t backups/backup_20260408_120000.sql.gz && echo "OK"
```
