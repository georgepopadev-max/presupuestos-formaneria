import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Invoices from './pages/Invoices';
import Materials from './pages/Materials';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import Suppliers from './pages/Suppliers';
import MarketAnalysis from './pages/MarketAnalysis';
import PendingMaterials from './pages/PendingMaterials';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Componente principal de la aplicación
 * Sistema de gestión B2B para presupuestos y facturas de fontanería
 */
function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirección raíz al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas protegidas con layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/presupuestos"
              element={
                <ProtectedRoute>
                  <Budgets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/facturas"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedores"
              element={
                <ProtectedRoute>
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materiales"
              element={
                <ProtectedRoute>
                  <Materials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyectos"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analisis"
              element={
                <ProtectedRoute>
                  <MarketAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materiales-pendientes"
              element={
                <ProtectedRoute>
                  <PendingMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
