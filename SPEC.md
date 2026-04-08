# Especificación Funcional

## Historias de Usuario

### Gestión de Clientes

**HU-001: Registrar cliente nuevo**
> Como usuario, quiero registrar clientes con sus datos de contacto para poder asociar presupuestos y facturas.

Criterios:
- [ ] Campos: nombre, email, teléfono, dirección, NIF/CIF
- [ ] Validación de formato de email y teléfono
- [ ] Historial visible de presupuestos y facturas del cliente

**HU-002: Buscar cliente**
> Como usuario, quiero buscar clientes por nombre o NIF para encontrarlos rápidamente.

Criterios:
- [ ] Búsqueda instantánea con debounce
- [ ] Resultados ordenados por relevancia
- [ ] Máximo 20 resultados por página

---

### Gestión de Materiales

**HU-003: Catálogo de materiales**
> Como usuario, quiero mantener un catálogo de materiales con precios para usarlos en presupuestos.

Criterios:
- [ ] CRUD completo de materiales
- [ ] Categorías: tuberías, griferías, accesorios, herramientas, etc.
- [ ] Precios de coste y precio de venta
- [ ] Unidad de medida (metros, unidades, botes, etc.)

**HU-004: Actualizar precios de materiales**
> Como usuario, quiero actualizar precios de materiales en lote para ajustar márgenes.

Criterios:
- [ ] Selección múltiple de materiales
- [ ] Aplicar aumento/descuento porcentual
- [ ] Registro de fecha de última actualización

---

### Presupuestos

**HU-005: Crear presupuesto**
> Como usuario, quiero crear presupuestos detallados para presentarlos a clientes.

Criterios:
- [ ] Seleccionar cliente o crear nuevo
- [ ] Añadir líneas de materiales con cantidad y precio
- [ ] Definir costes de mano de obra
- [ ] Aplicar márgenes por línea y globales
- [ ] Añadir notas y observaciones
- [ ] Vista previa antes de guardar

**HU-006: Márgenes en presupuestos**
> Como usuario, quiero ver y ajustar márgenes para garantizar rentabilidad.

Criterios:
- [ ] Ver margen por línea (%)
- [ ] Ver margen total (%)
- [ ] Ajustar márgenes individuales
- [ ] Alerta visual si margen < 15%

**HU-007: Convertir presupuesto a factura**
> Como usuario, quiero convertir un presupuesto aceptado en factura automáticamente.

Criterios:
- [ ] Copia todos los datos del presupuesto
- [ ] Genera número de factura secuencial
- [ ] Enlaza factura con presupuesto original
- [ ] Actualiza estado del presupuesto a "facturado"

---

### Facturas

**HU-008: Crear factura**
> Como usuario, quiero crear facturas con todos los datos legales requeridos.

Criterios:
- [ ] Numeración secuencial automática (Ej: 2026-0001)
- [ ] Datos del cliente y de la empresa
- [ ] Líneas de detalle con IVA desglosado
- [ ] Soporte para IVA 21%, 10%, 4% y exento por línea
- [ ] Fecha de emisión y fecha de vencimiento
- [ ] Métodos de pago: transferencia, efectivo, tarjeta

**HU-009: Generar PDF de factura**
> Como usuario, quiero descargar facturas en PDF para entregarlas a clientes.

Criterios:
- [ ] Formato A4 profesional
- [ ] Logo de la empresa (desde configuración)
- [ ] Todos los datos legales requeridos en España
- [ ] IBAN y banco de la empresa en el PDF
- [ ] IVA desglosado por tipo en el PDF

**HU-010: Marcar factura como pagada**
> Como usuario, quiero registrar pagos de facturas para hacer seguimiento.

Criterios:
- [ ] Fecha de pago
- [ ] Método de pago
- [ ] Notas de pago opcionales
- [ ] Recordatorio visual de facturas vencidas

**HU-015: Cancelar factura (soft-delete)**
> Como usuario, quiero cancelar facturas sin eliminarlas para mantener trazabilidad.

Criterios:
- [ ] Las facturas nunca se eliminan físicamente
- [ ] Se marcan como canceladas
- [ ] Las facturas canceladas no aparecen en listados activos
- [ ] Se mantiene el histórico completo

---

### Materiales Pendientes de Compra

**HU-016: Gestionar materiales pendientes**
> Como usuario, quiero rastrear materiales planificados pero no comprados para organizar compras a proveedores.

Criterios:
- [ ] Crear lista de materiales pendientes desde un presupuesto
- [ ] Registrar cantidad pendiente vs comprada
- [ ] Registrar precio estimado y precio de compra real
- [ ] Asociar a un proveedor
- [ ] Marcar como comprado con fecha
- [ ] Ver resumen de materiales pendientes agrupados por proveedor

---

### Configuración de Empresa

**HU-013: Datos de la empresa**
> Como administrador, quiero configurar los datos de la empresa para que aparezcan en facturas y presupuestos.

Criterios:
- [ ] Nombre, NIF, dirección, ciudad, código postal
- [ ] Teléfono y email
- [ ] IBAN y nombre del banco
- [ ] Logo para facturas (URL o upload)
- [ ] IVA predeterminado para nuevas líneas

---

### Informes

**HU-011: Informe de ventas**
> Como usuario, quiero ver las ventas por período para conocer la evolución del negocio.

Criterios:
- [ ] Ventas mensuales/trimestrales/anuales
- [ ] Comparativa con período anterior
- [ ] Gráfico de evolución
- [ ] Exportable a CSV/PDF

**HU-012: Análisis de márgenes**
> Como usuario, quiero ver los márgenes medios por tipo de trabajo.

Criterios:
- [ ] Margen medio por presupuesto/factura
- [ ] Márgenes por categoría de material
- [ ] Tendencia de márgenes en el tiempo

---

### Administración

**HU-014: Copia de seguridad**
> Como administrador, quiero hacer backup de los datos para evitar pérdidas.

Criterios:
- [ ] Exportar base de datos completa
- [ ] Importar desde backup
- [ ] Programar backups automáticos (futuro)

---

## Nuevas Funcionalidades

### 1. IVA por Línea

Cada línea de presupuesto y factura puede tener un tipo de IVA diferente:
- **General**: 21%
- **Reducido**: 10%
- **Superreducido**: 4%
- **Exento**: 0%

Los totales se recalculan automáticamente basándose en el IVA de cada línea.

### 2. Soft-Delete de Facturas

Las facturas nunca se eliminan físicamente de la base de datos. En su lugar, se marcan como `cancelada`. Esto mantiene la trazabilidad completa y cumple con la normativa fiscal.

### 3. Conversión Presupuesto → Factura

Al convertir un presupuesto aceptado a factura:
- Se copian todas las líneas del presupuesto
- Se genera un número de factura secuencial
- Se establece `fechaVencimiento` a 30 días desde la emisión
- Se enlaza la factura con el presupuesto original

### 4. Configuración de Empresa

Todos los datos de la empresa se almacenan en la base de datos (tabla `configuracion`) y se utilizan en:
- PDFs de facturas y presupuestos
- Datos del emisor en documentos
- Configuración de IVA predeterminado

### 5. Materiales Pendientes de Compra

Sistema de seguimiento para materiales que están planificados pero aún no comprados:
- Permite registrar precio estimado vs precio real
- Facilita el seguimiento de compras por proveedor
- Sincroniza con líneas del presupuesto original

### 6. Mejoras en Generadores de Secuencia

Se han implementado transacciones con `FOR UPDATE` para evitar condiciones de carrera cuando múltiples solicitudes generan secuencias de números (presupuestos/facturas).

---

## Modelo de Entidades

### Entidad: Cliente

```
Cliente {
  id: string (UUID)
  nombre: string
  email: string
  telefono: string
  direccion: string
  codigoPostal: string
  ciudad: string
  nif: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Entidad: Material

```
Material {
  id: string (UUID)
  nombre: string
  descripcion: string
  categoria: string
  unidadMedida: string (m, ud, l, kg, etc.)
  precioCoste: decimal
  precioVenta: decimal
  stock: number (opcional)
  activo: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Entidad: Presupuesto

```
Presupuesto {
  id: string (UUID)
  numero: string (2026-0001)
  clienteId: string (FK)
  estado: enum (borrador, enviado, aceptado, rechazado, facturado)
  fechaValidez: date
  subtotal: decimal
  margenTotal: decimal
  descuento: decimal
  total: decimal
  notas: text
  createdAt: timestamp
  updatedAt: timestamp
}

LineaPresupuesto {
  id: string (UUID)
  presupuestoId: string (FK)
  materialId: string (FK, nullable)
  descripcion: string
  cantidad: decimal
  precioUnidad: decimal
  tipoIVA: enum (21, 10, 4, exento)
  importe: decimal
  importeIVA: decimal
  total: decimal
  margen: decimal
  orden: number
}
```

### Entidad: Factura

```
Factura {
  id: string (UUID)
  numero: string (2026-0001)
  presupuestoId: string (FK, nullable)
  clienteId: string (FK)
  estado: enum (borrador, emitida, pagada, cancelada)
  fechaEmision: date
  fechaVencimiento: date
  fechaPago: date (nullable)
  subtotal: decimal
  IVA: decimal
  descuento: decimal
  total: decimal
  formaPago: enum (transferencia, efectivo, tarjeta)
  notasPago: text (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}

LineaFactura {
  id: string (UUID)
  facturaId: string (FK)
  materialId: string (FK, nullable)
  descripcion: string
  cantidad: decimal
  precioUnidad: decimal
  tipoIVA: enum (21, 10, 4, exento)
  importe: decimal
  importeIVA: decimal
  total: decimal
  orden: number
}
```

### Entidad: Configuracion

```
Configuracion {
  id: string (PK)
  clave: string (unique)
  valor: string (JSON)
}
```

Claves configuradas:
- `empresa_nombre`: Nombre de la empresa
- `empresa_nif`: NIF/CIF de la empresa
- `empresa_direccion`: Dirección fiscal
- `empresa_ciudad`: Ciudad
- `empresa_codigo_postal`: Código postal
- `empresa_telefono`: Teléfono de contacto
- `empresa_email`: Email de contacto
- `empresa_iban`: IBAN para transferencias
- `empresa_banco`: Nombre del banco
- `iva_predeterminado`: Tipo IVA por defecto (21, 10, 4, exento)

### Entidad: MaterialesPendientes

```
MaterialesPendientes {
  id: string (UUID)
  presupuestoId: string (FK)
  materialId: string (FK, nullable)
  descripcion: string
  cantidad_pendiente: decimal
  cantidad_comprada: decimal
  precio_estimado: decimal (nullable)
  precio_compra: decimal (nullable)
  estado: enum (pendiente, parcial, comprado)
  proveedorId: string (FK, nullable)
  fecha_compra: date (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Entidad: Proveedor

```
Proveedor {
  id: string (UUID)
  nombre: string
  email: string (nullable)
  telefono: string (nullable)
  contacto: string (nullable)
  activo: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Relaciones

```
Cliente 1──∞ Presupuesto
Cliente 1──∞ Factura
Presupuesto 1──∞ LineaPresupuesto
Presupuesto 1──∞ MaterialesPendientes
Presupuesto 0..1──1 Factura
Material 1──∞ LineaPresupuesto
Material 1──∞ LineaFactura
Material 1──∞ MaterialesPendientes
Proveedor 1──∞ MaterialesPendientes
Factura 1──∞ LineaFactura
```

## API Endpoints

### Clientes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/clientes | Listar clientes (paginado) |
| GET | /api/clientes/:id | Obtener cliente por ID |
| GET | /api/clientes/:id/historial | Historial de presupuestos/facturas |
| POST | /api/clientes | Crear cliente |
| PUT | /api/clientes/:id | Actualizar cliente |
| DELETE | /api/clientes/:id | Eliminar cliente |
| GET | /api/clientes/buscar?q= | Buscar clientes |

### Materiales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/materiales | Listar materiales (paginado) |
| GET | /api/materiales/:id | Obtener material por ID |
| GET | /api/materiales/categorias | Listar categorías |
| POST | /api/materiales | Crear material |
| PUT | /api/materiales/:id | Actualizar material |
| DELETE | /api/materiales/:id | Eliminar material |
| PUT | /api/materiales/precio | Actualizar precios en lote |

### Proveedores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/proveedores | Listar proveedores |
| GET | /api/proveedores/:id | Obtener proveedor por ID |
| POST | /api/proveedores | Crear proveedor |
| PUT | /api/proveedores/:id | Actualizar proveedor |
| DELETE | /api/proveedores/:id | Eliminar proveedor |

### Presupuestos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/presupuestos | Listar presupuestos (filtros: estado, cliente) |
| GET | /api/presupuestos/:id | Obtener presupuesto con líneas |
| POST | /api/presupuestos | Crear presupuesto |
| PUT | /api/presupuestos/:id | Actualizar presupuesto |
| PUT | /api/presupuestos/:id/estado | Cambiar estado |
| DELETE | /api/presupuestos/:id | Eliminar presupuesto |
| POST | /api/presupuestos/:id/facturar | Convertir a factura |

### Facturas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/facturas | Listar facturas (filtros: estado, cliente, fecha) |
| GET | /api/facturas/:id | Obtener factura con líneas |
| GET | /api/facturas/:id/pdf | Generar PDF |
| POST | /api/facturas | Crear factura |
| PUT | /api/facturas/:id | Actualizar factura |
| PUT | /api/facturas/:id/pagar | Registrar pago |
| PATCH | /api/facturas/:id/cancelar | Cancelar factura (soft-delete) |

### Materiales Pendientes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/materiales-pendientes/presupuesto/:id | Obtener materiales pendientes de un presupuesto |
| POST | /api/materiales-pendientes/presupuesto/:id/crear | Crear materiales pendientes desde presupuesto |
| PATCH | /api/materiales-pendientes/:id/comprar | Marcar material como comprado |
| PATCH | /api/materiales-pendientes/:id/cantidad | Actualizar cantidad pendiente/comprada |
| DELETE | /api/materiales-pendientes/:id | Eliminar material pendiente |
| GET | /api/materiales-pendientes/resumen/proveedor | Resumen agrupado por proveedor |

### Configuración

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/config | Obtener toda la configuración |
| GET | /api/config/empresa | Obtener datos de empresa |
| POST | /api/config | Actualizar configuración |
| PUT | /api/config | Actualizar configuración |
| GET | /api/config/backup | Exportar backup |
| POST | /api/config/backup | Importar backup |

### Informes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/informes/ventas | Ventas por período |
| GET | /api/informes/margenes | Análisis de márgenes |
| GET | /api/informes/materiales | Materiales más usados |
| GET | /api/informes/clientes | Top clientes |

## Páginas Frontend

| Ruta | Descripción |
|------|-------------|
| / | Dashboard principal |
| /clientes | Gestión de clientes |
| /clientes/:id | Detalle de cliente |
| /materiales | Catálogo de materiales |
| /presupuestos | Listado de presupuestos |
| /presupuestos/nuevo | Crear presupuesto |
| /presupuestos/:id | Detalle de presupuesto |
| /facturas | Listado de facturas |
| /facturas/nuevo | Crear factura |
| /facturas/:id | Detalle de factura |
| /settings | Configuración de empresa |
| /materiales-pendientes | Gestión de materiales pendientes de compra |
| /informes | Informes y estadísticas |

## Criterios de Aceptación

### CA-001: Presupuesto completo
- Puedo crear un presupuesto con al menos 5 líneas de materiales
- El cálculo de totales es correcto (subtotal, márgenes, descuento, total, IVA)
- Puedo cambiar el estado del presupuesto
- Puedo ver una vista previa antes de guardar

### CA-002: Factura desde presupuesto
- Al convertir un presupuesto a factura, se copian todos los datos correctamente
- El número de factura es secuencial y único
- El enlace presupuesto-factura es visible en ambos

### CA-003: PDF de factura
- El PDF incluye todos los datos requeridos legalmente
- El formato es profesional y legible
- Se puede abrir en cualquier visor de PDF estándar
- Incluye IBAN y datos bancarios de la empresa
- Muestra IVA desglosado por tipo

### CA-004: Búsqueda rápida
- La búsqueda de clientes devuelve resultados en <500ms
- La búsqueda funciona con tildes y sin tildes

### CA-005: PWA funcional
- La aplicación se puede instalar en móvil
- Funciona sin conexión para consultar datos
- Los datos se sincronizan al恢复 conexión

### CA-006: Márgenes visibles
- En cada línea del presupuesto se muestra el margen %
- El margen total es visible
- Se muestra alerta si margen < 15%

### CA-007: IVA por línea
- Cada línea puede tener un tipo de IVA diferente
- Los totales se recalculan correctamente según los tipos de IVA

### CA-008: Cancelación de facturas
- Las facturas canceladas no se eliminan físicamente
- Appecen en listados históricos pero no en listados activos

### CA-009: Materiales pendientes
- Puedo crear lista de materiales pendientes desde un presupuesto
- Puedo registrar compras parciales
- Puedo ver resumen por proveedor

## Reglas de Negocio

1. **Numeración**: Facturas y presupuestos usan secuencia anual (reset cada 1 de enero)
2. **IVA**: Por defecto 21%, configurable por línea (21%, 10%, 4%, exento)
3. **Validez**: Presupuestos válidos 30 días por defecto
4. **Eliminación**: No se eliminan facturas, se marcan como canceladas (soft-delete)
5. **Márgenes**: No hay margen mínimo enforced, pero se advierte
6. **Moneda**: Euros (€), 2 decimales en pantalla, 4 en base de datos
7. **Secuencias**: Uso de transacciones con FOR UPDATE para evitar race conditions