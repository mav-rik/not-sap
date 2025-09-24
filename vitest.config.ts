import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '*.config.ts',
        '*.config.js',
        '.github/',
        'coverage/'
      ]
    }
  },
  resolve: {
    alias: {
      'notsapui': resolve(__dirname, './packages/ui/src'),
      'notsapodata': resolve(__dirname, './packages/odata/src')
    }
  }
});