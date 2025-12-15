# Seguridad en Michi Router

Este documento describe las medidas de seguridad implementadas en Michi Router y las mejores prácticas recomendadas para su uso.

## Medidas de Seguridad Implementadas

### 1. Protección contra URLs Maliciosas

El router incluye validaciones automáticas para prevenir navegación a URLs potencialmente peligrosas:

- **Bloqueo de `javascript:` URLs**: Previene ejecución de código JavaScript arbitrario
- **Bloqueo de `data:` URLs**: Previene inyección de contenido malicioso
- **Validación de tipos**: Solo acepta strings como parámetros de navegación

```typescript
// Estas URLs son bloqueadas automáticamente
navigate('javascript:alert("XSS")');
navigate('data:text/html,<script>alert("XSS")</script>');

// Estas URLs son permitidas
navigate('/dashboard');
navigate('/user/123');
navigate('https://external-site.com');
```

### 2. Seguridad en el Navegador

- **Detección automática de entorno**: Verifica si `window` está disponible
- **Inicialización segura**: Proporciona valores por defecto seguros
- **Prevención de errores**: No intenta acceder a APIs del navegador innecesariamente

### 3. Prevención de XSS

- **No uso de `dangerouslySetInnerHTML`**: Todo el contenido se renderiza de forma segura
- **Renderizado declarativo**: Solo se utilizan componentes React para el renderizado
- **Validación de entrada**: Las rutas se validan antes del procesamiento

### 4. Componente Protected

- **Validación de configuración**: Verifica que los parámetros requeridos estén presentes
- **Manejo seguro de estados**: No expone información sensible en errores
- **Redirección controlada**: Solo permite redirecciones a rutas válidas

## Mejores Prácticas de Seguridad

### 1. Validación de Rutas

Siempre valida las rutas del lado del servidor:

```typescript
// En tu backend/API
function validateRoute(route: string): boolean {
  const allowedRoutes = ['/dashboard', '/profile', '/settings'];
  return allowedRoutes.some(allowed => route.startsWith(allowed));
}
```

### 2. Autenticación y Autorización

Usa el componente `Protected` con validaciones robustas:

```typescript
// Buena práctica
<Protected 
  configObject={{
    states: { 
      user: authenticatedUser, // Verificado por tu sistema de auth
      isLoading 
    },
    redirectionPath: '/login',
    loadingComponent: <AuthenticatingComponent />
  }}
>
  <SensitiveContent />
</Protected>
```

### 3. Content Security Policy (CSP)

Michi Router es compatible con CSP estrictas. Ejemplo de headers recomendados:

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
```

### 4. Sanitización de URLs

Para URLs externas o generadas dinámicamente, siempre sanitiza:

```typescript
function sanitizeUrl(url: string): string {
  // Implementa tu lógica de sanitización
  const allowedProtocols = ['http:', 'https:', 'mailto:'];
  const urlObj = new URL(url);
  
  if (!allowedProtocols.includes(urlObj.protocol)) {
    throw new Error('Protocolo no permitido');
  }
  
  return url;
}
```

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor:

1. **NO** abras un issue público
2. Envía un email a [security@project.com] (reemplazar con email real)
3. Incluye:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Versión afectada

## Auditorías de Seguridad

- **Última auditoría**: 14/diciembre/2025
- **Herramientas utilizadas**: 
  - `npm audit`
  - Análisis estático de código
  - Pruebas de penetración básicas
- **Estado**: Sin vulnerabilidades conocidas

## Actualizaciones de Seguridad

- Mantén siempre la versión más reciente
- Suscríbete a las notificaciones de GitHub para updates de seguridad
- Revisa regularmente las dependencias con `npm audit`

---

**Nota**: La seguridad es responsabilidad compartida. Mientras Michi Router implementa medidas de protección, la seguridad completa de tu aplicación depende también de:

- Configuración correcta del servidor
- Validación en el backend
- Implementación segura de autenticación
- Políticas de seguridad del navegador (CSP, HTTPS, etc.)
