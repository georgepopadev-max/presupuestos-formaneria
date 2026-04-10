import app from './app';
import dotenv from 'dotenv';
import knex from 'knex';
import config from '../../knexfile';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ejecutar migraciones automáticamente al arrancar
async function start() {
  try {
    const db = knex(config);
    console.log('  Ejecutando migraciones...');
    await db.migrate.latest();
    console.log('  Migraciones completadas.');
    await db.destroy();
  } catch (err) {
    console.error('  Error en migraciones:', err);
  }

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
