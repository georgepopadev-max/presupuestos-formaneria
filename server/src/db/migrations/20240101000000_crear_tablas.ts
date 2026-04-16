// ============================================================
// MIGRACIÓN: Creación de tablas del sistema
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================

import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  // Tabla de clientes
  await knex.schema.createTable('clientes', (table) => {
    table.increments('id').primary();
    table.string('nombre', 255).notNullable();
    table.string('telefono', 20);
    table.string('email', 255);
    table.string('direccion', 500);
    table.string('ciudad', 100);
    table.string('codigo_postal', 10);
    table.string('nif', 20);
    table.text('observaciones');
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de proveedores
  await knex.schema.createTable('proveedores', (table) => {
    table.increments('id').primary();
    table.string('nombre', 255).notNullable();
    table.string('telefono', 20);
    table.string('email', 255);
    table.string('direccion', 500);
    table.string('ciudad', 100);
    table.string('codigo_postal', 10);
    table.string('cif', 20);
    table.string('persona_contacto', 255);
    table.text('observaciones');
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de materiales
  await knex.schema.createTable('materiales', (table) => {
    table.increments('id').primary();
    table.string('nombre', 255).notNullable();
    table.text('descripcion');
    table.string('categoria', 100);
    table.string('unidad_medida', 20).notNullable();
    table.decimal('precio_unitario', 10, 2).notNullable();
    table.integer('proveedor_id').unsigned().references('id').inTable('proveedores').onDelete('SET NULL');
    table.integer('stock').defaultTo(0);
    table.integer('stock_minimo').defaultTo(0);
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de proyectos
  await knex.schema.createTable('proyectos', (table) => {
    table.increments('id').primary();
    table.string('nombre', 255).notNullable();
    table.text('descripcion');
    table.integer('cliente_id').unsigned().notNullable().references('id').inTable('clientes').onDelete('RESTRICT');
    table.string('direccion', 500);
    table.string('ciudad', 100);
    table.integer('presupuesto_id').unsigned().references('id').inTable('presupuestos').onDelete('SET NULL');
    table.enum('estado', ['pendiente', 'en_progreso', 'completado', 'cancelado']).defaultTo('pendiente');
    table.date('fecha_inicio');
    table.date('fecha_fin');
    table.text('observaciones');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de presupuestos
  await knex.schema.createTable('presupuestos', (table) => {
    table.increments('id').primary();
    table.string('numero', 50).notNullable().unique();
    table.integer('cliente_id').unsigned().notNullable().references('id').inTable('clientes').onDelete('RESTRICT');
    table.integer('proyecto_id').unsigned().references('id').inTable('proyectos').onDelete('SET NULL');
    table.string('titulo', 255).notNullable();
    table.text('descripcion');
    table.enum('estado', ['borrador', 'enviado', 'aceptado', 'rechazado', 'vencido']).defaultTo('borrador');
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('iva', 12, 2).notNullable();
    table.decimal('total', 12, 2).notNullable();
    table.date('fecha_validez');
    table.date('fecha_creacion');
    table.text('notas');
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de líneas de presupuesto
  await knex.schema.createTable('presupuesto_lineas', (table) => {
    table.increments('id').primary();
    table.integer('presupuesto_id').unsigned().notNullable().references('id').inTable('presupuestos').onDelete('CASCADE');
    table.integer('material_id').unsigned().references('id').inTable('materiales').onDelete('SET NULL');
    table.string('descripcion', 500).notNullable();
    table.decimal('cantidad', 10, 3).notNullable();
    table.decimal('precio_unitario', 10, 2).notNullable();
    table.decimal('importe', 12, 2).notNullable();
    table.integer('orden').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de facturas
  await knex.schema.createTable('facturas', (table) => {
    table.increments('id').primary();
    table.string('numero', 50).notNullable().unique();
    table.string('serie', 20).notNullable();
    table.integer('presupuesto_id').unsigned().references('id').inTable('presupuestos').onDelete('SET NULL');
    table.integer('cliente_id').unsigned().notNullable().references('id').inTable('clientes').onDelete('RESTRICT');
    table.integer('proyecto_id').unsigned().references('id').inTable('proyectos').onDelete('SET NULL');
    table.date('fecha_emision').notNullable();
    table.date('fecha_vencimiento');
    table.enum('estado', ['borrador', 'emitida', 'pagada', 'vencida', 'cancelada']).defaultTo('borrador');
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('iva', 12, 2).notNullable();
    table.decimal('total', 12, 2).notNullable();
    table.enum('metodo_pago', ['efectivo', 'transferencia', 'tarjeta', 'bizum']);
    table.text('notas');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de líneas de factura
  await knex.schema.createTable('factura_lineas', (table) => {
    table.increments('id').primary();
    table.integer('factura_id').unsigned().notNullable().references('id').inTable('facturas').onDelete('CASCADE');
    table.integer('material_id').unsigned().references('id').inTable('materiales').onDelete('SET NULL');
    table.string('descripcion', 500).notNullable();
    table.decimal('cantidad', 10, 3).notNullable();
    table.decimal('precio_unitario', 10, 2).notNullable();
    table.decimal('importe', 12, 2).notNullable();
    table.integer('orden').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de precios de mercado
  await knex.schema.createTable('precios_mercado', (table) => {
    table.increments('id').primary();
    table.integer('material_id').unsigned().notNullable().references('id').inTable('materiales').onDelete('CASCADE');
    table.integer('proveedor_id').unsigned().notNullable().references('id').inTable('proveedores').onDelete('CASCADE');
    table.decimal('precio', 10, 2).notNullable();
    table.date('fecha_actualizacion').notNullable();
    table.string('fuente', 500);
    table.text('observaciones');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabla de secuencias (para generación de números)
  await knex.schema.createTable('secuencias', (table) => {
    table.increments('id').primary();
    table.string('clave', 50).notNullable().unique();
    table.integer('ultimo_numero').notNullable().defaultTo(0);
    table.string('prefijo', 20);
    table.integer('digitos').defaultTo(4);
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Índices para mejorar rendimiento en consultas frecuentes
  await knex.schema.raw('CREATE INDEX idx_presupuestos_cliente ON presupuestos(cliente_id)');
  await knex.schema.raw('CREATE INDEX idx_presupuestos_estado ON presupuestos(estado)');
  await knex.schema.raw('CREATE INDEX idx_facturas_cliente ON facturas(cliente_id)');
  await knex.schema.raw('CREATE INDEX idx_facturas_estado ON facturas(estado)');
  await knex.schema.raw('CREATE INDEX idx_facturas_fecha_emision ON facturas(fecha_emision)');
  await knex.schema.raw('CREATE INDEX idx_proyectos_cliente ON proyectos(cliente_id)');
  await knex.schema.raw('CREATE INDEX idx_materiales_proveedor ON materiales(proveedor_id)');
  await knex.schema.raw('CREATE INDEX idx_precios_mercado_material ON precios_mercado(material_id)');
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('precios_mercado');
  await knex.schema.dropTableIfExists('secuencias');
  await knex.schema.dropTableIfExists('factura_lineas');
  await knex.schema.dropTableIfExists('facturas');
  await knex.schema.dropTableIfExists('presupuesto_lineas');
  await knex.schema.dropTableIfExists('presupuestos');
  await knex.schema.dropTableIfExists('proyectos');
  await knex.schema.dropTableIfExists('materiales');
  await knex.schema.dropTableIfExists('proveedores');
  await knex.schema.dropTableIfExists('clientes');
};
