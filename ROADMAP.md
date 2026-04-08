# Roadmap del Proyecto

## Resumen Ejecutivo

Sistema de gestión para una empresa de fontanería (2-3 personas) en España. Aplicación cloud-based con enfoque mobile-first PWA.

## Calendario de Hitos

```
2026
├── Q2 (Abril-Junio)
│   ├── Abril:   Planificacion + Documentacion ← NOS ENCONTRAMOS AQUÍ
│   ├── Mayo:    Fase 1 - MVP (Clientes, Materiales, Presupuestos)
│   └── Junio:  Fase 2 - Facturas + PDF
│
├── Q3 (Julio-Septiembre)
│   ├── Julio:   Fase 3 - Informes + Dashboard
│   └── Agosto: beta testing + ajustes
│   └──Septiembre: Lanzamiento v1.0
│
└── Q4 (Octubre-Diciembre)
    └── Fase 4 (solo si es necesario)
        ├── SII (asesoramiento fiscal requerido)
        ├── Multi-usuario
        └── Integraciones
```

## Hitos (Milestones)

### M0: Documentación ✅
**Fecha**: Abril 2026
**Estado**: En progreso
**Entregables**:
- [x] README.md
- [x] ARCHITECTURE.md
- [x] SPEC.md
- [x] TODO.md
- [x] ROADMAP.md
- [x] DECISIONS.md

### M1: MVP Funcional
**Fecha objetivo**: 31 Mayo 2026
**Descripción**: Sistema básico funcionando con clientes, materiales y presupuestos.

**Criterios de aceptación**:
- [ ] 10+ clientes dados de alta
- [ ] 50+ materiales en catálogo
- [ ] 5+ presupuestos creados
- [ ] Márgenes calculados correctamente
- [ ] Funciona en móvil

### M2: Ciclo de Venta Completo
**Fecha objetivo**: 30 Junio 2026
**Descripción**: Facturas con PDF y conversión desde presupuestos.

**Criterios de aceptación**:
- [ ] Primera factura creada desde presupuesto
- [ ] PDF descargado y verificado
- [ ] Registro de pago funcionando
- [ ] Al menos 3 facturas emitidas

### M3: v1.0 - Lanzamiento
**Fecha objetivo**: 15 Septiembre 2026
**Descripción**: Versión en producción lista para uso real.

**Criterios de aceptación**:
- [ ] Deploy en servidor/cloud
- [ ] Dominio configurado
- [ ] SSL activo
- [ ] Backups configurados
- [ ] 3+ facturas emitidas y cobradas
- [ ] 0 bugs críticos

### M4: Estabilización (Post-Lanzamiento)
**Fecha objetivo**: Octubre 2026
**Descripción**: Ajustes basados en uso real.

**Criterios de aceptación**:
- [ ] Feedback de usuarios incorporado
- [ ] Bugs críticos resueltos
- [ ] Documentación actualizada

### M5: v1.1 - Mejoras (Opcional)
**Fecha objetivo**: Noviembre-Diciembre 2026
**Descripción**: Mejoras identificadas post-lanzamiento.

**Posibles mejoras**:
- [ ] Dashboard mejorado
- [ ] Más plantillas de presupuestos
- [ ] Historial de precios
- [ ] Notificaciones push

### M6: SII (Opcional - Requerimiento Externo)
**Fecha objetivo**: Por definir
**Descripción**: Integración con sistema de Hacienda.

**Prerrequisitos**:
- Asesoramiento fiscal profesional
- Certificado digital de la empresa
- Análisis detallado de requisitos AEAT

## Equipo

| Rol | Responsabilidad | Dedicación |
|-----|------------------|------------|
| Desarrollador | Construcción completa | 100% |
| Diseñador UX | UI/UX (puede ser externalizado) | parcial |
| Asesor fiscal | SII y aspectos legales (futuro) | consultoría |

## Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Alcance demasiado amplio | Media | Alto | Priorizar features, cortar si es necesario |
| Problemas de rendimiento SQLite | Baja | Medio | Planificar migración a PostgreSQL |
| Cambios requisitos fiscales (SII) | Media | Alto | Diseñar schema flexible, no implementar SII prematuramente |
| Pérdida de datos | Baja | Crítico | Backups automáticos desde día 1 |

## Dependencias Externas

- **Dominio**: Necesario para producción
- **Certificado SSL**: Let's Encrypt (gratuito)
- **Hosting**: Opciones a evaluar:
  - Railway (simple, gratuito tier)
  - Render (similar)
  - VPS propio (más control)

## Decisiones Pendientes

1. **Hosting**: ¿Donde se desplegará la aplicación?
2. **SII**: ¿Es realmente necesario para el volumen de negocio?
3. **Dominio**: ¿Ya se tiene dominio registrado?
4. **Certificado digital**: ¿La empresa ya dispone de uno para SII?

## Siguiente Paso

Comenzar implementación de la **Fase 1**:
1. Inicializar proyecto
2. Configurar base de datos
3. Implementar API de Clientes y Materiales
4. Implementar frontend básico
