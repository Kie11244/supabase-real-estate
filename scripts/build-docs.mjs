import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ensureBasePath = (value) => {
  if (!value) {
    return '/';
  }
  let base = value.trim();
  if (!base) {
    return '/';
  }
  if (!base.startsWith('/')) {
    base = `/${base}`;
  }
  if (!base.endsWith('/')) {
    base = `${base}/`;
  }
  return base;
};

const repoFallback = process.env.npm_package_name
  ? `/${process.env.npm_package_name}/`
  : '/';

const env = {
  ...process.env,
  VITE_BUILD_DOCS: 'true',
  VITE_PUBLIC_BASE: ensureBasePath(process.env.VITE_PUBLIC_BASE || repoFallback),
};

const viteBin = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../node_modules/vite/bin/vite.js'
);

const child = spawn(process.execPath, [viteBin, 'build'], {
  stdio: 'inherit',
  env,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
