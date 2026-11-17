# Fase 3 · Persistencia

- **Estado:** pendiente
- **Fechas:** 7 – 21 dic 2026
- **Versión al cerrar:** `v0.3.0`
- **Decisiones:** [ADR-0005 PostgreSQL](../adr/0005-postgresql-como-base-de-datos.md) · prevista: elección de ORM

## Objetivo

Guardar los datos en PostgreSQL sustituyendo el repositorio en memoria, sin cambiar el núcleo ni el contrato de la API.

## Entregables

- [ ] Modelo de datos documentado en `docs/arquitectura/modelo-de-datos.md`, relacional con restricciones en la base de datos (`CHECK`, claves foráneas, `NOT NULL`) e índices justificados por las consultas reales.
- [ ] PostgreSQL en local con Docker.
- [ ] ADR sobre el ORM.
- [ ] Esquema y migraciones versionadas.
- [ ] Implementación de `Repositorio<T>` sobre la base de datos, intercambiable con la de memoria.
- [ ] Datos de ejemplo reproducibles (*seed*).
- [ ] Consultas sin el problema N+1.
- [ ] Tests de integración contra una base de datos de pruebas.

## Criterios de aceptación

- Los tests e2e de la fase 2 pasan sin cambios usando PostgreSQL.
- Ninguna consulta se ejecuta dentro de un bucle sobre resultados de otra.
- El stock no puede quedar negativo aunque el código lo intente.
