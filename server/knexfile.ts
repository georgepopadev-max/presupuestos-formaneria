// ============================================================
// CONFIGURACIÓN DE KNEX PARA BASE DE DATOS
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================

import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'localhost',
    port: 5432,
    database: 'presupuestos_fontaneria',
    user: 'postgres',
    password: '',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/db/migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/db/seeds',
    extension: 'ts',
  },
};

export default config;
