# Verificación SIE local simulada

El worker puede consultar dos fuentes de demostración locales: un fixture HTML generado desde `src/infrastructure/browser/registrossielocal.fixture.ts` o, si se define `SIE_LOCAL_REPLICA_PATH` fuera de producción, una réplica HTML local. La segunda recorre su formulario de acceso con credenciales ficticias de prueba, abre las fichas de estudiante y lee las notas visibles. No se conecta al portal oficial ni guarda credenciales. La página usada aquí está rotulada como réplica local y sus datos son ficticios.

El fixture integrado trae dos registros (`SIM-2026-001` con 85 y `SIM-2026-002` con 72), para 2026, periodo 1 y `MAT-SEC`. La réplica local incorpora estudiantes de demostración y notas independientes para probar coincidencia, discrepancia y ausencia de nota. La clave de búsqueda combina RUDE, gestión, periodo y código de materia. Si la nota coincide, el ítem queda `VERIFIED`; si difiere, queda `DISCREPANCY` y conserva ambos valores sin sobrescribir la nota local. Si no existe una fila única o la nota no es válida, queda `FAILED` con `sieValue: null`. El origen queda como `LOCAL_SIE_SIMULATION`.

La pantalla web abre primero el historial de la cola simulada. La auditoría del portal real se muestra solo si el frontend se compila con `VITE_SIE_REAL_AUDIT_ENABLED=true`; además, `SIE_REAL_AUDIT_ENABLED=true` debe habilitarse explícitamente en el servidor. La API mantiene la auditoría real deshabilitada por defecto, además de exigir los permisos de acceso. No se debe habilitar hasta validar el portal y su recorrido.

Para ejecutar las pruebas y el diagnóstico del navegador:

```bash
pnpm --filter @academic/sie-worker test --runInBand
pnpm --filter @academic/sie-worker test:puppeteer
```

Para recorrer la réplica local suministrada en Windows y probar el lector con registros de demostración:

```powershell
$env:SIE_LOCAL_REPLICA_PATH = 'C:\Users\dagne\Documents\Codex\2026-10-30\porque-me-sale-este-error-en-3\outputs\replica-calificaciones.html'
pnpm --filter @academic/sie-worker test:replica
```

El comando verifica tres resultados del worker: nota coincidente, discrepancia y estudiante sin nota cargada. Los usuarios del formulario son ficticios y la réplica no hace solicitudes al SIE.

Puppeteer utiliza su Chrome descargado. En Windows, si falta, el adaptador puede usar Microsoft Edge instalado; también se puede definir `PUPPETEER_EXECUTABLE_PATH`. Las pruebas de navegador no necesitan Redis, PostgreSQL ni acceso al SIE.

Esta simulación demuestra lectura, comparación, persistencia del estado y manejo de errores **contra un fixture local**. `VERIFIED` en estas pruebas no acredita sincronización, escritura ni verificación en el SIE oficial. Esos recorridos quedan pendientes de probarse cuando el portal esté disponible.

## Discrepancias y pausas

Las discrepancias de un lote se agrupan por curso, asignatura y período, se asignan al usuario que solicitó el lote y reciben un plazo inicial de 72 horas. Si la proporción de discrepancias supera `SIE_SYNC_DISCREPANCY_THRESHOLD` (20% por defecto), el worker pausa los ítems pendientes. Administración debe resolver todos los grupos y dejar un motivo antes de reanudar. Dirección debe validar ambos valores de operación antes de usarlos con datos institucionales.

El tamaño máximo de un lote es de 50 calificaciones y el worker procesa como máximo un trabajo por segundo. Si la automatización local termina en fallo, el panel permite descargar un CSV de pendientes para carga asistida. El CSV identifica el origen local simulado y no confirma carga alguna en el portal oficial.
