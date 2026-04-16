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
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow specific Vercel deployments for presupuestos-formaneria only
    if (/^https:\/\/presupuestos-formaneria\.vercel\.app$/.test(origin) ||
        /^https:\/\/presupuestos-formaneria-[a-z0-9]+-vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    // Allow localhost for development
    if (origin === 'http://localhost:4000') return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Habilitar CORS
app.use(express.json()); // Parsear bodies JSON
app.use(express.urlencoded({ extended: true })); // Parsear bodies URL-encoded

// Desactivar caching en el proxy/cdn de Railway para respuestas JSON de API
// Esto previene respuestas 304 Not Modified con body vacío
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

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
