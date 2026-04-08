# Registro de Decisiones Arquitectónicas (ADR)

Este documento recoge las decisiones técnicas importantes tomadas durante el desarrollo del proyecto.

## Formato

Cada decisión sigue este formato:

```
## ADR-XXX: Título de la decisión

**Fecha**: YYYY-MM-DD
**Estado**: Propuesto | Aceptado | Deprecated | Reemplazado

### Contexto
[Descripción del problema o situación que motivó la decisión]

### Decisión
[Qué se decidió hacer]

### Consecuencias
**Positivas**:
- [Beneficio 1]
- [Beneficio 2]

**Negativas**:
- [Drawback 1]
- [Drawback 2]

**Notas**:
- [Nota adicional opcional]
```

---

## Decisiones Tomadas

### ADR-001: SQLite como base de datos

**Fecha**: 2026-04-08
**Estado**: Aceptado

#### Contexto
Sistema para empresa pequeña (2-3 personas) con volúmenes de datos esperados bajos (<10.000 registros).

#### Decisión
Usar SQLite como base de datos principal en lugar de PostgreSQL.

#### Consecuencias
**Positivas**:
- Zero-config, no requiere servidor separado
- Portabilidad: la base de datos es un archivo
- Rendimiento excellent para lecturas
- Backup simple (copiar archivo)

**Negativas**:
- No escalable horizontalmente
- Concurrencia limitada (unlock por escritura)
- Sin soporte nativo para tipos arrays/JSON

**Notas**:
- Migración a PostgreSQL es directa si se necesita escalar
- Para este volumen de datos, SQLite es más que suficiente

---

*Más decisiones se añadirán según avance el proyecto.*
