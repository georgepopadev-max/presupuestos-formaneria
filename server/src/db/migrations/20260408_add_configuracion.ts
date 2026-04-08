// ============================================================
// MIGRACIÓN: Tabla de configuración de empresa
// Almacena datos de la empresa para facturas y presupuestos
// ============================================================

import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  // Tabla de configuración general
  await knex.schema.createTable('configuracion', (table) => {
    table.increments('id').primary();
    table.string('clave', 100).notNullable().unique();
    table.text('valor'); // Valores almacenados como texto (JSON permitido)
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Insertar configuración inicial de la empresa
  await knex('configuracion').insert([
    { clave: 'empresa_nombre', valor: 'Tu Empresa de Fontanería' },
    { clave: 'empresa_nif', valor: 'B12345678' },
    { clave: 'empresa_direccion', valor: '' },
    { clave: 'empresa_ciudad', valor: '' },
    { clave: 'empresa_codigo_postal', valor: '' },
    { clave: 'empresa_telefono', valor: '' },
    { clave: 'empresa_email', valor: '' },
    { clave: 'empresa_iban', valor: '' },
    { clave: 'empresa_banco', valor: '' },
    { clave: 'iva_predeterminado', valor: '21' },
  ]);
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('configuracion');
};
