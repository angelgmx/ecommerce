# Fase 6 · Pagos y colas

- **Estado:** pendiente
- **Fechas:** 19 – 28 ene 2027
- **Versión al cerrar:** `v0.6.0`
- **Decisiones:** previstas: flujo de pago · procesamiento síncrono o con colas

## Objetivo

Cobrar con Stripe de forma fiable y sacar de la petición el trabajo lento.

## Entregables

- [ ] Pago con Stripe Checkout, con el flujo documentado en `docs/arquitectura/pagos.md`.
- [ ] Confirmación del pago por webhook con verificación de firma.
- [ ] Webhooks idempotentes: un evento repetido no cambia el estado dos veces.
- [ ] Gestión de pagos fallidos y reembolsos.
- [ ] Caché del catálogo con Redis y estrategia de invalidación.
- [ ] Cola para tareas en segundo plano (emails de confirmación) con reintentos.
- [ ] Eventos de dominio para desacoplar módulos.

## Criterios de aceptación

- El pedido solo pasa a `pagado` por el webhook, nunca por la redirección del navegador.
- Reenviar el mismo evento de Stripe no produce efectos duplicados.
- Un cambio de producto invalida su entrada de caché.
