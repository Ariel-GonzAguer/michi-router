#!/bin/bash

# Script para publicar el paquete en npm
# Uso: ./publish.sh [patch|minor|major]

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Validar que se pasó un argumento
if [ $# -eq 0 ]; then
  echo -e "${RED}Error: Debes especificar el tipo de versión${NC}"
  echo "Uso: ./publish.sh [patch|minor|major]"
  echo ""
  echo "Ejemplos:"
  echo "  ./publish.sh patch  (ej: 2.2.2 -> 2.2.3)"
  echo "  ./publish.sh minor  (ej: 2.2.2 -> 2.3.0)"
  echo "  ./publish.sh major  (ej: 2.2.2 -> 3.0.0)"
  exit 1
fi

VERSION_TYPE=$1

# Validar que el tipo de versión sea válido
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: Tipo de versión inválido: $VERSION_TYPE${NC}"
  echo "Valores válidos: patch, minor, major"
  exit 1
fi

echo -e "${YELLOW}📦 Iniciando proceso de publicación...${NC}"

# 1. Verificar que el repositorio está limpio
echo -e "${YELLOW}Verificando estado del repositorio...${NC}"
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}Error: Hay cambios sin commitear${NC}"
  exit 1
fi

# 2. Actualizar a la rama principal
echo -e "${YELLOW}Actualizando rama main...${NC}"
git pull origin main

# 3. Ejecutar tests
echo -e "${YELLOW}Ejecutando tests...${NC}"
npm test

# 4. Limpiar y compilar
echo -e "${YELLOW}Compilando proyecto...${NC}"
npm run clean
npm run build:bundle

# 5. Aumentar versión
echo -e "${YELLOW}Aumentando versión (${VERSION_TYPE})...${NC}"
npm version $VERSION_TYPE

# 6. Publicar en npm
echo -e "${YELLOW}Publicando en npm...${NC}"
npm publish --access public

# 7. Push de tags y cambios
echo -e "${YELLOW}Enviando cambios a repositorio...${NC}"
git push origin main
git push origin --tags

echo -e "${GREEN}✅ ¡Publicación completada exitosamente!${NC}"
echo -e "${GREEN}El paquete @arielgonzaguer/michi-router ha sido publicado en npm${NC}"
