# Fase 5 · Pedidos

- **Estado:** pendiente
- **Fechas:** 7 – 18 ene 2027
- **Versión al cerrar:** `v0.5.0`
- **Decisiones:** prevista: estrategia contra la sobreventa

## Objetivo

Convertir el carrito en pedido sin vender nunca más unidades de las que hay, incluso con compras simultáneas.

## Entregables

- [ ] Checkout por HTTP que crea el pedido y descuenta el stock en una sola transacción.
- [ ] Control de concurrencia y ADR sobre la estrategia (bloqueo de fila, reserva temporal u otra).
- [ ] Reserva de stock con caducidad durante el pago.
- [ ] Historial de pedidos del usuario con paginación por cursor.
- [ ] Formato de error estándar ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)).
- [ ] Claves de idempotencia en la creación de pedidos.

## Criterios de aceptación

- Un test con compras concurrentes de la última unidad crea exactamente un pedido.
- Un fallo a mitad del checkout no deja ni pedido ni stock modificado.
- Repetir una petición con la misma clave de idempotencia no crea un segundo pedido.
