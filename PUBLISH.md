# Guía de Publicación en npm

Este documento describe cómo publicar la versión del paquete `@arielgonzaguer/michi-router` en npm.

## Método 1: Usando scripts npm (Recomendado)

### Publicar una versión patch (2.2.2 → 2.2.3)
```bash
npm run release:patch
```

### Publicar una versión minor (2.2.2 → 2.3.0)
```bash
npm run release:minor
```

### Publicar una versión major (2.2.2 → 3.0.0)
```bash
npm run release:major
```

## Método 2: Usando el script bash

### Permisos
Primero, asegúrate de que el script tenga permisos de ejecución:
```bash
chmod +x publish.sh
```

### Publicar una versión
```bash
./publish.sh patch    # para parches
./publish.sh minor    # para características menores
./publish.sh major    # para cambios mayores
```

## Qué hacen estos scripts

1. **Verifican que no hay cambios sin commitear**
2. **Actualizan la rama main** desde el repositorio remoto
3. **Ejecutan los tests** para asegurar que todo funciona
4. **Limpian y compilan el proyecto** generando los archivos de distribución
5. **Aumentan la versión** en el `package.json`
6. **Publican en npm** con acceso público
7. **Hacen push de los cambios y tags** al repositorio

## Requisitos previos

- Estar logueado en npm: `npm login`
- Tener permisos de publicación en `@arielgonzaguer/michi-router`
- Git debe estar configurado correctamente
- No debe haber cambios sin commitear

## Versionamiento Semántico

Sigue [Semantic Versioning](https://semver.org/):
- **MAJOR** (major): Cambios incompatibles con versiones anteriores
- **MINOR** (minor): Nuevas funcionalidades compatibles hacia atrás
- **PATCH** (patch): Correcciones de bugs compatibles hacia atrás

Ejemplo: `2.2.2` = Major.Minor.Patch

## Después de publicar

- La versión se actualizará en `package.json`
- Se creará un tag git automáticamente
- Los cambios se enviarán al repositorio
- El paquete estará disponible en npm inmediatamente

## Troubleshooting

### "Error: Debes estar logueado en npm"
```bash
npm login
```

### "Error: Ya existe esa versión"
Usa un número de versión diferente o verifica qué versiones ya están publicadas:
```bash
npm view @arielgonzaguer/michi-router versions
```

### "Error: Hay cambios sin commitear"
Realiza un commit antes de ejecutar el script:
```bash
git add .
git commit -m "descripción de cambios"
```

## En caso de error

Si algo sale mal durante la publicación, Git lo notará y detendrá el proceso. Puedes:
1. Revisar los logs de error
2. Hacer los cambios necesarios
3. Volver a intentar la publicación
