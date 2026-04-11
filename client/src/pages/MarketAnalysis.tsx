import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { dashboardService, materialesService } from '../services/api';

// Tipos locales para el análisis
interface MonthlyStats {
  mes: string;
  presupuestos: number;
  aceptados: number;
  facturacion: number;
  margen: number;
}

interface MarketStats {
  tasaAceptacion: string;
  ticketMedio: string;
  proyectosGanados: number;
  facturacionAnual: number;
}

interface MaterialComparison {
  id: string;
  nombre: string;
  precioActual: number;
  precioMercado: number;
  diferencia: number;
  oportunidad: 'alta' | 'media' | 'baja';
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Página de Análisis de Mercado
 * Estadísticas y tendencias del negocio
 */
export default function MarketAnalysis() {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [materialComparisons, setMaterialComparisons] = useState<MaterialComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentYear = new Date().getFullYear();
        
        // Intentar obtener datos del dashboard (backend calcula márgenes)
        let marketDataResp = await dashboardService.getMarketData(currentYear);
        
        // Transformar datos del backend al formato esperado
        const rawData = marketDataResp.data;
        const backendData = Array.isArray(rawData) ? rawData as Array<{
          mes: string;
          presupuestosCreados: number;
          presupuestosAceptados: number;
          facturacionTotal: number;
          margenPromedio: number;
        }> : [];
        
        const transformedData: MonthlyStats[] = MESES.map((mes, index) => {
          const monthNum = index + 1;
          const monthBackendData = backendData.find(d => parseInt(d.mes, 10) === monthNum);
          
          return {
            mes,
            presupuestos: monthBackendData?.presupuestosCreados || 0,
            aceptados: monthBackendData?.presupuestosAceptados || 0,
            facturacion: monthBackendData?.facturacionTotal || 0,
            margen: monthBackendData?.margenPromedio || 0,
          };
        });

        // Filtrar solo meses con datos
        const dataWithContent = transformedData.filter(d => d.presupuestos > 0 || d.facturacion > 0);
        setMonthlyData(dataWithContent);

        // Calcular estadísticas generales desde el backend
        const totalPresupuestos = backendData.reduce((sum, d) => sum + d.presupuestosCreados, 0);
        const totalAceptados = backendData.reduce((sum, d) => sum + d.presupuestosAceptados, 0);
        const facturacionTotal = backendData.reduce((sum, d) => sum + d.facturacionTotal, 0);
        
        setStats({
          tasaAceptacion: totalPresupuestos > 0 ? `${((totalAceptados / totalPresupuestos) * 100).toFixed(1)}%` : '0%',
          ticketMedio: formatCurrency(totalPresupuestos > 0 ? facturacionTotal / totalPresupuestos : 0),
          proyectosGanados: totalAceptados,
          facturacionAnual: facturacionTotal,
        });

        // Cargar comparación de precios de mercado
        await loadMaterialComparisons();

      } catch (err) {
        console.error('Error cargando datos de mercado:', err);
        setError('Error al cargar los datos. Mostrando datos de demostración.');
        
        // Fallsback a datos de ejemplo en caso de error
        setMonthlyData([
          { mes: 'Ene', presupuestos: 15, aceptados: 12, facturacion: 18500, margen: 28.5 },
          { mes: 'Feb', presupuestos: 18, aceptados: 14, facturacion: 22100, margen: 31.2 },
          { mes: 'Mar', presupuestos: 22, aceptados: 18, facturacion: 27800, margen: 29.8 },
          { mes: 'Abr', presupuestos: 20, aceptados: 16, facturacion: 24500, margen: 33.1 },
          { mes: 'May', presupuestos: 25, aceptados: 20, facturacion: 31200, margen: 30.5 },
          { mes: 'Jun', presupuestos: 28, aceptados: 22, facturacion: 35800, margen: 32.5 },
        ]);
        setStats({
          tasaAceptacion: '72%',
          ticketMedio: formatCurrency(1250),
          proyectosGanados: 102,
          facturacionAnual: 284500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMaterialComparisons = async () => {
    try {
      // Obtener todos los materiales
      const materialesRes = await materialesService.getAll();
      const materiales = Array.isArray(materialesRes.data) ? materialesRes.data : [];

      // Precios de mercado simulados (en producción vendrían de un servicio externo)
      const preciosMercado: Record<string, number> = {
        // Tuberías
        'tubo pvc 32mm': 2.85,
        'tubo pvc 40mm': 3.65,
        'tubo cobre 22mm': 8.50,
        'tubo cobre 28mm': 11.20,
        'tubo pex 20mm': 1.95,
        // Valvulería
        'valvula esfera 1/2"': 12.50,
        'valvula esfera 3/4"': 18.75,
        'valvula retencion 1/2"': 8.90,
        // Fittings
        'codo 90 32mm': 1.45,
        'te 32mm': 2.10,
        'reduccion 40-32': 1.75,
      };

      const comparisons: MaterialComparison[] = materiales
        .filter((m: any) => m.precioUnitario > 0)
        .map((m: any) => {
          const nombreLower = m.nombre.toLowerCase();
          const precioMercadoRef = preciosMercado[nombreLower] || m.precioUnitario * 1.1;
          const diferencia = ((m.precioUnitario - precioMercadoRef) / precioMercadoRef) * 100;
          
          let oportunidad: 'alta' | 'media' | 'baja' = 'baja';
          if (diferencia > 15) oportunidad = 'alta';
          else if (diferencia > 5) oportunidad = 'media';
          
          return {
            id: m.id,
            nombre: m.nombre,
            precioActual: m.precioUnitario,
            precioMercado: precioMercadoRef,
            diferencia,
            oportunidad,
          };
        })
        .sort((a: MaterialComparison, b: MaterialComparison) => b.diferencia - a.diferencia)
        .slice(0, 10); // Top 10 materiales con mayor oportunidad

      setMaterialComparisons(comparisons);
    } catch (err) {
      console.error('Error cargando comparación de materiales:', err);
      // Silenciar error, la tabla de comparación es un bonus
    }
  };

  const getOportunidadColor = (oportunidad: string) => {
    switch (oportunidad) {
      case 'alta': return 'text-red-600 bg-red-50';
      case 'media': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Análisis de Mercado</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Análisis de Mercado</h1>
      
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}
      
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Tasa de aceptación</p>
          <p className="text-2xl font-bold text-green-600">{stats?.tasaAceptacion ?? '--'}</p>
          <p className="text-xs text-gray-400">presupuestos aceptados</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ticket medio</p>
          <p className="text-2xl font-bold text-blue-600">{stats?.ticketMedio ?? '--'}</p>
          <p className="text-xs text-gray-400">por factura</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Proyectos ganados</p>
          <p className="text-2xl font-bold text-purple-600">{stats?.proyectosGanados ?? 0}</p>
          <p className="text-xs text-gray-400">último año</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Facturación anual</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.facturacionAnual ?? 0)}</p>
          <p className="text-xs text-gray-400">ejercicio actual</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de presupuestos y aceptados */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Presupuestos vs Aceptados</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="presupuestos" name="Creados" fill="#3b82f6" />
                <Bar dataKey="aceptados" name="Aceptados" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de facturación mensual */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturación Mensual</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="facturacion" name="Facturación" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de comparación de precios de mercado */}
      {materialComparisons.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Precios de Materiales</h3>
          <p className="text-sm text-gray-500 mb-4">
            Compara tus precios de compra con precios de mercado para identificar oportunidades de ahorro
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Mercado</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Oportunidad</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materialComparisons.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.precioActual)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{formatCurrency(item.precioMercado)}</td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${item.diferencia > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.diferencia > 0 ? '+' : ''}{item.diferencia.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOportunidadColor(item.oportunidad)}`}>
                        {item.oportunidad === 'alta' ? 'Alta' : item.oportunidad === 'media' ? 'Media' : 'Baja'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
