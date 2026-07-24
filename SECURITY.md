# Seguridad en Michi Router

Este documento resume las garantias de seguridad del router y las recomendaciones de uso.

## Politica de versiones soportadas

| Version | Soportada | Fechas |
|---------|-----------|--------|
| 3.0.x | Si | Enero 2025 - Diciembre 2025 |
| 2.x | No | Finalizada |
| 1.x | No | Finalizada |

### Recomendaciones
- Mantener siempre la ultima version patch de la version minor actual
- Actualizar a nuevas versiones minor cuando esten disponibles
- Reportar vulnerabilidades en versiones no soportadas no garantiza respuesta

## Medidas implementadas

### 1. Navegacion interna segura

Michi Router valida los destinos antes de navegar:

- Bloquea protocolos inseguros (`javascript:`, `data:`, etc.).
- Bloquea destinos externos (otro `origin`).
- Solo permite URLs internas validas para navegacion del router.

### 2. Link interno

El componente `Link` esta pensado para rutas internas. Si recibe una URL no interna, la navegacion se bloquea.

### 3. Redireccion segura en `Protected`

`Protected` valida `redirectionPath`. Si es insegura o externa, usa `/` como fallback.

### 4. Sin `dangerouslySetInnerHTML`

El paquete no usa renderizado HTML inseguro.

## Buenas practicas recomendadas

- Validar autorizacion tambien en backend.
- Evitar exponer informacion sensible solo por navegacion cliente.
- Configurar CSP y HTTPS en produccion.
- Mantener dependencias actualizadas.

## Reporte de vulnerabilidades

Para reportar una vulnerabilidad, usa:

- **GitHub Security Advisory (preferido)** en este repositorio.
- O un issue privado con detalles de reproduccion e impacto.

### Proceso de reporte

1. **No** abrir issues publicos para vulnerabilidades
2. Enviar detalles a traves de GitHub Security Advisory
3. Incluir:
   - Descripcion de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Vers afectada
4. Esperar respuesta en 48 horas
5. Coordinar disclosure responsable

## Seguridad del repositorio

- Dependencias escaneadas con `npm audit`
- Commits firmados con GPG (opcional)
- Branch protection en `main`
- CI/CD con tests automatizados
