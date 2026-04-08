"use strict";
// ============================================================
// CONFIGURACIÓN DE KNEX PARA BASE DE DATOS
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
exports.default = config;
//# sourceMappingURL=knexfile.js.map