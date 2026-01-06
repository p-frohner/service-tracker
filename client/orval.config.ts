import { defineConfig } from 'orval';

export default defineConfig({
  'service-tracker-api': {
    input: '../openapi.yaml',
    output: {
        baseUrl: '/api',
        target: './src/api.ts',
        client: 'fetch'
    },
  },
});

