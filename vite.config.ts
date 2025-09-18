import path from 'path';
import { defineConfig, loadEnv } from 'vite';

const normalizeBase = (rawValue?: string) => {
  if (!rawValue) {
    return '/';
  }

  let value = rawValue.trim();
  if (!value || value === '/') {
    return '/';
  }

  if (!value.startsWith('/')) {
    value = `/${value}`;
  }

  if (!value.endsWith('/')) {
    value = `${value}/`;
  }

  return value;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const runtimeEnv = { ...process.env, ...env } as Record<string, string | undefined>;
  const base = normalizeBase(runtimeEnv.VITE_PUBLIC_BASE);
  const shouldBuildDocs = runtimeEnv.VITE_BUILD_DOCS === 'true';

  return {
    base,
    define: {
      'process.env.API_KEY': JSON.stringify(runtimeEnv.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(runtimeEnv.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: shouldBuildDocs ? 'docs' : 'dist',
      emptyOutDir: true,
    },
  };
});
