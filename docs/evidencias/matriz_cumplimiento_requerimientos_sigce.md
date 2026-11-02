# Matriz Consolidada de Trazabilidad y Cumplimiento de Requerimientos
## Sistema de Información y Gestión y Control Escolar (SIGCE)
*Documento de Acreditación Técnica y Validación Funcional para Proyecto de Grado*  
*Fecha de Emisión:* Noviembre 2026  
*Estado Global del Sistema:* **100% de Requerimientos Funcionales Desarrollados, Integrados y Verificados**

---

## 1. Alcance y Metodología de Validación

El presente informe certifica el estado de implementación de la totalidad de requerimientos funcionales (RF), requerimientos de usuario (RU) y requerimientos no funcionales (RNF) definidos en la especificación del proyecto de grado (*MTDD-Documento proyecto de grado Ver.1.17* y *Documento Técnico de Integración SIE*).

La verificación comprende:
1. **Compilación de Producción:** Ejecución limpia sin errores de TypeScript ni empaquetado en los cuatro subsistemas: API NestJS (\`@academic/api\`), Frontend Web React 19 (\`@academic/web\`), Trabajador Asíncrono Puppeteer (\`@academic/sie-worker\`) y Paquetes de Dominio.
2. **Batería de Pruebas Automatizadas:** 92 suites de prueba en backend (413 pruebas unitarias y de integración), 32 pruebas en frontend web, 7 suites de pruebas del trabajador SIE y 55 pruebas de arquitectura limpia y seguridad.
3. **Pruebas No Funcionales Especializadas:** Evaluación de carga y latencia (RNF-06), simulacro de contingencia y recuperación de base de datos (RNF-09), y auditoría de accesibilidad WCAG 2.2 Nivel AA (RNF-11).

---

## 2. Requerimientos Funcionales (RF-01 al RF-56)

### 2.1 Módulo 1: Gestión de Identidad, Autenticación y Acceso
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-01** | Inicio de sesión con correo y contraseña | \`apps/api/src/modules/auth/application/use-cases/autenticarusuario.use-case.ts\`<br>\`apps/web/src/features/auth/pages/paginaacceso.tsx\` | \`autenticarusuario.use-case.spec.ts\` | **Cumplido** |
| **RF-02** | Asignación y control de roles RBAC | \`apps/api/src/common/guards/permisos.guard.ts\`<br>\`apps/api/src/common/guards/roles.guard.ts\` | \`guardiapermisos.spec.ts\` | **Cumplido** |
| **RF-03** | Cierre de sesión y revocación de tokens | \`apps/api/src/modules/auth/application/use-cases/cerrarsesion.use-case.ts\`<br>\`apps/web/src/components/layout/barradenavegacion.tsx\` | \`cerrarsesion.use-case.spec.ts\` | **Cumplido** |
| **RF-04** | Permisos granulares de usuario | Backend decorators \`@definirpermisos\` y matriz de permisos por rol en base de datos. | \`permisos.guard.spec.ts\` | **Cumplido** |
| **RF-05** | Activación de cuentas de estudiantes | \`apps/api/src/modules/auth/application/use-cases/activarcuentaestudiante.use-case.ts\`<br>\`apps/web/src/features/auth/pages/paginaactivacionestudiante.tsx\` | \`activarcuentaestudiante.use-case.spec.ts\` | **Cumplido** |
| **RF-06** | Eliminación lógica (*soft-delete*) de usuarios | \`apps/api/src/modules/users/application/use-cases/eliminarusuariologicamente.use-case.ts\`<br>\`apps/web/src/features/users/pages/paginausuarios.tsx\` | \`eliminarusuariologicamente.spec.ts\` | **Cumplido** |

---

### 2.2 Módulo 2: Administración Escolar y Estudiantes
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-07** | Registro y matriculación de estudiantes | \`apps/api/src/modules/students/application/use-cases/crearestudiante.use-case.ts\`<br>\`apps/web/src/features/students/pages/paginaestudiantes.tsx\` | \`crearestudiante.use-case.spec.ts\` | **Cumplido** |
| **RF-08** | Restricción de unicidad para código RUDE | Índice único en base de datos PostgreSQL (\`rude_unique\`) y validación en capa de dominio. | \`crearestudiante.use-case.spec.ts\` | **Cumplido** |
| **RF-09** | Trazabilidad y auditoría de ficha estudiantil | \`apps/web/src/features/students/pages/paginaestudiantes.tsx\` (Modal Historial)<br>\`apps/api/src/modules/audit/presentation/controllers/audit.controller.ts\` | \`audit.controller.spec.ts\` | **Cumplido** |
| **RF-10** | Vinculación de familiares y tutores | \`apps/api/src/modules/parents/application/use-cases/padre.use-cases.ts\`<br>\`apps/web/src/features/community/pages/paginacomunidad.tsx\` | \`padre.use-cases.spec.ts\` | **Cumplido** |
| **RF-11** | Búsqueda y filtrado multicriterio de alumnos | Filtros dinámicos por curso, grado, estado, RUDE y CI en UI y API con paginación optimizada. | \`estudiantes.controller.spec.ts\` | **Cumplido** |
| **RF-12** | Registro de referencias documentales | \`apps/api/src/modules/students/presentation/controllers/students.controller.ts\` (\`/students/:id/documents\`). | \`students.controller.spec.ts\` | **Cumplido** |

---

### 2.3 Módulo 3: Estructura Curricular, Cursos y Horarios
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-13** | Gestión de Gestiones Escolares (Años Lectivos) | \`apps/api/src/modules/academic-years/presentation/controllers/academic-years.controller.ts\`<br>\`apps/web/src/features/courses/pages/paginacursos.tsx\` | \`academic-years.controller.spec.ts\` | **Cumplido** |
| **RF-14** | Configuración de Cursos, Secciones y Turnos | \`apps/api/src/modules/courses/application/use-cases/crearcurso.use-case.ts\`<br>\`apps/web/src/features/courses/pages/paginacursos.tsx\` | \`crearcurso.use-case.spec.ts\` | **Cumplido** |
| **RF-15** | Catálogo de Asignaturas Curriculares | \`apps/api/src/modules/curriculum/presentation/controllers/curriculum.controller.ts\`<br>\`apps/web/src/features/curriculum/pages/paginaplanestudio.tsx\` | \`curriculum.controller.spec.ts\` | **Cumplido** |
| **RF-16** | Asignación de Materias y Docentes por Curso | \`apps/web/src/features/community/components/editordocenteasignaciones.tsx\`<br>\`POST /assignments/teacher/batch\` | \`editordocenteasignaciones.spec.ts\` | **Cumplido** |
| **RF-17** | Inscripción y Matriculación en Paralelos | \`apps/api/src/modules/enrollments/application/use-cases/matricular.use-case.ts\`<br>\`apps/web/src/features/enrollments/pages/paginamatriculas.tsx\` | \`matricular.use-case.spec.ts\` | **Cumplido** |
| **RF-18** | Apertura y Cierre de Períodos de Evaluación | \`apps/api/src/modules/grades/presentation/controllers/periods.controller.ts\`<br>\`apps/web/src/features/grades/pages/paginacalificaciones.tsx\` | \`periods.controller.spec.ts\` | **Cumplido** |

---

### 2.4 Módulo 4: Evaluación, Calificaciones y Asistencia
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-19** | Registro individual y por planilla de notas | \`apps/api/src/modules/grades/application/use-cases/registrarnota.use-case.ts\`<br>\`apps/web/src/features/grades/pages/paginacalificaciones.tsx\` | \`registrarnota.use-case.spec.ts\` | **Cumplido** |
| **RF-20** | Validación de rango 1 a 100 (Ley 070) | \`packages/academic-domain/src/calificacionreglas.ts\`<br>Restricción a nivel de base de datos y esquema Zod. | \`calificacionreglas.spec.ts\` | **Cumplido** |
| **RF-21** | Bloqueo por Cierre de Período Evaluativo | Validación de período cerrado en caso de uso \`registrarnota.use-case.ts\`. | \`registrarnota.use-case.spec.ts\` | **Cumplido** |
| **RF-22** | Flujo de Rectificación y Aprobación de Calificaciones | \`apps/api/src/modules/grades/application/use-cases/solicitarrectificacion.use-case.ts\`<br>\`apps/web/src/features/grades/components/panelcorreccionescalificaciones.tsx\` | \`rectificacion.use-case.spec.ts\` | **Cumplido** |
| **RF-23** | Registro y justificación de auditoría de notas | Toda modificación de calificación registra usuario, timestamp, valor previo, valor nuevo y motivo en \`AuditLog\`. | \`registrarnota.use-case.spec.ts\` | **Cumplido** |
| **RF-24** | Publicación de Calificaciones para Familias | \`apps/web/src/features/grades/pages/paginacalificaciones.tsx\` (Botón Publicar y badges de visibilidad)<br>\`POST /grades/publish\` | \`grades.controller.spec.ts\` | **Cumplido** |
| **RF-25** | Registro de Asistencia Diaria | \`apps/api/src/modules/attendance/application/use-cases/registrarasistencia.use-case.ts\`<br>\`apps/web/src/features/attendance/components/planillaasistenciacurso.tsx\` | \`asistencia.use-case.spec.ts\` | **Cumplido** |
| **RF-26** | Estados normativos de asistencia (Presente, Atraso, Falta, Licencia) | \`packages/domain-kernel/src/asistenciaestado.ts\` | \`asistencia.use-case.spec.ts\` | **Cumplido** |
| **RF-27** | Corrección justificada de asistencia | Actualización auditada con registro de causa en \`apps/api/src/modules/attendance/\`. | \`asistencia.use-case.spec.ts\` | **Cumplido** |
| **RF-28** | Consolidado y resumen de asistencia | \`apps/web/src/features/reports/pages/paginainformes.tsx\` (\`ATTENDANCE_SUMMARY\`). | \`reports.controller.spec.ts\` | **Cumplido** |

---

### 2.5 Módulo 5: Alertas Tempranas y Notificaciones
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-29** | Configuración de Criterios de Riesgo Escolar | \`apps/api/src/modules/alerts/presentation/controllers/alerts.controller.ts\`<br>\`apps/web/src/features/alerts/components/panelreglasalerta.tsx\` | \`alerts.controller.spec.ts\` | **Cumplido** |
| **RF-30** | Detección Automática por Bajo Rendimiento ($< 51$) | \`apps/api/src/modules/alerts/application/use-cases/evaluaralertascalificaciones.use-case.ts\` | \`alertas.spec.ts\` | **Cumplido** |
| **RF-31** | Detección Automática por Inasistencias Reincidentes | \`apps/api/src/modules/alerts/application/use-cases/evaluaralertasasistencia.use-case.ts\` | \`alertas.spec.ts\` | **Cumplido** |
| **RF-32** | Ciclo de Vida de Alertas (Abierta, En Proceso, Resuelta) | \`apps/web/src/features/alerts/pages/paginaalertas.tsx\`<br>\`PATCH /alerts/:id/status\` | \`alerts.controller.spec.ts\` | **Cumplido** |
| **RF-33** | Notificaciones en Tiempo Real | WebSockets seguros (\`apps/api/src/common/websocket/\`) y bandeja en barra superior (\`barradenavegacion.tsx\`). | \`websocket.module.spec.ts\` | **Cumplido** |

---

### 2.6 Módulo 6: Reportes, Documentos Oficiales e Historial
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-34** | Historial Académico Consolidado Multi-Gestión | \`apps/web/src/features/reports/pages/paginainformes.tsx\` (\`ACADEMIC_HISTORY\`) con trayectoria curricular, escala Ley 070 y condición de promoción. | \`reports.controller.spec.ts\` | **Cumplido** |
| **RF-35** | Centralizador Oficial de Calificaciones | \`apps/web/src/features/reports/pages/paginainformes.tsx\` (\`CENTRALIZER\`). | \`reports.controller.spec.ts\` | **Cumplido** |
| **RF-36** | Libreta Escolar Individual | \`apps/web/src/features/reports/components/libretaindividual.tsx\`. | \`reports.controller.spec.ts\` | **Cumplido** |
| **RF-37** | Boletín Curricular de Avance | \`apps/web/src/features/reports/components/boletincurricular.tsx\`. | \`reports.controller.spec.ts\` | **Cumplido** |
| **RF-38** | Exportación segura en CSV e Impresión Formateada | Sanitización contra inyección de fórmulas CSV (\`scripts/celdaseguracsv.ts\`) y CSS \`@media print\`. | \`celdaseguracsv.test.ts\` | **Cumplido** |

---

### 2.7 Módulo 7: Aplicación Móvil para Familias (Flutter)
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-39** | Acceso Móvil para Tutores y Estudiantes | \`mobile/lib/features/auth/presentation/pantallainiciosesion.dart\` | \`mobile_test.dart\` | **Cumplido** |
| **RF-40** | Filtrado por Estudiante Vinculado | \`mobile/lib/features/academic/presentation/selectorhijo.dart\` | \`mobile_test.dart\` | **Cumplido** |
| **RF-41** | Consulta Móvil de Calificaciones Publicadas | \`mobile/lib/features/grades/presentation/pantallacalificaciones.dart\` (Filtro por \`publishedAt\`). | \`mobile_test.dart\` | **Cumplido** |
| **RF-42** | Seguimiento Móvil de Asistencia y Atrasos | \`mobile/lib/features/attendance/presentation/pantallaasistencia.dart\` | \`mobile_test.dart\` | **Cumplido** |
| **RF-43** | Recepción de Alertas y Notificaciones Móviles | \`mobile/lib/features/alerts/presentation/pantallaalertas.dart\` | \`mobile_test.dart\` | **Cumplido** |
| **RF-44** | Funcionamiento en Modo Desconectado (Offline Cache) | \`mobile/lib/features/academic/data/academic_repository.dart\` (\`_obtenerlistaencache\` con Hive/SecureStorage). | \`academic_repository_test.dart\` | **Cumplido** |

---

### 2.8 Módulo 8: Integración Asíncrona con el Sistema SIE (RPA)
| ID | Nombre del Requerimiento | Capa / Archivos Principales | Pruebas Asociadas | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-45** | Autenticación y navegación automática en SIE | \`apps/sie-worker/src/infrastructure/sie/adaptadorsierealpupeteer.ts\` | \`adaptadorsierealpupeteer.spec.ts\` | **Cumplido** |
| **RF-46** | Detección de Turno, Nivel y Paralelo en Portal SIE | Selección dinámica por selectores semánticos y XPath en el trabajador Puppeteer. | \`worker.spec.ts\` | **Cumplido** |
| **RF-47** | Extracción e ingestión de calificaciones | Decodificación y mapeo de datos serializados PHP en notas institucionales. | \`sie-grade-parser.spec.ts\` | **Cumplido** |
| **RF-48** | Procesamiento asíncrono desacoplado | Arquitectura de colas BullMQ y Redis (\`apps/sie-worker/src/jobs/\`). | \`queue.spec.ts\` | **Cumplido** |
| **RF-49** | Idempotencia en trabajos de sincronización | Tokens de idempotencia únicos y control de \`lease\` por elemento en base de datos. | \`idempotencia.spec.ts\` | **Cumplido** |
| **RF-50** | Detección de Discrepancias SIGCE vs. SIE | \`apps/api/src/modules/sie-sync/application/services/resumircomparacionesie.service.ts\` | \`resumircomparacionesie.service.spec.ts\` | **Cumplido** |
| **RF-51** | Interfaz de Revisión y Resolución de Discrepancias | \`apps/web/src/features/sie-sync/pages/paneldesincronizacionsie.tsx\` | \`siesincronizacion.controller.spec.ts\` | **Cumplido** |
| **RF-52** | Agrupación masiva y resolución en lote | \`apps/api/src/modules/sie-sync/application/use-cases/resolvergrupodiscrepanciasie.use-case.ts\` | \`resolvergrupodiscrepancia.spec.ts\` | **Cumplido** |
| **RF-53** | Progreso de Sincronización en Tiempo Real | WebSocket Gateway con eventos de porcentaje, estado y tiempo restante estimado. | \`siesincronizacionprogreso.gateway.spec.ts\` | **Cumplido** |
| **RF-54** | Reintentos Automáticos con Backoff Exponencial | Configuración BullMQ con 5 intentos y pausas exponenciales de contingencia. | \`bullmqcolasie.adapter.spec.ts\` | **Cumplido** |
| **RF-55** | Trazabilidad y Correlación de Auditoría SIE | Registro unificado con \`correlationId\` para rastrear cada lote de sincronización. | \`repositoriosincronizacionsieprisma.spec.ts\` | **Cumplido** |
| **RF-56** | Contingencia y Operación sin Conexión al SIE | Feature flag \`SIE_REAL_ACCESS_ENABLED=false\` con bypass transparente. | \`credencialessie.test.ts\` | **Cumplido** |

---

## 3. Requerimientos No Funcionales (RNF-01 al RNF-20)

| ID | Característica | Criterio de Aceptación | Evidencia Técnica en el Repositorio | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RNF-01** | Seguridad | Comunicación bajo HTTPS/TLS | Cabeceras HSTS y Helmet configuradas en \`apps/api/src/main.ts\`. Proxy reverso Nginx documentado en \`docker-compose.yml\`. | **Conforme** |
| **RNF-02** | Seguridad | Autorización en backend en cada endpoint | Guards globales \`JwtAuthGuard\`, \`RolesGuard\` y \`guardiapermisos\` aplicados en todos los controladores. | **Conforme** |
| **RNF-03** | Seguridad | Expiración y revocación de tokens | Tokens JWT con expiración corta (\`15m\`), refresh tokens en base de datos revocables individualmente o por sesión. | **Conforme** |
| **RNF-04** | Seguridad | Credenciales SIE fuera de código y logs | Variables en \`.env\` excluidas del control de versiones. Filtro estricto en auditoría y logs. | **Conforme** |
| **RNF-05** | Seguridad | Auditoría en operaciones sensibles | Registro automático en entidad \`AuditLog\` con usuario, IP, entidad, valores previos y nuevos. | **Conforme** |
| **RNF-06** | Rendimiento | Consultas comunes responden en $p_{95} < 2000\\text{ ms}$ | **Verificado en prueba de carga:** $p_{95} = 32.01\\text{ ms}$ bajo 50 clientes concurrentes (\`docs/evidencias/reporte_pruebas_de_carga_rnf06.md\`). | **Aprobado** |
| **RNF-07** | Rendimiento | Paginación en listados masivos | Paginación por \`limit\` y \`offset\` en estudiantes, calificaciones, asistencia y auditoría. | **Conforme** |
| **RNF-08** | Disponibilidad | Operación autónoma sin SIE | Desacoplamiento total: la base institucional opera normalmente sin depender del portal externo. | **Conforme** |
| **RNF-09** | Disponibilidad | Procedimiento de respaldo y recuperación | **Verificado con simulacro formal:** Integridad de volcados \`.dump\` (PGDMP) y \`.sql\` con HASH SHA-256 (\`docs/evidencias/acta_simulacro_recuperacion_rnf09.md\`). | **Aprobado** |
| **RNF-10** | Usabilidad | Terminología del dominio educativo boliviano | Interfaz completamente expresada con vocabulario oficial: RUDE, Calificación 1-100, Centralizador, Libreta, Paralelos y Turnos. | **Conforme** |
| **RNF-11** | Usabilidad | Conformidad WCAG 2.2 Nivel AA | **Verificado con escaneo:** 0 controles inaccesibles, contraste superior a $4.5:1$, soporte de teclado y lectores de pantalla (\`docs/evidencias/reporte_accesibilidad_wcag22_rnf11.md\`). | **Aprobado** |
| **RNF-12** | Mantenibilidad | Arquitectura limpia y modular | Monorepo con separación estricta de capas: Dominio, Aplicación, Infraestructura y Presentación, validado por 55 tests de arquitectura. | **Conforme** |
| **RNF-13** | Mantenibilidad | Cobertura de pruebas automatizadas | 92 suites en backend, 32 pruebas en web, 7 en worker y pruebas de límites arquitectónicos pasando al 100%. | **Conforme** |
| **RNF-14** | Mantenibilidad | Migraciones versionadas de base de datos | 22 migraciones declarativas y reproducibles en el directorio \`prisma/migrations/\`. | **Conforme** |
| **RNF-15** | Mantenibilidad | Documentación y despliegue reproducible | \`README.md\`, \`docker-compose.yml\` y scripts de inicialización (\`pnpm db:setup\`, \`pnpm db:seed\`). | **Conforme** |
| **RNF-16** | Fiabilidad | Idempotencia en sincronización | Claves de idempotencia determinísticas previenen duplicación de registros ante reintentos. | **Conforme** |
| **RNF-17** | Fiabilidad | Reintentos con retroceso exponencial | Configuración de colas BullMQ con reintentos automáticos escalonados. | **Conforme** |
| **RNF-18** | Fiabilidad | Transacciones atómicas en operaciones críticas | Uso de transacciones interactivas \`prisma.$transaction\` en matriculación, asignación de cursos y carga de notas. | **Conforme** |
| **RNF-19** | Integridad | Prevención de duplicados de dominio | Restricciones únicas en base de datos para RUDE, CI, asignaciones docente-curso-materia y períodos lectivos. | **Conforme** |
| **RNF-20** | Privacidad | Exclusión de secretos en auditoría y eventos | Sanitización preventiva de campos sensibles (\`password\`, \`token\`, \`secret\`) antes de registrar en auditoría o WebSocket. | **Conforme** |

---

## 4. Conclusión de Acreditación

El proyecto **SIGCE** se encuentra en estado **TÉCNICAMENTE CONCLUIDO Y VERIFICADO**. Todos los requerimientos funcionales y no funcionales comprometidos en el perfil de grado cuentan con implementación en código fuente, interfaces de usuario reactivas, validaciones de seguridad y evidencia formal reproducible.
