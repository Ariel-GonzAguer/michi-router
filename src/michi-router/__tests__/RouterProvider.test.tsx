import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Link, RouterProvider, useLocation, useNavigate, useParams } from '../Michi-router';

const resetTo = (path: string) => {
  window.history.replaceState({}, '', path);
};

describe('RouterProvider core', () => {
  beforeEach(() => {
    resetTo('/');
    vi.restoreAllMocks();
  });

  it('hace match con parámetros dinámicos', () => {
    resetTo('/users/42');

    const User = () => {
      const { id } = useParams<{ id: string }>();
      return <div>User {id}</div>;
    };

    render(
      <RouterProvider routes={[{ path: '/users/:id', component: <User /> }]}>
        <div>404</div>
      </RouterProvider>
    );

    expect(screen.getByText('User 42')).toBeInTheDocument();
  });

  it('soporta wildcard en rutas', () => {
    resetTo('/docs/guides/start');

    const Docs = () => {
      const params = useParams<{ '*': string }>();
      return <div>Wildcard {params['*']}</div>;
    };

    render(
      <RouterProvider routes={[{ path: '/docs/*', component: <Docs /> }]}>
        <div>404</div>
      </RouterProvider>
    );

    expect(screen.getByText('Wildcard guides/start')).toBeInTheDocument();
  });

  it('respeta basename en match y navegación', () => {
    resetTo('/app/home');

    const Home = () => {
      const navigate = useNavigate();
      return <button onClick={() => navigate('/about')}>Go about</button>;
    };

    render(
      <RouterProvider
        basename="/app"
        routes={[
          { path: '/home', component: <Home /> },
          { path: '/about', component: <div>About page</div> }
        ]}
      >
        <div>404</div>
      </RouterProvider>
    );

    fireEvent.click(screen.getByText('Go about'));
    expect(screen.getByText('About page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/app/about');
  });

  it('useLocation refleja pathname, search y hash', () => {
    const Home = () => {
      const navigate = useNavigate();
      return (
        <button onClick={() => navigate('/search?q=michi#top', { state: { source: 'test' } })}>
          Buscar
        </button>
      );
    };

    const Search = () => {
      const location = useLocation();
      return <div>{location.fullPath}</div>;
    };

    render(
      <RouterProvider
        routes={[
          { path: '/', component: <Home /> },
          { path: '/search', component: <Search /> }
        ]}
      />
    );

    fireEvent.click(screen.getByText('Buscar'));
    expect(screen.getByText('/search?q=michi#top')).toBeInTheDocument();
  });

  it('bloquea URLs maliciosas y externas', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const Controls = () => {
      const navigate = useNavigate();
      return (
        <>
          <button onClick={() => navigate('javascript:alert(1)')}>JS URL</button>
          <button onClick={() => navigate('https://evil.test/phish')}>External</button>
        </>
      );
    };

    render(
      <RouterProvider routes={[{ path: '/', component: <Controls /> }]}>
        <div>404</div>
      </RouterProvider>
    );

    fireEvent.click(screen.getByText('JS URL'));
    fireEvent.click(screen.getByText('External'));

    expect(window.location.pathname).toBe('/');
    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('MichiRouter: navegación bloqueada. URL interna no válida')
    );
    expect(warnSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('MichiRouter: navegación bloqueada. URL interna no válida')
    );
  });

  it('Link solo navega rutas internas', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <RouterProvider routes={[{ path: '/', component: (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="https://evil.test/phish">External</Link>
        </>
      ) }]}>
        <div>404</div>
      </RouterProvider>
    );

    const externalLink = screen.getByText('External').closest('a');
    expect(externalLink).toHaveAttribute('href', '#');

    fireEvent.click(screen.getByText('External'));
    expect(window.location.pathname).toBe('/');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('MichiRouter: navegación bloqueada. URL interna no válida')
    );

    fireEvent.click(screen.getByText('Dashboard'));
    expect(window.location.pathname).toBe('/dashboard');
  });
});
