import { SieWorkerApplication } from './worker';

const app = new SieWorkerApplication();

app.start().catch((err) => {
  console.error('Error fatal iniciando el Worker RPA:', err);
  process.exit(1);
});

// Manejo de señales de apagado
process.on('SIGINT', async () => {
  await app.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await app.stop();
  process.exit(0);
});
