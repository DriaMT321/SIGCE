import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'SIGCE · Asistente de calificaciones',
    description: 'Ayuda a la responsable a completar calificaciones en la página que tiene abierta.',
    version: '1.0.0',
    minimum_chrome_version: '116',
    action: { default_title: 'Abrir asistente SIGCE' },
    permissions: ['sidePanel', 'activeTab', 'storage'],
    host_permissions: ['https://api.sigce.lat/*', 'http://localhost:3000/*'],
  },
});
