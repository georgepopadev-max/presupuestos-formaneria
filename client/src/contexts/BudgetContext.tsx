import { createContext, useContext, useState, ReactNode } from 'react';
import type { Presupuesto, LineaPresupuesto } from '../types';
import { calculateSubtotal, calculateTotal } from '../utils/validators';
import { IVA_TASAS } from '../utils/constants';

// Mapping de tipoIva a tasa numérica
const TIPO_IVA_MAP: Record<string, number> = {
  general: IVA_TASAS.GENERAL,
  reducido: IVA_TASAS.REDUCIDO,
  super_reducido: IVA_TASAS.SUPER_REDUCIDO,
};

interface BudgetContextType {
  // Estado actual del presupuesto en edición
  currentBudget: Partial<Presupuesto>;
  lineas: LineaPresupuesto[];
  
  // Acciones
  setCurrentBudget: (budget: Partial<Presupuesto>) => void;
  addLinea: (linea: Omit<LineaPresupuesto, 'id'>) => void;
  updateLinea: (id: number, linea: Partial<LineaPresupuesto>) => void;
  removeLinea: (id: number) => void;
  clearBudget: () => void;
  
  // Valores calculados
  subtotal: number;
  iva: number;
  total: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

let budgetLineIdCounter = Date.now();
const generateBudgetLineId = () => ++budgetLineIdCounter;

/**
 * Proveedor de contexto para gestión de presupuestos
 * Maneja el estado del presupuesto en edición y sus líneas
 */
export function BudgetProvider({ children }: { children: ReactNode }) {
  const [currentBudget, setCurrentBudget] = useState<Partial<Presupuesto>>({});
  const [lineas, setLineas] = useState<LineaPresupuesto[]>([]);

  const addLinea = (linea: Omit<LineaPresupuesto, 'id'>) => {
    const newLinea: LineaPresupuesto = {
      ...linea,
      id: generateBudgetLineId(),
      importe: linea.cantidad * linea.precioUnitario,
    };
    setLineas((prev) => [...prev, newLinea]);
  };

  const updateLinea = (id: number, updates: Partial<LineaPresupuesto>) => {
    setLineas((prev) =>
      prev.map((linea) => {
        if (linea.id !== id) return linea;
        const updated = { ...linea, ...updates };
        // Recalcular importe si cambian cantidad o precio
        updated.importe = updated.cantidad * updated.precioUnitario;
        return updated;
      })
    );
  };

  const removeLinea = (id: number) => {
    setLineas((prev) => prev.filter((linea) => linea.id !== id));
  };

  const clearBudget = () => {
    setCurrentBudget({});
    setLineas([]);
  };

  // Calcular totales
  const subtotal = calculateSubtotal(lineas);
  const iva = lineas.reduce((sum, l) => {
    const tasa = TIPO_IVA_MAP[l.tipoIva] ?? IVA_TASAS.GENERAL;
    return sum + (l.importe * tasa / 100);
  }, 0);
  const total = calculateTotal(subtotal, iva);

  return (
    <BudgetContext.Provider
      value={{
        currentBudget,
        lineas,
        setCurrentBudget,
        addLinea,
        updateLinea,
        removeLinea,
        clearBudget,
        subtotal,
        iva,
        total,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de presupuestos
 */
export function useBudgetContext(): BudgetContextType {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgetContext debe usarse dentro de BudgetProvider');
  }
  return context;
}