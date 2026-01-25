import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// mock useNavigate from Michi-router
const mockNavigate = vi.fn();
vi.mock('../Michi-router', () => ({
  useNavigate: () => mockNavigate,
}));

import Protected from '../Protected';

describe('Protected component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('muestra loadingComponent cuando isLoading true', () => {
    const auth = { user: null, isLoading: true };
    render(
      <Protected configObject={{ states: auth, loadingComponent: <div>Loading...</div>, redirectionPath: '/' }}>
        <div>Private</div>
      </Protected>
    );
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('redirige cuando isLoading false y no hay user', () => {
    const auth = { user: null, isLoading: false };
    render(
      <Protected configObject={{ states: auth, redirectionPath: '/login' }}>
        <div>Private</div>
      </Protected>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renderiza los hijos cuando hay user', () => {
    const auth = { user: { name: 'A' }, isLoading: false };
    render(
      <Protected configObject={{ states: auth, redirectionPath: '/' }}>
        <div>PrivateContent</div>
      </Protected>
    );
    expect(screen.getByText('PrivateContent')).toBeDefined();
  });

  it('muestra defaultMessage correctamente cuando está cargando', () => {
    const auth = { user: null, isLoading: true };
    render(
      <Protected configObject={{ states: auth, defaultMessage: 'Cargando...', redirectionPath: '/' }}>
        <div>Private</div>
      </Protected>
    );
    
    expect(screen.getByText('Cargando...')).toBeDefined();
  });

  it('maneja configuración inválida correctamente', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Crear un configuración con states nulo para testing
    const invalidConfig = {
      states: null as any,
      redirectionPath: '/'
    };
    
    render(
      <Protected configObject={invalidConfig}>
        <div>Private</div>
      </Protected>
    );
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Componente Protected: El objeto de configuración es inválido')
    );
    
    consoleSpy.mockRestore();
  });
});
