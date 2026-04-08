# Arquitectura Técnica

## Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (PWA)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Clientes   │  │Presupuestos │  │  Facturas   │              │
│  │  Materiales │  │   Trabajos  │  │  Informes   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│                   ┌──────────────┐                               │
│                   │  zustand     │                               │
│                   │   stores     │                               │
│                   └──────┬───────┘                               │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                       SERVIDOR (Express)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      API Routes                           │   │
│  │  /api/clientes  /api/materiales  /api/presupuestos  ...   │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Services Layer                        │   │
│  │  ClienteService  MaterialService  PresupuestoService    │   │
│  │  FacturaService  InformeService                          │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Drizzle ORM                             │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     SQLite      │
                    │   (data.db)    │
                    └─────────────────┘
```

## Módulos Principales

### 1. Módulo de Clientes

Gestión de clientes de la empresa.

**Responsabilidades:**
- CRUD de clientes
- Historial de presupuestos y facturas
- Datos de contacto y facturación

**Ubicación:** `server/services/cliente.service.ts`

### 2. Módulo de Materiales

Catálogo de materiales de fontanería con precios.

**Responsabilidades:**
- Gestión del catálogo de materiales
- Precios de compra y venta
- Categorización (tuberías, griferías, accesorios, etc.)

**Ubicación:** `server/services/material.service.ts`

### 3. Módulo de Presupuestos

Creación y gestión de presupuestos.

**Responsabilidades:**
- Crear presupuestos con líneas de materiales
- Definir mano de obra
- Aplicar márgenes y descuentos
- Convertir a factura

**Ubicación:** `server/services/presupuesto.service.ts`

### 4. Módulo de Facturas

Gestión de facturas y documentación fiscal.

**Responsabilidades:**
- Crear facturas (desde presupuesto o directas)
- Numeración secuencial automática
- Cálculo de impuestos (IVA 21%, 10%, 4%)
- Generación de PDF
- Historial de facturas

**Ubicación:** `server/services/factura.service.ts`

### 5. Módulo de Informes

Reporting y análisis.

**Responsabilidades:**
- Ventas por período
- Márgenes por trabajo
- Materiales más usados
- Clientes principales

**Ubicación:** `server/services/informe.service.ts`

## Flujo de Datos

### Creación de un Presupuesto → Factura

```
1. Usuario crea/selecciona cliente
2. Usuario añade líneas de materiales
3. Sistema calcula totales con márgenes
4. Usuario añade costes de mano de obra
5. Sistema genera presupuesto (estado: "borrador")
6. Usuario revisa y guarda (estado: "enviado")
7. Cliente acepta → Usuario convierte a factura
8. Sistema genera número de factura secuencial
9. Factura disponible como PDF
```

### Estados de un Presupuesto

```
borrador → enviado → aceptado → rechazado → facturado
```

### Estados de una Factura

```
borrador → emitida → pagada → cancelada
```

## Consideraciones de Seguridad

### Autenticación

- JWT (JSON Web Tokens) para autenticación stateless
- Tokens de acceso con expiración corta (1h)
- Refresh tokens para sesiones prolongadas

### Autorización

- Roles simples: administrador, usuario
- Middleware de verificación en todas las rutas protegidas

### Validación de Datos

- Zod para validación de schemas en API
- TypeScript para tipado fuerte en frontend
- Sanitización de inputs de usuario

### Almacenamiento

- Contraseñas hasheadas con bcrypt
- Datos sensibles cifrados en disco (futuro)
- Backups automáticos de la base de datos

### CORS

- Configuración restrictiva de orígenes permitidos
- Solo el origen de la aplicación puede acceder a la API

## Notas de Escalabilidad

### Límites Actuales

- Diseñado para 2-3 usuarios simultáneos
- Base de datos SQLite (adequada para <100k registros)
- Sin caché de aplicación

### Cuándo Escalar

| Indicador | Umbral | Acción |
|-----------|--------|--------|
| Usuarios simultáneos | >10 | Considerar PostgreSQL + Redis |
| Tamaño BD | >500MB | Implementar archivado |
| Tiempo respuesta | >2s | Añadir índices, caché |

### Estrategia de Escalado

1. **Fase 1**: SQLite → PostgreSQL (migración directa)
2. **Fase 2**: Añadir Redis para caché de consultas frecuentes
3. **Fase 3**: Separar API y frontend en servicios independientes
4. **Fase 4**: Implementar CDN para assets estáticos y PDFs

### Optimizaciones Implementadas

- Índices en campos de búsqueda frecuente
- Lazy loading de listas grandes
- Paginación en todas las consultas de lista
- Virtualización de listas largas (react-virtual)

## Decisiones Técnicas

Ver documento `DECISIONS.md` para el log completo de decisiones arquitectónicas.
