# Convenciones de Commits

Referencia para clasificar cambios en el changelog.

## Tipos de cambio

### Agregado (feat)
Nueva funcionalidad que no existia antes.

Ejemplos:
- Nuevo componente
- Nueva funcionalidad en hook
- Nuevo export del paquete

### Corregido (fix)
Correccion de un bug o comportamiento no esperado.

Ejemplos:
- Fix en navegacion
- Correccion de tipos
- Manejo de edge cases

### Cambiado (refactor, chore, deps)
Cambios que no agregan ni corrigen funcionalidad.

Ejemplos:
- Refactorizacion de codigo
- Actualizacion de dependencias
- Cambios en configuracion
- Migracion de herramientas

### Documentado (docs)
Cambios en documentacion.

Ejemplos:
- Actualizacion de README
- Nuevos ejemplos de uso
- Comentarios en codigo

### Test (test)
Cambios en la suite de tests.

Ejemplos:
- Nuevos tests
- Mejora en cobertura
- Fix de tests flaky

## Formato en CHANGELOG

```markdown
### Agregado
- Descripcion del cambio nuevo (#issue opcional)

### Cambiado
- Descripcion del cambio existente

### Corregido
- Descripcion de la correccion

### Documentado
- Descripcion del cambio de documentacion
```

## Reglas

1. Usar espanol neutro (no regionalismos)
2. Ser conciso pero descriptivo
3. Incluir referencia a archivo/componente cuando sea relevante
4. No incluir hashes de commit
5. No incluir nombres de autor
