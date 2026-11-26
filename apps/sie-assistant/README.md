# Asistente SIGCE para el SIE

Extensión de Chrome Manifest V3. La responsable abre su propia sesión en el SIE. El panel ofrece un modo **Acompañado**, que deja la revisión y el guardado en manos de la responsable, y un modo **Continuo**, que puede recorrer una cola de selecciones preparadas y pulsar Guardar en la interfaz visible del SIE tras una autorización explícita. En ambos modos, el resumen de SIGCE registra acciones y avisos observados; no acredita una conciliación oficial de las calificaciones.

Durante el llenado aparece un cursor visual que señala el RUDE encontrado, el botón de calificaciones y la casilla de materia y trimestre. El indicador sigue las acciones reales del complemento; no mueve el mouse del usuario ni pulsa **Guardar**.

El script de contenido solo opera en `https://academico.sie.gob.bo/*` y en las rutas de demostración configuradas. Lee el DOM visible y despacha `input`, `change` y `blur`; no hace solicitudes de red al SIE ni lee sus cookies o credenciales. El modo Acompañado no pulsa Guardar. El modo Continuo pulsa el control Guardar visible y requiere detectar un aviso de éxito de la página. Las solicitudes de red de la extensión se dirigen a la API de SIGCE.

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

### Probar con una página HTML de referencia

Para servir el archivo HTML de referencia sin modificarlo:

```powershell
pnpm --filter @academic/sie-assistant demo:reference "C:\ruta\sie-calificaciones.html"
```

El servidor escucha solo en `localhost:4174`. La ruta `http://localhost:4174/` entrega el HTML y sus recursos originales, sin etiquetas ni sustituciones. La extensión no prepara notas ficticias en esa ruta.

Para probar el llenado, abre `http://localhost:4174/demo`. Esa ruta separada sustituye el listado por tres estudiantes ficticios y muestra una etiqueta de demostración. Escribe cualquier usuario y contraseña en la página de prueba y selecciona **Primaria → Segundo → B → Lista de inscritos**. En el panel de la extensión pulsa **Cargar datos de demostración**, **Comprobar pantalla** e **Iniciar recorrido**. Para cada estudiante, revisa la nota, pulsa **Guardar Cambios** en la página y luego **Confirmé el guardado · siguiente** en el panel. El panel no envía este recorrido a la API de SIGCE.

## Recorrido de uso

1. La responsable inicia sesión en el SIE con su cuenta y abre la pantalla de calificaciones.
2. En el complemento inicia sesión en SIGCE, elige gestión, curso, materia y trimestre cerrado, y prepara las notas publicadas.
3. En **Acompañado**, comprueba la pantalla y procesa una fila por vez. Revisa la nota en el SIE, guarda allí y confirma el aviso visible en el panel.
4. En **Continuo**, prepara una cola de combinaciones curso, materia y trimestre. La opción de guardado automático viene desactivada; para iniciar se debe activarla y confirmar que se revisó la cola.
5. Cada fila requiere RUDE exacto, apellido coincidente y una única casilla editable. Antes de escribir se vuelve a comprobar la huella de las notas de SIGCE. Si la calificación cambió, el asistente omite esa fila.
6. Si una casilla ya contiene un valor distinto, por defecto se omite. Si se autorizó reemplazar valores, el asistente guarda el valor anterior en el almacenamiento local de Chrome antes de escribir. El historial permite descargarlo; en el modo Acompañado, la fila activa ofrece una acción para reponer el valor anterior en el campo y pedir que se guarde en el SIE.
7. El modo Continuo reconoce cursos usando controles visibles del portal. Si el curso, el estudiante, la materia, el periodo o el aviso de guardado no se reconocen de forma inequívoca, se registra el error y se omite la fila. Se detiene si la sesión termina o si no puede confirmar que el contexto sea seguro.
8. Al terminar, el panel presenta resultados por curso y estudiante y permite descargar un informe JSON. Este informe y los respaldos contienen RUDE y calificaciones de menores: se guardan en el perfil local de Chrome y cualquier archivo descargado debe resguardarse con acceso limitado. SIGCE recibe un resumen de acciones; el aviso visible del SIE no equivale a una verificación oficial de la nota.

El portal puede cambiar sus tablas o el modo de guardado. Si el complemento no reconoce una estructura inequívoca, detiene esa fila para revisión manual.
