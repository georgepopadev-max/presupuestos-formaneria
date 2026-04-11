-- ============================================================
-- DATOS INICIALES (SEED)
-- Sistema de gestión de presupuestos y facturas para fontanería
-- ============================================================

-- Secuencias para generación automática de números
INSERT INTO secuencias (clave, ultimo_numero, prefijo, digitos) VALUES
('presupuesto', 0, 'PRE-', 4),
('factura', 0, 'FAC-', 4),
('proyecto', 0, 'PROY-', 4)
ON CONFLICT(clave) DO NOTHING;

-- Configuración inicial de la empresa
INSERT INTO configuracion (clave, valor) VALUES
('empresa_nombre', 'Tu Empresa de Fontanería'),
('empresa_nif', 'B12345678'),
('empresa_direccion', ''),
('empresa_ciudad', ''),
('empresa_codigo_postal', ''),
('empresa_telefono', ''),
('empresa_email', ''),
('empresa_iban', ''),
('empresa_banco', ''),
('iva_predeterminado', '21')
ON CONFLICT(clave) DO NOTHING;

-- Usuario administrador por defecto
-- Contraseña: admin123 (hash generado con bcrypt, costo 10)
-- Para cambiar la contraseña, regenerar el hash con:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('nueva_password', 10).then(h => console.log(h))"
INSERT INTO usuarios (email, password_hash, nombre, activo) VALUES
('admin@formaneria.com', '$2b$10$RJNICg0eNOgVjZPkmi9K9.OK813x6x7TGbokvLeU2p/cS.c5lFmxC', 'Administrador', 1)
ON CONFLICT(email) DO NOTHING;
