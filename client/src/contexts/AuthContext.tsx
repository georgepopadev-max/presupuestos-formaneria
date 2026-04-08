import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Usuario, AuthState, LoginCredentials } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: { nombre: string; email: string; password: string }) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de autenticación para toda la aplicación
 * Maneja login, logout y estado de sesión
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión existente al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('usuario');
    
    if (token && usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr) as Usuario;
        setState({
          token,
          usuario,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    const { token, usuario } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    setState({
      token,
      usuario,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('usuario');
    setState({
      usuario: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const register = async (data: { nombre: string; email: string; password: string }) => {
    await authService.register(data);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de autenticación
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}