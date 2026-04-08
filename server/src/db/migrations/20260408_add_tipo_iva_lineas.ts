// ============================================================
// MIGRACIÓN: Añadir tipo_iva a líneas de facturas y presupuestos
// Permite IVA diferente por línea: general (21%), reducido (10%), superreducido (4%), exento (0%)
// ============================================================

import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  // Añadir tipo_iva a factura_lineas
  await knex.schema.alterTable('factura_lineas', (table) => {
    table
      .enum('tipo_iva', ['general', 'reducido', 'superreducido', 'exento'])
      .defaultTo('general')
      .comment("Tipo de IVA: general (21%), reducido (10%), superreducido (4%), exento (0%)");
  });

  // Añadir tipo_iva a presupuesto_lineas
  await knex.schema.alterTable('presupuesto_lineas', (table) => {
    table
      .enum('tipo_iva', ['general', 'reducido', 'superreducido', 'exento'])
      .defaultTo('general')
      .comment("Tipo de IVA: general (21%), reducido (10%), superreducido (4%), exento (0%)");
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('factura_lineas', (table) => {
    table.dropColumn('tipo_iva');
  });

  await knex.schema.alterTable('presupuesto_lineas', (table) => {
    table.dropColumn('tipo_iva');
  });
};
