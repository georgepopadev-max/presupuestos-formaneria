// ============================================================
// SERVICIO DE AUTENTICACIÓN JWT
// Sistema de gestión de presupuestos y facturas para fontanería
// ============================================================

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import knex from 'knex';
import knexConfig from '../../knexfile';
import { Usuario } from '../types';

const db = knex(knexConfig);
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-super-secreto-2024';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Registra un nuevo usuario
   */
  async register(email: string, password: string, nombre: string): Promise<{ usuario: Omit<Usuario, 'password_hash'>; token: string }> {
    // Verificar si el email ya existe
    const existing = await db('usuarios').where({ email }).first();
    if (existing) {
      throw new Error('El email ya está registrado');
    }

    // Hash de password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const [usuario] = await db('usuarios')
      .insert({ email, password_hash: passwordHash, nombre })
      .returning(['id', 'email', 'nombre', 'activo', 'created_at']);

    // Generar token
    const token = this.generateToken(usuario);

    return { usuario, token };
  }

  /**
   * Login de usuario
   */
  async login(email: string, password: string): Promise<{ usuario: Omit<Usuario, 'password_hash'>; token: string }> {
    // Buscar usuario
    const usuario = await db('usuarios').where({ email }).first();
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new Error('Usuario desactivado');
    }

    // Verificar password
    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(usuario);

    return {
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, activo: usuario.activo },
      token,
    };
  }

  /**
   * Verifica un token JWT
   */
  async verifyToken(token: string): Promise<{ id: number; email: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      return decoded;
    } catch {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Genera un token JWT
   */
  private generateToken(usuario: any): string {
    return jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: number): Promise<Omit<Usuario, 'password_hash'> | null> {
    const usuario = await db('usuarios').where({ id }).first();
    if (!usuario) return null;
    const { password_hash, ...rest } = usuario;
    return rest;
  }
}

export default new AuthService();
