import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  // Import @testing-library/jest-dom directly from test files (avoid running before Vitest globals)
  },
});
