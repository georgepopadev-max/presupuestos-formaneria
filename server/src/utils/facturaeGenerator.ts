// ============================================================
// GENERADOR DE XML FACTURAE
// ============================================================
// Genera documentos XML en formato Facturae 3.2
// Estándar de factura electrónica español
//
// Referencias:
// - www.facturae.es
// - Esquema XSD oficial de Facturae 3.2
//
// NOTA: Esta es una implementación básica/estructura
// Para producción real se necesitaría:
// - Validación estricta contra XSD
// - Firma digital con certificado reconocido
// - Precisión decimal adecuada (2 decimales estándar)
// ============================================================

import { Factura, Cliente, FacturaLinea } from '../types';

/**
 * Genera un XML Facturae 3.2 básico para una factura
 * 
 * @param factura - Datos de la factura
 * @param cliente - Datos del cliente/receptor
 * @param lineas - Líneas de detalle de la factura
 * @param empresaDatos - Datos de la empresa emissora
 * @returns String con el XML Facturae 3.2
 */
export const generarFacturaeXML = (
  factura: Factura,
  cliente: Cliente,
  lineas: FacturaLinea[],
  empresaDatos: { nombre: string; nif: string; direccion: string }
): string => {
  
  // Preparar datos del emisor (empresa)
  const emisor = {
    nombre: empresaDatos.nombre,
    nif: empresaDatos.nif,
    direccion: empresaDatos.direccion
  };

  // Preparar datos del receptor (cliente)
  const receptor = {
    nombre: cliente.nombre,
    nif: cliente.nif || '',
    direccion: cliente.direccion || ''
  };

  // Formatear fecha de emisión (DD-MM-AAAA)
  const fechaEmision = new Date(factura.fechaEmision)
    .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '-');

  // Calcular totales desde las líneas
  const subtotal = lineas.reduce((sum, l) => sum + l.importe, 0);
  const totalIVA = factura.iva || 0;
  const total = factura.total;

  // Generar líneas deitems XML
  const itemsXML = lineas.map((linea, index) => `
    <Items>
      <Item>
        <LineNumber>${index + 1}</LineNumber>
        <Quantity>${linea.cantidad}</Quantity>
        <UnitOfMeasure>01</UnitOfMeasure> <!-- 01 = unidades -->
        <LineItemAmount>${linea.importe.toFixed(2)}</LineItemAmount>
        <ItemDescription>${escapeXml(linea.descripcion)}</ItemDescription>
        <UnitPriceWithoutTax>${(linea.importe / linea.cantidad).toFixed(2)}</UnitPriceWithoutTax>
        <UnitPriceWithTax>${(linea.importe / linea.cantidad).toFixed(2)}</UnitPriceWithTax>
        <TotalCost>${linea.importe.toFixed(2)}</TotalCost>
        <TaxesOutputs>
          <Tax>
            <TaxType>01</TaxType> <!-- 01 = IVA -->
            <TaxRate>${factura.iva > 0 ? '21.00' : '0.00'}</TaxRate>
            <TaxableBase>${linea.importe.toFixed(2)}</TaxableBase>
            <TaxAmount>${((linea.importe * (factura.iva > 0 ? 0.21 : 0))).toFixed(2)}</TaxAmount>
          </Tax>
        </TaxesOutputs>
      </Item>
    </Items>
  `).join('');

  // Construir el XML completo Facturae 3.2
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Facturae xmlns="http://www.facturae.es/v3.2" version="3.2">
  <FileHeader>
    <SchemaVersion>3.2</SchemaVersion>
    <Modality>${factura.estado === 'borrador' ? 'I' : 'F'}</Modality> <!-- I = Invoice simplified, F = Invoice -->
    <InvoiceIssuerType>EM</InvoiceIssuerType> <!-- EM = Emisor -->
    <Batch>
      <BatchIdentifier>${factura.numero}-${fechaEmision.replace(/-/g, '')}</BatchIdentifier>
      <InvoicesCount>1</InvoicesCount>
      <TotalInvoicesAmount>${total.toFixed(2)}</TotalInvoicesAmount>
      <TotalOutstandingAmount>${total.toFixed(2)}</TotalOutstandingAmount>
      <TotalExecutableAmount>${total.toFixed(2)}</TotalExecutableAmount>
      <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
    </Batch>
  </FileHeader>
  <Parties>
    <SellerParty>
      <TaxIdentification>
        <PersonTypeCode>J</PersonTypeCode> <!-- J = Jurídica -->
        <ResidenceTypeCode>R</ResidenceTypeCode> <!-- R = Residente -->
        <TaxIdentificationNumber>${emisor.nif}</TaxIdentificationNumber>
      </TaxIdentification>
      <IndividualOrLegalEntity>
        <CorporateName>${escapeXml(emisor.nombre)}</CorporateName>
        <Address>
          <Address>${escapeXml(emisor.direccion)}</Address>
          <PostCode>28001</PostCode>
          <Town>Madrid</Town>
          <Province>Madrid</Province>
          <CountryCode>ES</CountryCode>
        </Address>
      </IndividualOrLegalEntity>
    </SellerParty>
    <BuyerParty>
      <TaxIdentification>
        <PersonTypeCode>${cliente.nif ? 'F' : 'J'}</PersonTypeCode> <!-- F = Física, J = Jurídica -->
        <ResidenceTypeCode>R</ResidenceTypeCode>
        <TaxIdentificationNumber>${receptor.nif || ''}</TaxIdentificationNumber>
      </TaxIdentification>
      <IndividualOrLegalEntity>
        <CorporateName>${escapeXml(receptor.nombre)}</CorporateName>
        <Address>
          <Address>${escapeXml(receptor.direccion)}</Address>
          <PostCode>28001</PostCode>
          <Town>Madrid</Town>
          <Province>Madrid</Province>
          <CountryCode>ES</CountryCode>
        </Address>
      </IndividualOrLegalEntity>
    </BuyerParty>
  </Parties>
  <Invoices>
    <Invoice>
      <InvoiceHeader>
        <InvoiceNumber>${factura.numero}</InvoiceNumber>
        <InvoiceSeriesCode>${factura.serie}</InvoiceSeriesCode>
        <InvoiceDocumentType>FC</InvoiceDocumentType> <!-- FC = Factura -->
        <InvoiceClass>OO</InvoiceClass> <!-- OO = Original -->
      </InvoiceHeader>
      <InvoiceIssueData>
        <IssueDate>${fechaEmision}</IssueDate>
        <DueDate>${factura.fechaVencimiento 
          ? new Date(factura.fechaVencimiento).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
          : fechaEmision}</DueDate>
        <PaymentMeans>
          <PaymentMeansCode>${getPaymentMeansCode(factura.metodoPago)}</PaymentMeansCode>
          <PaymentAccountNumber>${factura.metodoPago === 'transferencia' ? 'ES00 0000 0000 0000 0000 0000' : ''}</PaymentAccountNumber>
        </PaymentMeans>
        <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
        <TaxesOutputs>
          <Tax>
            <TaxType>01</TaxType>
            <TaxRate>${factura.iva > 0 ? '21.00' : '0.00'}</TaxRate>
            <TaxableBase>${subtotal.toFixed(2)}</TaxableBase>
            <TaxAmount>${totalIVA.toFixed(2)}</TaxAmount>
          </Tax>
        </TaxesOutputs>
        <BillReceivedIndicator>true</BillReceivedIndicator>
      </InvoiceIssueData>
      ${itemsXML}
      <InvoiceTotals>
        <TotalGrossAmount>${subtotal.toFixed(2)}</TotalGrossAmount>
        <TotalGeneralDiscountAmounts>
          <DiscountCriterium>1</DiscountCriterium>
          <DiscountAmount>0.00</DiscountAmount>
        </TotalGeneralDiscountAmounts>
        <TotalGeneralSurchargeAmounts>
          <SurchargeCriterium>1</SurchargeCriterium>
          <SurchargeAmount>0.00</SurchargeAmount>
        </TotalGeneralSurchargeAmounts>
        <TotalTaxOutputs>${totalIVA.toFixed(2)}</TotalTaxOutputs>
        <InvoiceTotal>${total.toFixed(2)}</InvoiceTotal>
        <TotalOutstandingAmount>${total.toFixed(2)}</TotalOutstandingAmount>
        <TotalExecutableAmount>${total.toFixed(2)}</TotalExecutableAmount>
      </InvoiceTotals>
    </Invoice>
  </Invoices>
</Facturae>`;

  return xml;
};

/**
 * Escapa caracteres especiales para XML
 * @param text Texto a escapar
 * @returns Texto seguro para XML
 */
const escapeXml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Obtiene el código de medio de pago según Facturae
 * @param metodoPago Método de pago del sistema
 * @returns Código de pago Facturae
 */
const getPaymentMeansCode = (metodoPago?: string): string => {
  switch (metodoPago) {
    case 'efectivo':
      return '02'; // Cash
    case 'transferencia':
      return '04'; // Credit transfer
    case 'tarjeta':
      return '1'; // Payment card (不完全 - hay más códigos)
    case 'bizum':
      return '1'; // Similar a tarjeta
    default:
      return '02'; // Por defecto efectivo
  }
};

export default { generarFacturaeXML };
