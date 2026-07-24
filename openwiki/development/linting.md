# Linting y formateo — michi-router

## Resumen

El proyecto usa ESLint 10 con flat config y Prettier para mantener calidad de código consistente. Las reglas incluyen detección de hooks de React, variables no usadas y console.logs.

## ESLint

### Configuración

Archivo: `eslint.config.js` (flat config)

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooksPlugin },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  { ignores: ['dist/', 'node_modules/', 'scripts/', 'skills/'] }
);
```

### Reglas

| Regla | Nivel | Propósito |
|-------|-------|-----------|
| `no-console` | warn | Prohíbe `console.log`, permite `console.warn` y `console.error` |
| `@typescript-eslint/no-unused-vars` | error | Variables no usadas son error. Params con `_` prefijo se ignoran |
| `@typescript-eslint/no-explicit-any` | warn | Uso de `any` genera warning |
| `react-hooks/rules-of-hooks` | error | Reglas de hooks: no condicionales, no en loops |
| `react-hooks/exhaustive-deps` | warn | Dependencias de hooks deben estar completas |

### Archivos ignorados

| Directorio | Razón |
|------------|-------|
| `dist/` | Build output |
| `node_modules/` | Dependencias |
| `scripts/` | Utilidades de build, no código de producción |
| `skills/` | Skills de documentación, no código de producción |

## Prettier

### Configuración

Archivo: `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

| Opción | Valor | Efecto |
|--------|-------|--------|
| `semi` | `true` | Puntos y coma al final de statements |
| `singleQuote` | `true` | Comillas simples en vez de dobles |
| `trailingComma` | `es5` | Trailing commas donde ES5 lo permite |
| `printWidth` | `100` | Línea máxima de 100 caracteres |
| `tabWidth` | `2` | Indentación de 2 espacios |

## Scripts

| Script | Comando | Propósito |
|--------|---------|-----------|
| `lint` | `pnpm lint` | Verificar código con ESLint |
| `lint:fix` | `pnpm lint:fix` | Auto-corregir problemas de lint |
| `format` | `pnpm format` | Formatear todo el código con Prettier |
| `format:check` | `pnpm format:check` | Verificar formateo sin modificar archivos |

## Uso

```bash
# Verificar lint
pnpm lint

# Auto-corregir
pnpm lint:fix

# Formatear todo
pnpm format

# Verificar formateo (para CI)
pnpm format:check
```

## Convenciones de código

| Convención | Valor |
|------------|-------|
| Indentación | 2 espacios |
| Strings | Comillas simples |
| Punto y coma | Sí |
| Trailing commas | ES5 |
| Línea máxima | 100 caracteres |
| Variables no usadas | Error (con `_` prefijo para params ignorados) |
| `any` | Warning |

## Integración con CI

La CI actual (`ci.yml`) **no ejecuta lint ni format:check**. Solo ejecuta `build:bundle`, `test` y `size:check`.

Para agregar lint a la CI, agregar estos steps al workflow:

```yaml
- run: pnpm lint
- run: pnpm format:check
```

## Referencias

- [development/workflow.md](workflow.md) — Flujo de desarrollo
- [development/testing.md](testing.md) — Estrategia de tests
- Archivo fuente: `eslint.config.js`
- Archivo fuente: `.prettierrc`
