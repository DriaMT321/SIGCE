import { aplicaciontrabajadorsie } from './aplicaciontrabajadorsie';

const aplicacion = new aplicaciontrabajadorsie();

aplicacion.iniciar().catch((err) => {
  console.error('Error fatal iniciando el Worker RPA:', err);
  process.exit(1);
});

// Manejo de señales de apagado
process.on('SIGINT', async () => {
  await aplicacion.detener();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await aplicacion.detener();
  process.exit(0);
});
