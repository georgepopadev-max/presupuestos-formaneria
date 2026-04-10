import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/presupuestos', label: 'Presupuestos', icon: '📋' },
  { path: '/facturas', label: 'Facturas', icon: '🧾' },
  { path: '/clientes', label: 'Clientes', icon: '👥' },
  { path: '/proveedores', label: 'Proveedores', icon: '🏭' },
  { path: '/materiales', label: 'Materiales', icon: '🔧' },
  { path: '/proyectos', label: 'Proyectos', icon: '🏗️' },
  { path: '/analisis', label: 'Análisis', icon: '📈' },
  { path: '/materiales-pendientes', label: 'Pendientes', icon: '⏳' },
  { path: '/settings', label: 'Configuración', icon: '⚙️' },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Logo/Título */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">Fontanería</h1>
          <p className="text-xs text-gray-400">Sistema de gestión</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                location.pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded transition-colors text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-h-screen">
        {/* Content rendered by Routes */}
      </main>
    </div>
  );
}
