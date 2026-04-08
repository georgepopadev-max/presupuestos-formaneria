import { createContext, useContext, useState, ReactNode } from 'react';
import type { Factura, LineaFactura } from '../types';
import { calculateSubtotal, calculateIVA, calculateTotal } from '../utils/validators';

interface InvoiceContextType {
  // Estado actual de la factura en edición
  currentInvoice: Partial<Factura>;
  lineas: LineaFactura[];
  
  // Acciones
  setCurrentInvoice: (invoice: Partial<Factura>) => void;
  addLinea: (linea: Omit<LineaFactura, 'id'>) => void;
  updateLinea: (id: string, linea: Partial<LineaFactura>) => void;
  removeLinea: (id: string) => void;
  clearInvoice: () => void;
  
  // Valores calculados
  subtotal: number;
  iva: number;
  total: number;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

/**
 * Proveedor de contexto para gestión de facturas
 * Maneja el estado de la factura en edición y sus líneas
 */
export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Factura>>({});
  const [lineas, setLineas] = useState<LineaFactura[]>([]);

  const addLinea = (linea: Omit<LineaFactura, 'id'>) => {
    const newLinea: LineaFactura = {
      ...linea,
      id: crypto.randomUUID(),
      importe: linea.cantidad * linea.precioUnitario,
    };
    setLineas((prev) => [...prev, newLinea]);
  };

  const updateLinea = (id: string, updates: Partial<LineaFactura>) => {
    setLineas((prev) =>
      prev.map((linea) => {
        if (linea.id !== id) return linea;
        const updated = { ...linea, ...updates };
        updated.importe = updated.cantidad * updated.precioUnitario;
        return updated;
      })
    );
  };

  const removeLinea = (id: string) => {
    setLineas((prev) => prev.filter((linea) => linea.id !== id));
  };

  const clearInvoice = () => {
    setCurrentInvoice({});
    setLineas([]);
  };

  // Calcular totales
  const subtotal = calculateSubtotal(lineas);
  const iva = calculateIVA(subtotal);
  const total = calculateTotal(subtotal, iva);

  return (
    <InvoiceContext.Provider
      value={{
        currentInvoice,
        lineas,
        setCurrentInvoice,
        addLinea,
        updateLinea,
        removeLinea,
        clearInvoice,
        subtotal,
        iva,
        total,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de facturas
 */
export function useInvoiceContext(): InvoiceContextType {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoiceContext debe usarse dentro de InvoiceProvider');
  }
  return context;
}