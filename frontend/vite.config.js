import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hosts allowed to reach the dev/preview server through a proxy domain
// (Render, ngrok, etc.). Entries must be plain hostnames — no scheme,
// no path. Extra hosts can be added without code changes:
//   VITE_ALLOWED_HOSTS=foo.onrender.com,bar.example.com
const allowedHosts = [
  'localhost',
  '127.0.0.1',
  'codegenie-ip3n.onrender.com',
  ...(process.env.VITE_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean),
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // Render injects its own PORT; fall back to 5173 locally.
    port: Number(process.env.PORT) || 5173,
    open: false,
    allowedHosts,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    allowedHosts,
  },
});
