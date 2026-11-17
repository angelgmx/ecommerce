# Fase 4 · Usuarios y seguridad

- **Estado:** pendiente
- **Fechas:** 22 dic 2026 – 5 ene 2027
- **Versión al cerrar:** `v0.4.0`
- **Decisiones:** prevista: almacenamiento del token de sesión

## Objetivo

Que solo pueda hacer cada operación quien debe, y que la API resista los ataques habituales.

## Entregables

- [ ] Registro y login con contraseñas almacenadas con un algoritmo de *hash* adecuado.
- [ ] Autenticación con JWT y renovación de sesión.
- [ ] Roles (`cliente`, `admin`): la gestión del catálogo pasa a requerir `admin`.
- [ ] ADR sobre dónde se guarda el token.
- [ ] Revisión frente al OWASP Top 10 documentada en `docs/arquitectura/seguridad.md`: intento de explotación, corrección y test que lo impide.
- [ ] Política de seguridad en `SECURITY.md`: cómo informar de una vulnerabilidad.
- [ ] Limitación de peticiones en login y registro.

## Criterios de aceptación

- Ninguna operación de escritura del catálogo es accesible sin rol `admin`.
- Las contraseñas no aparecen en respuestas, logs ni errores.
- Cada vulnerabilidad revisada tiene un test que falla si se reintroduce.
