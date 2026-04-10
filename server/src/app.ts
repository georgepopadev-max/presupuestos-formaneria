import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import presupuestosRoutes from './routes/presupuestos.routes';
import facturasRoutes from './routes/facturas.routes';
import clientesRoutes from './routes/clientes.routes';
import proveedoresRoutes from './routes/proveedores.routes';
import proyectosRoutes from './routes/proyectos.routes';
import materialesRoutes from './routes/materiales.routes';
import preciosMercadoRoutes from './routes/preciosMercado.routes';
import siiRoutes from './routes/sii.routes';
import configRoutes from './routes/config.routes';
import materialesPendientesRoutes from './routes/materialesPendientes.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

// Importar middleware de errores
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

// Crear aplicación Express
const app: Application = express();

// Middlewares de seguridad y configuración
app.use(helmet()); // Seguridad con headers HTTP
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear bodies JSON
app.use(express.urlencoded({ extended: true })); // Parsear bodies URL-encoded

// Ruta de salud para verificar que el servidor está funcionando
app.get('/health', (_req: Request, res: Response) => {
  res.json({ estado: 'OK', mensaje: 'Servidor funcionando correctamente' });
});

// Rutas de la API
app.use('/api/presupuestos', presupuestosRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/materiales', materialesRoutes);
app.use('/api/precios-mercado', preciosMercadoRoutes);
app.use('/api/sii', siiRoutes);
app.use('/api/config', configRoutes);
app.use('/api/materiales-pendientes', materialesPendientesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
