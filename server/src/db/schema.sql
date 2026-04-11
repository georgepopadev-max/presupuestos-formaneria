-- ============================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS
-- Sistema de gestión de presupuestos y facturas para fontanería
-- Versión: Schema SQL basado en análisis de código TypeScript
-- ============================================================

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion VARCHAR(500),
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    nif VARCHAR(20),
    observaciones TEXT,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion VARCHAR(500),
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    cif VARCHAR(20),
    persona_contacto VARCHAR(255),
    observaciones TEXT,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materiales
CREATE TABLE IF NOT EXISTS materiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(20) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    proveedor_id INTEGER UNSIGNED REFERENCES proveedores(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cliente_id INTEGER UNSIGNED NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    direccion VARCHAR(500),
    ciudad VARCHAR(100),
    presupuesto_id INTEGER UNSIGNED REFERENCES presupuestos(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
    fecha_inicio DATE,
    fecha_fin DATE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de presupuestos (CORREGIDA: añadido activo)
CREATE TABLE IF NOT EXISTS presupuestos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero VARCHAR(50) NOT NULL UNIQUE,
    cliente_id INTEGER UNSIGNED NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    proyecto_id INTEGER UNSIGNED REFERENCES proyectos(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado', 'aceptado', 'rechazado', 'vencido')),
    subtotal DECIMAL(12, 2) NOT NULL,
    iva DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    fecha_validez DATE,
    fecha_creacion DATE,
    notas TEXT,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de líneas de presupuesto (CORREGIDA: añadido tipo_iva)
CREATE TABLE IF NOT EXISTS presupuesto_lineas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    presupuesto_id INTEGER UNSIGNED NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    material_id INTEGER UNSIGNED REFERENCES materiales(id) ON DELETE SET NULL,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10, 3) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    importe DECIMAL(12, 2) NOT NULL,
    tipo_iva VARCHAR(20) DEFAULT 'general' CHECK (tipo_iva IN ('general', 'reducido', 'superreducido', 'exento')),
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de facturas (CORREGIDA: añadido activo)
CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero VARCHAR(50) NOT NULL UNIQUE,
    serie VARCHAR(20) NOT NULL,
    presupuesto_id INTEGER UNSIGNED REFERENCES presupuestos(id) ON DELETE SET NULL,
    cliente_id INTEGER UNSIGNED NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    proyecto_id INTEGER UNSIGNED REFERENCES proyectos(id) ON DELETE SET NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'emitida', 'pagada', 'vencida', 'cancelada')),
    subtotal DECIMAL(12, 2) NOT NULL,
    iva DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(20) CHECK (metodo_pago IN ('efectivo', 'transferencia', 'tarjeta', 'bizum')),
    notas TEXT,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de líneas de factura (CORREGIDA: añadido tipo_iva)
CREATE TABLE IF NOT EXISTS factura_lineas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER UNSIGNED NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    material_id INTEGER UNSIGNED REFERENCES materiales(id) ON DELETE SET NULL,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10, 3) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    importe DECIMAL(12, 2) NOT NULL,
    tipo_iva VARCHAR(20) DEFAULT 'general' CHECK (tipo_iva IN ('general', 'reducido', 'superreducido', 'exento')),
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de precios de mercado
CREATE TABLE IF NOT EXISTS precios_mercado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER UNSIGNED NOT NULL REFERENCES materiales(id) ON DELETE CASCADE,
    proveedor_id INTEGER UNSIGNED NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_actualizacion DATE NOT NULL,
    fuente VARCHAR(500),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de secuencias para generación automática de números
CREATE TABLE IF NOT EXISTS secuencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave VARCHAR(50) NOT NULL UNIQUE,
    ultimo_numero INTEGER NOT NULL DEFAULT 0,
    prefijo VARCHAR(20),
    digitos INTEGER DEFAULT 4,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuración de empresa
CREATE TABLE IF NOT EXISTS configuracion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materiales pendientes de compra
CREATE TABLE IF NOT EXISTS materiales_pendientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    presupuesto_id INTEGER UNSIGNED NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    material_id INTEGER UNSIGNED REFERENCES materiales(id) ON DELETE SET NULL,
    descripcion VARCHAR(500) NOT NULL,
    cantidad_pendiente DECIMAL(10, 3) NOT NULL,
    cantidad_comprada DECIMAL(10, 3) DEFAULT 0,
    precio_estimado DECIMAL(10, 2),
    proveedor_id INTEGER UNSIGNED REFERENCES proveedores(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'parcial', 'comprado')),
    precio_compra DECIMAL(10, 2),
    fecha_compra DATE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios para autenticación JWT
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_presupuestos_cliente ON presupuestos(cliente_id);
CREATE INDEX idx_presupuestos_estado ON presupuestos(estado);
CREATE INDEX idx_presupuestos_activo ON presupuestos(activo);
CREATE INDEX idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX idx_facturas_estado ON facturas(estado);
CREATE INDEX idx_facturas_fecha_emision ON facturas(fecha_emision);
CREATE INDEX idx_facturas_activo ON facturas(activo);
CREATE INDEX idx_proyectos_cliente ON proyectos(cliente_id);
CREATE INDEX idx_materiales_proveedor ON materiales(proveedor_id);
CREATE INDEX idx_precios_mercado_material ON precios_mercado(material_id);
CREATE INDEX idx_materiales_pendientes_presupuesto ON materiales_pendientes(presupuesto_id);
CREATE INDEX idx_materiales_pendientes_estado ON materiales_pendientes(estado);
CREATE INDEX idx_secuencias_clave ON secuencias(clave);
