// ============================================================
// SEMILLAS: Datos iniciales del sistema
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================

import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export const seed = async (knex: Knex): Promise<void> => {
  // Limpiar tablas en orden correcto (respetando foreign keys)
  await knex('precios_mercado').del();
  await knex('secuencias').del();
  await knex('usuarios').del();
  await knex('factura_lineas').del();
  await knex('facturas').del();
  await knex('presupuesto_lineas').del();
  await knex('presupuestos').del();
  await knex('proyectos').del();
  await knex('materiales').del();
  await knex('proveedores').del();
  await knex('clientes').del();

  // Insertar usuario administrador por defecto (password: admin123)
  const passwordHash = await bcrypt.hash('admin123', 10);
  await knex('usuarios').insert({
    email: 'admin@tuempresa.com',
    password_hash: passwordHash,
    nombre: 'Administrador',
    activo: true,
  });

  // Insertar clientes de ejemplo
  await knex('clientes').insert([
    {
      nombre: 'Juan García López',
      telefono: '612 345 678',
      email: 'juan.garcia@email.com',
      direccion: 'Calle Mayor 123',
      ciudad: 'Madrid',
      codigo_postal: '28001',
      nif: '12345678A',
      observaciones: 'Cliente habitual',
      activo: true,
    },
    {
      nombre: 'María Rodríguez Fernández',
      telefono: '634 567 890',
      email: 'maria.rodriguez@email.com',
      direccion: 'Avenida de la Constitución 45',
      ciudad: 'Barcelona',
      codigo_postal: '08001',
      nif: '87654321B',
      observaciones: 'Puntual en pagos',
      activo: true,
    },
    {
      nombre: 'Pedro Martínez Sánchez',
      telefono: '655 789 012',
      email: 'pedro.martinez@email.com',
      direccion: 'Plaza del Sol 8',
      ciudad: 'Valencia',
      codigo_postal: '46001',
      nif: '56789012C',
      activo: true,
    },
  ]);

  // Insertar proveedores de ejemplo
  await knex('proveedores').insert([
    {
      nombre: 'Suministros Fontanería Central',
      telefono: '912 345 678',
      email: 'ventas@sfcentral.com',
      direccion: 'Polígono Industrial Norte, Nave 15',
      ciudad: 'Madrid',
      codigo_postal: '28050',
      cif: 'A12345678',
      persona_contacto: 'Carlos López',
      observaciones: 'Proveedor principal de materiales',
      activo: true,
    },
    {
      nombre: 'Tuberías y Accesorios S.L.',
      telefono: '963 456 789',
      email: 'info@tuberiasaccesorios.es',
      direccion: 'Calle del Metal 30',
      ciudad: 'Valencia',
      codigo_postal: '46014',
      cif: 'B98765432',
      persona_contacto: 'Ana García',
      activo: true,
    },
    {
      nombre: 'Griferías Premium',
      telefono: '934 567 890',
      email: 'comercial@griferiaspremium.com',
      direccion: 'Avenida Diagonal 200',
      ciudad: 'Barcelona',
      codigo_postal: '08018',
      cif: 'C55544433',
      persona_contacto: 'Luis Martínez',
      observaciones: 'Especialistas en grifería de alta gama',
      activo: true,
    },
  ]);

  // Insertar materiales de ejemplo
  await knex('materiales').insert([
    {
      nombre: 'Tubo PVC 32mm',
      descripcion: 'Tubo de PVC para desagüe, longitud 3 metros',
      categoria: 'Tuberías',
      unidad_medida: 'unidad',
      precio_unitario: 4.50,
      proveedor_id: 1,
      stock: 100,
      stock_minimo: 20,
      activo: true,
    },
    {
      nombre: 'Tubo cobre 22mm',
      descripcion: 'Tubo de cobre para agua caliente, longitud 5 metros',
      categoria: 'Tuberías',
      unidad_medida: 'unidad',
      precio_unitario: 18.75,
      proveedor_id: 1,
      stock: 50,
      stock_minimo: 10,
      activo: true,
    },
    {
      nombre: 'Codo PVC 90º 32mm',
      descripcion: 'Codo de PVC a 90 grados para desagüe',
      categoria: 'Accesorios',
      unidad_medida: 'unidad',
      precio_unitario: 1.20,
      proveedor_id: 1,
      stock: 200,
      stock_minimo: 50,
      activo: true,
    },
    {
      nombre: 'Llave de paso 1/2"',
      descripcion: 'Llave de paso esférica de latón 1/2 pulgada',
      categoria: 'Válvulas',
      unidad_medida: 'unidad',
      precio_unitario: 8.90,
      proveedor_id: 2,
      stock: 75,
      stock_minimo: 15,
      activo: true,
    },
    {
      nombre: 'Grifo monomando lavabo',
      descripcion: 'Grifo monomando para lavabo, cromado',
      categoria: 'Grifería',
      unidad_medida: 'unidad',
      precio_unitario: 45.00,
      proveedor_id: 3,
      stock: 25,
      stock_minimo: 5,
      activo: true,
    },
    {
      nombre: 'Válvula desagüe automático',
      descripcion: 'Válvula automática de desagüe para lavadora',
      categoria: 'Válvulas',
      unidad_medida: 'unidad',
      precio_unitario: 12.50,
      proveedor_id: 2,
      stock: 40,
      stock_minimo: 10,
      activo: true,
    },
    {
      nombre: 'Racord hembra 3/4"',
      descripcion: 'Racord de latón hembra 3/4 de pulgada',
      categoria: 'Racores',
      unidad_medida: 'unidad',
      precio_unitario: 3.25,
      proveedor_id: 2,
      stock: 150,
      stock_minimo: 30,
      activo: true,
    },
    {
      nombre: 'Filtro anti-cal',
      descripcion: 'Filtro descalcificador magnético para caldera',
      categoria: 'Tratamiento agua',
      unidad_medida: 'unidad',
      precio_unitario: 89.00,
      proveedor_id: 1,
      stock: 10,
      stock_minimo: 3,
      activo: true,
    },
  ]);

  // Insertar secuencias iniciales
  await knex('secuencias').insert([
    { clave: 'factura', ultimo_numero: 0, prefijo: 'FAC-', digitos: 4 },
    { clave: 'presupuesto', ultimo_numero: 0, prefijo: 'PRE-', digitos: 4 },
    { clave: 'proyecto', ultimo_numero: 0, prefijo: 'PROY-', digitos: 4 },
  ]);

  // Insertar precios de mercado (referencia para actualizaciones)
  await knex('precios_mercado').insert([
    {
      material_id: 1,
      proveedor_id: 1,
      precio: 4.50,
      fecha_actualizacion: new Date(),
      fuente: 'Tarifa oficial 2024',
    },
    {
      material_id: 2,
      proveedor_id: 1,
      precio: 18.75,
      fecha_actualizacion: new Date(),
      fuente: 'Tarifa oficial 2024',
    },
    {
      material_id: 3,
      proveedor_id: 1,
      precio: 1.20,
      fecha_actualizacion: new Date(),
      fuente: 'Tarifa oficial 2024',
    },
    {
      material_id: 4,
      proveedor_id: 2,
      precio: 8.90,
      fecha_actualizacion: new Date(),
      fuente: 'Catálogo primavera 2024',
    },
    {
      material_id: 5,
      proveedor_id: 3,
      precio: 45.00,
      fecha_actualizacion: new Date(),
      fuente: 'Web oficial Griferías Premium',
    },
  ]);
};
