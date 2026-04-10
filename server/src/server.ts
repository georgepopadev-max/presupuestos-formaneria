import app from './app';
import dotenv from 'dotenv';
// @ts-ignore
import pg from 'pg';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ejecutar migraciones completas con pg directo
async function runMigrations() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.log('  No DATABASE_URL, saltando migraciones.');
    return;
  }

  const client = new pg.Client({
    connectionString: DATABASE_URL.includes('?') ? DATABASE_URL : DATABASE_URL + '?sslmode=require',
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('  Ejecutando migraciones...');

    // Tabla usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(255),
        rol VARCHAR(50) DEFAULT 'admin',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla clientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(255),
        direccion VARCHAR(500),
        ciudad VARCHAR(100),
        codigo_postal VARCHAR(10),
        nif VARCHAR(20),
        observaciones TEXT,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla proveedores
    await client.query(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(255),
        direccion VARCHAR(500),
        ciudad VARCHAR(100),
        codigo_postal VARCHAR(10),
        cif VARCHAR(20),
        persona_contacto VARCHAR(255),
        observaciones TEXT,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla materiales
    await client.query(`
      CREATE TABLE IF NOT EXISTS materiales (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(100),
        unidad_medida VARCHAR(20) NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
        stock INTEGER DEFAULT 0,
        stock_minimo INTEGER DEFAULT 0,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla proyectos
    await client.query(`
      CREATE TABLE IF NOT EXISTS proyectos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
        direccion VARCHAR(500),
        ciudad VARCHAR(100),
        presupuesto_id INTEGER REFERENCES presupuestos(id) ON DELETE SET NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        fecha_inicio DATE,
        fecha_fin DATE,
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla presupuestos
    await client.query(`
      CREATE TABLE IF NOT EXISTS presupuestos (
        id SERIAL PRIMARY KEY,
        numero VARCHAR(50) UNIQUE NOT NULL,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
        proyecto_id INTEGER REFERENCES proyectos(id) ON DELETE SET NULL,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        estado VARCHAR(50) DEFAULT 'borrador',
        subtotal DECIMAL(12,2) NOT NULL,
        iva DECIMAL(12,2) NOT NULL,
        total DECIMAL(12,2) NOT NULL,
        fecha_validez DATE,
        fecha_creacion DATE,
        notas TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla líneas de presupuesto
    await client.query(`
      CREATE TABLE IF NOT EXISTS presupuesto_lineas (
        id SERIAL PRIMARY KEY,
        presupuesto_id INTEGER NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
        material_id INTEGER REFERENCES materiales(id) ON DELETE SET NULL,
        descripcion VARCHAR(500) NOT NULL,
        cantidad DECIMAL(10,3) NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        importe DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla facturas
    await client.query(`
      CREATE TABLE IF NOT EXISTS facturas (
        id SERIAL PRIMARY KEY,
        numero VARCHAR(50) UNIQUE NOT NULL,
        presupuesto_id INTEGER REFERENCES presupuestos(id) ON DELETE SET NULL,
        cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        fecha_emision DATE DEFAULT CURRENT_DATE,
        fecha_vencimiento DATE,
        importe DECIMAL(12,2) DEFAULT 0,
        importe_pagado DECIMAL(12,2) DEFAULT 0,
        metodo_pago VARCHAR(50),
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla precios mercado
    await client.query(`
      CREATE TABLE IF NOT EXISTS precios_mercado (
        id SERIAL PRIMARY KEY,
        ano INTEGER,
        trimestre INTEGER,
        tipo_servicio VARCHAR(255),
        precio_medio DECIMAL(12,2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla config
    await client.query(`
      CREATE TABLE IF NOT EXISTS config (
        id SERIAL PRIMARY KEY,
        clave VARCHAR(255) UNIQUE NOT NULL,
        valor TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla materiales pendientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS materiales_pendientes (
        id SERIAL PRIMARY KEY,
        proyecto_id INTEGER REFERENCES proyectos(id) ON DELETE CASCADE,
        material_nombre VARCHAR(255),
        cantidad DECIMAL(10,2),
        estado VARCHAR(50) DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla línea de facturas
    await client.query(`
      CREATE TABLE IF NOT EXISTS factura_lineas (
        id SERIAL PRIMARY KEY,
        factura_id INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
        descripcion VARCHAR(500) NOT NULL,
        cantidad DECIMAL(10,3) NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        importe DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabla secuencias para números correlativos
    await client.query(`
      CREATE TABLE IF NOT EXISTS secuencias (
        id SERIAL PRIMARY KEY,
        clave VARCHAR(100) UNIQUE NOT NULL,
        ultimo_numero INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`
      INSERT INTO secuencias (clave, ultimo_numero) VALUES ('presupuesto', 0), ('factura', 0)
      ON CONFLICT (clave) DO NOTHING;
    `);

    // Crear usuario admin por defecto
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO usuarios (email, password_hash, nombre, rol)
      VALUES ('admin@tuempresa.com', $1, 'Administrador', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hash]);

    console.log('  Migraciones completadas.');
  } catch (err) {
    console.error('  Error en migraciones:', err);
  } finally {
    await client.end();
  }
}

// Iniciar el servidor
async function start() {
  await runMigrations();

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     Sistema de Gestión de Presupuestos y Facturas         ║
║              para Fontanería                             ║
╠══════════════════════════════════════════════════════════╣
║  Servidor iniciado en modo: ${NODE_ENV.padEnd(31)}║
║  Puerto: ${PORT.toString().padEnd(47)}║
║  URL: http://localhost:${PORT}                            ║
╚══════════════════════════════════════════════════════════╝
    `);
  });
}

start();
