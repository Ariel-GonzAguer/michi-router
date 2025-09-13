# Compatibilidad con React Native

Este documento describe los pasos necesarios para adaptar `michi-router` y hacerlo compatible con aplicaciones React Native. La lógica central del router y del componente `Protected` es agnóstica al DOM, pero existen puntos visuales y supuestos sobre HTML que deben corregirse.

## Objetivo
- Permitir que `Protected` y otros componentes se usen sin fallos en React Native.
- Mantener compatibilidad con React Web (no romper la API pública).

## Resumen: ¿Es compatible hoy?
- Sí en gran parte: la lógica (hooks, navegación abstracta, checks de autenticación) es compatible.
- No completamente: el componente `Protected` usa un `div` por defecto cuando muestra `defaultMessage` y puede devolver un `JSX.Element` que asuma elementos DOM.

## Cambios recomendados
1. Evitar elementos HTML hardcodeados
   - Reemplazar `return config.defaultMessage ? <div>{config.defaultMessage}</div> : null;` por una solución agnóstica, por ejemplo:
     - Permitir pasar un `loadingComponent` (ya existe) y preferirlo.
     - Si `loadingComponent` no está definido, devolver `null` en vez de `<div>`.

2. Hacer opcional el `defaultMessage` o documentar que en React Native debe pasarse `loadingComponent`.

3. Exponer hooks/funciones de navegación de forma agnóstica
   - Asegurarse de que `useNavigate` y `RouterProvider` no dependen de `window` ni `history`.

4. Documentar y proveer ejemplos de uso en React Native
   - Mostrar cómo pasar un `loadingComponent` usando `View`/`Text`.
   - Ejemplo de tipado para `ProtectedConfig` en TypeScript.

5. (Opcional) Añadir una build o export específico para React Native si necesitas resolver imports de `react-dom` o algo similar. En este caso probablemente no hace falta, porque no dependes de `react-dom`.

## Ejemplos concretos
### 1) Cambios en `Protected.tsx` (concepto)
- Actualmente (simplificado):
```tsx
if (isLoading) {
  if (config.loadingComponent) return config.loadingComponent as JSX.Element;
  return config.defaultMessage ? <div>{config.defaultMessage}</div> : null;
}
```
- Recomendado (agnóstico):
```tsx
if (isLoading) {
  if (config.loadingComponent) return config.loadingComponent as JSX.Element;
  // No renderizamos <div> por defecto: retornamos texto plano o null
  return config.defaultMessage ? <>{config.defaultMessage}</> : null;
}
```
> Nota: `<>...</>` (Fragment) renderiza texto sin envolver en `div` y en React Native funcionará para mostrar `string`? En RN no renderiza texto suelto; por eso recomendamos documentar que para RN hay que pasar `loadingComponent`.

### 2) Ejemplo de `loadingComponent` para React Native
```tsx
// App.tsx (React Native)
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Protected from '@arielgonzaguer/michi-router';

const RNLoading = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size="large" />
    <Text>Cargando...</Text>
  </View>
);

// Uso:
<Protected configObject={{ states, redirectionPath: '/', loadingComponent: <RNLoading /> }}>
  <AppContent />
</Protected>
```

### 3) Tipado recomendado (types.ts)
- Exponer `AuthState<User = any>` y `ProtectedConfig<User = any>` para que los consumidores tipen su `user` y `configObject`.

## Checklist de cambios a implementar
- [ ] Eliminar cualquier `div` o elemento HTML por defecto en `Protected`.
- [ ] Documentar en `README.md` la sección "React Native" con el ejemplo anterior.
- [ ] Publicar una versión menor/patch con la documentación y cambios menores compatibles.
- [ ] (Opcional) Añadir un test de integración sencillo que renderice `Protected` con un `loadingComponent` de React Native mediante `react-test-renderer` o `@testing-library/react-native`.

## Notas finales
- Para mantener compatibilidad con web y RN, lo más sencillo es exigir que en RN el consumidor provea `loadingComponent`. Esto evita añadir lógica de detección de plataforma en el paquete.
- Si quieres que lo haga yo, puedo:
  - Modificar `Protected.tsx` para eliminar el `<div>` por defecto y usar fragment/null.
  - Añadir la sección a `README.md` y crear un ejemplo en la carpeta `examples/`.

Si quieres que haga los cambios de código y documentación ahora, indícamelo y los aplico. Si prefieres hacerlo tú más tarde, el archivo `REACT_NATIVE_SUPPORT.md` ya quedó creado con las instrucciones.