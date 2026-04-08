import { format } from 'date-fns';

// Props para el componente DatePicker
interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  error?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

/**
 * Componente DatePicker basado en input date nativo
 * Formato: dd/MM/yyyy para España
 */
export function DatePicker({
  label,
  value,
  onChange,
  error,
  minDate,
  maxDate,
  className = '',
}: DatePickerProps) {
  // Convertir formato dd/MM/yyyy a yyyy-MM-dd para el input
  const displayValue = value ? format(new Date(value), 'yyyy-MM-dd') : '';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Convertir de yyyy-MM-dd a Date y luego formatear
      const date = new Date(dateValue);
      onChange(format(date, 'yyyy-MM-dd'));
    } else {
      onChange('');
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          value={displayValue}
          onChange={handleChange}
          min={minDate}
          max={maxDate}
          className={`
            w-full px-3 py-2 border rounded-lg transition-colors
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default DatePicker;