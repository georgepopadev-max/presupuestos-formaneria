import { ReactNode } from 'react';

// Props para el componente Card
interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Componente Card reutilizable para contenedores de contenido
 */
export function Card({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
}: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-100">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;