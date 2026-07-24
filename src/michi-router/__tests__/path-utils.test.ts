import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizePathname,
  normalizeBasename,
  resolveInternalPath,
  matchRoutePath,
} from '../path-utils';

describe('normalizePathname', () => {
  it('agrega barra al inicio', () => {
    expect(normalizePathname('users')).toBe('/users');
  });

  it('elimina barra al final', () => {
    expect(normalizePathname('/users/')).toBe('/users');
  });

  it('maneja string vacio', () => {
    expect(normalizePathname('')).toBe('/');
  });

  it('maneja solo barras', () => {
    expect(normalizePathname('///')).toBe('/');
  });

  it('retorna / para /', () => {
    expect(normalizePathname('/')).toBe('/');
  });

  it('elimina barras multiples al final', () => {
    expect(normalizePathname('/users///')).toBe('/users');
  });
});

describe('normalizeBasename', () => {
  it('retorna / cuando no hay basename', () => {
    expect(normalizeBasename(undefined)).toBe('/');
    expect(normalizeBasename('')).toBe('/');
  });

  it('normaliza basename con barra al final', () => {
    expect(normalizeBasename('/app/')).toBe('/app');
  });

  it('agrega barra al inicio', () => {
    expect(normalizeBasename('app')).toBe('/app');
  });
});

describe('resolveInternalPath', () => {
  beforeEach(() => {
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://michi-router.local',
        pathname: '/',
      },
      writable: true,
    });
  });

  it('retorna null para string vacio', () => {
    expect(resolveInternalPath('')).toBeNull();
  });

  it('retorna null para protocolos inseguros', () => {
    expect(resolveInternalPath('javascript:alert(1)')).toBeNull();
    expect(resolveInternalPath('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('retorna null para URLs externas', () => {
    expect(resolveInternalPath('https://evil.test/phish')).toBeNull();
  });

  it('acepta URLs internas validas', () => {
    const result = resolveInternalPath('/users/42');
    expect(result).not.toBeNull();
    expect(result?.pathname).toBe('/users/42');
  });

  it('maneja query strings y hash', () => {
    const result = resolveInternalPath('/search?q=michi#top');
    expect(result).not.toBeNull();
    expect(result?.pathname).toBe('/search');
    expect(result?.search).toBe('?q=michi');
    expect(result?.hash).toBe('#top');
    expect(result?.fullPath).toBe('/search?q=michi#top');
  });

  it('retorna null para strings con caracteres de control', () => {
    expect(resolveInternalPath('/users\x00/42')).toBeNull();
  });

  it('maneja basename correctamente', () => {
    const result = resolveInternalPath('/app/home', '/app');
    expect(result).not.toBeNull();
    expect(result?.pathname).toBe('/home');
  });
});

describe('matchRoutePath', () => {
  it('matchea rutas estaticas', () => {
    expect(matchRoutePath('/', '/')).toEqual({});
    expect(matchRoutePath('/users', '/users')).toEqual({});
    expect(matchRoutePath('/users/list', '/users/list')).toEqual({});
  });

  it('no matchea rutas diferentes', () => {
    expect(matchRoutePath('/users', '/posts')).toBeNull();
    expect(matchRoutePath('/users', '/users/42')).toBeNull();
  });

  it('extrae parametros dinamicos', () => {
    expect(matchRoutePath('/users/:id', '/users/42')).toEqual({ id: '42' });
    expect(matchRoutePath('/posts/:postId/comments/:commentId', '/posts/1/comments/2')).toEqual({
      postId: '1',
      commentId: '2',
    });
  });

  it('soporta wildcard *', () => {
    expect(matchRoutePath('/docs/*', '/docs/guides/start')).toEqual({
      '*': 'guides/start',
    });
    expect(matchRoutePath('/docs/*', '/docs')).toEqual({
      '*': '',
    });
  });

  it('wildcard al final captura todo', () => {
    expect(matchRoutePath('/files/*', '/files/a/b/c/d')).toEqual({
      '*': 'a/b/c/d',
    });
  });

  it('maneja multiples parametros dinamicos', () => {
    expect(matchRoutePath('/:section/:id', '/about/123')).toEqual({
      section: 'about',
      id: '123',
    });
  });

  it('no matchea si hay segmentos de mas', () => {
    expect(matchRoutePath('/users', '/users/42/extra')).toBeNull();
  });

  it('maneja ruta raiz con parametros', () => {
    expect(matchRoutePath('/:id', '/42')).toEqual({ id: '42' });
  });
});
