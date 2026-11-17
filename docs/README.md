# Documentación

Documentación técnica de **openecommerce**: cómo está construido, hacia dónde va y por qué se tomó cada decisión.

| Documento | Contenido |
| --- | --- |
| [Arquitectura](arquitectura/README.md) | Visión general del sistema y un documento por cada parte: API, datos, seguridad, pagos y despliegue |
| [Hoja de ruta](roadmap/README.md) | Las fases del proyecto con su alcance, tareas y criterios de aceptación |
| [Decisiones de arquitectura (ADR)](adr/README.md) | Registro de decisiones: contexto, opciones valoradas y consecuencias |

## Convenciones

- **Idioma:** el dominio, el código y la documentación están en español. Los términos técnicos estándar (DTO, endpoint, pipe) se mantienen en inglés.
- **Importes:** siempre en céntimos enteros (`1990` son 19,90 €).
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`).
- **Ramas:** `main` siempre estable. Cada cambio entra desde una rama propia mediante pull request (a partir de la fase 2).
- **Decisiones:** toda elección difícil de deshacer se documenta como ADR antes de implementarla.
