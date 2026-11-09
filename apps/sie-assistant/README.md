# Asistente SIGCE para el SIE

Extensión de Chrome Manifest V3. La responsable abre su propia sesión en el SIE y el complemento rellena una nota por estudiante en la tabla visible. La responsable revisa y pulsa **Guardar**. El complemento espera un clic real en ese botón y un aviso de la página antes de ofrecer la confirmación y continuar. El resumen de SIGCE registra acciones informadas por la responsable; no acredita que el SIE haya persistido o verificado las notas.

El script de contenido solo opera en `https://academico.sie.gob.bo/*` y en la réplica sintética `http://localhost:4174/*`. Lee el DOM visible y despacha `input`, `change` y `blur`; no hace solicitudes de red al SIE, no lee cookies ni credenciales del portal y no pulsa Guardar. Las únicas solicitudes de la extensión van a la API de SIGCE.

## Construir e instalar

Desde la raíz del repositorio:

```powershell
pnpm install
pnpm --filter @academic/sie-assistant build
```

En Chrome abre `chrome://extensions`, activa **Modo desarrollador**, pulsa **Cargar descomprimida** y elige `apps/sie-assistant/.output/chrome-mv3`. Copia el ID de 32 letras que Chrome muestra para la extensión.

En el entorno de la API configura el origen exacto, por ejemplo:

```dotenv
SIGCE_EXTENSION_ORIGIN=chrome-extension://abcdefghijklmnopabcdefghijklmnop
```

Reinicia la API tras cambiar esa variable. La API rechaza otros orígenes de extensión. En el panel se puede elegir SIGCE local (`http://localhost:3000/api/v1`) o desplegado (`https://api.sigce.lat/api/v1`). El acceso a SIGCE usa una sesión corta propia de la extensión; las credenciales del SIE se escriben únicamente en el portal oficial.

## Demostración local

```powershell
pnpm --filter @academic/sie-assistant demo
```

Abre `http://localhost:4174/` en Chrome, pulsa el icono de la extensión y elige **Cargar datos de demostración**. La réplica contiene tres estudiantes ficticios. En esa página el resumen no se envía a SIGCE. La demostración local no prueba compatibilidad con el portal oficial; sus encabezados y controles deben revisarse cuando este esté habilitado.

## Recorrido de uso

1. La responsable inicia sesión en el SIE y abre el curso.
2. En el complemento inicia sesión en SIGCE, elige gestión, curso, materia y trimestre cerrado, y carga las notas publicadas.
3. Comprueba la pantalla. El complemento exige un único contexto de curso y una tabla visible con RUDE y apellido.
4. Inicia el recorrido. Cada fila exige RUDE exacto, apellido coincidente y una única casilla editable de materia y trimestre. Antes de cada nota se vuelve a consultar la huella de las calificaciones en SIGCE. Un cambio de datos detiene el recorrido.
5. La responsable revisa y guarda cada registro en el SIE. Después del aviso de la página confirma el guardado en el panel; el complemento continúa con el siguiente estudiante.
6. Si falta una coincidencia o existe una nota distinta, el recorrido se detiene. La responsable puede omitir o autorizar expresamente el reemplazo.
7. Cada decisión queda registrada en SIGCE antes de continuar con la siguiente fila. Al terminar, el panel muestra el resumen del recorrido. Una confirmación de la responsable se diferencia de una conciliación posterior con un reporte oficial.

El portal puede cambiar sus tablas o el modo de guardado. Si el complemento no reconoce una estructura inequívoca, detiene esa fila para revisión manual.
