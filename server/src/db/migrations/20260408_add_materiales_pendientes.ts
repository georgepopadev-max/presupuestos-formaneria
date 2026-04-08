// ============================================================
// MIGRACIÓN: Tabla de materiales pendientes de compra
// Materiales planificados para un presupuesto que aún no se han adquirido
// ============================================================

import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('materiales_pendientes', (table) => {
    table.increments('id').primary();
    table.integer('presupuesto_id').unsigned().notNullable()
      .references('id').inTable('presupuestos').onDelete('CASCADE');
    table.integer('material_id').unsigned()
      .references('id').inTable('materiales').onDelete('SET NULL');
    table.string('descripcion', 500).notNullable();
    table.decimal('cantidad_pendiente', 10, 3).notNullable();
    table.decimal('cantidad_comprada', 10, 3).defaultTo(0);
    table.decimal('precio_estimado', 10, 2);
    table.integer('proveedor_id').unsigned()
      .references('id').inTable('proveedores').onDelete('SET NULL');
    table.enum('estado', ['pendiente', 'parcial', 'comprado']).defaultTo('pendiente');
    table.decimal('precio_compra', 10, 2);
    table.date('fecha_compra');
    table.text('observaciones');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Índices para consultas frecuentes
  await knex.schema.raw('CREATE INDEX idx_materiales_pendientes_presupuesto ON materiales_pendientes(presupuesto_id)');
  await knex.schema.raw('CREATE INDEX idx_materiales_pendientes_estado ON materiales_pendientes(estado)');
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('materiales_pendientes');
};
