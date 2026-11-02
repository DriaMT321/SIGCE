# Guía de usuario de SIGCE

Esta guía refleja los recorridos disponibles en el código de SIGCE revisado el 24 de octubre de 2026. Los menús y acciones dependen del perfil y los permisos de cada cuenta. Si la versión desplegada muestra opciones distintas, consulta a la administración del colegio.

## Iniciar sesión

1. Abre la dirección de SIGCE que te proporcionó el colegio.
2. Selecciona el perfil institucional que corresponde a tu cuenta.
3. Escribe el identificador y la clave solicitados por la pantalla. El tipo de identificador cambia según el perfil.
4. Para el perfil **Familia**, ingresa también el número de celular asociado a la cuenta.
5. Selecciona **Ingresar a la Plataforma**.

El colegio entrega las cuentas y credenciales. No compartas tu clave. Si no puedes entrar, confirma con administración que la cuenta esté activa y que estés usando el perfil correcto.

### Activar una cuenta estudiantil

1. En la pantalla de acceso, selecciona **Estudiante** y luego **Activar mi cuenta estudiantil**.
2. Ingresa el código de activación entregado por la institución.
3. Crea una clave personal de al menos 12 caracteres y repítela.
4. Selecciona **Guardar clave y activar**. Después, inicia sesión con tu RUDE o cédula y la nueva clave.

El código vence siete días después de su emisión y solo se puede usar una vez. Si venció o no lo recibiste, solicita uno nuevo a la institución.

## Funciones por perfil

### Administración y Dirección

El menú permite gestionar estudiantes, cursos, horarios, asignaciones, currículo, matrículas, calificaciones, asistencia, docentes, familias, comunicados, alertas, usuarios, auditoría e informes. También muestra **Sincronización SIE**. Las acciones sensibles requieren los permisos correspondientes.

### Docente

Usa **Horarios**, **Tareas y Exámenes**, **Avance Curricular**, **Notas**, **Asistencia**, **Comunicados**, **Alertas** e **Informes**. La API limita las consultas y cambios a los cursos y asignaturas vinculados a tus asignaciones vigentes.

### Estudiante

Consulta **Horarios**, **Tareas y Exámenes**, **Notas**, **Asistencia**, **Comunicados** y **Alertas**. La cuenta muestra la información asociada al estudiante autenticado.

### Familia

Consulta los horarios, tareas, calificaciones, asistencia, comunicados y alertas de los estudiantes vinculados a tu cuenta. En la aplicación móvil, abre la tarjeta del estudiante y selecciona **Calificaciones** o **Asistencia**.

## Registrar calificaciones y asistencia

### Notas

1. Abre **Notas**.
2. Elige la gestión, el período y los filtros de curso o asignatura disponibles.
3. Selecciona **Nota Individual** para registrar una nota o **Planilla por Curso (Carga Grupal)** para cargar varias.
4. Revisa estudiante, asignatura, período y valor antes de guardar. El sistema valida el rango y los permisos de la cuenta.

### Asistencia

1. Abre **Asistencia**.
2. Selecciona el curso, la fecha y los estudiantes disponibles para tu perfil.
3. Registra o actualiza el estado de cada estudiante y guarda los cambios.
4. Si un registro requiere corrección, usa el flujo permitido por tu perfil. Las modificaciones quedan sujetas a permisos y trazabilidad.

## Cerrar un período y corregir una nota

### Antes de cerrar

Solo el perfil **Administración y Dirección** puede cerrar o reabrir un período. En **Notas**, revisa el período seleccionado y el estado **Periodo Abierto**. Al seleccionar **Cerrar Periodo**, SIGCE presenta un resumen con el número de calificaciones y estudiantes. Comprueba esos datos antes de confirmar: el cierre bloquea nuevas calificaciones ordinarias.

No cierres un período hasta que Dirección confirme que la revisión académica terminó. La reapertura también debe tener autorización institucional.

### Corregir una nota de un período cerrado

1. En **Notas**, abre **Correcciones de períodos cerrados** y selecciona **Iniciar una solicitud**.
2. Elige la calificación y registra la nota propuesta, el motivo (al menos 10 caracteres) y la referencia del documento de respaldo.
3. Selecciona **Enviar a Dirección**. La nota no cambia mientras la solicitud espera una decisión.
4. Dirección revisa la solicitud, escribe el motivo de la decisión y selecciona **Aprobar y ejecutar** o **Rechazar**.

La decisión queda registrada. Una aprobación ejecuta la corrección; un rechazo conserva la solicitud y el motivo de la decisión.

## Comparación de calificaciones con SIE

El menú **Sincronización SIE** está disponible para Administración y Dirección. La cola activa de esta versión prepara una **comparación local** de calificaciones de un período cerrado:

1. Selecciona el período cerrado del año activo; si hace falta, limita el lote por curso o asignatura.
2. Selecciona **Revisar resumen** y comprueba el año, período, estudiantes, cursos, asignaturas y cantidad de notas.
3. Marca la confirmación del resumen y selecciona **Confirmar y encolar**.
4. Consulta el origen, estado y resultados del lote en la cola. Si aparecen discrepancias, Dirección debe resolverlas con la decisión y el motivo correspondientes.

**Límite de esta versión:** la cola compara con una página local de pruebas; no inicia sesión ni envía calificaciones al SIE oficial. Un estado **VERIFIED** de esta simulación no acredita una transferencia oficial. No introduzcas credenciales reales en este recorrido. La auditoría del portal es una función separada: solo debe ejecutarla la persona designada por el colegio, con autorización institucional y cuando esa función esté habilitada.

## Consultar información desde el móvil

Entra con el perfil y las credenciales asignadas. La pantalla **Estudiantes vinculados** muestra los estudiantes asociados a la cuenta familiar. Abre su tarjeta para consultar calificaciones o asistencia. Si aparece un aviso de falta de conexión, el contenido mostrado puede ser una copia local; revisa la fecha de actualización y vuelve a consultar cuando haya conexión.

Si no aparece un estudiante esperado, solicita a la institución que revise el vínculo de la cuenta familiar. La aplicación no concede acceso a estudiantes que no estén vinculados y autorizados.

## Si algo no funciona

- **No aparece una opción:** el menú depende de tu perfil y permisos; solicita a administración que revise la cuenta.
- **No puedes modificar un período cerrado:** usa la solicitud de corrección de nota cuando corresponda; no intentes registrar una nota ordinaria en un período cerrado.
- **No aparecen estudiantes en la cuenta familiar:** pide que revisen el vínculo institucional.
- **La información móvil indica que está sin conexión:** comprueba la fecha de actualización y vuelve a cargar cuando tengas conexión.
- **La comparación SIE no devuelve resultados:** revisa que exista un año activo, un período cerrado y calificaciones elegibles; recuerda que el recorrido actual es local.
