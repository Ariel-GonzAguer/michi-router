---
name: changelog-updater
description: Actualiza CHANGELOG.md basandose en cambios staged en git. Usar cuando el usuario diga "actualizar changelog", "agregar changelog", "documentar cambios", o antes de ejecutar scripts de publicacion. Verificar siempre que haya cambios staged antes de proceder.
---

# Changelog Updater

Genera entradas de changelog automaticamente desde `git diff --staged`.

## Flujo de trabajo

### 1. Verificar cambios staged

```bash
git diff --staged --stat
```

Si no hay cambios, informar al usuario y detener el proceso.

### 2. Obtener diff detallado

```bash
git diff --staged
```

### 3. Clasificar cambios

| Tipo de cambio | Prefijo en changelog | Descripcion |
|----------------|---------------------|-------------|
| Nueva funcionalidad | `Agregado` | Features nuevas |
| Correccion de bug | `Corregido` | Bugs fixes |
| Documentacion | `Documentado` | Cambios en docs |
| Refactorizacion | `Cambiado` | Cambios de estructura sin cambio funcional |
| Tests | `Agregado` | Nuevos tests o cambios en tests existentes |
| Mantenimiento | `Cambiado` | Chores, dependencias, config |

### 4. Generar entrada

- Formato de fecha localizado: `15 de enero de 2025`
- Seccion: `[No publicado]`
- Mantener estructura Keep a Changelog

### 5. Actualizar CHANGELOG.md

- Insertar debajo de `[No publicado]`
- Mantener orden: Agregado, Cambiado, Corregido, Documentado
- No editar secciones ya publicadas (versiones con fecha)

## Reglas

- **No** editar secciones ya publicadas (versiones con fecha)
- **No** generar entradas para commits de merge
- Mantener lenguaje en espanol neutro
- Si hay multiples cambios del mismo tipo, listarlos como items separados
- Incluir referencias a archivos modificados cuando sea relevante

## Ejemplo de salida

```markdown
## [No publicado]

### Agregado
- Tests unitarios para `path-utils.ts`
- Skill `changelog-updater` para actualizacion automatica

### Cambiado
- TypeScript actualizado de 4.9.5 a 5.7.3
- Scripts de build migrados de npm a pnpm

### Corregido
- Fix en manejo de basename vacio
```
