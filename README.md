# presupuestos-fontaneria

Sistema de gestión de presupuestos y facturas para obras de fontanería. Diseñado para empresas pequeñas (2-3 personas) en España.

## Descripción

Aplicación web progresive (PWA) para gestionar el ciclo completo de presupuestos, facturas, materiales y clientes en una empresa de fontanería. Permite crear presupuestos detallados, convertirlos en facturas, controlar márgenes y precios de mercado.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui
- **Estado**: Zustand
- **Backend**: Node.js + Express
- **Base de datos**: SQLite (Drizzle ORM)
- **PDF**: @react-pdf/renderer
- **PWA**: Vite PWA Plugin
- **Validación**: Zod

## Prerrequisitos

- Node.js 20+
- npm 10+
- Git

## Instalación Rápida

```bash
# Clonar el repositorio
git clone <repo-url>
cd presupuestos-fontaneria

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar base de datos
npm run db:push

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## Variables de Entorno

```env
# Entorno
NODE_ENV=development

# Base de datos
DATABASE_URL=./data.db

# Servidor
PORT=3001
HOST=localhost

# Seguridad
JWT_SECRET=tu-secret-muy-largo-y-aleatorio
CORS_ORIGIN=http://localhost:5173

# Empresa (facturas)
EMPRESA_NOMBRE="Fontanería Ejemplo S.L."
EMPRESA_DIRECCION="Calle Ejemplo 123, 28001 Madrid"
EMPRESA_TELEFONO="912 345 678"
EMPRESA_EMAIL="info@fontaneria-ejemplo.es"
EMPRESA_NIF="B12345678"
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo (frontend + backend)
npm run dev:server   # Solo backend

# Base de datos
npm run db:push      # Sincronizar schema con la base de datos
npm run db:studio    # Abrir Drizzle Studio (gestor visual)
npm run db:generate  # Generar migraciones

# Building
npm run build        # Build de producción
npm run preview      # Preview de producción

# Calidad
npm run lint         # Linting con ESLint
npm run typecheck    # Verificación de tipos TypeScript

# Testing
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
```

## Estructura del Proyecto

```
presupuestos-fontaneria/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/          # Páginas/Rutas
│   ├── lib/             # Utilidades y configuración
│   ├── stores/          # Estado global (Zustand)
│   └── types/           # Tipos TypeScript
├── server/
│   ├── routes/          # Rutas API
│   ├── db/              # Schema y queries de BD
│   └── services/        # Lógica de negocio
└── public/              # Assets estáticos
```

## PWA

La aplicación funciona como PWA:
- Instalable en móvil y escritorio
- Funciona sin conexión (lectura)
- Notificaciones push (futuro)

## Licencia

MIT
