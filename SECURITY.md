# Seguridad en Michi Router

Este documento resume las garantías de seguridad del router y las recomendaciones de uso.

## Medidas implementadas

### 1. Navegación interna segura

Michi Router valida los destinos antes de navegar:

- Bloquea protocolos inseguros (`javascript:`, `data:`, etc.).
- Bloquea destinos externos (otro `origin`).
- Solo permite URLs internas válidas para navegación del router.

### 2. Link interno

El componente `Link` está pensado para rutas internas. Si recibe una URL no interna, la navegación se bloquea.

### 3. Redirección segura en `Protected`

`Protected` valida `redirectionPath`. Si es insegura o externa, usa `/` como fallback.

### 4. Sin `dangerouslySetInnerHTML`

El paquete no usa renderizado HTML inseguro.

## Buenas prácticas recomendadas

- Validar autorización también en backend.
- Evitar exponer información sensible solo por navegación cliente.
- Configurar CSP y HTTPS en producción.
- Mantener dependencias actualizadas.

## Reporte de vulnerabilidades

Para reportar una vulnerabilidad, usa:

- **GitHub Security Advisory (preferido)** en este repositorio.
- O un issue privado con detalles de reproducción e impacto.
