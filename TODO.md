# Roadmap de Desarrollo

## Fase 1: MVP - Fundamentos ⭐

**Objetivo**: Sistema funcional mínimo para gestionar materiales, clientes y presupuestos básicos.

**Duración estimada**: 2-3 semanas

### 1.1 Estructura del Proyecto
- [ ] Inicializar proyecto React + Vite + TypeScript
- [ ] Configurar TailwindCSS y shadcn/ui
- [ ] Configurar Express con TypeScript
- [ ] Configurar Drizzle ORM con SQLite
- [ ] Configurar ESLint y Prettier
- [ ] Configurar PWA con Vite PWA Plugin
- [ ] Crear estructura de carpetas

### 1.2 Base de Datos
- [ ] Schema de Clientes
- [ ] Schema de Materiales
- [ ] Schema de Presupuestos
- [ ] Schema de Líneas de Presupuesto
- [ ] Índices para búsquedas frecuentes
- [ ] Seed data inicial (categorías de materiales)

### 1.3 API - CRUD Básico
- [ ] Rutas API para Clientes (CRUD)
- [ ] Rutas API para Materiales (CRUD)
- [ ] Rutas API para Presupuestos (CRUD)
- [ ] Validación con Zod
- [ ] Manejo de errores centralizado
- [ ] Middleware de autenticación (JWT básico)

### 1.4 Frontend - Vistas Principales
- [ ] Layout principal con navegación
- [ ] Página de Clientes (lista + crear + editar)
- [ ] Página de Materiales (lista + crear + editar)
- [ ] Página de Presupuestos (lista)
- [ ] Formulario de Presupuesto (crear + editar)
- [ ] Estados de presupuesto (borrador/enviado/aceptado/rechazado)

### 1.5 Cálculos
- [ ] Cálculo de importe por línea (cantidad × precio)
- [ ] Cálculo de márgenes por línea
- [ ] Cálculo de totales (subtotal, margen total, descuento, total)
- [ ] Alerta visual para márgenes bajos

**Definition of Done**:
- Usuario puede dar de alta clientes
- Usuario puede dar de alta materiales
- Usuario puede crear un presupuesto con materiales
- El sistema calcula márgenes automáticamente
- Interfaz usable en móvil

---

## Fase 2: Facturas y PDF 📄

**Objetivo**: Ciclo completo de venta con facturas profesionales.

**Duración estimada**: 1-2 semanas

### 2.1 Modelo de Facturas
- [ ] Schema de Facturas
- [ ] Schema de Líneas de Factura
- [ ] Tipos de IVA por línea (21%, 10%, 4%, exento)
- [ ] Numeración automática secuencial

### 2.2 API de Facturas
- [ ] CRUD completo de facturas
- [ ] Registro de pago (fecha, método)
- [ ] Cambio de estado (borrador → emitida → pagada/cancelada)

### 2.3 Conversión Presupuesto → Factura
- [ ] Endpoint para convertir presupuesto a factura
- [ ] Copia de todas las líneas
- [ ] Generación de número de factura
- [ ] Enlace bidireccional presupuesto-factura

### 2.4 Frontend - Facturas
- [ ] Página de Facturas (lista con filtros)
- [ ] Detalle de Factura
- [ ] Formulario de Factura
- [ ] Botón "Crear factura desde presupuesto"
- [ ] Registro de pago

### 2.5 Generación de PDF
- [ ] Template de factura con @react-pdf/renderer
- [ ] Datos de empresa configurables
- [ ] Logo de empresa
- [ ] Vista previa en el navegador
- [ ] Descarga de PDF

**Definition of Done**:
- Usuario puede crear una factura desde un presupuesto
- Factura se puede marcar como pagada
- PDF de factura se puede descargar
- Factura incluye todos los datos legales

---

## Fase 3: Informes y Análisis 📊

**Objetivo**: Visión del negocio y análisis de rentabilidad.

**Duración estimada**: 1 semana

### 3.1 Informes de Ventas
- [ ] Endpoint: Ventas por mes/trimestre/año
- [ ] Comparativa con período anterior
- [ ] Gráfico de evolución (Recharts)

### 3.2 Análisis de Márgenes
- [ ] Margen medio por factura
- [ ] Margen por categoría de material
- [ ] Tendencia de márgenes

### 3.3 Top Materiales y Clientes
- [ ] Materiales más usados en presupuestos
- [ ] Clientes con mayor facturación

### 3.4 Frontend - Informes
- [ ] Dashboard con métricas principales
- [ ] Página de informes detallados
- [ ] Filtros de período
- [ ] Exportación a CSV

### 3.5 Dashboard
- [ ] Resumen de presupuestos por estado
- [ ] Facturas pendientes de pago
- [ ] Ventas del mes actual
- [ ] Margen medio del mes

**Definition of Done**:
- Dashboard muestra KPIs principales
- Informes son exportables
- Datos se actualizan en tiempo real

---

## Fase 4: SII y Extras 🔧

**Objetivo**: Cumplimiento fiscal y mejoras de UX.

**Duración estimada**: 2-3 semanas (solo si es necesario)

### 4.1 SII (Suministro Inmediato de Información) - Opcional
- [ ] Formato de archivo XML SII
- [ ] Datos requeridos por Hacienda
- [ ] Exportación de libro de facturas
- [ ] Nota: La integración directa con AEAT requiere certificado digital y es compleja

### 4.2 Mejoras de UX
- [ ] Historial de precios por material
- [ ] Plantillas de presupuestos (presupuesto tipo baño, cocina, etc.)
- [ ] Duplicar presupuesto existente
- [ ] Notas y observaciones avanzadas

### 4.3 Copia de Seguridad
- [ ] Exportar base de datos
- [ ] Importar base de datos
- [ ] Backups automáticos (supabase/cron)

### 4.4 PWA Mejorado
- [ ] Notificaciones push para facturas pendientes
- [ ] Widget de negocio (iOS/Android)
- [ ] Sincronización offline

### 4.5 Multi-usuario
- [ ] Roles: administrador, empleado
- [ ] Permisos por功能
- [ ] Historial de acciones

**Definition of Done (Fase 4)**:
- Solo implementar si hay demanda real
- SII es kompleks y requiere asesoramiento fiscal

---

## Estimación de Timeline

```
Mes 1:
├── Semana 1: Estructura + DB + API básica
├── Semana 2: Frontend - Clientes + Materiales
└── Semana 3: Frontend - Presupuestos
    Semana 4: Ajustes MVP

Mes 2:
├── Semana 5: Facturas + API
├── Semana 6: Frontend Facturas
├── Semana 7: PDF + conversión presupuesto→factura
└── Semana 8: Informes + Dashboard

Mes 3 (opcional):
└── Semana 9-12: SII + extras + multi-usuario
```

## Priorización

1. **Alta prioridad**: Fases 1 y 2 completas
2. **Media prioridad**: Dashboard + informes básicos
3. **Baja prioridad**: SII, multi-usuario, advanced features
4. **Cuando sea necesario**: Integración con servicios externos

## Notas

- Este roadmap es orientativo y se ajustará según feedback real
- La Fase 4 (SII) requiere asesoramiento de un profesional fiscal
- Considerar migrar a PostgreSQL si el rendimiento de SQLite no es suficiente
