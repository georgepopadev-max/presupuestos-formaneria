# SII - Suministro Inmediato de Información

## ¿Qué es el SII?

El **SII (Suministro Inmediato de Información)** es un sistema de la Agencia Tributaria española (AEAT) que obliga a determinados empresarios y profesionales a enviar electrónicamente los detalles de sus facturas en un plazo máximo de **4 días hábiles** desde su emisión o recepción.

### Obligados al SII

El SII es obligatorio para:

| Condición | Umbral |
|-----------|--------|
| Facturación anual | > **6.000.000 €** |
| Número de facturas/año | > **3.000 facturas** |

Si cumples **cualquiera** de las dos condiciones, estás obligado al SII.

### Plazos de presentación

- **Facturas emitidas**: dentro de los 4 días hábiles siguientes a la fecha de emisión
- **Facturas recibidas**: dentro de los 4 días hábiles siguientes a la fecha en que se produce el registro contable
- **Facturas rectificativas**: mismo plazo que las originales

---

## Estado Actual de Esta Empresa

**El SII NO es obligatorio** para nuestra empresa de fontanería por los siguientes motivos:

- Empresa pequeña con 2 empleados
- Facturación anual muy inferior a 6M€
- Número de facturas muy inferior a 3.000/año

### Umbrales Actuales

| Métrica | Valor Actual | Umbral SII | Estado |
|---------|-------------|------------|--------|
| Facturas anuales | 0 | 3.000 | ✅ Dentro de umbral |
| Facturación anual | 0 € | 6.000.000 € | ✅ Dentro de umbral |

---

## Infraestructura Preparada

Aunque el SII no es necesario ahora, hemos implementado la infraestructura para cuando sea preciso:

### Archivos creados

- `src/services/sii.service.ts` - Lógica de negocio del SII
- `src/utils/facturaeGenerator.ts` - Generador de XML Facturae
- `src/controllers/sii.controller.ts` - Controlador API
- `src/routes/sii.routes.ts` - Rutas API
- `src/types/sii.types.ts` - Tipos TypeScript

### API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/sii/status` | Estado actual del SII y umbrales |
| GET | `/api/sii/factura/:id/xml` | Genera XML Facturae de una factura |
| GET | `/api/sii/cliente/:id` | Verifica si un cliente requiere SII |

---

## Facturae - Formato de Factura Electrónica

### ¿Qué es Facturae?

**Facturae** es el formato estándar español para facturas electrónicas, definido por el Ministerio de Hacienda y Función Pública. Es un archivo XML que sigue un esquema XSD oficial.

### Versiones

- **Facturae 3.2** (versión actual) - Schema disponible en www.facturae.es
- Facturae 3.2.1 (parches menores)

### Estructura del XML

```xml
<Facturae>
  <FileHeader>          <!-- Versión, modalidad, lote -->
  <Parties>             <!-- Emisor y Receptor -->
    <SellerParty>       <!-- Datos de nuestra empresa -->
    <BuyerParty>        <!-- Datos del cliente -->
  </Parties>
  <Invoices>            <!-- Datos de la factura -->
    <Invoice>
      <InvoiceHeader>   <!-- Número, serie, tipo -->
      <InvoiceIssueData> <!-- Fechas, impuestos, pago -->
      <Items>           <!-- Líneas de detalle -->
      <InvoiceTotals>   <!-- Totales -->
    </Invoice>
  </Invoices>
</Facturae>
```

---

## Habilitación del SII

Cuando la empresa crezca y alcance los umbrales del SII, será necesario:

### 1. Requisitos Previos

- **Certificado digital** válido (AFirma, FNMT, etc.)
- Alta en el sistema SII mediante el portal de la AEAT
- Conexión a internet para el envío telemático

### 2. Cambios en el Software

El servicio `sii.service.ts` incluye el método `registrarEnSII()` que actualmente es un stub. Para implementarlo:

```typescript
// Será necesario implementar:
// 1. Firma digital del XML Facturae
// 2. Conexión SOAP con los web services de la AEAT
// 3. Manejo de respuestas y códigos de error
// 4. Sistema de reintentos y cola de envíos
```

### 3. Cambios en los Procesos

- Envío de facturas en plazo (4 días hábiles)
- Registro inmediato de facturas recibidas
- Gestión de errores y rectificaciones

---

## Recursos

- **Portal SII AEAT**: https://www.agenciatributaria.es/AEAT.internet/SII.html
- **Facturae Official**: https://www.facturae.es/
- **Manual Facturae 3.2**: En la web de @firma / Ministerio de Hacienda

---

## Notas de Implementación

### Limitaciones Actuales

⚠️ La generación de XML Facturae está **simplificada** para esta fase:

1. **No incluye firma digital** - Necesaria para envío real al SII
2. **No valida contra XSD** - Para producción se debe validar el schema
3. **Direcciones simplificadas** - Usan valores por defecto
4. **Códigos de pago básicos** - Solo los más comunes

### Próximos Pasos (para SII completo)

1. Implementar firma digital con `xml-crypto` o similar
2. Integrar validación XSD con `libxmljs`
3. Implementar cliente SOAP para AEAT
4. Añadir caché de certificados
5. Sistema de cola para envíos masivos

---

*Documento creado como parte del proyecto de gestión de presupuestos y facturas de fontanería.*
