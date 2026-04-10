import app from './app';
import dotenv from 'dotenv';
// @ts-ignore
import pg from 'pg';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ejecutar migraciones manualmente con pg directo
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS knex_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        batch INTEGER,
        migration_time TIMESTAMP DEFAULT NOW()
      );
    `);

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

    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefono VARCHAR(50),
        direccion TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefono VARCHAR(50),
        direccion TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS presupuestos (
        id SERIAL PRIMARY KEY,
        numero VARCHAR(50) UNIQUE NOT NULL,
        cliente_id INTEGER REFERENCES clientes(id),
        estado VARCHAR(50) DEFAULT 'borrador',
        fecha DATE DEFAULT CURRENT_DATE,
        subtotal DECIMAL(12,2) DEFAULT 0,
        iva DECIMAL(12,2) DEFAULT 0,
        total DECIMAL(12,2) DEFAULT 0,
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS facturas (
        id SERIAL PRIMARY KEY,
        numero VARCHAR(50) UNIQUE NOT NULL,
        presupuesto_id INTEGER REFERENCES presupuestos(id),
        cliente_id INTEGER REFERENCES clientes(id),
        estado VARCHAR(50) DEFAULT 'pendiente',
        fecha DATE DEFAULT CURRENT_DATE,
        importe DECIMAL(12,2) DEFAULT 0,
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS proyectos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        cliente_id INTEGER REFERENCES clientes(id),
        estado VARCHAR(50) DEFAULT 'planificacion',
        presupuesto_total DECIMAL(12,2) DEFAULT 0,
        fecha_inicio DATE,
        fecha_fin DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS materiales (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        unidad VARCHAR(50) DEFAULT 'ud',
        precio DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

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
