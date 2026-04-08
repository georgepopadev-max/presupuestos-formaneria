// ============================================================
// SERVICIO DE CONFIGURACIÓN
// Gestiona la configuración de la empresa y valores generales
// ============================================================

import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex(knexConfig);

/**
 * Servicio para gestionar la configuración de la aplicación
 */
export class ConfigService {
  /**
   * Obtiene el valor de una clave de configuración
   * @param clave - Clave de configuración
   * @returns Valor asociado o null si no existe
   */
  async get(clave: string): Promise<string | null> {
    const row = await db('configuracion').where({ clave }).first();
    return row?.valor || null;
  }

  /**
   * Establece el valor de una clave de configuración
   * @param clave - Clave de configuración
   * @param valor - Nuevo valor
   */
  async set(clave: string, valor: string): Promise<void> {
    const exists = await db('configuracion').where({ clave }).first();
    if (exists) {
      await db('configuracion').where({ clave }).update({ valor, updated_at: db.fn.now() });
    } else {
      await db('configuracion').insert({ clave, valor });
    }
  }

  /**
   * Obtiene todas las claves y valores de configuración
   * @returns Objeto con todas las configuraciones
   */
  async getAll(): Promise<Record<string, string>> {
    const rows = await db('configuracion').orderBy('clave');
    return rows.reduce((acc, r) => ({ ...acc, [r.clave]: r.valor }), {});
  }

  /**
   * Obtiene la configuración de la empresa en un objeto estructurado
   * @returns Datos de la empresa
   */
  async getEmpresaConfig(): Promise<{
    nombre: string;
    nif: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
    email: string;
    iban: string;
    banco: string;
  }> {
    const all = await this.getAll();
    return {
      nombre: all['empresa_nombre'] || '',
      nif: all['empresa_nif'] || '',
      direccion: all['empresa_direccion'] || '',
      ciudad: all['empresa_ciudad'] || '',
      codigoPostal: all['empresa_codigo_postal'] || '',
      telefono: all['empresa_telefono'] || '',
      email: all['empresa_email'] || '',
      iban: all['empresa_iban'] || '',
      banco: all['empresa_banco'] || '',
    };
  }
}

export default new ConfigService();
