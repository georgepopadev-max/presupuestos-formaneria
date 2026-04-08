import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { KPICard } from '../components/dashboard/KPICard';
import { MarginChart } from '../components/dashboard/MarginChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { formatCurrency } from '../utils/formatters';
import { presupuestosService, facturasService, clientesService } from '../services/api';
import type { Presupuesto, Factura, Cliente } from '../types';

interface ActivityItem {
  id: string;
  tipo: 'presupuesto' | 'factura' | 'cliente';
  descripcion: string;
  monto?: number;
  fecha: Date;
}

interface MarginDataItem {
  mes: string;
  margen: number;
  facturacion: number;
}

const mesesEspanol = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Página del Dashboard
 * Muestra resumen de KPIs y gráficos de la empresa
 */
export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    presupuestosPendientes: 0,
    facturasPendientes: 0,
    facturasCobradas: 0,
    margenMedio: 0,
    proyectosActivos: 0,
  });
  const [marginData, setMarginData] = useState<MarginDataItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [presupuestosRes, facturasRes, clientesRes] = await Promise.all([
          presupuestosService.getAll(),
          facturasService.getAll(),
          clientesService.getAll(),
        ]);

        const presupuestos: Presupuesto[] = presupuestosRes.data;
        const facturas: Factura[] = facturasRes.data;
        const clientes: Cliente[] = clientesRes.data;

        // Calculate KPIs
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // presupuestosPendientes: count of presupuestos with estado 'enviado' or 'borrador'
        const presupuestosPendientes = presupuestos.filter(
          (p) => p.estado === 'enviado' || p.estado === 'borrador'
        ).length;

        // facturasPendientes: count of facturas with estado 'emitida' (not paid)
        const facturasPendientes = facturas.filter((f) => f.estado === 'emitida').length;

        // facturasCobradas: sum of facturas with estado 'pagada' this month
        const inicioMes = new Date(currentYear, currentMonth, 1);
        const facturasCobradas = facturas
          .filter((f) => f.estado === 'pagada' && new Date(f.fechaEmision) >= inicioMes)
          .reduce((sum, f) => sum + f.total, 0);

        // margenMedio: calculated from accepted presupuestos
        const aceptados = presupuestos.filter((p) => p.estado === 'aceptado' && p.total > 0);
        const margenMedio = aceptados.length > 0
          ? aceptados.reduce((sum, p) => sum + ((p.total - p.subtotal) / p.total * 100), 0) / aceptados.length
          : 0;

        setKpis({
          presupuestosPendientes,
          facturasPendientes,
          facturasCobradas,
          margenMedio: Math.round(margenMedio * 10) / 10,
          proyectosActivos: 0, // Could be derived from proyectos if available
        });

        // Build margin data grouped by month
        const monthlyData: Record<number, { facturacion: number; margenSum: number; count: number }> = {};
        
        // Initialize all months of current year
        for (let i = 0; i < 12; i++) {
          monthlyData[i] = { facturacion: 0, margenSum: 0, count: 0 };
        }

        // Sum facturacion from paid facturas per month
        facturas.forEach((f) => {
          const fecha = new Date(f.fechaEmision);
          if (fecha.getFullYear() === currentYear && f.estado === 'pagada') {
            const month = fecha.getMonth();
            monthlyData[month].facturacion += f.total;
          }
        });

        // Calculate margen from accepted presupuestos per month
        presupuestos.forEach((p) => {
          const fecha = new Date(p.createdAt);
          if (fecha.getFullYear() === currentYear && p.estado === 'aceptado' && p.total > 0) {
            const month = fecha.getMonth();
            monthlyData[month].margenSum += (p.total - p.subtotal) / p.total * 100;
            monthlyData[month].count += 1;
          }
        });

        const chartData: MarginDataItem[] = [];
        for (let i = 0; i < 12; i++) {
          const data = monthlyData[i];
          const avgMargen = data.count > 0 ? data.margenSum / data.count : 0;
          chartData.push({
            mes: mesesEspanol[i],
            margen: Math.round(avgMargen * 10) / 10,
            facturacion: Math.round(data.facturacion),
          });
        }
        setMarginData(chartData);

        // Build recent activity
        const activities: ActivityItem[] = [];

        // Recent presupuestos (last 5)
        const recentPresupuestos = [...presupuestos]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        recentPresupuestos.forEach((p) => {
          const estadoLabels: Record<string, string> = {
            borrador: 'creado',
            enviado: 'enviado',
            aceptado: 'aceptado',
            rechazado: 'rechazado',
          };
          activities.push({
            id: p.id,
            tipo: 'presupuesto',
            descripcion: `Presupuesto ${p.numero} ${estadoLabels[p.estado] || p.estado}`,
            monto: p.total,
            fecha: new Date(p.createdAt),
          });
        });

        // Recent facturas (last 5)
        const recentFacturas = [...facturas]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        recentFacturas.forEach((f) => {
          const estadoLabels: Record<string, string> = {
            borrador: 'creada',
            emitida: 'emitida',
            pagada: 'pagada',
            vencida: 'vencida',
          };
          activities.push({
            id: f.id,
            tipo: 'factura',
            descripcion: `Factura ${f.numero} ${estadoLabels[f.estado] || f.estado}`,
            monto: f.total,
            fecha: new Date(f.createdAt),
          });
        });

        // Recent clientes
        const recentClientes = [...clientes]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        recentClientes.forEach((c) => {
          activities.push({
            id: c.id,
            tipo: 'cliente',
            descripcion: `Nuevo cliente: ${c.nombre}`,
            fecha: new Date(c.createdAt),
          });
        });

        // Sort all by date and take top 5
        const sortedActivities = activities
          .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
          .slice(0, 5);

        setRecentActivity(sortedActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header con usuario y logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {usuario?.nombre || usuario?.email}
          </span>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      
      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Presupuestos pendientes"
          value={kpis.presupuestosPendientes}
          subtitle="Últimos 30 días"
          color="blue"
          icon={<span className="text-2xl">📋</span>}
        />
        <KPICard
          title="Facturas pendientes"
          value={kpis.facturasPendientes}
          subtitle="Por cobrar"
          color="yellow"
          icon={<span className="text-2xl">🧾</span>}
        />
        <KPICard
          title="Facturado este mes"
          value={formatCurrency(kpis.facturasCobradas)}
          color="green"
          icon={<span className="text-2xl">💰</span>}
        />
        <KPICard
          title="Margen medio"
          value={`${kpis.margenMedio}%`}
          subtitle="Rentabilidad"
          trend={{ value: 2.3, isPositive: true }}
          color="blue"
          icon={<span className="text-2xl">📊</span>}
        />
      </div>

      {/* Gráficos y actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarginChart data={marginData} />
        </div>
        <div>
          <RecentActivity activities={recentActivity} maxItems={5} />
        </div>
      </div>
    </div>
  );
}