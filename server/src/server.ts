import app from './app';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     Sistema de Gestión de Presupuestos y Facturas         ║
║              para Fontanería                             ║
╠══════════════════════════════════════════════════════════╣
║  Servidor iniciado en modo: ${NODE_ENV.padEnd(31)}║
║  Puerto: ${PORT.toString().padEnd(47)}║
║  URL: http://localhost:${PORT}                            ║
╚══════════════════════════════════════════════════════════╝
  `);
});
