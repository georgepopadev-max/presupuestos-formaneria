# Deploy - Presupuestos Formanería

Guía de despliegue para un equipo de 2 personas sin DevOps dedicado.

---

## Opción recomendada: Railway

Railway es la opción más sencilla para equipos pequeños. Proporciona base de datos PostgreSQL, deploy automático desde GitHub y dominio gratuito.

### 1. Preparar el proyecto

```bash
# Asegúrate de que el código está en GitHub
git add .
git commit -m "Preparado para deploy"
git push origin main
```

### 2. Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) → "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio

### 3. Provisionar PostgreSQL

1. En el proyecto → "Add Service" → "PostgreSQL"
2. Railway creará la base de datos y te dará la URL de conexión
3. Copia la `DATABASE_URL` (la necesitarás en el paso 4)

### 4. Configurar variables de entorno

En Railway → tu servicio → Settings → Environment Variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://... (de Railway)
JWT_SECRET=una-clave-random-segura
VITE_API_URL=https://tu-proyecto.up.railway.app/api
```

### 5. Deploy del servidor

1. Railway detectará automáticamente el `package.json`
2. Añade un comando de start en `server/package.json`:
   ```json
   "scripts": {
     "start": "node dist/index.js"
   }
   ```
3. Railway hará el build y deploy automáticamente en cada push

### 6. Deploy del cliente

El cliente (Vite) necesita hacer build y servir los archivos estáticos:

**Opción A: Deploy separado (recomendado)**
1. Conecta el repo a **Vercel** o **Netlify**
2. Vercel detectará Vite automáticamente
3. Configura `VITE_API_URL` con la URL de Railway

**Opción B: Servir desde el servidor**
En producción, el servidor puede servir los archivos estáticos del cliente.

### 7. Dominio personalizado (opcional)

En Railway → Settings → Domains:
- Añade tu dominio (ej: `presupuestos.tuempresa.com`)
- Configura los DNS según las instrucciones

---

## Opción alternativa: Render

Render es similar a Railway pero con un tier gratuito más limitado.

### Pasos

1. Crear cuenta en [render.com](https://render.com)
2. "New" → "PostgreSQL" → crear base de datos
3. "New" → "Web Service" → conectar GitHub
4. Configurar:
   - **Build Command:** `cd client && npm install && npm run build`
   - **Start Command:** (para servidor) o configurar como Static Site

### Variables de entorno en Render

Iguales que en Railway (ver sección 4).

---

## VPS (avanzado)

Para quienes prefieren control total.

### Requisitos
- Ubuntu 22.04+
- 2GB RAM mínimo

### 1. Instalar Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Clonar y configurar

```bash
git clone https://github.com/tu-usuario/presupuestos-formaneria.git
cd presupuestos-formaneria
cp .env.example .env
# Editar .env con valores reales
```

### 3. Iniciar con Docker Compose

```bash
docker compose up -d
```

### 4. Configurar Nginx como reverse proxy

```nginx
server {
    listen 80;
    server_name presupuestos.tuempresa.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d presupuestos.tuempresa.com
```

### 6. Actualización

```bash
git pull origin main
docker compose build
docker compose up -d
```

---

## Notas importantes

### Backups
- **Railway/Render:** Dan backups automáticos
- **VPS:** Configurar backups periódicos con:
  ```bash
  docker compose exec postgres pg_dump -U formaneria presupuestos > backup_$(date +%Y%m%d).sql
  ```

### Variables de entorno sensibles
- **Nunca** hacer commit del `.env` real
- Usar secretos de Railway/Render para `JWT_SECRET`
- Generar secrets seguros con: `openssl rand -base64 32`

### Monitorización básica
- Ver logs: `docker compose logs -f`
- Estado: `docker compose ps`
- Reiniciar: `docker compose restart`

---

## Checklist pre-launch

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` generado y seguro
- [ ] `DATABASE_URL` apunta a la BD correcta
- [ ] `VITE_API_URL` apunta al dominio correcto
- [ ] Tests pasan en local
- [ ] Build funciona sin errores
- [ ] Dominio configurado (si aplica)
