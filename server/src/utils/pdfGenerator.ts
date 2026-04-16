// ============================================================
// GENERADOR DE DOCUMENTOS PDF
// Genera facturas y presupuestos en formato PDF
// ============================================================

import PDFDocument from 'pdfkit';
import { Factura, Presupuesto, Cliente, FacturaLinea, PresupuestoLinea } from '../types';

/**
 * Opciones para la generación de PDFs
 */
export interface PdfOptions {
  logoPath?: string;
  empresaNombre?: string;
  empresaDireccion?: string;
  empresaTelefono?: string;
  empresaEmail?: string;
  empresaNif?: string;
  empresaIban?: string;
  empresaBanco?: string;
}

/**
 * Genera un PDF de factura
 * @param factura - Datos de la factura
 * @param cliente - Datos del cliente
 * @param lineas - Líneas de la factura
 * @param options - Opciones adicionales
 * @returns Buffer con el PDF generado
 */
export const generarPdfFactura = async (
  factura: Factura,
  cliente: Cliente,
  lineas: FacturaLinea[],
  options: PdfOptions = {}
): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtener configuración de empresa si no se proporcionan datos
      if (!options.empresaNombre) {
        const configService = require('../services/config.service').default;
        const empresa = await configService.getEmpresaConfig();
        options = {
          ...options,
          empresaNombre: empresa.nombre,
          empresaNif: empresa.nif,
          empresaDireccion: empresa.direccion,
          empresaTelefono: empresa.telefono,
          empresaEmail: empresa.email,
          empresaIban: empresa.iban,
          empresaBanco: empresa.banco,
        };
      }

      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // --- CONTENIDO DEL PDF ---

      // Cabecera con datos de la empresa (izquierda)
      doc.fontSize(20).font('Helvetica-Bold').text(options.empresaNombre || 'Empresa', 50, 50);
      doc.fontSize(10).font('Helvetica');
      if (options.empresaDireccion) doc.text(options.empresaDireccion, 50, 75);
      if (options.empresaTelefono) doc.text(`Tel: ${options.empresaTelefono}`, 50, 90);
      if (options.empresaEmail) doc.text(`Email: ${options.empresaEmail}`, 50, 105);
      if (options.empresaNif) doc.text(`NIF: ${options.empresaNif}`, 50, 120);

      // Datos de la factura (derecha)
      doc.fontSize(16).font('Helvetica-Bold').text('FACTURA', 400, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica').text(`Número: ${factura.numero}`, 400, 75, { align: 'right' });
      doc.text(`Fecha: ${new Date(factura.fechaEmision).toLocaleDateString('es-ES')}`, 400, 90, { align: 'right' });
      if (factura.fechaVencimiento) {
        doc.text(`Vencimiento: ${new Date(factura.fechaVencimiento).toLocaleDateString('es-ES')}`, 400, 105, { align: 'right' });
      }

      // IBAN y banco en la parte derecha (debajo de los datos de factura)
      if (options.empresaIban) {
        doc.text(`IBAN: ${options.empresaIban}`, 400, 120, { align: 'right' });
      }
      if (options.empresaBanco) {
        doc.text(`Banco: ${options.empresaBanco}`, 400, 135, { align: 'right' });
      }

      // Datos del cliente
      doc.fontSize(12).font('Helvetica-Bold').text('Cliente:', 50, 170);
      doc.fontSize(10).font('Helvetica');
      doc.text(cliente.nombre, 50, 185);
      if (cliente.direccion) doc.text(cliente.direccion, 50, 200);
      if (cliente.ciudad) doc.text(`${cliente.ciudad} ${cliente.codigo_postal || ''}`, 50, 215);
      if (cliente.telefono) doc.text(`Tel: ${cliente.telefono}`, 50, 230);
      if (cliente.nif) doc.text(`NIF/CIF: ${cliente.nif}`, 50, 245);

      // Tabla de líneas de factura
      let yPosition = 290;

      // Cabecera de la tabla
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Descripción', 50, yPosition);
      doc.text('Cantidad', 300, yPosition, { width: 60, align: 'right' });
      doc.text('Precio', 370, yPosition, { width: 80, align: 'right' });
      doc.text('Importe', 460, yPosition, { width: 80, align: 'right' });

      yPosition += 20;

      // Línea separadora
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;

      // Líneas de detalle
      doc.font('Helvetica');
      lineas.forEach((linea) => {
        doc.text(linea.descripcion, 50, yPosition, { width: 240 });
        doc.text(linea.cantidad.toString(), 300, yPosition, { width: 60, align: 'right' });
        doc.text(`${linea.precioUnitario.toFixed(2)} €`, 370, yPosition, { width: 80, align: 'right' });
        doc.text(`${linea.importe.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });
        yPosition += 20;
      });

      // Totales
      yPosition += 20;
      doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;

      doc.font('Helvetica').text('Subtotal:', 350, yPosition);
      doc.text(`${factura.subtotal.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });
      yPosition += 20;

      doc.text('IVA (21%):', 350, yPosition);
      doc.text(`${factura.iva.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });
      yPosition += 20;

      doc.font('Helvetica-Bold').text('TOTAL:', 350, yPosition);
      doc.text(`${factura.total.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });

      // Notas
      if (factura.notas) {
        yPosition += 60;
        doc.fontSize(10).font('Helvetica-Bold').text('Observaciones:', 50, yPosition);
        doc.font('Helvetica').text(factura.notas, 50, yPosition + 15);
      }

      // Pie de página
      doc.fontSize(8).text(
        'Gracias por su confianza',
        50,
        doc.page.height - 50,
        { align: 'center', width: 500 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Genera un PDF de presupuesto
 * @param presupuesto - Datos del presupuesto
 * @param cliente - Datos del cliente
 * @param lineas - Líneas del presupuesto
 * @param options - Opciones adicionales
 * @returns Buffer con el PDF generado
 */
export const generarPdfPresupuesto = async (
  presupuesto: Presupuesto,
  cliente: Cliente,
  lineas: PresupuestoLinea[],
  options: PdfOptions = {}
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Cabecera
      doc.fontSize(20).font('Helvetica-Bold').text(options.empresaNombre || 'Empresa', 50, 50);
      doc.fontSize(10).font('Helvetica').text(options.empresaDireccion || '', 50, 75);
      doc.text(`Tel: ${options.empresaTelefono || ''}`, 50, 90);
      doc.text(`Email: ${options.empresaEmail || ''}`, 50, 105);

      // Datos del presupuesto
      doc.fontSize(16).font('Helvetica-Bold').text('PRESUPUESTO', 400, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica');
      doc.text(`Número: ${presupuesto.numero}`, 400, 75, { align: 'right' });
      doc.text(`Fecha: ${new Date(presupuesto.fechaCreacion || new Date()).toLocaleDateString('es-ES')}`, 400, 90, { align: 'right' });
      if (presupuesto.fechaValidez) {
        doc.text(`Validez: ${new Date(presupuesto.fechaValidez).toLocaleDateString('es-ES')}`, 400, 105, { align: 'right' });
      }

      // Título del presupuesto
      doc.fontSize(14).font('Helvetica-Bold').text(presupuesto.titulo, 50, 170);

      // Cliente
      doc.fontSize(12).font('Helvetica-Bold').text('Cliente:', 50, 200);
      doc.fontSize(10).font('Helvetica');
      doc.text(cliente.nombre, 50, 215);
      if (cliente.direccion) doc.text(cliente.direccion, 50, 230);
      if (cliente.ciudad) doc.text(`${cliente.ciudad} ${cliente.codigo_postal || ''}`, 50, 245);

      // Tabla de líneas
      let yPosition = 290;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Descripción', 50, yPosition);
      doc.text('Cantidad', 300, yPosition, { width: 60, align: 'right' });
      doc.text('Precio', 370, yPosition, { width: 80, align: 'right' });
      doc.text('Importe', 460, yPosition, { width: 80, align: 'right' });

      yPosition += 20;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;

      doc.font('Helvetica');
      lineas.forEach((linea) => {
        doc.text(linea.descripcion, 50, yPosition, { width: 240 });
        doc.text(linea.cantidad.toString(), 300, yPosition, { width: 60, align: 'right' });
        doc.text(`${linea.precioUnitario.toFixed(2)} €`, 370, yPosition, { width: 80, align: 'right' });
        doc.text(`${linea.importe.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });
        yPosition += 20;
      });

      // Totales
      yPosition += 20;
      doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;

      doc.font('Helvetica').text('Subtotal:', 350, yPosition);
      doc.text(`${presupuesto.subtotal.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });
      yPosition += 20;

      doc.text('IVA (21%):', 350, yPosition);
      doc.text(`${presupuesto.iva.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });
      yPosition += 20;

      doc.font('Helvetica-Bold').text('TOTAL:', 350, yPosition);
      doc.text(`${presupuesto.total.toFixed(2)} €`, 460, yPosition, { width: 80, align: 'right' });

      // Notas
      if (presupuesto.notas) {
        yPosition += 60;
        doc.fontSize(10).font('Helvetica-Bold').text('Observaciones:', 50, yPosition);
        doc.font('Helvetica').text(presupuesto.notas, 50, yPosition + 15);
      }

      // Validez del presupuesto
      if (presupuesto.fechaValidez) {
        yPosition += 60;
        doc.fontSize(9).text(
          `Este presupuesto es válido hasta el ${new Date(presupuesto.fechaValidez).toLocaleDateString('es-ES')}`,
          50,
          yPosition
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
