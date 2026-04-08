import { createContext, useContext, useState, ReactNode } from 'react';
import type { Presupuesto, LineaPresupuesto } from '../types';
import { calculateSubtotal, calculateIVA, calculateTotal } from '../utils/validators';

interface BudgetContextType {
  // Estado actual del presupuesto en edición
  currentBudget: Partial<Presupuesto>;
  lineas: LineaPresupuesto[];
  
  // Acciones
  setCurrentBudget: (budget: Partial<Presupuesto>) => void;
  addLinea: (linea: Omit<LineaPresupuesto, 'id'>) => void;
  updateLinea: (id: string, linea: Partial<LineaPresupuesto>) => void;
  removeLinea: (id: string) => void;
  clearBudget: () => void;
  
  // Valores calculados
  subtotal: number;
  iva: number;
  total: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

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
      id: crypto.randomUUID(),
      importe: linea.cantidad * linea.precioUnitario,
    };
    setLineas((prev) => [...prev, newLinea]);
  };

  const updateLinea = (id: string, updates: Partial<LineaPresupuesto>) => {
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

  const removeLinea = (id: string) => {
    setLineas((prev) => prev.filter((linea) => linea.id !== id));
  };

  const clearBudget = () => {
    setCurrentBudget({});
    setLineas([]);
  };

  // Calcular totales
  const subtotal = calculateSubtotal(lineas);
  const iva = calculateIVA(subtotal);
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