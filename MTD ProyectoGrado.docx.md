Gráfico  El contenido generado por IA puede ser incorrecto.

**UNIVERSIDAD PRIVADA DEL VALLE**

**FACULTAD DE INFORMÁTICA Y ELECTRÓNICA CARRERA DE LICENCIATURA EN INGENIERÍA DE SISTEMAS INFORMÁTICOS**

**SISTEMA DE GESTIÓN ACADÉMICA PARA LOS PROCESOS DE REGISTROS, ACTUALIZACIÓN, SEGUIMIENTO Y SINCRONIZACIÓN CON EL SISTEMA DE INSCRIPCIÓN ESTUDIANTIL EN EL COLEGIO COMUNIDAD CRISTIANA DE SANTA CRUZ DE LA SIERRA**

**PROYECTO DE GRADO PARA OPTAR AL TÍTULO DE LICENCIATURA EN INGENIERÍA DE SISTEMAS**

**POSTULANTE:** DAGNER ENRIQUE MOLINA TORRICO

**TUTOR:** ING. MARCO CANEDO REJAS

Santa Cruz – Bolivia

2026

# DEDICATORIA

*Dedico este proyecto a mi familia, por su apoyo constante, su paciencia y la confianza que me brindaron durante mi formación universitaria. También lo dedico a quienes, con una palabra o una ayuda oportuna, hicieron más llevadero este proceso.*

# AGRADECIMIENTOS

Agradezco a la Universidad Privada del Valle, a la Facultad de Informática y Electrónica y a la carrera de Ingeniería de Sistemas por la formación recibida y por las condiciones que permitieron desarrollar este proyecto.

Expreso un agradecimiento especial al Ing. Marco Canedo Rejas, tutor del proyecto, por sus observaciones y orientación durante la planificación y revisión del trabajo.

También agradezco al Colegio Comunidad Cristiana de Santa Cruz de la Sierra y a las personas que aportaron información para comprender sus procesos académicos.

# RESUMEN

El proyecto plantea un sistema de gestión académica para el Colegio Comunidad Cristiana de Santa Cruz de la Sierra. La necesidad nace de un problema cotidiano: la información de estudiantes, calificaciones y asistencia circula por registros separados, se vuelve a transcribir y debe conciliarse con el Sistema de Información Educativa (SIE). Esa secuencia consume tiempo y abre espacio a duplicidades, omisiones y correcciones tardías.

La investigación adopta un enfoque mixto y organiza el diagnóstico mediante cuestionarios, entrevistas, observación y revisión documental. La evidencia institucional disponible se distingue de aquella que aún requiere validación; por esa razón, el documento no atribuye resultados de implementación que todavía no han sido medidos. Los requerimientos, reglas de negocio y criterios de aceptación se conectan con los procesos observados y con los anexos que respaldan el levantamiento de información.

La solución propuesta reúne una plataforma web, una aplicación móvil para padres o tutores y un módulo controlado de automatización para el SIE. El diseño utiliza React y TypeScript, NestJS, Flutter, PostgreSQL, Prisma, Redis, BullMQ y Puppeteer, dentro de un monolito modular guiado por arquitectura limpia y diseño orientado al dominio. Se incorporan controles de acceso por roles, auditoría de operaciones, protección de credenciales y verificación posterior de cada sincronización.

El capítulo de ingeniería incluye un examen de la normativa boliviana y una valoración económica del desarrollo. La Ley N.° 164 prioriza el software libre en entidades públicas, pero no convierte el trabajo de programación en un servicio sin pago. Con referencias salariales públicas y un cálculo por meses-persona, el desarrollo se estima en Bs 110.563,20 antes de infraestructura y gastos que dependan de una cotización. La cifra sirve para decidir y comparar; no reemplaza una propuesta comercial.

**Palabras clave: gestión académica, SIE, interoperabilidad, arquitectura de software, trazabilidad, software libre, costo de desarrollo.**

# ABSTRACT

This project proposes an academic management system for Colegio Comunidad Cristiana in Santa Cruz de la Sierra, Bolivia. Student records, grades and attendance currently move through separate files, are transcribed more than once and must later be reconciled with the national Student Information System (SIE). The resulting workload creates room for duplicate records, omissions and delayed corrections.

The study follows a mixed approach. Questionnaires, interviews, observation and document review support the diagnosis, while the text separates evidence already available from findings that still require institutional validation. Requirements, business rules and acceptance criteria are linked to the observed processes and to the supporting annexes.

The proposed solution combines a web platform, a mobile application for parents or guardians and a controlled SIE automation module. Its design uses React and TypeScript, NestJS, Flutter, PostgreSQL, Prisma, Redis, BullMQ and Puppeteer in a modular monolith shaped by Clean Architecture and Domain-Driven Design. Role-based access, operation logs, credential protection and post-synchronization checks are part of the design.

The engineering chapter also examines Bolivian law and estimates the economic value of development. Law No. 164 gives priority to free software in public entities; it does not require unpaid programming work. A bottom-up calculation based on published public salary references values development at BOB 110,563.20, excluding infrastructure and items that require a supplier quotation.

**Keywords: academic management, SIE, interoperability, software architecture, traceability, free software, development cost.**

**ÍNDICE DE CONTENIDO**

[**CAPÍTULO I MARCO INTRODUCTORIO 1**](#capítulo-imarco-introductorio)

[1.1 INTRODUCCIÓN 2](#11-introducción)

[1.2 ANTECEDENTES DEL PROBLEMA 2](#12-antecedentes-del-problema)

[1.3 PLANTEAMIENTO DEL PROBLEMA 3](#13-planteamiento-del-problema)

[1.4 FORMULACIÓN DEL PROBLEMA 5](#14-formulación-del-problema)

[1.5 OBJETO DE ESTUDIO 5](#15-objeto-de-estudio)

[1.6 OBJETIVOS 6](#16-objetivos)

[*1.6.1 OBJETIVO GENERAL 6*](#161-objetivo-general)

[*1.6.2 OBJETIVOS ESPECÍFICOS 6*](#162-objetivos-específicos)

[1.7 JUSTIFICACIÓN 6](#17-justificación)

[*1.7.1 JUSTIFICACIÓN TÉCNICA 6*](#171-justificación-técnica)

[*1.7.2 JUSTIFICACIÓN ECONÓMICA 7*](#172-justificación-económica)

[*1.7.3 JUSTIFICACIÓN SOCIAL 8*](#173-justificación-social)

[1.8 DELIMITACIÓN DE LA INVESTIGACIÓN 9](#18-delimitación-de-la-investigación)

[*1.8.1 TEMÁTICA 9*](#181-temática)

[*1.8.2 ESPACIAL 9*](#182-espacial)

[*1.8.3 TEMPORAL 9*](#183-temporal)

[1.9 PROPUESTA DE SOLUCIÓN AL PLANTEAMIENTO DEL PROBLEMA 9](#19-propuesta-de-solución-al-planteamiento-del-problema)

[1.10 METODOLOGÍA 11](#110-metodología)

[*1.10.1 ENFOQUE Y TIPO DE INVESTIGACIÓN 11*](#1101-enfoque-y-tipo-de-investigación)

[*1.10.2 MÉTODO DE INVESTIGACIÓN 11*](#1102-método-de-investigación)

[*1.10.3 TÉCNICAS E INSTRUMENTOS DE INVESTIGACIÓN 12*](#1103-técnicas-e-instrumentos-de-investigación)

[*1.10.4 POBLACIÓN Y MUESTRA 12*](#1104-población-y-muestra)

[**CAPÍTULO II MARCO TEÓRICO 14**](#capítulo-iimarco-teórico)

[2.1 FUNDAMENTOS DE INGENIERÍA DE SOFTWARE 15](#21-fundamentos-de-ingeniería-de-software)

[*2.1.1 PRINCIPIOS DE LA INGENIERÍA DE SOFTWARE 16*](#211-principios-de-la-ingeniería-de-software)

[*2.1.2 MODELOS DE DESARROLLO DE SOFTWARE 17*](#212-modelos-de-desarrollo-de-software)

[*2.1.2.1 Enfoques tradicionales de desarrollo 17*](#2121-enfoques-tradicionales-de-desarrollo)

[*2.1.2.2 Enfoques ágiles e iterativos 18*](#2122-enfoques-ágiles-e-iterativos)

[*2.1.3 METODOLOGÍA DE DESARROLLO DE SOFTWARE SELECCIONADA 19*](#213-metodología-de-desarrollo-de-software-seleccionada)

[*2.1.4 INGENIERÍA DE REQUERIMIENTOS 20*](#214-ingeniería-de-requerimientos)

[*2.1.4.1 Requerimientos funcionales 20*](#2141-requerimientos-funcionales)

[*2.1.4.2 Requerimientos no funcionales 21*](#2142-requerimientos-no-funcionales)

[*2.1.4.3 Técnicas de levantamiento de requerimientos 21*](#2143-técnicas-de-levantamiento-de-requerimientos)

[*2.1.4.4 Validación de requerimientos 22*](#2144-validación-de-requerimientos)

[*2.1.5 DOCUMENTACIÓN Y ESPECIFICACIÓN DE REQUERIMIENTOS 23*](#215-documentación-y-especificación-de-requerimientos)

[*2.1.6 CALIDAD DEL SOFTWARE 23*](#216-calidad-del-software)

[2.2 GESTIÓN DE LA INFORMACIÓN ACADÉMICA 24](#22-gestión-de-la-información-académica)

[*2.2.1 GESTIÓN ACADÉMICA 24*](#221-gestión-académica)

[*2.2.2 INFORMACIÓN Y REGISTRO ESTUDIANTIL 25*](#222-información-y-registro-estudiantil)

[*2.2.3 PROCESOS DE REGISTRO Y ACTUALIZACIÓN DE INFORMACIÓN ACADÉMICA*\
*25*](#223-procesos-de-registro-y-actualización-de-información-académica)

[*2.2.4 GESTIÓN DE CALIFICACIONES 26*](#224-gestión-de-calificaciones)

[*2.2.5 CONTROL Y SEGUIMIENTO DE ASISTENCIA 26*](#225-control-y-seguimiento-de-asistencia)

[*2.2.6 HISTORIAL ACADÉMICO DEL ESTUDIANTE 27*](#226-historial-académico-del-estudiante)

[*2.2.7 SEGUIMIENTO DEL RENDIMIENTO ACADÉMICO 27*](#227-seguimiento-del-rendimiento-académico)

[*2.2.8 ALERTAS ACADÉMICAS 28*](#228-alertas-académicas)

[*2.2.9 PARTICIPACIÓN DE PADRES Y TUTORES EN EL SEGUIMIENTO ACADÉMICO*\
*29*](#229-participación-de-padres-y-tutores-en-el-seguimiento-académico)

[2.3 SISTEMAS DE INFORMACIÓN ACADÉMICA 29](#23-sistemas-de-información-académica)

[*2.3.1 SISTEMAS DE INFORMACIÓN 29*](#231-sistemas-de-información)

[*2.3.2 SISTEMAS DE INFORMACIÓN EN INSTITUCIONES EDUCATIVAS 30*](#232-sistemas-de-información-en-instituciones-educativas)

[*2.3.3 SISTEMAS DE GESTIÓN ACADÉMICA 30*](#233-sistemas-de-gestión-académica)

[*2.3.4 CENTRALIZACIÓN DE INFORMACIÓN ESTUDIANTIL 31*](#234-centralización-de-información-estudiantil)

[*2.3.5 INTEGRIDAD Y CONSISTENCIA DE LOS REGISTROS ACADÉMICOS 31*](#235-integridad-y-consistencia-de-los-registros-académicos)

[*2.3.6 TRAZABILIDAD DE LA INFORMACIÓN ACADÉMICA 32*](#236-trazabilidad-de-la-información-académica)

[*2.3.7 AUDITORÍA DE REGISTROS ACADÉMICOS 32*](#237-auditoría-de-registros-académicos)

[2.4 SISTEMA DE INFORMACIÓN EDUCATIVA EN BOLIVIA 33](#24-sistema-de-información-educativa-en-bolivia)

[*2.4.1 SISTEMA DE INFORMACIÓN EDUCATIVA 33*](#241-sistema-de-información-educativa)

[*2.4.2 GESTIÓN DE INFORMACIÓN ESTUDIANTIL MEDIANTE EL SIE 33*](#242-gestión-de-información-estudiantil-mediante-el-sie)

[*2.4.3 REGISTRO DE INFORMACIÓN ACADÉMICA EN EL SIE 34*](#243-registro-de-información-académica-en-el-sie)

[*2.4.4 TRANSFERENCIA DE INFORMACIÓN ACADÉMICA HACIA EL SIE 34*](#244-transferencia-de-información-académica-hacia-el-sie)

[*2.4.5 LIMITACIONES DE INTEROPERABILIDAD CON SISTEMAS EDUCATIVOS EXTERNOS*\
*35*](#245-limitaciones-de-interoperabilidad-con-sistemas-educativos-externos)

[*2.4.6 NORMATIVA BOLIVIANA RELACIONADA CON LA GESTIÓN DE INFORMACIÓN ACADÉMICA*\
*36*](#246-normativa-boliviana-relacionada-con-la-gestión-de-información-académica)

[2.5 INTEROPERABILIDAD Y AUTOMATIZACIÓN DE PROCESOS 37](#25-interoperabilidad-y-automatización-de-procesos)

[*2.5.1 INTEROPERABILIDAD ENTRE SISTEMAS DE INFORMACIÓN 37*](#251-interoperabilidad-entre-sistemas-de-información)

[*2.5.2 INTEGRACIÓN DE SISTEMAS 37*](#252-integración-de-sistemas)

[*2.5.3 INTERFACES DE PROGRAMACIÓN DE APLICACIONES 38*](#253-interfaces-de-programación-de-aplicaciones)

[*2.5.4 SERVICIOS WEB 38*](#254-servicios-web)

[*2.5.5 AUTOMATIZACIÓN ROBÓTICA DE PROCESOS 38*](#255-automatización-robótica-de-procesos)

[*2.5.6 AUTOMATIZACIÓN MEDIANTE NAVEGACIÓN WEB 39*](#256-automatización-mediante-navegación-web)

[*2.5.7 SINCRONIZACIÓN DE INFORMACIÓN ENTRE SISTEMAS 40*](#257-sincronización-de-información-entre-sistemas)

[*2.5.8 VERIFICACIÓN DE INFORMACIÓN SINCRONIZADA 40*](#258-verificación-de-información-sincronizada)

[*2.5.9 CONCILIACIÓN DE DATOS ENTRE SISTEMAS 41*](#259-conciliación-de-datos-entre-sistemas)

[*2.5.10 MANEJO DE ERRORES Y REINTENTOS EN PROCESOS AUTOMATIZADOS 41*](#2510-manejo-de-errores-y-reintentos-en-procesos-automatizados)

[*2.5.11 TRAZABILIDAD Y AUDITORÍA DE PROCESOS AUTOMATIZADOS 42*](#2511-trazabilidad-y-auditoría-de-procesos-automatizados)

[2.6 ARQUITECTURA DE SOFTWARE 42](#26-arquitectura-de-software)

[*2.6.1 FUNDAMENTOS DE ARQUITECTURA DE SOFTWARE 42*](#261-fundamentos-de-arquitectura-de-software)

[*2.6.2 ARQUITECTURAS EN SISTEMAS WEB Y MÓVILES 43*](#262-arquitecturas-en-sistemas-web-y-móviles)

[*2.6.3 ESTILOS ARQUITECTÓNICOS DE SOFTWARE 43*](#263-estilos-arquitectónicos-de-software)

[*2.6.3.1 Arquitectura monolítica 43*](#2631-arquitectura-monolítica)

[*2.6.3.2 Arquitectura de microservicios 44*](#2632-arquitectura-de-microservicios)

[*2.6.3.3 Monolito modular 44*](#2633-monolito-modular)

[*2.6.4 ARQUITECTURA LIMPIA 45*](#264-arquitectura-limpia)

[*2.6.4.1 Principios de Arquitectura Limpia 45*](#2641-principios-de-arquitectura-limpia)

[*2.6.4.2 Capa de dominio 46*](#2642-capa-de-dominio)

[*2.6.4.3 Capa de aplicación 46*](#2643-capa-de-aplicación)

[*2.6.4.4 Capa de infraestructura 46*](#2644-capa-de-infraestructura)

[*2.6.4.5 Capa de presentación 47*](#2645-capa-de-presentación)

[*2.6.5 DISEÑO ORIENTADO AL DOMINIO 47*](#265-diseño-orientado-al-dominio)

[*2.6.5.1 Dominio y subdominios 47*](#2651-dominio-y-subdominios)

[*2.6.5.2 Entidades 48*](#2652-entidades)

[*2.6.5.3 Objetos de valor 48*](#2653-objetos-de-valor)

[*2.6.5.4 Agregados 48*](#2654-agregados)

[*2.6.5.5 Servicios de dominio 49*](#2655-servicios-de-dominio)

[*2.6.5.6 Repositorios 49*](#2656-repositorios)

[*2.6.5.7 Contextos delimitados 49*](#2657-contextos-delimitados)

[*2.6.6 ARQUITECTURA ORIENTADA A EVENTOS INTERNOS 50*](#266-arquitectura-orientada-a-eventos-internos)

[*2.6.7 PROCESAMIENTO ASÍNCRONO 50*](#267-procesamiento-asíncrono)

[*2.6.8 COLAS DE TRABAJO 50*](#268-colas-de-trabajo)

[2.7 DESARROLLO DE APLICACIONES WEB Y MÓVILES 51](#27-desarrollo-de-aplicaciones-web-y-móviles)

[*2.7.1 ARQUITECTURA CLIENTE-SERVIDOR 51*](#271-arquitectura-cliente-servidor)

[*2.7.2 API REST 51*](#272-api-rest)

[*2.7.3 DESARROLLO WEB BASADO EN COMPONENTES 52*](#273-desarrollo-web-basado-en-componentes)

[*2.7.4 APLICACIONES MÓVILES MULTIPLATAFORMA 52*](#274-aplicaciones-móviles-multiplataforma)

[*2.7.5 COMUNICACIÓN EN TIEMPO REAL 53*](#275-comunicación-en-tiempo-real)

[*2.7.6 WEBSOCKETS 53*](#276-websockets)

[*2.7.7 TECNOLOGÍAS Y HERRAMIENTAS DE DESARROLLO SELECCIONADAS 53*](#277-tecnologías-y-herramientas-de-desarrollo-seleccionadas)

[*2.7.7.1 React 54*](#2771-react)

[*2.7.7.2 TypeScript 54*](#2772-typescript)

[*2.7.7.3 NestJS 54*](#2773-nestjs)

[*2.7.7.4 Flutter 55*](#2774-flutter)

[*2.7.7.5 Puppeteer 55*](#2775-puppeteer)

[*2.7.7.6 Redis 55*](#2776-redis)

[*2.7.7.7 BullMQ 56*](#2777-bullmq)

[2.8 SISTEMAS DE GESTIÓN DE BASES DE DATOS 56](#28-sistemas-de-gestión-de-bases-de-datos)

[*2.8.1 BASES DE DATOS 56*](#281-bases-de-datos)

[*2.8.2 BASES DE DATOS RELACIONALES 57*](#282-bases-de-datos-relacionales)

[*2.8.3 MODELADO DE DATOS 57*](#283-modelado-de-datos)

[*2.8.4 MODELO ENTIDAD-RELACIÓN 57*](#284-modelo-entidad-relación)

[*2.8.5 INTEGRIDAD REFERENCIAL 58*](#285-integridad-referencial)

[*2.8.6 POSTGRESQL 58*](#286-postgresql)

[*2.8.7 MAPEO OBJETO-RELACIONAL 59*](#287-mapeo-objeto-relacional)

[*2.8.8 PRISMA ORM 59*](#288-prisma-orm)

[*2.8.9 AUDITORÍA Y TRAZABILIDAD DE CAMBIOS EN BASES DE DATOS 59*](#289-auditoría-y-trazabilidad-de-cambios-en-bases-de-datos)

[2.9 SEGURIDAD DE LA INFORMACIÓN 60](#29-seguridad-de-la-información)

[*2.9.1 SEGURIDAD EN SISTEMAS DE INFORMACIÓN 60*](#291-seguridad-en-sistemas-de-información)

[*2.9.2 AUTENTICACIÓN DE USUARIOS 60*](#292-autenticación-de-usuarios)

[*2.9.3 AUTORIZACIÓN 61*](#293-autorización)

[*2.9.4 CONTROL DE ACCESO BASADO EN ROLES 61*](#294-control-de-acceso-basado-en-roles)

[*2.9.5 GESTIÓN SEGURA DE CREDENCIALES 62*](#295-gestión-segura-de-credenciales)

[*2.9.6 PROTECCIÓN DE INFORMACIÓN ESTUDIANTIL 62*](#296-protección-de-información-estudiantil)

[*2.9.7 SEGURIDAD EN LA COMUNICACIÓN ENTRE APLICACIONES 63*](#297-seguridad-en-la-comunicación-entre-aplicaciones)

[*2.9.8 REGISTRO Y AUDITORÍA DE OPERACIONES 63*](#298-registro-y-auditoría-de-operaciones)

[2.10 EXPERIENCIA DE USUARIO Y ACCESIBILIDAD 64](#210-experiencia-de-usuario-y-accesibilidad)

[*2.10.1 DISEÑO CENTRADO EN EL USUARIO 64*](#2101-diseño-centrado-en-el-usuario)

[*2.10.2 PRINCIPIOS DE USABILIDAD 64*](#2102-principios-de-usabilidad)

[*2.10.3 EXPERIENCIA DE USUARIO EN SISTEMAS EDUCATIVOS 64*](#2103-experiencia-de-usuario-en-sistemas-educativos)

[*2.10.4 DISEÑO DE INTERFACES WEB 65*](#2104-diseño-de-interfaces-web)

[*2.10.5 DISEÑO DE APLICACIONES MÓVILES PARA PADRES Y TUTORES 65*](#2105-diseño-de-aplicaciones-móviles-para-padres-y-tutores)

[*2.10.6 ACCESIBILIDAD EN APLICACIONES WEB Y MÓVILES 66*](#2106-accesibilidad-en-aplicaciones-web-y-móviles)

[*2.10.7 SIMPLICIDAD DE INTERACCIÓN 66*](#2107-simplicidad-de-interacción)

[2.11 EVALUACIÓN Y VALIDACIÓN DE SISTEMAS 67](#211-evaluación-y-validación-de-sistemas)

[*2.11.1 CALIDAD DEL PRODUCTO SOFTWARE 67*](#2111-calidad-del-producto-software)

[*2.11.2 PRUEBAS DE SOFTWARE 67*](#2112-pruebas-de-software)

[*2.11.3 PRUEBAS FUNCIONALES 68*](#2113-pruebas-funcionales)

[*2.11.4 PRUEBAS DE INTEGRACIÓN 68*](#2114-pruebas-de-integración)

[*2.11.5 PRUEBAS DE USABILIDAD 69*](#2115-pruebas-de-usabilidad)

[*2.11.6 PRUEBAS DE ACEPTACIÓN DE USUARIO 69*](#2116-pruebas-de-aceptación-de-usuario)

[*2.11.7 VALIDACIÓN DE INTEGRIDAD DE DATOS 70*](#2117-validación-de-integridad-de-datos)

[*2.11.8 VALIDACIÓN DE PROCESOS DE SINCRONIZACIÓN 70*](#2118-validación-de-procesos-de-sincronización)

[*2.11.9 REFERENTES DE CALIDAD Y GESTIÓN AMBIENTAL 72*](#2119-referentes-de-calidad-y-gestión-ambiental)

[2.12 ESTADO DEL ARTE 73](#212-estado-del-arte)

[*2.12.1 ALCANCE Y CRITERIO DE REVISIÓN 73*](#2121-alcance-y-criterio-de-revisión)

[*2.12.2 TENDENCIAS EN LOS SISTEMAS DE INFORMACIÓN EDUCATIVA 73*](#2122-tendencias-en-los-sistemas-de-información-educativa)

[*2.12.3 PLATAFORMAS PÚBLICAS Y PRIVADAS EXAMINADAS 74*](#2123-plataformas-públicas-y-privadas-examinadas)

[*2.12.4 ALERTAS, INTEROPERABILIDAD Y AUTOMATIZACIÓN 75*](#2124-alertas-interoperabilidad-y-automatización)

[*2.12.5 COMPARACIÓN DE REFERENTES 76*](#2125-comparación-de-referentes)

[*2.12.6 ELEMENTOS SOLICITADOS PARA EL SISTEMA Y RESPALDO DEL ESTADO DEL ARTE*\
*76*](#2126-elementos-solicitados-para-el-sistema-y-respaldo-del-estado-del-arte)

[*2.12.6.1 REGISTRO MAESTRO DEL ESTUDIANTE, RUDE Y MATRÍCULA 77*](#21261-registro-maestro-del-estudiante-rude-y-matrícula)

[*2.12.6.2 CALIFICACIONES, ASISTENCIA E HISTORIAL ACADÉMICO 77*](#21262-calificaciones-asistencia-e-historial-académico)

[*2.12.6.3 CONSULTA MÓVIL PARA PADRES Y TUTORES 77*](#21263-consulta-móvil-para-padres-y-tutores)

[*2.12.6.4 ALERTAS Y TABLEROS DE SEGUIMIENTO 77*](#21264-alertas-y-tableros-de-seguimiento)

[*2.12.6.5 ROLES, PRIVACIDAD Y AUDITORÍA 77*](#21265-roles-privacidad-y-auditoría)

[*2.12.6.6 SINCRONIZACIÓN, VERIFICACIÓN Y CONCILIACIÓN CON EL SIE 78*](#21266-sincronización-verificación-y-conciliación-con-el-sie)

[*2.12.6.7 REPORTES PARA OPERACIÓN Y TOMA DE DECISIONES 78*](#21267-reportes-para-operación-y-toma-de-decisiones)

[*2.12.6.8 AFIRMACIONES QUE REQUIEREN RESPALDO FIRMADO 78*](#21268-afirmaciones-que-requieren-respaldo-firmado)

[*2.12.7 BRECHA IDENTIFICADA Y APORTE DEL PROYECTO 79*](#2127-brecha-identificada-y-aporte-del-proyecto)

[**CAPÍTULO III INGENIERÍA DEL PROYECTO 80**](#capítulo-iiiingeniería-del-proyecto)

[3.1 ANÁLISIS DEL CONTEXTO DEL COLEGIO COMUNIDAD CRISTIANA 82](#31-análisis-del-contexto-del-colegio-comunidad-cristiana)

[*3.1.1 DESCRIPCIÓN DE LA INSTITUCIÓN 82*](#311-descripción-de-la-institución)

[*3.1.2 ORGANIZACIÓN DEL PROCESO ACADÉMICO 83*](#312-organización-del-proceso-académico)

[*3.1.3 ACTORES INVOLUCRADOS EN LA GESTIÓN ACADÉMICA 84*](#313-actores-involucrados-en-la-gestión-académica)

[*3.1.4 HERRAMIENTAS UTILIZADAS ACTUALMENTE 85*](#314-herramientas-utilizadas-actualmente)

[*3.1.5 FUENTES DE INFORMACIÓN ACADÉMICA EXISTENTES 86*](#315-fuentes-de-información-académica-existentes)

[3.2 DIAGNÓSTICO DEL PROCESO ACTUAL 87](#32-diagnóstico-del-proceso-actual)

[*3.2.1 PROCESO ACTUAL DE REGISTRO DE INFORMACIÓN ESTUDIANTIL 87*](#321-proceso-actual-de-registro-de-información-estudiantil)

[*3.2.2 PROCESO ACTUAL DE ACTUALIZACIÓN DE INFORMACIÓN 87*](#322-proceso-actual-de-actualización-de-información)

[*3.2.3 PROCESO ACTUAL DE REGISTRO DE CALIFICACIONES 88*](#323-proceso-actual-de-registro-de-calificaciones)

[*3.2.4 PROCESO ACTUAL DE CONTROL DE ASISTENCIA 89*](#324-proceso-actual-de-control-de-asistencia)

[*3.2.5 PROCESO ACTUAL DE SEGUIMIENTO ACADÉMICO 89*](#325-proceso-actual-de-seguimiento-académico)

[*3.2.6 PROCESO ACTUAL DE TRANSFERENCIA DE INFORMACIÓN AL SIE 90*](#326-proceso-actual-de-transferencia-de-información-al-sie)

[*3.2.7 COMUNICACIÓN ACTUAL CON PADRES Y TUTORES 90*](#327-comunicación-actual-con-padres-y-tutores)

[*3.2.8 PROBLEMAS Y NECESIDADES IDENTIFICADAS 91*](#328-problemas-y-necesidades-identificadas)

[3.3 RESULTADOS DEL LEVANTAMIENTO DE INFORMACIÓN 92](#33-resultados-del-levantamiento-de-información)

[*3.3.1 RESULTADOS DE ENTREVISTAS Y CUESTIONARIOS 92*](#331-resultados-de-entrevistas-y-cuestionarios)

[*3.3.2 RESULTADOS DE LA OBSERVACIÓN DIRECTA 93*](#332-resultados-de-la-observación-directa)

[*3.3.3 RESULTADOS DEL ANÁLISIS DOCUMENTAL 93*](#333-resultados-del-análisis-documental)

[*3.3.4 IDENTIFICACIÓN DE DUPLICIDAD E INCONSISTENCIAS 94*](#334-identificación-de-duplicidad-e-inconsistencias)

[*3.3.5 IDENTIFICACIÓN DE CARGA OPERATIVA 94*](#335-identificación-de-carga-operativa)

[*3.3.6 NECESIDADES DE LOS USUARIOS 95*](#336-necesidades-de-los-usuarios)

[3.4 MODELADO DEL PROCESO ACTUAL Y PROPUESTO 95](#34-modelado-del-proceso-actual-y-propuesto)

[*3.4.1 MODELO DEL PROCESO ACADÉMICO ACTUAL 95*](#341-modelo-del-proceso-académico-actual)

[*3.4.2 IDENTIFICACIÓN DE PUNTOS CRÍTICOS 95*](#342-identificación-de-puntos-críticos)

[*3.4.3 MODELO DEL PROCESO ACADÉMICO PROPUESTO 96*](#343-modelo-del-proceso-académico-propuesto)

[*3.4.4 COMPARACIÓN ENTRE EL PROCESO ACTUAL Y EL PROCESO PROPUESTO 97*](#344-comparación-entre-el-proceso-actual-y-el-proceso-propuesto)

[3.5 ACTORES Y ROLES DEL SISTEMA 97](#35-actores-y-roles-del-sistema)

[*3.5.1 PERSONAL ADMINISTRATIVO 97*](#351-personal-administrativo)

[*3.5.2 DIRECCIÓN 97*](#352-dirección)

[*3.5.3 DOCENTES 98*](#353-docentes)

[*3.5.4 PADRES Y TUTORES 98*](#354-padres-y-tutores)

[*3.5.5 MATRIZ DE ROLES Y PERMISOS 98*](#355-matriz-de-roles-y-permisos)

[3.6 DEFINICIÓN DE REQUERIMIENTOS 99](#36-definición-de-requerimientos)

[*3.6.1 REQUERIMIENTOS FUNCIONALES 102*](#361-requerimientos-funcionales)

[*3.6.1.1 Gestión de usuarios y autenticación 102*](#3611-gestión-de-usuarios-y-autenticación)

[*3.6.1.2 Gestión de estudiantes 102*](#3612-gestión-de-estudiantes)

[*3.6.1.3 Gestión académica 102*](#3613-gestión-académica)

[*3.6.1.4 Gestión de calificaciones 102*](#3614-gestión-de-calificaciones)

[*3.6.1.5 Gestión de asistencia 102*](#3615-gestión-de-asistencia)

[*3.6.1.6 Seguimiento y alertas 103*](#3616-seguimiento-y-alertas)

[*3.6.1.7 Reportes e historiales académicos 103*](#3617-reportes-e-historiales-académicos)

[*3.6.1.8 Aplicación móvil para padres y tutores 103*](#3618-aplicación-móvil-para-padres-y-tutores)

[*3.6.1.9 Sincronización con el SIE 103*](#3619-sincronización-con-el-sie)

[*3.6.1.10 Auditoría y trazabilidad 103*](#36110-auditoría-y-trazabilidad)

[*3.6.2 REQUERIMIENTOS NO FUNCIONALES 104*](#362-requerimientos-no-funcionales)

[*3.6.2.1 Seguridad 105*](#3621-seguridad)

[*3.6.2.2 Rendimiento 105*](#3622-rendimiento)

[*3.6.2.3 Disponibilidad 105*](#3623-disponibilidad)

[*3.6.2.4 Usabilidad 105*](#3624-usabilidad)

[*3.6.2.5 Mantenibilidad 106*](#3625-mantenibilidad)

[*3.6.2.6 Fiabilidad 106*](#3626-fiabilidad)

[*3.6.3 REGLAS DE NEGOCIO 106*](#363-reglas-de-negocio)

[*3.6.4 CRITERIOS DE ACEPTACIÓN 107*](#364-criterios-de-aceptación)

[*3.6.5 MATRIZ DE TRAZABILIDAD DE REQUERIMIENTOS 108*](#365-matriz-de-trazabilidad-de-requerimientos)

[3.7 MODELADO FUNCIONAL DEL SISTEMA 109](#37-modelado-funcional-del-sistema)

[*3.7.1 DIAGRAMA GENERAL DE CASOS DE USO 109*](#371-diagrama-general-de-casos-de-uso)

[*3.7.2 ESPECIFICACIÓN DE CASOS DE USO 110*](#372-especificación-de-casos-de-uso)

[*3.7.3 HISTORIAS DE USUARIO 111*](#373-historias-de-usuario)

[*3.7.4 DIAGRAMAS DE ACTIVIDADES 112*](#374-diagramas-de-actividades)

[*3.7.5 DIAGRAMAS DE SECUENCIA 112*](#375-diagramas-de-secuencia)

[3.8 DISEÑO DE LA ARQUITECTURA DE LA SOLUCIÓN 113](#38-diseño-de-la-arquitectura-de-la-solución)

[*3.8.1 VISTA DE CONTEXTO DEL SISTEMA 113*](#381-vista-de-contexto-del-sistema)

[*3.8.2 VISTA DE CONTENEDORES 114*](#382-vista-de-contenedores)

[*3.8.3 COMPONENTES PRINCIPALES 115*](#383-componentes-principales)

[*3.8.4 ARQUITECTURA DEL BACKEND 116*](#384-arquitectura-del-backend)

[*3.8.5 ARQUITECTURA DE LA PLATAFORMA WEB 117*](#385-arquitectura-de-la-plataforma-web)

[*3.8.6 ARQUITECTURA DE LA APLICACIÓN MÓVIL 117*](#386-arquitectura-de-la-aplicación-móvil)

[*3.8.7 ORGANIZACIÓN DEL MONOLITO MODULAR 117*](#387-organización-del-monolito-modular)

[*3.8.8 APLICACIÓN DE ARQUITECTURA LIMPIA 118*](#388-aplicación-de-arquitectura-limpia)

[*3.8.9 APLICACIÓN DE DISEÑO ORIENTADO AL DOMINIO 118*](#389-aplicación-de-diseño-orientado-al-dominio)

[3.9 DISEÑO DEL MODELO DE DATOS 119](#39-diseño-del-modelo-de-datos)

[*3.9.1 IDENTIFICACIÓN DE ENTIDADES DEL DOMINIO 119*](#391-identificación-de-entidades-del-dominio)

[*3.9.2 MODELO ENTIDAD-RELACIÓN 120*](#392-modelo-entidad-relación)

[*3.9.3 MODELO RELACIONAL 123*](#393-modelo-relacional)

[*3.9.4 INTEGRIDAD DE LOS REGISTROS ACADÉMICOS 123*](#394-integridad-de-los-registros-académicos)

[*3.9.5 DISEÑO DE AUDITORÍA Y TRAZABILIDAD 124*](#395-diseño-de-auditoría-y-trazabilidad)

[3.10 DISEÑO DEL MECANISMO DE SINCRONIZACIÓN CON EL SIE 124](#310-diseño-del-mecanismo-de-sincronización-con-el-sie)

[*3.10.1 RESTRICCIONES DE INTEROPERABILIDAD IDENTIFICADAS 124*](#3101-restricciones-de-interoperabilidad-identificadas)

[*3.10.2 ARQUITECTURA DEL MÓDULO DE AUTOMATIZACIÓN 125*](#3102-arquitectura-del-módulo-de-automatización)

[*3.10.3 FLUJO DE SINCRONIZACIÓN DE INFORMACIÓN 125*](#3103-flujo-de-sincronización-de-información)

[*3.10.4 PROCESAMIENTO ASÍNCRONO DE SOLICITUDES 126*](#3104-procesamiento-asíncrono-de-solicitudes)

[*3.10.5 ESTADOS DEL PROCESO DE SINCRONIZACIÓN 126*](#3105-estados-del-proceso-de-sincronización)

[*3.10.6 VERIFICACIÓN DE INFORMACIÓN REGISTRADA EN EL SIE 127*](#3106-verificación-de-información-registrada-en-el-sie)

[*3.10.7 CONCILIACIÓN ENTRE INFORMACIÓN LOCAL Y SIE 128*](#3107-conciliación-entre-información-local-y-sie)

[*3.10.8 GESTIÓN DE ERRORES Y REINTENTOS 128*](#3108-gestión-de-errores-y-reintentos)

[*3.10.9 TRAZABILIDAD Y AUDITORÍA DE SINCRONIZACIONES 129*](#3109-trazabilidad-y-auditoría-de-sincronizaciones)

[*3.10.10 COMUNICACIÓN DEL PROGRESO EN TIEMPO REAL 129*](#31010-comunicación-del-progreso-en-tiempo-real)

[3.11 DISEÑO DE INTERFACES 130](#311-diseño-de-interfaces)

[*3.11.1 LINEAMIENTOS DE EXPERIENCIA DE USUARIO 130*](#3111-lineamientos-de-experiencia-de-usuario)

[*3.11.2 PROTOTIPOS DE LA PLATAFORMA WEB 130*](#3112-prototipos-de-la-plataforma-web)

[*3.11.3 PROTOTIPOS DE LA APLICACIÓN MÓVIL 131*](#3113-prototipos-de-la-aplicación-móvil)

[*3.11.4 DISEÑO DE LA PANTALLA DE AUDITORÍA SIE 131*](#3114-diseño-de-la-pantalla-de-auditoría-sie)

[*3.11.5 DISEÑO DE ALERTAS Y NOTIFICACIONES 132*](#3115-diseño-de-alertas-y-notificaciones)

[3.12 DISEÑO DE SEGURIDAD 132](#312-diseño-de-seguridad)

[*3.12.1 AUTENTICACIÓN 132*](#3121-autenticación)

[*3.12.2 ROLES Y PERMISOS 132*](#3122-roles-y-permisos)

[*3.12.3 PROTECCIÓN DE INFORMACIÓN ESTUDIANTIL 133*](#3123-protección-de-información-estudiantil)

[*3.12.4 SEGURIDAD DE CREDENCIALES DEL SIE 133*](#3124-seguridad-de-credenciales-del-sie)

[*3.12.5 REGISTRO DE OPERACIONES SENSIBLES 134*](#3125-registro-de-operaciones-sensibles)

[3.13 MARCO JURÍDICO Y MODALIDADES DE LICENCIAMIENTO 135](#313-marco-jurídico-y-modalidades-de-licenciamiento)

[*3.13.1 SOFTWARE LIBRE EN LA LEY N.° 164 Y SU REGLAMENTACIÓN 135*](#3131-software-libre-en-la-ley-n-164-y-su-reglamentación)

[*3.13.2 VIGENCIA DEL D.S. N.° 4260 136*](#3132-vigencia-del-ds-n-4260)

[*3.13.3 GRATUIDAD EDUCATIVA Y COSTO DEL SOFTWARE 136*](#3133-gratuidad-educativa-y-costo-del-software)

[*3.13.4 DERECHO DE AUTOR, CONTRATOS Y OBRA POR ENCARGO 137*](#3134-derecho-de-autor-contratos-y-obra-por-encargo)

[*3.13.5 APLICACIÓN AL PROYECTO 137*](#3135-aplicación-al-proyecto)

[3.14 ESTIMACIÓN DEL COSTO DE DESARROLLO DE SOFTWARE ACADÉMICO EN BOLIVIA\
138](#314-estimación-del-costo-de-desarrollo-de-software-académico-en-bolivia)

[*3.14.1 FUENTES Y CRITERIO DE CÁLCULO 138*](#3141-fuentes-y-criterio-de-cálculo)

[*3.14.2 VALORACIÓN DEL TRABAJO DE DESARROLLO 139*](#3142-valoración-del-trabajo-de-desarrollo)

[*3.14.3 INFRAESTRUCTURA Y COSTO DEL PRIMER AÑO 139*](#3143-infraestructura-y-costo-del-primer-año)

[*3.14.4 LECTURA Y LÍMITES DE LA ESTIMACIÓN 139*](#3144-lectura-y-límites-de-la-estimación)

[3.15 PLAN DE DESARROLLO 140](#315-plan-de-desarrollo)

[*3.15.1 ORGANIZACIÓN DEL TRABAJO POR INCREMENTOS 140*](#3151-organización-del-trabajo-por-incrementos)

[*3.15.2 ALCANCE DE LOS INCREMENTOS 141*](#3152-alcance-de-los-incrementos)

[*3.15.3 CRITERIOS DE ACEPTACIÓN 141*](#3153-criterios-de-aceptación)

[*3.15.4 DEFINICIÓN DE TERMINADO 142*](#3154-definición-de-terminado)

[*3.15.5 COMPARATIVA Y SELECCIÓN DE TECNOLOGÍAS 143*](#3155-comparativa-y-selección-de-tecnologías)

[*3.15.5.1 BASE DE LA PONDERACIÓN 143*](#31551-base-de-la-ponderación)

[*3.15.5.2 CAPA DE PRESENTACIÓN WEB 144*](#31552-capa-de-presentación-web)

[*3.15.5.3 CAPA DE BACKEND 145*](#31553-capa-de-backend)

[*3.15.5.4 CAPA MÓVIL 147*](#31554-capa-móvil)

[*3.15.5.5 CAPA DE PERSISTENCIA 147*](#31555-capa-de-persistencia)

[*3.15.5.6 CAPA DE PROCESAMIENTO ASÍNCRONO 149*](#31556-capa-de-procesamiento-asíncrono)

[*3.15.5.7 CAPA DE INTEGRACIÓN CON EL SIE 150*](#31557-capa-de-integración-con-el-sie)

[*3.15.5.8 CAPA DE COMUNICACIÓN EN TIEMPO REAL 151*](#31558-capa-de-comunicación-en-tiempo-real)

[*3.15.5.9 ARQUITECTURA DE DESPLIEGUE 152*](#31559-arquitectura-de-despliegue)

[**CRONOGRAMA 154**](#cronograma)

[**REFERENCIAS BIBLIOGRÁFICAS 155**](#referencias-bibliográficas)

[**ANEXOS 164**](#anexos)

**ÍNDICE DE FIGURAS**

[Figura 1. Diagrama de Árbol de Problemas 3](#tg_figure_1)

[Figura 2. Diagrama de Ishikawa de las causas del problema de gestión académica\
5](#tg_figure_ishikawa)

[Figura 3. Diagrama de arquitectura 10](#tg_figure_2)

[Figura 3.1. Diagrama general de casos de uso 110](#tg_figure_2_1)

[Figura 3.2. Secuencia de sincronización y verificación SIE 113](#tg_figure_2_2)

[Figura 3.3. Vista de contexto del sistema 114](#tg_figure_2_3)

[Figura 3.4. Vista de contenedores de la solución 115](#tg_figure_2_4)

[Figura 3.5. Modelo entidad-relación conceptual 121](#tg_figure_2_5)

[Figura 3.6. Modelo entidad-relación general del sistema académico 195](#tg_figure_2_6)

[Figura L.1. Diagrama general de procesos académicos y sincronización con el SIE\
194](#tg_fig_l1)

**ÍNDICE DE ANEXOS**

[Anexo A. CUESTIONARIO A LA DIRECTORA DEL COLEGIO COMUNIDAD CRISTIANA\
164](#tg_annex_a)

[Anexo B. CARTA DE AUTORIZACIÓN Y CERTIFICACIÓN INSTITUCIONAL\
166](#anexo_b)

[Anexo C. CERTIFICACIÓN DE POBLACIÓN Y PERSONAL PARTICIPANTE\
167](#anexo_c)

[Anexo D. CERTIFICACIÓN DE PROCESOS, HERRAMIENTAS Y DUPLICIDAD DE REGISTROS\
168](#anexo_d)

[Anexo E. CERTIFICACIÓN DE TIEMPOS OPERATIVOS Y CONSUMO DE RECURSOS\
169](#anexo_e)

[Anexo F. ACTA DE VALIDACIÓN DEL DIAGNÓSTICO Y PROCESO ACTUAL\
170](#anexo_f)

[Anexo G. ACTA DE VALIDACIÓN DE REQUERIMIENTOS, ROLES Y REGLAS DE NEGOCIO\
171](#anexo_g)

[Anexo H. CARTA DE AUTORIZACIÓN PARA TRATAMIENTO DE DATOS Y PRUEBAS CON EL SIE\
172](#anexo_h)

[Anexo I. CONSTANCIAS INDIVIDUALES DE PARTICIPACIÓN EN EL LEVANTAMIENTO DE INFORMACIÓN\
173](#anexo_i)

[Anexo J. ACTA DE ACEPTACIÓN Y VALIDACIÓN FINAL DEL SISTEMA\
175](#anexo_j)

[ANEXO K. REQUERIMIENTOS DE USUARIO 176](#anexo-k-requerimientos-de-usuario)

[ANEXO L. DIAGRAMA GENERAL DE PROCESOS ACADÉMICOS Y SINCRONIZACIÓN CON EL SIE\
194](#anexo-l-diagrama-general-de-procesos-académicos-y-sincronización-con-el-sie)

[Anexo M. MODELO ENTIDAD-RELACIÓN GENERAL DEL SISTEMA ACADÉMICO\
195](#anexo-m-modelo-entidad-relación-general-del-sistema-académico)

**ÍNDICE DE TABLAS**

[Tabla 1. Cronograma de desarrollo 154](#tg_table_1)

[Tabla 2.1. Comparación de referentes del estado del arte 76](#tg_table_2_1_state_art)

[Tabla 2.2. Elementos solicitados, respaldo documental y evidencia institucional requerida\
79](#tg_table_2_2_state_requirements)

[Tabla 3.1. Fuentes de información académica y tratamiento propuesto\
86](#tg_table_2_1)

[Tabla 3.2. Problemas, efectos y respuesta de diseño 91](#tg_table_2_2)

[Tabla 3.3. Matriz de roles y permisos propuesta 98](#tg_table_2_3)

[Tabla 3.4. Requerimientos funcionales propuestos 100](#tg_table_2_4)

[Tabla 3.5. Requerimientos no funcionales 104](#tg_table_2_5)

[Tabla 3.6. Reglas de negocio 106](#tg_table_2_6)

[Tabla 3.7. Criterios de aceptación representativos 108](#tg_table_2_7)

[Tabla 3.8. Matriz resumida de trazabilidad 109](#tg_table_2_8)

[Tabla 3.9. Especificación resumida de casos de uso 110](#tg_table_2_9)

[Tabla 3.10. Historias de usuario prioritarias 111](#tg_table_2_10)

[Tabla 3.11. Contenedores y componentes arquitectónicos 115](#tg_table_2_11)

[Tabla 3.12. Entidades principales del dominio 119](#tg_table_2_12)

[Tabla 3.13. Estados del proceso SIE 127](#tg_table_2_13)

[Tabla 3.14. Controles de seguridad propuestos 135](#tg_table_2_14)

[Tabla 3.15. Matriz de alcance jurídico aplicable al proyecto 137](#tg_table_3_15)

[Tabla 3.16. Fuentes económicas empleadas en la estimación 138](#tg_table_3_16)

[Tabla 3.17. Estimación del valor económico del desarrollo 139](#tg_table_3_17)

[Tabla 3.18. Escenario económico referencial del primer año 139](#tg_table_3_18)

[Tabla 3.19. Plan de desarrollo por incrementos 140](#tg_table_2_15)

[Tabla 3.20. Criterios, pesos y evidencia del ranking tecnológico 143](#tg_table_3_20_v2)

[Tabla 3.21. Comparación detallada para React 144](#tg_table_tech_3_21_v2)

[Tabla 3.22. Comparación detallada para TypeScript 145](#tg_table_tech_3_22_v2)

[Tabla 3.23. Comparación detallada para Node.js 145](#tg_table_tech_3_23_v2)

[Tabla 3.24. Comparación detallada para NestJS 146](#tg_table_tech_3_24_v2)

[Tabla 3.25. Comparación detallada para Flutter 147](#tg_table_tech_3_25_v2)

[Tabla 3.26. Comparación detallada para PostgreSQL 148](#tg_table_tech_3_26_v2)

[Tabla 3.27. Comparación detallada para Prisma ORM 148](#tg_table_tech_3_27_v2)

[Tabla 3.28. Comparación detallada para Redis 149](#tg_table_tech_3_28_v2)

[Tabla 3.29. Comparación detallada para BullMQ 150](#tg_table_tech_3_29_v2)

[Tabla 3.30. Comparación detallada para Puppeteer 150](#tg_table_tech_3_30_v2)

[Tabla 3.31. Comparación detallada para WebSocket 151](#tg_table_tech_3_31_v2)

[Tabla 3.32. Comparación detallada para Monolito modular 152](#tg_table_tech_3_32_v2)

# LISTA DE SIGLAS Y ABREVIATURAS

AF: Adecuación funcional dentro del ranking tecnológico

AGETIC: Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación

API: Interfaz de Programación de Aplicaciones

AS-IS: Estado actual del proceso

ASVS: Estándar de Verificación de Seguridad de Aplicaciones

BPMN: Modelo y Notación de Procesos de Negocio

CE: Compatibilidad con el ecosistema tecnológico

CO: Costo total de adopción y operación

CPE: Constitución Política del Estado

CRUD: Crear, leer, actualizar y eliminar

D.S.: Decreto Supremo

DDD: Diseño Orientado al Dominio

ER: Entidad-Relación

FK: Clave foránea

HTTP: Protocolo de Transferencia de Hipertexto

HTTPS: Protocolo seguro de transferencia de hipertexto

IEEE: Instituto de Ingenieros Eléctricos y Electrónicos

IN: Integración y soporte del ecosistema

ISO/IEC/IEEE: Organismos internacionales de normalización y estándares

JSON: Notación de Objetos de JavaScript

MD: Mantenibilidad de la solución

NIST: Instituto Nacional de Estándares y Tecnología

ORM: Mapeo Objeto-Relacional

OWASP: Open Worldwide Application Security Project

PAC: Programa Anual de Contrataciones

PK: Clave primaria

REST: Transferencia de Estado Representacional

RPA: Automatización Robótica de Procesos

RUDE: Registro Único de Estudiantes

SENAPI: Servicio Nacional de Propiedad Intelectual

SICOES: Sistema de Contrataciones Estatales

SIE: Sistema de Información Educativa

SIGED: Sistemas de Información y Gestión Educativa

SQL: Lenguaje de Consulta Estructurado

SSE: Eventos enviados por el servidor

TLS: Seguridad de la Capa de Transporte

UI: Interfaz de Usuario

UML: Lenguaje Unificado de Modelado

URL: Localizador Uniforme de Recursos

UX: Experiencia de Usuario

WAI: Iniciativa de Accesibilidad Web

WCAG: Pautas de Accesibilidad para el Contenido Web

XML: Lenguaje de Marcado Extensible

# CAPÍTULO I MARCO INTRODUCTORIO

## 1.1 INTRODUCCIÓN

En una institución educativa, un dato académico pasa por varias manos: se registra, se corrige, se consolida y se comunica. Cuando cada etapa se apoya en archivos separados, el problema no se limita al tiempo empleado; también se vuelve difícil saber cuál es la versión válida y quién modificó un registro.

La situación aparece en distintos sistemas educativos de la región. Un diagnóstico de 16 sistemas de América Latina y el Caribe describe niveles iniciales de transformación digital y la coexistencia de papel, planillas aisladas y registros fragmentados ([Arias Ortiz et al., 2021](#tg_ref_existing_307e010f1326)). Esa combinación favorece la duplicidad de tareas, vuelve más lento el seguimiento y deja más puntos expuestos a errores de transcripción.

En el Colegio Comunidad Cristiana de Santa Cruz de la Sierra, el diagnóstico preliminar apunta a dificultades en el registro, la actualización, el seguimiento y la consolidación de datos estudiantiles. Parte de la información debe volver a registrarse en plataformas distintas, lo que aumenta la carga operativa del personal y complica la conciliación de los datos.

El proyecto examina esos procesos antes de proponer una herramienta. La intención no es digitalizar una práctica sin entenderla, sino localizar los puntos en que se duplican actividades, se pierde trazabilidad o se requiere una comprobación manual.

El trabajo se sitúa en la Ingeniería de Software y combina diagnóstico institucional, especificación de requerimientos, diseño de arquitectura, modelado de datos y planificación de pruebas. La solución se formula como una propuesta verificable; los resultados de una implementación completa quedan sujetos a la construcción y validación previstas.

## 1.2 ANTECEDENTES DEL PROBLEMA

La incorporación de sistemas de gestión de información académica permite ordenar el registro, el almacenamiento, la actualización y el seguimiento de los datos estudiantiles. La mejora no consiste en digitalizar una práctica sin examinarla: exige definir procesos, responsabilidades y controles que puedan comprobarse ([Sommerville, 2020](#tg_ref_existing_d6b4d5adf7d0)). En el ámbito regional existen plataformas para asistencia, historiales, calificaciones y comunicación con las familias; el SIAGIE del Ministerio de Educación del Perú constituye una referencia institucional para ese tipo de servicios.

También se observan soluciones privadas orientadas a la gestión escolar, como SieWeb, que reúne funciones de matrícula, seguimiento y comunicación en una plataforma web. Estas referencias ayudan a delimitar el problema, pero no sustituyen el diagnóstico propio del Colegio Comunidad Cristiana ni autorizan a trasladar sus funciones sin revisar sus requisitos.

En el contexto boliviano, el Ministerio de Educación dispone del Sistema de Información Educativa (SIE), plataforma destinada al registro y consolidación de información académica oficial de las unidades educativas, la cual se rige bajo los lineamientos institucionales y reglamentos de administración de datos vigentes (Ministerio de Educación del Estado Plurinacional de Bolivia, 2015). Sin embargo, el proceso de registro y actualización de información académica en el Sistema de Información Educativa (SIE) requiere la intervención manual del personal responsable para la carga de determinados datos. Esta situación genera duplicidad de trabajo y aumenta la probabilidad de errores durante el proceso de reporte de información académica.

## 1.3 PLANTEAMIENTO DEL PROBLEMA

En la versión disponible del diagnóstico, el cuestionario respondido por la directora y la documentación institucional describen dificultades de registro, actualización y seguimiento de la información académica (véase Anexo A). Esa evidencia orienta el diseño, pero no se presenta como una medición estadística de todo el personal mientras los demás instrumentos permanezcan pendientes de certificación.

La normativa educativa asigna responsabilidades sobre la calidad y oportunidad de la información que se reporta. El problema, entonces, tiene dos caras: la carga cotidiana de capturar y revisar datos, y el riesgo institucional de remitir información incompleta, duplicada o desactualizada.

<a id="tg_figure_1"></a>Figura 1**.** Diagrama de Árbol de Problemas

**Fuente:** Elaboración propia, 2026

El árbol de problemas resume la situación observada; el diagrama de Ishikawa ordena sus posibles causas para que el diagnóstico no confunda síntomas con orígenes. Las ramas reúnen factores de personas, procesos, tecnología, datos, gestión y entorno normativo que inciden en la duplicidad, los retrasos y las inconsistencias de los registros académicos.

<a id="tg_figure_ishikawa"></a>Figura 2. Diagrama de Ishikawa de las causas del problema de gestión académica

Fuente: Elaboración propia, 2026, a partir del diagnóstico institucional ([Anexo A](#tg_annex_a)) y del proceso académico documentado ([Anexo L](#anexo-l-diagrama-general-de-procesos-académicos-y-sincronización-con-el-sie)).

Las ramas no expresan todavía una frecuencia estadística ni prueban por sí solas causalidad. La institución deberá validar cada afirmación mediante acta o certificación cuando se use como evidencia definitiva: quién vuelve a capturar datos, en qué etapa ocurre, cuántos registros se corrigen, qué permisos se aplican y qué indisponibilidades del SIE afectaron el trabajo.

## 1.4 FORMULACIÓN DEL PROBLEMA

¿De qué manera las dificultades de registro, actualización y seguimiento académico, junto con la limitada integración con el Sistema de Inscripción Estudiantil, afectan la integridad de los registros del Colegio Comunidad Cristiana de Santa Cruz de la Sierra?

## 1.5 OBJETO DE ESTUDIO

El objeto de estudio está constituido por los procesos de gestión académica del Colegio Comunidad Cristiana, en particular el registro, la actualización, el seguimiento y la sincronización de los datos estudiantiles que deben utilizarse en la operación institucional y, cuando corresponda, en el Sistema de Información Educativa.

## 1.6 OBJETIVOS

### 1.6.1 OBJETIVO GENERAL

Desarrollar un sistema de gestión académica para los procesos de registro, actualización, seguimiento y sincronización de la información con el Sistema de Inscripción Estudiantil, mediante la aplicación de Arquitectura Limpia y Diseño Orientado al Dominio, en el Colegio Comunidad Cristiana de la ciudad de Santa Cruz de la Sierra.

### 1.6.2 OBJETIVOS ESPECÍFICOS

1. Analizar los procesos actuales de gestión de la información académica del Colegio Comunidad Cristiana para identificar las causas de la duplicidad de registros, los errores asociados al manejo de datos estudiantiles y determinar los requerimientos funcionales y no funcionales del sistema.
2. Diseñar la arquitectura, el modelo de datos y los componentes funcionales del sistema de gestión académica de acuerdo con los requerimientos identificados y las necesidades operativas de la institución con el uso de Arquitectura limpia y Diseño Orientado al Dominio.
3. Construir los módulos del sistema de gestión académica para los procesos de registro, actualización, seguimiento de la información estudiantil conforme a los requerimientos establecidos y mecanismos de interoperabilidad como la automatización robótica de procesos y navegación web en segundo plano para la sincronización de información académica con el Sistema de Información Educativa.

1. Evaluar el funcionamiento del sistema mediante pruebas de validación y aceptación de usuarios para verificar la reducción de errores y la mejora en los procesos de gestión de la información académica.

## 1.7 JUSTIFICACIÓN

### 1.7.1 JUSTIFICACIÓN TÉCNICA

La presente propuesta se justifica técnicamente porque plantea la implementación de un sistema de gestión de información académica que permitirá centralizar el registro, almacenamiento, actualización y consulta de la información estudiantil en una única plataforma. La centralización de la información constituye una alternativa tecnológica adecuada para mejorar la organización de los registros académicos y reducir las inconsistencias derivadas del manejo de datos en múltiples medios o fuentes de información. Desde el punto de vista de la ingeniería de software, los sistemas de gestión académica facilitan el control y seguimiento de la información mediante mecanismos de validación, almacenamiento estructurado y acceso controlado a los datos, permitiendo mantener registros consistentes y actualizados durante los procesos académicos. Asimismo, la disponibilidad de información en tiempo real favorece la consulta oportuna de los registros por parte de los usuarios autorizados y contribuye a mejorar la trazabilidad de la información estudiantil.

De igual manera, la propuesta contempla mecanismos de interoperabilidad para la sincronización de información con el Sistema de Información Educativa (SIE), permitiendo disminuir la necesidad de realizar registros repetitivos y reduciendo la probabilidad de errores asociados a la transcripción manual de datos. Esta característica aporta una mejora técnica al proceso de gestión de la información académica al facilitar la consistencia de los registros utilizados por la institución.

La propuesta es técnicamente viable porque articula una base de datos única, controles de integridad, una interfaz para los perfiles que intervienen en el proceso y un mecanismo de sincronización sujeto a autorización y verificación. Su pertinencia se comprobará mediante pruebas funcionales, revisión de seguridad y aceptación de usuarios.

### 1.7.2 JUSTIFICACIÓN ECONÓMICA

La presente propuesta se justifica económicamente debido a que busca reducir los recursos invertidos en las actividades de registro, actualización y control de la información académica del Colegio Comunidad Cristiana.

La justificación económica considera el tiempo destinado al registro, la consolidación y la transferencia de información académica. El cuestionario respondido por la directora señala que, durante los cierres trimestrales, estas actividades requieren más de seis horas; sin embargo, no permite establecer todavía horas por jornada, número de jornadas ni participación total del plantel. Por ello, la cuantificación económica definitiva se incorpora únicamente cuando la institución complete la certificación de tiempos operativos y su fuente de verificación (véase Anexo E).

Asimismo, el uso de documentación física representa un costo recurrente para la institución. De acuerdo con la información recopilada durante el diagnóstico (Esteves Fajardo, Garcés Garcés, Toala Santana, & Poveda Gurumendi, 2018), cada docente utiliza en promedio medio paquete de papel bond de 500 hojas por mes para actividades relacionadas con registros académicos, formularios y documentación de seguimiento estudiantil. Considerando un costo aproximado de Bs. 37 por paquete (Librería IRBE, 2026), el consumo mensual de los dieciséis docentes representa un gasto cercano a Bs. 296. Proyectado a los diez meses de actividad académica de una gestión escolar, el gasto estimado alcanza aproximadamente Bs. 2.960, equivalente al uso de 80 paquetes de papel o alrededor de 40.000 hojas impresas. Esta situación evidencia la existencia de costos operativos asociados al manejo de documentación física que podrían reducirse  mediante la digitalización y centralización de la información académica.

Adicionalmente, la duplicidad de registros y la transcripción manual de información incrementan la probabilidad de errores en los datos académicos, generando la necesidad de realizar correcciones, verificaciones y reprocesamientos que demandan tiempo adicional por parte del personal responsable.

Ante esta situación, la implementación de un sistema de gestión académica permitirá centralizar la información en una única plataforma, reducir la dependencia de documentación física y disminuir la duplicidad de actividades relacionadas con el registro de información estudiantil. Como consecuencia, se espera una utilización más eficiente de los recursos institucionales y una reducción de los costos asociados a los procesos académicos desarrollados actualmente en la institución.

### 1.7.3 JUSTIFICACIÓN SOCIAL

La presente propuesta se justifica socialmente porque contribuirá a mejorar la gestión y disponibilidad de la información académica dentro del Colegio Comunidad Cristiana, beneficiando directamente a docentes, estudiantes y padres de familia.

Para los docentes, la implementación del sistema permitirá reducir el tiempo destinado a actividades repetitivas relacionadas con el registro, actualización y consulta de información académica. Esto favorecerá una mejor distribución de sus actividades laborales, permitiéndoles dedicar mayor atención al seguimiento académico de los estudiantes y a las actividades propias del proceso educativo.

Para los padres de familia, la disponibilidad de información académica organizada y actualizada facilitará el acceso oportuno a datos relacionados con el desempeño y asistencia de sus hijos, fortaleciendo su participación y acompañamiento en el proceso formativo.

En el caso de los estudiantes, la mejora en la organización y control de la información académica contribuirá a que los registros relacionados con calificaciones, asistencia y seguimiento académico sean gestionados de manera más confiable, reduciendo la probabilidad de inconsistencias derivadas de procesos manuales. Asimismo, la comunidad educativa en general se beneficiará al contar con una herramienta que favorezca una comunicación más eficiente entre los diferentes actores involucrados en el proceso educativo, promoviendo una gestión académica más organizada y orientada al acceso oportuno de la información.

## 1.8 DELIMITACIÓN DE LA INVESTIGACIÓN

### 1.8.1 TEMÁTICA

La presente investigación se delimita al área de la Ingeniería de Software aplicada a los sistemas de gestión académica en instituciones educativas. El estudio se centra en la gestión de información académica, particularmente en los procesos de registro, almacenamiento, actualización, seguimiento e intercambio de datos académicos vinculados al control de la información estudiantil.

### 1.8.2 ESPACIAL

La investigación se desarrolla en la Unidad Educativa Comunidad Cristiana B, código SIE N.° 81981191, turno mañana, ubicada en Santa Cruz de la Sierra, Bolivia. La institución constituye la unidad de análisis para el estudio de los procesos de gestión de información académica y la validación de la propuesta (véase Anexo B).

### 1.8.3 TEMPORAL

La presente investigación se lleva a cabo durante la gestión 2026 con inicio en el mes de junio y fecha tentativa de cierre en noviembre del mismo año.

## 1.9 PROPUESTA DE SOLUCIÓN AL PLANTEAMIENTO DEL PROBLEMA

La solución plantea el desarrollo de un sistema de gestión de información académica compuesto por una plataforma web administrativa y una aplicación móvil orientada a los padres de familia y tutores, diseñada bajo los principios de Arquitectura Limpia y Diseño Orientado al Dominio, con el fin de mejorar la integridad, el registro, la actualización y el seguimiento académico en el Colegio Comunidad Cristiana.

La plataforma web permitirá al personal administrativo y docente centralizar la administración de calificaciones, control de asistencia e historiales académicos en una base de datos relacional única, reduciendo la duplicidad de información y minimizando los errores derivados de los procesos manuales. Por su parte, la aplicación móvil facilitará el acceso oportuno de los padres de familia a los reportes de desempeño y alertas tempranas, optimizando la comunicación institucional.

Con respecto a la integración con el entorno estatal, y reconociendo que el Sistema de Información Educativa de Bolivia no dispone de una API pública, servicios web abiertos ni documentación técnica de interoperabilidad oficial, la sincronización de datos no se realizará mediante métodos de conexión tradicionales. En su lugar, la solución técnica incorporará un módulo de Automatización Robótica de Procesos estructurado mediante técnicas de navegación web en segundo plano.

Este componente se diseña para ejecutar, en un entorno autorizado, rutinas controladas de autenticación, lectura de formularios, transferencia y verificación posterior de la información definida en el alcance. La automatización busca disminuir la recaptura manual y reducir los errores de transcripción; no elimina por completo el riesgo, por lo que incorpora validaciones, registro de evidencias, conciliación de discrepancias y tratamiento de fallos.

La arquitectura constituye una hipótesis técnica de solución frente a las restricciones identificadas. Su viabilidad, la mejora de la consistencia y la reducción de la carga operativa deben comprobarse mediante una prueba de concepto, pruebas funcionales y de sincronización, mediciones antes y después y aceptación de usuarios. Los resultados se documentarán en el acta de validación final cuando exista una versión evaluable (véase Anexo J).

<a id="tg_figure_2"></a>*Figura 3. Diagrama de arquitectura*

**Fuente:** Elaboración Propia, 2026

## 1.10 METODOLOGÍA

### 1.10.1 ENFOQUE Y TIPO DE INVESTIGACIÓN

La presente investigación se desarrolla bajo un enfoque mixto. Desde el enfoque cualitativo, se recopilará información mediante entrevistas, observación y análisis de los procesos académicos y administrativos del Colegio Comunidad Cristiana, con el propósito de identificar las necesidades, dificultades y requerimientos relacionados con los procesos de registro, actualización, seguimiento académico y sincronización de información estudiantil. Desde el enfoque cuantitativo, se obtendrán y analizarán datos medibles relacionados con la gestión de registros estudiantiles, tales como tiempos de procesamiento, frecuencia de errores, inconsistencias en la información, cantidad de registros procesados y resultados de encuestas aplicadas a los usuarios del sistema De acuerdo con Hernández Sampieri, Fernández Collado y Baptista Lucio (Hernández Sampieri, Fernández Collado, & Baptista Lucio, 2014). La combinación de ambos enfoques permitirá comprender de manera integral la problemática existente, sustentar los requerimientos del sistema y evaluar los beneficios obtenidos con la implementación de la propuesta tecnológica. Bajo este contexto, el proyecto cuantificará las ineficiencias operativas y la demanda técnica del personal del Colegio Comunidad Cristiana mediante la aplicación de cuestionarios estructurados con escala de Likert. Asimismo, el estudio se enmarca en el tipo descriptivo, puesto que busca especificar las propiedades, características y dinámicas de los procesos de gestión académica en la institución. La finalidad no es manipular variables experimentales, sino identificar y describir objetivamente cómo se realiza actualmente el registro de calificaciones y su posterior transcripción al SIE. Esta descripción objetiva permitirá establecer una base sólida de requerimientos funcionales para el diseño de la solución de software.

### 1.10.2 MÉTODO DE INVESTIGACIÓN

El método analítico-sintético permite separar el proceso académico en actividades observables —registro, actualización, seguimiento y transferencia— y luego relacionarlas para explicar sus dependencias. En este proyecto se emplea para localizar duplicidades, puntos de control y datos que deben conservar trazabilidad ([Bernal, 2010](#tg_ref_existing_1d1cdda4e75f)).

El método deductivo parte de conceptos generales sobre sistemas de información, arquitectura de software e interoperabilidad y los lleva al caso concreto del colegio. La deducción no sustituye el levantamiento de evidencia: sirve para formular criterios de diseño que después deben contrastarse con los procesos reales.

### 1.10.3 TÉCNICAS E INSTRUMENTOS DE INVESTIGACIÓN

La investigación utiliza técnicas de encuesta, entrevista, observación y análisis documental. Se aplicó a la directora un cuestionario estructurado con escala de Likert de siete niveles, desde «totalmente en desacuerdo» hasta «totalmente de acuerdo» (véase Anexo A). Esta respuesta se analiza como percepción de una informante clave. Las entrevistas, observaciones y demás cuestionarios sólo se incorporan como resultados cuando cuentan con constancia individual y matriz de sistematización completas (véase Anexo I).

Como complemento, la guía de entrevista estructurada se dirige a actores clave de la gestión académica para comprender el registro, el seguimiento, el control, la seguridad de la información y la interacción con el SIE. Cada aplicación debe consignar fecha, duración, función del participante y consentimiento; las respuestas se categorizan en una matriz de análisis sin atribuir al conjunto institucional opiniones obtenidas de una sola persona (véase Anexo I).

El análisis documental revisa normativa educativa, documentación institucional y registros académicos disponibles mediante fichas que identifican documento, fecha, contenido relevante y relación con los objetivos. Los datos personales se anonimizan y su acceso se limita a lo autorizado por la institución (véanse Anexos B y H).

### 1.10.4 POBLACIÓN Y MUESTRA

La población de estudio comprende a las personas que ejecutan, supervisan o administran directamente el registro, la actualización, el seguimiento y la transferencia de información estudiantil. La delimitación permite relacionar cada instrumento con las actividades que realmente conoce su participante.

La población de estudio está conformada por la totalidad del personal directivo, administrativo y el plantel docente del Colegio Comunidad Cristiana en actual ejercicio. Específicamente, está integrada por una directora, una secretaria y dieciséis docentes, haciendo un universo total de dieciocho personas.

Se prevé un censo cuando los instrumentos se apliquen al 100 % de la población certificada. Mientras la certificación y el registro de respuestas permanezcan incompletos, la muestra efectiva se reportará según las participaciones documentadas. En la versión actual se dispone de un cuestionario respondido por la directora; sus resultados no se presentan como representativos de todo el personal (véanse Anexos A, C e I).

# CAPÍTULO II MARCO TEÓRICO

El presente marco teórico establece las bases conceptuales, metodológicas y tecnológicas necesarias para el desarrollo de un sistema de gestión académica orientado al registro, actualización, seguimiento y sincronización de información estudiantil con el Sistema de Información Educativa del Estado Plurinacional de Bolivia. La fundamentación parte de la ingeniería de software y de la gestión de información académica, para posteriormente abordar los sistemas de información educativa, la interoperabilidad, la automatización de procesos, la arquitectura de software, las tecnologías de desarrollo web y móvil, las bases de datos, la seguridad, la experiencia de usuario y los mecanismos de evaluación y validación.

El enfoque adoptado responde a la naturaleza del proyecto: una solución compuesta por una plataforma web para personal de la institución educativa, una aplicación móvil destinada principalmente a padres o tutores y un mecanismo de interoperabilidad con sistemas externos. Por ello, el estudio no se limita al desarrollo de interfaces, sino que considera aspectos de integridad, trazabilidad, seguridad, auditoría, automatización y calidad de los datos. Estos elementos adquieren especial relevancia en el contexto boliviano, dado que el Ministerio de Educación utiliza el Sistema de Información Educativa y, específicamente, el Sistema Académico para administrar datos de unidades educativas, cursos, personal, inscripciones y calificaciones [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

## 2.1 FUNDAMENTOS DE INGENIERÍA DE SOFTWARE

La ingeniería de software proporciona el conjunto de conocimientos, métodos y prácticas que permiten transformar una necesidad organizacional en un producto software mantenible y verificable. El Software Engineering Body of Knowledge —SWEBOK— organiza esta disciplina en áreas como requerimientos, diseño, construcción, pruebas, mantenimiento, calidad, arquitectura y gestión de la ingeniería de software, mostrando que la construcción de un sistema profesional comprende mucho más que la programación de sus funcionalidades [(IEEE Computer Society, 2024)](#tg_ref_existing_ecf887101fba).

En el contexto del presente proyecto, la ingeniería de software permite estructurar la transición desde procesos académicos parcialmente manuales y distribuidos hacia un sistema centralizado. Esto exige identificar correctamente a los actores, comprender sus actividades, especificar los requerimientos, definir una arquitectura, implementar mecanismos de persistencia y sincronización y, finalmente, verificar mediante pruebas que la solución satisface los objetivos planteados.

### 2.1.1 PRINCIPIOS DE LA INGENIERÍA DE SOFTWARE

La ingeniería de software persigue que un sistema sea comprensible, verificable, mantenible y capaz de evolucionar. Entre sus principios se encuentra la separación de responsabilidades, que busca evitar que una única parte del sistema concentre funciones pertenecientes a diferentes áreas del negocio. El principio de responsabilidad única, formulado en el contexto de los principios SOLID, plantea que un módulo debería estar asociado a una razón coherente para cambiar; este criterio contribuye a reducir el acoplamiento y facilita la modificación independiente de diferentes partes de la aplicación [(Martin, 2014)](#tg_ref_existing_198bc1d28085).

Otro principio importante es la modularidad. Un sistema modular divide sus capacidades en unidades con responsabilidades identificables y mecanismos explícitos de comunicación. En una plataforma académica, por ejemplo, la gestión de estudiantes, la estructura académica, las calificaciones, la asistencia, las notificaciones y la interoperabilidad con un sistema externo representan problemas diferentes y, por tanto, es conveniente evitar que sus reglas se encuentren mezcladas en un único conjunto de clases o funciones. El propio enfoque modular de NestJS utiliza módulos para encapsular capacidades relacionadas y establecer interfaces claras entre diferentes partes de una aplicación [(NestJS, 2026)](#tg_ref_existing_5c873ad8d3d5).

La abstracción constituye igualmente un principio fundamental. Mediante ella se ocultan detalles técnicos detrás de contratos estables. En el presente proyecto, una operación conceptual como *sincronizar calificaciones* no debería depender directamente, desde el dominio académico, de cómo Puppeteer localiza un elemento HTML dentro de un portal externo. La abstracción permite que el núcleo del sistema conozca la existencia de una capacidad de sincronización, mientras la tecnología concreta empleada para realizarla permanece en una capa periférica. Esta relación coincide con el principio de dependencias de Arquitectura Limpia, según el cual las dependencias deben orientarse hacia las políticas internas y no obligar a la lógica central a conocer frameworks, bases de datos o interfaces externas [(Martin, 2012)](#tg_ref_existing_9d9818d9ccad).

La mantenibilidad está estrechamente vinculada con estos principios. ISO/IEC 25010:2023 incorpora la mantenibilidad dentro de su modelo de calidad del producto y plantea características que pueden utilizarse durante la definición de requerimientos y criterios de aceptación. Un software educativo destinado a utilizarse durante varias gestiones no debe evaluarse únicamente según si funciona inicialmente; también debe considerarse la facilidad con que pueda corregirse, probarse y adaptarse ante modificaciones de reglas académicas o sistemas externos [(ISO/IEC, 2023)](#tg_ref_existing_e98c60c85b65).

Finalmente, la ingeniería de software requiere trazabilidad entre necesidades, requerimientos, diseño, implementación y pruebas. En el presente proyecto esto significa que una necesidad como reducir errores de transcripción debe derivar en requerimientos concretos de validación y sincronización; dichos requerimientos deben reflejarse en componentes arquitectónicos y finalmente disponer de casos de prueba capaces de demostrar su cumplimiento. SWEBOK e ISO/IEC/IEEE 29148 consideran la gestión, especificación y validación de requerimientos actividades centrales dentro del ciclo de vida de sistemas y software ([IEEE Computer Society, 2024](#tg_ref_existing_ecf887101fba); [ISO/IEC/IEEE, 2018](#tg_ref_existing_d9050faa16ef)).

### 2.1.2 MODELOS DE DESARROLLO DE SOFTWARE

Los modelos de desarrollo establecen una estructura para organizar las actividades mediante las que el software pasa desde la identificación de necesidades hasta su construcción, prueba y evolución. No existe un modelo universalmente apropiado para todos los proyectos: la selección depende de factores como estabilidad de requerimientos, incertidumbre técnica, disponibilidad de usuarios y posibilidad de entregar resultados parciales ([Sommerville, 2020](#tg_ref_existing_d6b4d5adf7d0)).

En proyectos donde existe interacción continua con usuarios y donde algunos detalles se descubren durante la construcción, los enfoques iterativos e incrementales permiten ajustar progresivamente el producto. Esta característica resulta pertinente para un sistema académico porque determinados flujos administrativos solo pueden comprenderse completamente después de observar el proceso real o de presentar prototipos a los usuarios.

#### 2.1.2.1 Enfoques tradicionales de desarrollo

El modelo en cascada representa uno de los enfoques secuenciales más conocidos. Su característica conceptual consiste en ordenar las actividades del proyecto en etapas sucesivas, de modo que la especificación precede al diseño, el diseño a la implementación y esta a la verificación. La utilidad histórica de estos modelos radica en que proporcionaron estructuras disciplinadas para documentar y administrar el desarrollo de software ([Sommerville, 2020](#tg_ref_existing_d6b4d5adf7d0)).

Los enfoques tradicionales facilitan la planificación cuando el problema es estable, los requisitos pueden definirse tempranamente y las condiciones de implementación presentan poca incertidumbre. También favorecen la elaboración anticipada de documentación y la definición de hitos claramente delimitados.

Sin embargo, esa misma secuencialidad puede convertirse en una limitación cuando es necesario incorporar conocimiento adquirido durante el desarrollo. Si una institución educativa observa un prototipo y descubre que el flujo real de registro de notas difiere de la especificación inicial, un modelo excesivamente rígido puede convertir una modificación razonable en una costosa revisión de etapas previamente cerradas.

En el presente proyecto existe además una dependencia externa relevante: el Sistema de Información Educativa. Las interfaces, mecanismos operativos y reglas de una plataforma externa se encuentran fuera del control del desarrollador. Por ello, resulta conveniente trabajar con incrementos verificables y aislar técnicamente la interoperabilidad, reduciendo el impacto que tendría un cambio del portal externo sobre el resto de la plataforma.

#### 2.1.2.2 Enfoques ágiles e iterativos

El desarrollo iterativo consiste en revisar y perfeccionar una solución a través de ciclos sucesivos. Cada iteración permite incorporar aprendizaje obtenido de la implementación y de la interacción con usuarios. El desarrollo incremental, aunque relacionado, pone énfasis en la entrega progresiva de capacidades funcionales: en vez de intentar terminar todo el sistema simultáneamente, cada incremento amplía el producto existente.

Ambos conceptos pueden combinarse. Un módulo de gestión de estudiantes puede construirse como primer incremento y ser refinado iterativamente después de las observaciones de los usuarios; posteriormente pueden incorporarse calificaciones, asistencia, seguimiento académico, aplicación móvil y sincronización externa.

El Manifiesto Ágil prioriza a las personas y sus interacciones, el software funcionando, la colaboración con el cliente y la capacidad de responder al cambio, sin negar el valor de procesos, herramientas, documentación, contratos y planes [(Beck et al., 2001)](#tg_ref_existing_83be445c797d). Sus principios también promueven entregas frecuentes, colaboración continua y reflexión sobre cómo mejorar la forma de trabajo.

La adaptación al cambio tiene particular importancia en sistemas organizacionales. Los usuarios pueden descubrir necesidades después de interactuar con una funcionalidad real, mientras que reglas administrativas o dependencias externas pueden modificarse durante la duración del proyecto. La adaptación no significa ausencia de planificación; supone que la planificación se revisa a partir de evidencia obtenida durante el desarrollo.

En consecuencia, para una plataforma académica resulta conveniente dividir el trabajo en capacidades verificables: primero establecer la infraestructura y seguridad básica; luego los procesos académicos centrales; posteriormente el seguimiento y comunicación con padres; y finalmente los mecanismos de interoperabilidad y auditoría. De esta forma, el riesgo técnico puede distribuirse a lo largo del desarrollo.

### 2.1.3 METODOLOGÍA DE DESARROLLO DE SOFTWARE SELECCIONADA

Para el presente proyecto se adopta **Scrum como marco de referencia ágil para organizar el desarrollo incremental**, complementado con las prácticas de ingeniería necesarias para diseño, pruebas y documentación. Scrum se define oficialmente como un marco de trabajo ligero orientado a generar valor mediante soluciones adaptativas para problemas complejos. Su funcionamiento se basa en empirismo y pensamiento Lean, utilizando ciclos denominados *Sprints* para crear incrementos inspeccionables del producto [(Schwaber & Sutherland, 2020)](#tg_ref_existing_f3927709de94).

Scrum establece tres pilares: transparencia, inspección y adaptación. La transparencia requiere hacer visible el estado relevante del producto y del trabajo; la inspección permite evaluar periódicamente resultados y progreso; y la adaptación permite introducir cambios cuando lo observado se desvía de los objetivos. Estos principios son apropiados para un proyecto académico donde los módulos pueden presentarse progresivamente al colegio y al tutor para recibir observaciones antes de continuar con funcionalidades posteriores [(Schwaber & Sutherland, 2020)](#tg_ref_existing_f3927709de94).

La selección se justifica porque el sistema contiene varios conjuntos de funcionalidades que pueden desarrollarse como incrementos relativamente independientes: autenticación y gestión de usuarios, estructura académica, estudiantes e inscripciones, calificaciones, asistencia, seguimiento, aplicación móvil, reportes y sincronización con el SIE. Una organización incremental permite obtener evidencia de funcionamiento desde etapas tempranas y evita que la integración con el SIE condicione la construcción de todas las demás funcionalidades.

La aplicación de Scrum en un proyecto universitario individual debe documentarse con precisión. El *Scrum Guide* define formalmente un Scrum Team compuesto por Product Owner, Scrum Master y Developers; por tanto, cuando el contexto académico no reproduce exactamente estas responsabilidades, es metodológicamente preferible declarar qué elementos se adoptan y cuáles se adaptan, en vez de afirmar que se aplica Scrum de manera estricta cuando no corresponde [(Schwaber & Sutherland, 2020)](#tg_ref_existing_f3927709de94).

En el proyecto pueden emplearse un Product Backlog para organizar requerimientos, Sprints para delimitar periodos de desarrollo, objetivos de Sprint para definir resultados esperados, revisiones periódicas con interesados y una definición explícita de terminado. ISO incluso dispone de una guía específica para aplicar la serie ISO/IEC/IEEE 29119 de pruebas de software dentro de proyectos ágiles, demostrando que agilidad y documentación rigurosa de pruebas no son enfoques incompatibles [(ISO/IEC, 2021)](#tg_ref_existing_09bdb02ad70b).

### 2.1.4 INGENIERÍA DE REQUERIMIENTOS

La ingeniería de requerimientos comprende las actividades mediante las cuales se descubren, analizan, especifican, validan y gestionan las necesidades que un sistema debe satisfacer. ISO/IEC/IEEE 29148:2018 define procesos e ítems de información relacionados con los requerimientos a lo largo del ciclo de vida de sistemas y productos software, mientras SWEBOK reconoce los requerimientos como un área fundamental de la ingeniería de software ([ISO/IEC/IEEE, 2018](#tg_ref_existing_d9050faa16ef); [IEEE Computer Society, 2024](#tg_ref_existing_ecf887101fba)).

En un sistema académico, una especificación insuficiente puede producir problemas importantes. Una frase informal como “el sistema debe manejar notas” no determina quién puede registrarlas, para qué periodos, con qué validaciones, qué ocurre después de modificarlas, quién puede consultarlas o cómo se relacionan con el SIE. La ingeniería de requerimientos transforma estas expresiones generales en condiciones verificables.

#### 2.1.4.1 Requerimientos funcionales

Los requerimientos funcionales describen servicios, comportamientos u operaciones que el sistema debe realizar. Indican qué resultado observable debe producir el software ante determinadas entradas o situaciones.

Para la solución propuesta pueden considerarse funcionales capacidades como registrar un estudiante, actualizar sus datos, asignarlo a una gestión y curso, registrar calificaciones, controlar asistencia, consultar el historial académico, vincular padres o tutores, generar alertas, consultar información desde la aplicación móvil, solicitar una sincronización con el SIE o verificar el estado de una sincronización.

La calidad de un requerimiento funcional depende de que pueda interpretarse y comprobarse. Por ejemplo, “el sistema debe permitir al docente registrar las calificaciones de los estudiantes de las asignaturas que tiene asignadas durante un periodo académico habilitado” es más verificable que “el sistema manejará notas”. ISO/IEC/IEEE 29148 establece precisamente lineamientos para los procesos, contenido y estructura de los productos de información relacionados con los requerimientos [(ISO/IEC/IEEE, 2018)](#tg_ref_existing_d9050faa16ef).

En el proyecto también será importante diferenciar una necesidad del usuario de una decisión técnica. “Permitir consultar las calificaciones de un hijo” representa una función; “implementar la consulta mediante Flutter” es una decisión de implementación. Mantener esta distinción evita que la especificación funcional quede innecesariamente acoplada a una tecnología.

#### 2.1.4.2 Requerimientos no funcionales

Los requerimientos no funcionales establecen condiciones de calidad o restricciones que debe satisfacer el sistema. Pueden referirse a rendimiento, seguridad, disponibilidad, usabilidad, fiabilidad, mantenibilidad o compatibilidad.

ISO/IEC 25010:2023 ofrece un modelo de calidad de producto que puede emplearse como referencia para formular y clasificar estos requerimientos. La norma permite vincular características de calidad con objetivos de diseño, pruebas y criterios de aceptación, evitando utilizar afirmaciones ambiguas como “el sistema debe ser rápido” o “debe ser seguro” [(ISO/IEC, 2023)](#tg_ref_existing_e98c60c85b65).

Para que un requerimiento no funcional sea evaluable debe incluir, cuando corresponda, un criterio medible. En lugar de “las páginas deben responder rápidamente”, puede establecerse un tiempo máximo esperado bajo condiciones de prueba especificadas. En seguridad, puede determinarse que toda comunicación entre clientes y servidor se realice mediante HTTPS, que la autorización se compruebe en el backend y que las operaciones sensibles queden registradas.

Para el sistema académico adquieren especial relevancia la confidencialidad de datos estudiantiles, la integridad de las calificaciones, la trazabilidad de modificaciones y la fiabilidad del proceso de sincronización. Una función que aparentemente “opera correctamente” puede seguir siendo inaceptable si permite consultar información de estudiantes no vinculados al usuario o si modifica calificaciones sin mantener evidencia de quién realizó la operación.

#### 2.1.4.3 Técnicas de levantamiento de requerimientos

El levantamiento o elicitación de requerimientos busca descubrir necesidades a partir de diferentes fuentes. En un entorno escolar no es suficiente consultar únicamente al personal directivo, porque distintos actores interactúan con diferentes partes del proceso.

La entrevista semiestructurada permite obtener información detallada sobre cómo realizan sus tareas directores, administradores y docentes. Las preguntas abiertas permiten identificar excepciones y reglas que pueden no aparecer en documentos formales. La observación directa complementa la entrevista porque permite contrastar el proceso declarado con el proceso realmente ejecutado.

El análisis documental es especialmente pertinente en este proyecto. Formularios de inscripción, hojas de cálculo, libretas, centralizadores, reglamentos internos, formatos de asistencia y documentos del Ministerio pueden revelar estructuras de información y reglas que deben conservarse en el sistema. En el contexto boliviano, las normas de gestión educativa y los instrumentos relacionados con el RUDE constituyen además referencias esenciales para comprender los datos oficiales vinculados con la inscripción [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

El prototipado también funciona como técnica de elicitación. Al visualizar una pantalla de registro de calificaciones o la aplicación destinada a padres, los usuarios pueden descubrir necesidades que resultan difíciles de expresar mediante una entrevista abstracta. La combinación de técnicas disminuye el riesgo de depender de una única fuente.

#### 2.1.4.4 Validación de requerimientos

La validación busca comprobar que los requerimientos representan las necesidades reales de los interesados y que poseen suficiente calidad para orientar diseño, implementación y pruebas. SWEBOK incluye la validación como actividad de la ingeniería de requerimientos y destaca la identificación de ambigüedades, conflictos u omisiones [(IEEE Computer Society, 2024)](#tg_ref_existing_ecf887101fba).

Un requerimiento puede ser técnicamente claro pero incorrecto para el negocio. Por ejemplo, un desarrollador podría especificar que cualquier docente puede editar cualquier calificación, mientras que la institución requiere restringir esta capacidad según asignaciones y periodos habilitados. La revisión con los usuarios permite detectar este tipo de problema antes de implementar la funcionalidad.

En el proyecto se recomienda validar los requerimientos mediante revisión con representantes de la institución, prototipos de interfaz, demostraciones de incrementos y criterios de aceptación. Para la interoperabilidad, la validación debe incluir además escenarios de fallo: credenciales inválidas, pérdida de conectividad, modificación de una pantalla externa, datos faltantes, reintentos o discrepancias entre el sistema local y el SIE.

La matriz de trazabilidad puede vincular cada requerimiento con su fuente, módulo, caso de uso o historia de usuario y caso de prueba. Esto permitirá, en capítulos posteriores, demostrar de manera objetiva qué requerimientos se implementaron y cómo fueron evaluados.

### 2.1.5 DOCUMENTACIÓN Y ESPECIFICACIÓN DE REQUERIMIENTOS

La documentación de requerimientos constituye el medio mediante el cual las necesidades levantadas se convierten en especificaciones utilizables por diseñadores, desarrolladores, evaluadores e interesados. ISO/IEC/IEEE 29148:2018 define lineamientos tanto para los procesos como para los productos de información generados durante la ingeniería de requerimientos y es aplicable independientemente del tamaño o metodología del proyecto [(ISO/IEC/IEEE, 2018)](#tg_ref_existing_d9050faa16ef).

Una especificación útil debe mantener identificadores únicos, descripciones comprensibles, prioridad, fuente y condiciones de verificación. Cuando sea apropiado, puede añadirse un criterio de aceptación. Los requerimientos pueden complementarse con diagramas UML, casos de uso, modelos de procesos y prototipos, ya que determinadas relaciones resultan más comprensibles de forma visual que exclusivamente mediante lenguaje natural.

En el presente proyecto conviene separar requerimientos por dominios funcionales. Así, los requerimientos de estudiantes, estructura académica, calificaciones, asistencia, seguimiento, aplicación móvil, seguridad y sincronización pueden rastrearse de manera independiente.

Para la sincronización con el SIE es particularmente importante especificar no solo la operación exitosa, sino su ciclo completo. Una solicitud puede estar pendiente, procesándose, confirmada, fallida o pendiente de revisión. Documentar estos estados evita que expresiones generales como “sincronizar con el SIE” oculten la complejidad real de una integración basada en procesos externos.

### 2.1.6 CALIDAD DEL SOFTWARE

La calidad del software puede comprenderse como el grado en que un producto satisface necesidades explícitas e implícitas bajo condiciones determinadas. ISO/IEC 25010:2023 proporciona un modelo para evaluar calidad del producto y utilizar sus características en la especificación de requerimientos, diseño, pruebas y criterios de aceptación [(ISO/IEC, 2023)](#tg_ref_existing_e98c60c85b65).

En un sistema académico la calidad posee una dimensión especialmente sensible: la exactitud e integridad de la información. Una interfaz visualmente correcta carece de utilidad si asocia una calificación al estudiante equivocado, duplica una inscripción o pierde evidencia de una actualización.

La fiabilidad se relaciona con que el sistema mantenga su funcionamiento esperado; la seguridad, con proteger información y operaciones; la mantenibilidad, con facilitar cambios; y la capacidad de interacción, con permitir que los usuarios completen sus tareas de manera comprensible.

La calidad debe considerarse desde el inicio y no únicamente en la etapa final. Los requerimientos medibles, las restricciones de base de datos, la arquitectura modular, los controles de acceso, los registros de auditoría y las pruebas automatizadas constituyen mecanismos que contribuyen colectivamente a la calidad del producto.

## 2.2 GESTIÓN DE LA INFORMACIÓN ACADÉMICA

La gestión de información académica comprende la organización sistemática de datos que describen a los estudiantes y su trayectoria dentro de una institución. Los sistemas de información estudiantil utilizados internacionalmente suelen integrar datos de inscripción, asistencia, trayectoria, logro académico y características de los estudiantes, permitiendo mantener registros longitudinales y producir información para la administración y el seguimiento educativo [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

En el caso del presente proyecto, esta información constituye el núcleo funcional del sistema. Su centralización permite que los procesos de registro, actualización, seguimiento y posterior transferencia hacia sistemas externos utilicen una fuente institucional coherente.

### 2.2.1 GESTIÓN ACADÉMICA

La gestión académica puede entenderse como el conjunto de actividades mediante las cuales una institución organiza y controla procesos relacionados con estudiantes, cursos, docentes, inscripciones, evaluaciones, asistencia, seguimiento y documentación académica.

Los sistemas digitales no sustituyen las decisiones pedagógicas o administrativas, pero proporcionan mecanismos para registrar las evidencias necesarias y reducir la fragmentación de información. La UNESCO destaca que los sistemas de información para la gestión educativa integran personas, procesos, instituciones y tecnologías con el objetivo de producir información que apoye la gestión y planificación [(UNESCO-IIPE, 2024)](#tg_ref_existing_e9b5741af95e).

En este proyecto, la gestión académica se concibe como un dominio central y no como una simple colección de formularios. Registrar un estudiante afecta posteriormente su inscripción, curso, asistencia, calificaciones, historial, vínculo con tutores y eventualmente información que será transferida al SIE. Esto exige consistencia entre módulos.

### 2.2.2 INFORMACIÓN Y REGISTRO ESTUDIANTIL

El registro estudiantil representa la identificación formal del alumno dentro del sistema. Incluye datos personales y académicos necesarios para asociarlo con una trayectoria educativa determinada.

En Bolivia, las Normas Generales para la Gestión Educativa 2026 establecen que el Formulario de Inscripción/actualización del Registro Único de Estudiantes —RUDE— permite identificar a los estudiantes y obtener estadísticas oficiales, y que su registro y actualización se realizan mediante herramientas informáticas del SIE. La norma también establece que un estudiante regular es aquel que cuenta con un código RUDE asignado en el SIE [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Este contexto hace indispensable que el modelo local de datos mantenga identificadores suficientes para relacionar un estudiante institucional con su identidad dentro del sistema oficial, evitando utilizar únicamente nombre y apellidos como mecanismo de correspondencia.

Además, el registro no debe confundirse con la inscripción académica. Un estudiante es una entidad relativamente estable, mientras que su inscripción corresponde a una relación con una gestión, curso, nivel u otras condiciones temporales. Esta separación permite conservar historial sin sobrescribir años anteriores.

### 2.2.3 PROCESOS DE REGISTRO Y ACTUALIZACIÓN DE INFORMACIÓN ACADÉMICA

La información estudiantil cambia a lo largo del tiempo. Pueden modificarse datos de contacto, domicilio, tutor responsable o condiciones administrativas, mientras que cada nueva gestión genera nuevos registros de inscripción y trayectoria.

La Resolución Ministerial 0001/2026 distingue expresamente entre inscripción y actualización del RUDE e indica que debe actualizarse en casos como traslado de unidad educativa o cambios de domicilio y otros datos pertinentes. La misma norma asigna al director responsabilidad sobre la correcta inscripción para evitar inconsistencias en el SIE, entre ellas duplicidad de RUDE, omisiones y errores de inscripción [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Desde la perspectiva del sistema propuesto, esta responsabilidad justifica aplicar validaciones antes de guardar información y conservar trazabilidad de modificaciones. No debería tratarse cada actualización como una sobrescritura sin contexto cuando el dato tiene impacto académico o administrativo.

La centralización puede además reducir la necesidad de modificar el mismo dato en diferentes archivos internos. Una vez validada, la actualización de información institucional debe reflejarse coherentemente en los módulos que consumen esa entidad.

### 2.2.4 GESTIÓN DE CALIFICACIONES

Las calificaciones constituyen registros académicos asociados a un estudiante, una asignatura o área, un periodo evaluativo y una gestión. Por esta razón, su representación requiere más contexto que un simple valor numérico.

El Sistema Académico del Ministerio de Educación incluye expresamente el registro de calificaciones entre las capacidades destinadas a las unidades educativas, junto con la creación de cursos, áreas, personal e inscripciones [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

En el sistema propuesto, una calificación debe asociarse a los elementos que permiten interpretar correctamente su significado y periodo de vigencia. También deben definirse reglas sobre quién puede registrarla o modificarla y en qué momento.

Por tratarse de información sensible y con efectos académicos, las modificaciones deberían generar evidencia de auditoría. Si una nota cambia de 75 a 85, el sistema debe poder identificar qué registro se modificó, qué usuario efectuó la operación y cuándo ocurrió. Cuando posteriormente se sincronice con el SIE, esta trazabilidad facilita determinar si una discrepancia se originó localmente, durante la automatización o en el sistema de destino.

### 2.2.5 CONTROL Y SEGUIMIENTO DE ASISTENCIA

La asistencia constituye otro componente esencial del seguimiento académico. No se limita al registro cotidiano de presencia o ausencia: acumulada a lo largo de una gestión, proporciona información que permite identificar patrones que requieren atención.

Los sistemas estudiantiles analizados por la OECD incluyen generalmente información de asistencia y absentismo entre sus componentes centrales. La organización también destaca que los problemas de asistencia requieren mecanismos de monitoreo y respuesta a nivel institucional y sistémico [(OECD, 2023, 2026)](#tg_ref_existing_5b8e9740991c).

Desde el punto de vista informático, el control de asistencia debe preservar fecha, estudiante, contexto académico y estado registrado. Cuando se permita corregir una ausencia, la modificación debería conservar trazabilidad.

El seguimiento puede utilizar agregaciones simples, como cantidad o porcentaje de ausencias en un periodo. Estas medidas pueden alimentar alertas institucionales sin necesidad de implementar modelos predictivos o inteligencia artificial.

### 2.2.6 HISTORIAL ACADÉMICO DEL ESTUDIANTE

El historial académico representa la trayectoria acumulada del estudiante a través de diferentes gestiones, cursos, periodos, asignaturas y resultados. Su valor radica precisamente en conservar el pasado en lugar de sustituirlo por la situación actual.

La OECD señala que los sistemas longitudinales de información estudiantil permiten conectar registros a través del tiempo y facilitan informes, visualización y análisis de la trayectoria educativa [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

Para el proyecto, esto implica evitar diseños donde una nueva gestión sobrescriba la inscripción anterior. El estudiante puede permanecer como entidad principal, mientras inscripciones, calificaciones y asistencias se relacionan con periodos específicos.

El historial proporciona además una base para padres, docentes y personal autorizado. Un tutor puede consultar la evolución de su hijo sin depender de archivos dispersos, mientras el personal administrativo puede verificar información de gestiones anteriores con mayor facilidad.

### 2.2.7 SEGUIMIENTO DEL RENDIMIENTO ACADÉMICO

El seguimiento del rendimiento implica observar sistemáticamente resultados académicos para detectar cambios que requieran acompañamiento. No debe interpretarse necesariamente como predicción automatizada; puede realizarse mediante indicadores descriptivos y reglas determinadas por la institución.

Los sistemas de información estudiantil facilitan este seguimiento al combinar datos académicos a través del tiempo. La OECD identifica que estos sistemas pueden apoyar análisis institucionales cuando los datos se encuentran disponibles de manera estructurada y conectada [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

En la plataforma propuesta pueden utilizarse promedios, variaciones entre periodos, número de asignaturas con determinadas condiciones o relación con registros de asistencia. El objetivo no es reemplazar el criterio pedagógico, sino presentar información de manera oportuna.

La interpretación final corresponde a los responsables educativos. Un descenso en calificaciones puede tener múltiples causas y no debe convertirse automáticamente en un juicio sobre el estudiante. El software proporciona evidencia organizada; la institución define la intervención adecuada.

### 2.2.8 ALERTAS ACADÉMICAS

Una alerta académica es una señal generada cuando determinados datos cumplen condiciones que justifican revisión. Por ejemplo, el sistema puede informar cuando se acumula cierto número de ausencias o cuando una calificación se encuentra por debajo de un criterio establecido por la institución.

Los sistemas de alerta temprana utilizados en educación suelen considerar información como asistencia y desempeño en cursos para identificar estudiantes que requieren atención; el Institute of Education Sciences de Estados Unidos destaca el uso de datos de asistencia dentro de estos mecanismos para orientar apoyos e intervenciones [(IES, 2024)](#tg_ref_existing_041f24552aea).

Para este proyecto, **alerta académica no equivale a modelo predictivo**. La solución puede implementar reglas deterministas y transparentes. Por ejemplo: “notificar al tutor cuando se registren tres ausencias consecutivas” o “generar una alerta cuando un resultado esté por debajo del umbral configurado”. Esto facilita explicar por qué se produjo cada alerta y evita introducir complejidad de aprendizaje automático innecesaria para los objetivos definidos.

Las alertas deben ser informativas y servir como apoyo al seguimiento, evitando etiquetas permanentes o decisiones automáticas sobre el estudiante.

### 2.2.9 PARTICIPACIÓN DE PADRES Y TUTORES EN EL SEGUIMIENTO ACADÉMICO

La participación de padres y tutores constituye una dimensión relevante del acompañamiento educativo. Las herramientas digitales pueden facilitar esta participación cuando proporcionan información comprensible y oportuna sobre asistencia, desempeño y actividades académicas.

UNESCO ha documentado iniciativas de tecnología educativa orientadas a fortalecer el involucramiento parental mediante el suministro de información relacionada con asistencia, desempeño o actividades de aprendizaje [(UNESCO, 2023)](#tg_ref_existing_03da920d0a21).

La aplicación móvil del presente proyecto responde a este principio. Su finalidad no consiste en replicar todo el sistema administrativo, sino ofrecer al padre o tutor una vista adecuada a sus responsabilidades: estudiantes vinculados, calificaciones, asistencia, alertas e información de seguimiento.

Es indispensable aplicar autorización a nivel de datos. Un usuario con rol de padre o tutor no debe obtener acceso general a estudiantes de la institución; debe consultar únicamente aquellos cuya relación haya sido validada en el sistema.

La simplicidad de la experiencia también es fundamental. La aplicación será utilizada por personas con diferentes niveles de familiaridad tecnológica, por lo que la presentación debe priorizar información comprensible, navegación clara y mensajes que indiquen qué ocurrió y qué acción puede realizar el usuario.

## 2.3 SISTEMAS DE INFORMACIÓN ACADÉMICA

### 2.3.1 SISTEMAS DE INFORMACIÓN

Un sistema de información integra personas, procedimientos, datos y tecnologías con el propósito de recolectar, procesar, almacenar y proporcionar información útil para las actividades de una organización. Su valor no reside exclusivamente en la tecnología, sino en la coordinación entre procesos y usuarios.

En el ámbito educativo, UNESCO-IIPE describe los sistemas de información para la gestión educativa como una combinación coordinada de personas, instituciones, tecnología y procesos destinada a producir datos de calidad que puedan ser utilizados en gestión y planificación [(UNESCO-IIPE, 2024)](#tg_ref_existing_e9b5741af95e).

Esta visión es particularmente útil para el presente proyecto. La plataforma no debe considerarse como una aplicación aislada del colegio: formará parte del proceso institucional de inscripción, registro académico, seguimiento y comunicación.

### 2.3.2 SISTEMAS DE INFORMACIÓN EN INSTITUCIONES EDUCATIVAS

Las instituciones educativas generan datos de manera continua: estudiantes, familias, docentes, cursos, inscripciones, asistencia, evaluaciones y documentos. Cuando estos registros se mantienen en fuentes independientes, aumenta la necesidad de volver a introducir, comparar o corregir información.

Los sistemas de información estudiantil permiten reunir algunos de estos datos dentro de una infraestructura coherente. La OECD identifica entre sus funciones comunes la gestión de matrícula, asistencia, trayectoria y rendimiento estudiantil [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

La incorporación de una solución institucional puede reducir la dependencia de archivos individuales y proporcionar una fuente compartida para los procesos autorizados. No obstante, la centralización incrementa simultáneamente la responsabilidad de proteger los datos almacenados, porque una brecha de seguridad tendría un alcance mayor que la pérdida de un archivo aislado.

### 2.3.3 SISTEMAS DE GESTIÓN ACADÉMICA

Un sistema de gestión académica especializa el concepto de sistema de información en los procesos académicos de una institución. Integra entidades como estudiantes, docentes, cursos, asignaturas, gestiones, calificaciones y asistencias, aplicando reglas de negocio propias del contexto educativo ([OECD, 2023](#tg_ref_existing_5b8e9740991c)).

La plataforma propuesta se ubica dentro de esta categoría, aunque incorpora además componentes de seguimiento para familias y de interoperabilidad externa. Por tanto, su función no es únicamente registrar datos, sino coordinar el ciclo de vida de la información académica.

La separación entre registro operativo e información de seguimiento permite construir vistas distintas a partir de una misma fuente. Un administrador necesita gestionar estudiantes; un docente registrar calificaciones; un padre consultar la información de su hijo; y un proceso automático puede necesitar preparar datos para una sincronización. La información subyacente puede ser común, mientras los permisos y casos de uso son diferentes.

### 2.3.4 CENTRALIZACIÓN DE INFORMACIÓN ESTUDIANTIL

La centralización consiste en mantener una fuente coherente de información en lugar de distribuir copias independientes entre múltiples archivos o aplicaciones. Su principal beneficio conceptual es reducir la ambigüedad sobre cuál versión representa el estado vigente.

Los sistemas modernos de información educativa buscan precisamente integrar datos para facilitar su reutilización y reducir procesos manuales entre herramientas. La OECD dedica un componente específico de su análisis de ecosistemas educativos digitales a la interoperabilidad y reutilización de datos y observa que la falta de integración continúa produciendo reportes manuales entre sistemas en diversos contextos [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

En el colegio, centralizar no significa que todos puedan ver todo. La fuente puede ser común, pero su acceso debe estar restringido de acuerdo con responsabilidades. La centralización y el control de acceso son, por tanto, conceptos complementarios.

También debe evitarse asumir que la centralización elimina automáticamente los errores. Si el sistema permite introducir datos incorrectos, centralizará también esos errores. Por ello se requieren validaciones, restricciones de integridad y procesos de verificación.

### 2.3.5 INTEGRIDAD Y CONSISTENCIA DE LOS REGISTROS ACADÉMICOS

La integridad de datos implica preservar su exactitud estructural y sus relaciones válidas. La consistencia implica evitar estados contradictorios dentro de la información administrada.

En una base de datos relacional, las claves primarias, claves foráneas y restricciones permiten imponer parte de estas reglas. PostgreSQL documenta las claves foráneas como un mecanismo para mantener integridad referencial entre tablas relacionadas [(PostgreSQL Global Development Group, 2026)](#tg_ref_postgres_constraints).

En un sistema académico, esto significa impedir, por ejemplo, que una calificación haga referencia a un estudiante inexistente o que una inscripción esté asociada a una gestión eliminada. Otras reglas necesitan validación de dominio: un docente solo puede registrar notas donde tenga asignación válida, o un estudiante no puede tener dos inscripciones incompatibles para la misma gestión.

La consistencia adquiere una segunda dimensión cuando existe sincronización con el SIE. El sistema local puede estar estructuralmente correcto y, sin embargo, contener un valor diferente del registrado en el sistema externo. Por ello el proyecto incorpora mecanismos de verificación y conciliación.

### 2.3.6 TRAZABILIDAD DE LA INFORMACIÓN ACADÉMICA

La trazabilidad permite reconstruir el origen y evolución de un dato. En sistemas académicos resulta relevante porque ciertas modificaciones poseen efectos formales y deben poder explicarse posteriormente.

Un registro de auditoría puede conservar usuario, operación, entidad afectada, fecha y, cuando corresponda, valor anterior y valor posterior. OWASP recomienda que el registro de eventos de aplicación incluya información suficiente para apoyar monitoreo, investigación y seguridad, evitando simultáneamente registrar secretos u otra información cuya exposición resulte innecesaria [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

Aplicado a una calificación, el sistema puede registrar que determinada nota fue modificada por un usuario autorizado en un momento específico. Aplicado a la sincronización, puede registrar cuándo se solicitó el envío al SIE, cuántos intentos se realizaron y qué resultado fue posteriormente verificado.

La trazabilidad también contribuye a diagnosticar errores técnicos. Si una automatización falla, el registro histórico permite determinar en qué fase ocurrió y con qué datos.

### 2.3.7 AUDITORÍA DE REGISTROS ACADÉMICOS

La auditoría utiliza la trazabilidad para revisar operaciones y verificar que los datos y procesos se comporten de acuerdo con reglas establecidas. No debe confundirse con el simple almacenamiento de logs técnicos.

Una auditoría de registros académicos debe responder preguntas como: quién creó o modificó el dato, cuándo ocurrió, qué cambió y qué operación originó el cambio. En el caso de integraciones, también resulta útil identificar el sistema de origen y destino.

Este concepto tiene especial importancia en Bolivia. Las Normas Generales para la Gestión Educativa 2026 señalan que la información generada por determinadas autoridades educativas, incluyendo direcciones de unidades educativas, se constituye en declaración jurada y vinculan incumplimientos con responsabilidades establecidas por la normativa aplicable [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Por ello, conservar evidencia de operaciones realizadas dentro del sistema contribuye tanto al control técnico como a la responsabilidad institucional.

## 2.4 SISTEMA DE INFORMACIÓN EDUCATIVA EN BOLIVIA

### 2.4.1 SISTEMA DE INFORMACIÓN EDUCATIVA

El Ministerio de Educación de Bolivia dispone del Sistema de Información Educativa —SIE— como conjunto de plataformas destinadas a administrar diferentes clases de información del sector educativo. Dentro de ellas se encuentra el sistema ACADÉMICO, accesible mediante academico.sie.gob.bo, descrito oficialmente como un sistema de administración de información académica para unidades educativas del Subsistema de Educación Regular [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Según el portal oficial del Ministerio, este componente permite gestionar creación de cursos, registro de áreas de atención, personal docente y administrativo, inscripciones y calificaciones. El ecosistema del SIE incorpora además otros componentes destinados a educación alternativa, especial, diplomas y estadísticas educativas [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

El SIE constituye, por tanto, un sistema externo de importancia directa para el proyecto. La aplicación desarrollada por el colegio no pretende sustituirlo, sino gestionar de forma interna los procesos de la institución y facilitar, dentro de los mecanismos autorizados, la relación entre la información local y las obligaciones de registro oficial.

### 2.4.2 GESTIÓN DE INFORMACIÓN ESTUDIANTIL MEDIANTE EL SIE

La normativa boliviana establece que el registro y actualización de datos del RUDE debe realizarse mediante las herramientas informáticas del Sistema de Información Educativa. Para la gestión 2026, la Resolución Ministerial 0001/2026 establece además que el estudiante regular cuenta con código RUDE asignado en el SIE [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

El RUDE funciona así como un elemento importante en la identificación oficial del estudiante dentro del sistema educativo. Desde la perspectiva de diseño de datos, el sistema institucional debe prever la representación de identificadores oficiales sin reemplazar sus propios identificadores internos de base de datos.

Utilizar identificadores diferentes para funciones diferentes es una práctica apropiada: una clave interna puede garantizar relaciones técnicas, mientras el código oficial permite correspondencia con el sistema externo. Esto reduce la dependencia del modelo interno respecto de un identificador cuya administración corresponde a otra institución.

### 2.4.3 REGISTRO DE INFORMACIÓN ACADÉMICA EN EL SIE

El Sistema Académico del SIE contempla inscripciones y registro de calificaciones entre sus funciones oficiales. Esto confirma que determinadas operaciones realizadas inicialmente dentro del colegio terminan teniendo una representación dentro del sistema ministerial [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

La Resolución Ministerial 0001/2026 otorga especial importancia a la calidad del registro. Establece que los directores deben garantizar la inscripción correcta del estudiante para evitar inconsistencias como duplicidad de RUDE, omisión o errores de inscripción [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Para el presente proyecto, este mandato respalda conceptualmente la inclusión de validaciones y verificaciones antes de considerar concluido un proceso de transferencia. El objetivo no debe ser únicamente “lograr que el robot complete el formulario”, sino confirmar que la operación produjo el estado académico esperado.

La misma normativa reconoce la Libreta Escolar Electrónica en el ámbito de las unidades educativas privadas, estableciendo incluso procedimientos frente a su incumplimiento, lo que evidencia la importancia formal de los registros electrónicos académicos [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

### 2.4.4 TRANSFERENCIA DE INFORMACIÓN ACADÉMICA HACIA EL SIE

La transferencia de información consiste en llevar datos producidos o administrados por la institución hacia el sistema oficial correspondiente. Cuando esta tarea se realiza manualmente, el operador debe consultar la fuente institucional, ubicar al estudiante dentro del SIE, introducir los valores y confirmar la operación ([Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a](#tg_ref_minedu_rm_2026); [Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b](#tg_ref_minedu_sie)).

La automatización propuesta busca asistir este proceso, pero debe preservar una separación clara entre el sistema local y el externo. El sistema institucional debe seguir siendo capaz de operar sobre sus propios datos aunque temporalmente el SIE no se encuentre disponible.

Desde una perspectiva arquitectónica, esta separación evita que el registro normal de una calificación dependa de la respuesta inmediata del sistema ministerial. En lugar de bloquear la operación local, puede crearse una solicitud de sincronización que sea procesada posteriormente mediante una cola.

Este enfoque permite además registrar estados intermedios y fallos. Una operación puede quedar “pendiente” si el sistema externo no responde y reintentarse de manera controlada, en lugar de obligar al usuario a repetir manualmente todo el proceso.

### 2.4.5 LIMITACIONES DE INTEROPERABILIDAD CON SISTEMAS EDUCATIVOS EXTERNOS

La interoperabilidad requiere mecanismos mediante los cuales dos sistemas puedan intercambiar e interpretar información. En ecosistemas educativos, la OECD identifica la interoperabilidad como un factor importante para maximizar la reutilización de datos y observa que cuando los sistemas no están integrados las instituciones pueden quedar obligadas a realizar transferencias o reportes manuales [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

En la documentación pública del Ministerio de Educación consultada para este marco teórico se describen portales y herramientas de gestión del SIE, incluido academico.sie.gob.bo, pero no se identificó una API pública documentada para ejecutar desde sistemas de terceros las operaciones académicas específicas planteadas en este proyecto. Esta afirmación debe entenderse como el resultado de la documentación pública localizada, no como una declaración de que técnicamente no exista ningún servicio interno [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Cuando un sistema autorizado solo puede operarse mediante una interfaz web, la automatización de navegador constituye una posible estrategia técnica. Puppeteer proporciona una API para controlar navegadores Chrome o Firefox, incluyendo navegación e interacción programática con páginas web [(Puppeteer, 2026)](#tg_ref_puppeteer_intro).

Esta alternativa tiene una limitación importante: depende en mayor medida de la estructura de la interfaz. Una modificación en identificadores, formularios, navegación o mecanismos de autenticación puede exigir actualizar la automatización. Por esta razón debe aislarse detrás de una interfaz de infraestructura, implementar manejo de errores y utilizarse únicamente con autorización institucional y credenciales legítimas.

### 2.4.6 NORMATIVA BOLIVIANA RELACIONADA CON LA GESTIÓN DE INFORMACIÓN ACADÉMICA

El marco normativo principal del proyecto incluye la Ley de Educación N.º 070 “Avelino Siñani–Elizardo Pérez”, las normas generales de gestión educativa emitidas por el Ministerio y disposiciones relacionadas con privacidad y derechos de niñas, niños y adolescentes. La Ley N.º 070 establece las bases del Sistema Educativo Plurinacional y reconoce, entre otros aspectos, el papel de madres y padres dentro del proceso educativo [(Estado Plurinacional de Bolivia, 2010)](#tg_ref_existing_afab040054e9).

Para la gestión 2026, la Resolución Ministerial N.º 0001/2026 es obligatoria para unidades educativas fiscales, privadas y de convenio. Su artículo 12 dispone que el registro y la actualización del RUDE se efectúen mediante las herramientas informáticas del SIE y atribuye a la dirección la calidad de la información; el artículo 17 exige evitar duplicidad de RUDE, omisiones y errores de inscripción; el artículo 41 fija un máximo de cinco días hábiles para el trámite de traslado y su registro; el artículo 60 ordena mantener archivos digitales cuando corresponda e impresos actualizados; y la Disposición Final Quinta señala que la información generada por las direcciones educativas y de unidades educativas constituye declaración jurada. La solución propuesta, por tanto, complementa al SIE: debe validar, conservar trazabilidad, respetar plazos y mantener evidencia, pero no sustituir el registro oficial ([Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a](#tg_ref_minedu_rm_2026)).

En materia de privacidad, la Constitución Política del Estado contempla la Acción de Protección de Privacidad frente al tratamiento incorrecto de datos registrados por medios físicos, electrónicos, magnéticos o informáticos y reconoce mecanismos para conocer, objetar, eliminar o rectificar información en determinadas circunstancias [(Estado Plurinacional de Bolivia, 2009)](#tg_ref_existing_4e706d338d10).

Además, la Ley N.º 548, Código Niña, Niño y Adolescente, reconoce el derecho a la privacidad e intimidad familiar y establece obligaciones de reserva y protección de la identidad en determinados contextos. Estas disposiciones refuerzan la necesidad de manejar con especial cuidado los datos de estudiantes menores de edad [(Estado Plurinacional de Bolivia, 2014)](#tg_ref_existing_1ffdd98416e9).

Consecuentemente, el sistema debe aplicar principios de acceso restringido, minimización de exposición de datos, seguridad de credenciales, trazabilidad y control sobre qué información puede consultar cada perfil.

## 2.5 INTEROPERABILIDAD Y AUTOMATIZACIÓN DE PROCESOS

### 2.5.1 INTEROPERABILIDAD ENTRE SISTEMAS DE INFORMACIÓN

La interoperabilidad puede entenderse como la capacidad de sistemas diferentes para intercambiar información y utilizarla de manera significativa. En educación, no basta con transportar datos: es necesario conservar su semántica. Un identificador de estudiante, una asignatura o una calificación deben representar el mismo concepto en origen y destino.

La OECD considera la interoperabilidad un componente relevante de los ecosistemas digitales educativos porque permite unificar y maximizar la reutilización de información entre herramientas [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

En el proyecto, la interoperabilidad presenta una particularidad: el sistema local controla su modelo de datos, pero no controla el SIE. Por ello se requiere una capa de traducción que conozca cómo una entidad local se corresponde con los campos y operaciones del sistema externo.

Un diseño adecuado evita insertar estas reglas directamente en los módulos académicos. La gestión de calificaciones debe continuar funcionando aunque el mecanismo externo se sustituya posteriormente.

### 2.5.2 INTEGRACIÓN DE SISTEMAS

La integración de sistemas comprende los mecanismos técnicos mediante los que aplicaciones independientes coordinan datos o procesos. Puede realizarse mediante bases de datos compartidas, archivos, servicios web, APIs, mensajería o automatización de interfaces, dependiendo de las capacidades disponibles ([OECD, 2023](#tg_ref_existing_5b8e9740991c)).

La alternativa preferible cuando existe es una interfaz estable y documentada, porque establece contratos explícitos entre los sistemas. Sin embargo, en sistemas heredados o plataformas cerradas, pueden ser necesarias estrategias de integración diferentes.

Para el proyecto se plantea desacoplar la integración mediante una interfaz o servicio de aplicación. Desde la perspectiva del dominio, se solicita “sincronizar información”; desde infraestructura, una implementación concreta puede emplear Puppeteer. Si en el futuro el Ministerio publica una API apropiada, la implementación podría reemplazarse manteniendo el caso de uso.

### 2.5.3 INTERFACES DE PROGRAMACIÓN DE APLICACIONES

Una API es una interfaz definida para que un software utilice funciones o recursos proporcionados por otro componente. En aplicaciones web modernas, las APIs basadas en HTTP son una forma habitual de comunicación cliente-servidor.

HTTP define semántica para solicitudes, respuestas, métodos, códigos de estado y metadatos que permiten construir protocolos de aplicación interoperables. La especificación actual se encuentra recogida, entre otros documentos, en RFC 9110 [(Fielding, Nottingham & Reschke, 2022)](#tg_ref_existing_46515d9e9555).

En el proyecto, el backend NestJS expone una API para la plataforma React y para la aplicación Flutter. Esta API constituye una frontera explícita: los clientes no interactúan directamente con PostgreSQL ni ejecutan reglas de negocio internas.

El uso de una misma API para web y móvil reduce duplicación porque autenticación, autorización y reglas académicas pueden mantenerse centralizadas en el servidor.

### 2.5.4 SERVICIOS WEB

El W3C describe un servicio web como un sistema software diseñado para soportar interacción interoperable entre máquinas a través de una red mediante interfaces descritas y mensajes basados en tecnologías web [(W3C, 2004)](#tg_ref_existing_890f87570899).

Aunque históricamente “servicios web” se asoció fuertemente con SOAP y XML, el concepto general de integración máquina a máquina es más amplio. En el proyecto, la API HTTP del backend representa un mecanismo de servicio para clientes autorizados.

La diferencia con la automatización del SIE es significativa. La aplicación móvil interactúa con una interfaz construida específicamente para consumo programático; Puppeteer, en cambio, interactúa con una interfaz originalmente creada para seres humanos. La primera opción ofrece un contrato más estable; la segunda requiere controles adicionales ante cambios de interfaz.

### 2.5.5 AUTOMATIZACIÓN ROBÓTICA DE PROCESOS

La Automatización Robótica de Procesos —RPA— utiliza software para ejecutar tareas estructuradas que normalmente realiza una persona mediante sistemas digitales. La literatura sobre adopción de RPA destaca especialmente procesos repetitivos, basados en reglas y con pasos relativamente estables como candidatos apropiados para automatización [(da Silva Costa et al., 2022)](#tg_ref_existing_55bed1ec9174).

RPA no implica robots físicos ni inteligencia artificial. Un robot de software puede iniciar sesión, navegar entre pantallas, introducir información, recuperar resultados y registrar el estado de la operación siguiendo reglas deterministas.

Su pertinencia para el proyecto depende de que el acceso esté autorizado y de que el flujo del SIE sea suficientemente repetitivo. El objetivo es reducir la repetición manual, no evadir mecanismos de seguridad o restricciones de acceso.

La literatura también identifica retos de mantenimiento y gobernanza. Cuando se automatiza una interfaz de usuario, cambios en esa interfaz pueden afectar el proceso. Por ello, la automatización debe tratarse como un componente técnico susceptible de fallar y no como una operación infalible [(da Silva Costa et al., 2022)](#tg_ref_existing_55bed1ec9174).

### 2.5.6 AUTOMATIZACIÓN MEDIANTE NAVEGACIÓN WEB

La automatización de navegador consiste en controlar programáticamente una aplicación web como lo haría un usuario, ejecutando navegación, selección de elementos, introducción de datos y lectura de resultados.

Puppeteer es una biblioteca que ofrece una API de alto nivel para controlar navegadores Chrome y Firefox mediante Chrome DevTools Protocol o WebDriver BiDi; puede funcionar en modo sin interfaz gráfica o con navegador visible según el escenario [(Puppeteer, 2026)](#tg_ref_puppeteer_intro).

En el sistema propuesto, Puppeteer puede utilizarse como adaptador de infraestructura para automatizar operaciones autorizadas dentro del portal académico del SIE. Su ubicación arquitectónica es importante: el dominio no debería contener selectores CSS, tiempos de espera ni instrucciones de navegación.

La automatización debe comprobar activamente el resultado de cada etapa. Encontrar un botón y hacer clic no demuestra por sí solo que la información se haya almacenado correctamente. El proceso debe esperar confirmaciones, leer el estado resultante y registrar evidencia suficiente.

También deben evitarse esperas fijas innecesarias. Los mecanismos basados en condiciones observables —por ejemplo, esperar que aparezca un elemento o se complete una navegación— son más robustos que asumir que todas las páginas tardarán el mismo número de segundos.

### 2.5.7 SINCRONIZACIÓN DE INFORMACIÓN ENTRE SISTEMAS

La sincronización busca mantener correspondencia entre información relacionada almacenada en sistemas diferentes. En este proyecto, el sistema académico local y el SIE son dos fuentes técnicamente independientes.

La sincronización no debe entenderse como una copia indiscriminada de toda la base de datos. Debe definirse qué entidades son sincronizables, qué sistema actúa como origen para cada operación, cuándo se ejecuta la transferencia y qué evidencia indica que concluyó satisfactoriamente.

Una estrategia apropiada es representar cada sincronización como una operación con identidad y estado. Esto permite conocer si se encuentra pendiente, procesándose, completada, fallida o pendiente de revisión.

El procesamiento mediante colas resulta útil porque separa el tiempo de respuesta del usuario del tiempo requerido por el sistema externo. BullMQ proporciona colas y trabajadores basados en Redis, incluyendo mecanismos para procesar trabajos y gestionar reintentos [(BullMQ, 2026)](#tg_ref_bullmq_retry).

### 2.5.8 VERIFICACIÓN DE INFORMACIÓN SINCRONIZADA

Una sincronización técnicamente ejecutada no necesariamente equivale a una sincronización correctamente registrada. Por ello debe existir una fase de verificación posterior ([ISO/IEC, 2008](#tg_ref_iso25012); [ISO/IEC/IEEE, 2021](#tg_ref_existing_fdc05ef84f09)).

En el caso de una calificación, el flujo puede expresarse conceptualmente así:

*Sistema local: Matemáticas = 85 → transferencia → SIE: Matemáticas = 85 → verificada*

Si la lectura posterior obtiene otro valor:

*Sistema local: Matemáticas = 85 → SIE: Matemáticas = 80 → discrepancia*

Esta estrategia permite diferenciar “el proceso automatizado no reportó error” de “la información final coincide”. La segunda condición proporciona un nivel superior de confianza.

La verificación también puede detectar errores silenciosos, como seleccionar accidentalmente otro periodo o estudiante. Por ello, cuando técnicamente sea posible, debe comprobar no solo el valor transferido sino también el contexto que lo identifica.

### 2.5.9 CONCILIACIÓN DE DATOS ENTRE SISTEMAS

La conciliación consiste en comparar dos representaciones de una misma información y clasificar su correspondencia. Es un paso posterior o complementario a la sincronización ([ISO/IEC, 2008](#tg_ref_iso25012)).

Para cada elemento pueden existir al menos tres estados lógicos: coincidencia, discrepancia o imposibilidad de verificación. Esta clasificación evita tratar como equivalentes un fallo de lectura y una diferencia real.

La conciliación puede representarse mediante registros con valor local, valor externo, fecha de comparación y resultado. De esta forma, el sistema no necesita sobrescribir inmediatamente uno de los dos valores para informar una discrepancia.

Este diseño es especialmente adecuado para auditoría. El administrador puede consultar qué registros coinciden con el SIE y cuáles requieren revisión, en lugar de depender únicamente de mensajes técnicos del robot.

La corrección de discrepancias debe mantenerse bajo reglas claras. El sistema no debería decidir automáticamente que uno de los valores es correcto salvo que el proceso institucional así lo establezca.

### 2.5.10 MANEJO DE ERRORES Y REINTENTOS EN PROCESOS AUTOMATIZADOS

Los sistemas externos pueden fallar temporalmente por indisponibilidad, conexión, sesiones expiradas o cambios de interfaz. Un proceso de integración debe asumir que estos eventos son posibles.

BullMQ permite configurar reintentos y estrategias de backoff para trabajos fallidos, haciendo posible espaciar nuevos intentos en lugar de repetir inmediatamente una operación que continúa siendo inviable [(BullMQ, 2026)](#tg_ref_bullmq_retry).

No todos los errores deben reintentarse. Un fallo transitorio de red puede justificar un nuevo intento; una credencial incorrecta requiere intervención; y un selector que dejó de existir puede indicar cambio estructural del portal. Clasificar errores evita bucles improductivos.

También debe considerarse la idempotencia. RFC 9110 diferencia métodos HTTP según sus propiedades, incluida la idempotencia, concepto según el cual repetir una operación produce el mismo efecto pretendido que ejecutarla una vez. Aunque la automatización del SIE no sea directamente una API REST, el principio sigue siendo útil al diseñar trabajos: antes de repetir una operación crítica conviene verificar si el intento anterior ya produjo el resultado esperado [(Fielding et al., 2022)](#tg_ref_existing_46515d9e9555).

### 2.5.11 TRAZABILIDAD Y AUDITORÍA DE PROCESOS AUTOMATIZADOS

Cada ejecución automática debe generar evidencia suficiente para reconstruir su comportamiento. Esto incluye identificador de trabajo, usuario o proceso que lo originó, entidad afectada, fecha de creación, inicio y finalización, número de intentos, resultado y error cuando corresponda.

La finalidad no es almacenar indiscriminadamente cada detalle del navegador, especialmente si pudiera incluir contraseñas o tokens. OWASP señala la necesidad de diseñar mecanismos de logging útiles para seguridad y operación, evitando registrar secretos u otros datos sensibles que no deban quedar expuestos [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

En el contexto del proyecto, el registro de auditoría puede separar eventos técnicos de eventos de negocio. “Timeout esperando el selector” es un evento técnico; “sincronización de calificación RF-XX fallida después de tres intentos” representa un estado de negocio.

Esta separación facilita tanto el mantenimiento por el desarrollador como la revisión por personal autorizado de la institución.

## 2.6 ARQUITECTURA DE SOFTWARE

### 2.6.1 FUNDAMENTOS DE ARQUITECTURA DE SOFTWARE

La arquitectura de software representa las decisiones estructurales de alto nivel que organizan un sistema, sus partes principales y sus relaciones. ISO/IEC/IEEE 42010:2022 establece requisitos para estructurar y expresar descripciones de arquitectura y distingue conceptualmente la arquitectura de una entidad de la documentación utilizada para describirla [(ISO/IEC/IEEE, 2022)](#tg_ref_existing_33688c8b4a84).

La arquitectura tiene impacto sobre atributos como mantenibilidad, modificabilidad, seguridad y capacidad de prueba. Una mala distribución de responsabilidades puede hacer que una modificación pequeña requiera alterar numerosos componentes no relacionados.

El presente sistema posee tres grandes superficies de interacción: frontend web, backend y aplicación móvil, además de una infraestructura de persistencia y automatización. La arquitectura debe definir fronteras claras entre estas partes.

La dependencia con el SIE refuerza esta necesidad. Las reglas académicas deben sobrevivir incluso si el mecanismo concreto de interoperabilidad cambia.

### 2.6.2 ARQUITECTURAS EN SISTEMAS WEB Y MÓVILES

Una aplicación web moderna suele organizarse mediante clientes que consumen servicios de un servidor. El frontend gestiona presentación e interacción, mientras el backend centraliza reglas de negocio, autorización, persistencia e integraciones ([Sommerville, 2020](#tg_ref_existing_d6b4d5adf7d0)).

La aplicación móvil puede consumir el mismo backend mediante HTTP. De esta manera, los clientes web y móvil presentan experiencias distintas pero dependen de una única implementación de reglas críticas.

Este enfoque evita duplicar autorización. Por ejemplo, la regla “el tutor solo puede consultar estudiantes vinculados” debe ejecutarse en el servidor; no es suficiente ocultar opciones en Flutter o React.

La comunicación en tiempo real puede complementar HTTP cuando el servidor necesita informar al cliente sobre un evento posterior a la solicitud inicial, como la finalización de una sincronización asíncrona.

### 2.6.3 ESTILOS ARQUITECTÓNICOS DE SOFTWARE

Los estilos arquitectónicos proporcionan formas generales de organizar componentes y despliegue. La elección debe responder al problema y no a una preferencia tecnológica ([ISO/IEC/IEEE, 2022](#tg_ref_existing_cc29a6f184a8)).

#### 2.6.3.1 Arquitectura monolítica

Una aplicación monolítica se construye y despliega como una unidad principal. Sus módulos comparten proceso de ejecución y habitualmente infraestructura común.

Esta arquitectura ofrece simplicidad operativa: despliegue, monitoreo y transacciones internas pueden ser más directos que en un entorno distribuido. Martin Fowler ha advertido que introducir microservicios implica una “prima” de complejidad y que numerosos sistemas pueden mantenerse apropiadamente como monolitos bien modularizados [(Fowler, 2015)](#tg_ref_existing_d15da7fce141).

El problema surge cuando “monolítico” se convierte en sinónimo de código sin fronteras internas. Un monolito puede estar correctamente estructurado o completamente acoplado.

#### 2.6.3.2 Arquitectura de microservicios

Los microservicios dividen una aplicación en servicios desplegables independientemente que colaboran mediante comunicación de red. Esta estructura puede permitir despliegue y escalado independiente, pero introduce complejidad distribuida relacionada con redes, observabilidad, consistencia y operación.

Microsoft describe los microservicios como servicios pequeños y autónomos que implementan capacidades de negocio y se comunican mediante contratos bien definidos [(Microsoft, 2026)](#tg_ref_typescript_basics).

Para un proyecto académico destinado inicialmente a una sola institución educativa, adoptar microservicios para cada módulo implicaría infraestructura y coordinación desproporcionadas respecto de la escala prevista.

No existe beneficio automático por distribuir un sistema. La elección debe justificarse por necesidades reales de despliegue independiente, escala u organización del equipo.

#### 2.6.3.3 Monolito modular

El monolito modular conserva una unidad de despliegue principal, pero divide internamente la aplicación en módulos con límites explícitos. [Fowler (2015)](#tg_ref_existing_d15da7fce141) sostiene que iniciar con una arquitectura monolítica puede ser una decisión prudente cuando los límites del dominio aún están madurando, siempre que la estructura interna preserve la modularidad y evite un acoplamiento indiscriminado.

Este enfoque resulta adecuado para el presente proyecto. Módulos como identidad, estudiantes, estructura académica, calificaciones, asistencia, seguimiento y sincronización pueden tener responsabilidades propias sin desplegarse como servicios independientes.

La ventaja principal es conservar simplicidad operacional mientras se controla el acoplamiento. Los módulos no deberían modificar directamente las tablas internas de otros módulos sin pasar por contratos o servicios definidos.

Además, una buena modularidad deja abierta una futura extracción si alguna capacidad llegara a requerir despliegue independiente.

### 2.6.4 ARQUITECTURA LIMPIA

Robert C. Martin formuló Arquitectura Limpia como una síntesis de enfoques arquitectónicos que buscan separar políticas de negocio de detalles externos. El principio central es la **regla de dependencia**: el código de las capas internas no debe depender de mecanismos ubicados en las capas externas, como bases de datos, frameworks, interfaces o servicios externos [(Martin, 2012)](#tg_ref_existing_9d9818d9ccad).

El modelo original de Martin utiliza conceptos como *Entities*, *Use Cases*, *Interface Adapters* y *Frameworks and Drivers*. En el presente proyecto se utiliza una adaptación frecuente basada en **dominio, aplicación, infraestructura y presentación**. Esta equivalencia debe entenderse como una organización práctica inspirada en Arquitectura Limpia, no como una nomenclatura literalmente idéntica al diagrama original.

#### 2.6.4.1 Principios de Arquitectura Limpia

La separación de responsabilidades busca que las decisiones más importantes del sistema dependan lo menos posible de frameworks y tecnologías ([Martin, 2012](#tg_ref_existing_9d9818d9ccad)).

La lógica que determina si un usuario puede registrar una calificación pertenece al dominio o aplicación; la forma en que PostgreSQL almacena el registro es infraestructura. La lógica que decide que una sincronización debe verificarse posteriormente tampoco debería depender directamente de Puppeteer.

El segundo principio es la inversión de dependencias. Las capas internas definen contratos y las externas proporcionan implementaciones. Por ejemplo, aplicación puede definir una interfaz *AcademicSyncGateway*; infraestructura implementa *SiePuppeteerGateway*.

Esto facilita pruebas. Un caso de uso puede evaluarse sustituyendo la integración externa por una implementación simulada, sin abrir realmente el portal del SIE.

#### 2.6.4.2 Capa de dominio

El dominio contiene los conceptos y reglas fundamentales del negocio. En el sistema académico pueden existir entidades o agregados relacionados con estudiante, inscripción, calificación, asistencia y periodo académico ([Martin, 2012](#tg_ref_existing_9d9818d9ccad)).

Esta capa debe evitar dependencias de NestJS, Prisma, Redis o Puppeteer. Su objetivo es representar el problema académico.

La independencia resulta especialmente útil para reglas que deben permanecer aunque se modifique la infraestructura. Por ejemplo, una calificación no deja de ser una calificación porque se cambie PostgreSQL por otra tecnología.

#### 2.6.4.3 Capa de aplicación

La capa de aplicación coordina casos de uso. Recibe una intención externa, obtiene los objetos necesarios, invoca las reglas del dominio y utiliza puertos para persistir o comunicarse con servicios externos ([Martin, 2012](#tg_ref_existing_9d9818d9ccad)).

Ejemplos de casos de uso serían *RegistrarCalificacion*, *ConsultarHistorialAcademico*, *RegistrarAsistencia* o *SolicitarSincronizacionSie*.

La aplicación debe coordinar el flujo sin contener detalles innecesarios de interfaz. Tampoco debería construir selectores HTML para el SIE.

Esta capa constituye un punto apropiado para manejar transacciones de casos de uso y emitir eventos que posteriormente sean atendidos de forma asíncrona.

#### 2.6.4.4 Capa de infraestructura

La infraestructura implementa mecanismos técnicos: PostgreSQL, Prisma, Redis, BullMQ, correo, almacenamiento, Puppeteer y otros adaptadores externos.

La infraestructura puede depender del dominio y de los contratos definidos internamente, pero el dominio no debería depender de infraestructura. Esta dirección preserva la regla de dependencia de Arquitectura Limpia [(Martin, 2012)](#tg_ref_existing_9d9818d9ccad).

El adaptador del SIE pertenece particularmente a esta capa, porque la estructura HTML de un portal ministerial es un detalle externo.

Igualmente, un repositorio basado en Prisma es una implementación técnica de una abstracción de persistencia y puede permanecer fuera del núcleo de negocio.

#### 2.6.4.5 Capa de presentación

La presentación recibe y entrega información a usuarios o clientes. Puede incluir controladores HTTP, validación de entrada vinculada al transporte y transformación de respuestas.

En una arquitectura con NestJS, los controladores reciben solicitudes y delegan el trabajo a proveedores o casos de uso; la documentación oficial distingue estos roles y promueve inyección de dependencias entre componentes [(NestJS, 2026)](#tg_ref_existing_5c873ad8d3d5).

React y Flutter constituyen clientes de presentación adicionales. Las reglas críticas no deben depender de que la interfaz haya ocultado un botón, porque un usuario podría enviar una solicitud directamente a la API.

### 2.6.5 DISEÑO ORIENTADO AL DOMINIO

Domain-Driven Design —DDD— es un enfoque para abordar sistemas cuyo núcleo contiene reglas y conceptos de negocio significativos. Eric Evans propone utilizar un modelo del dominio y un lenguaje compartido entre especialistas y desarrolladores para evitar que la implementación se separe de los conceptos reales del negocio [(Evans, 2003)](#tg_ref_evans_ddd).

DDD incluye patrones estratégicos y tácticos. En un proyecto académico no es necesario utilizar todos ellos; deben emplearse aquellos que ayuden a representar correctamente el dominio.

#### 2.6.5.1 Dominio y subdominios

El dominio es el ámbito de conocimiento que el software pretende resolver. Aquí corresponde a la gestión académica y sus procesos de información.

Puede dividirse en subdominios como identidad y acceso, gestión de estudiantes, estructura académica, evaluación, asistencia, seguimiento y sincronización externa.

Esta división permite evitar un modelo gigantesco donde cualquier cambio afecta todo el sistema. Microsoft recomienda identificar subdominios y límites de contexto a partir de capacidades del negocio antes de decidir la arquitectura técnica [(Microsoft, 2026)](#tg_ref_typescript_basics).

#### 2.6.5.2 Entidades

Una entidad posee identidad que se mantiene aunque cambien algunos atributos. Un estudiante continúa representando al mismo individuo aunque actualice su domicilio o teléfono.

La identidad no debe confundirse con los atributos visibles. Dos estudiantes pueden compartir nombres y apellidos, por lo que el sistema necesita identificadores adecuados.

Microsoft describe las entidades de DDD como objetos caracterizados principalmente por identidad y continuidad, en contraste con objetos definidos exclusivamente por sus valores [(Microsoft, 2026)](#tg_ref_typescript_basics).

#### 2.6.5.3 Objetos de valor

Un objeto de valor se define por sus atributos y no necesita identidad propia independiente. Dos objetos con valores equivalentes pueden considerarse conceptualmente iguales ([Evans, 2003](#tg_ref_evans_ddd)).

Ejemplos potenciales son un periodo académico, un rango de calificación o determinadas representaciones de contacto, siempre que las reglas del dominio justifiquen su encapsulación.

Los objetos de valor son útiles para reunir validaciones y evitar el uso indiscriminado de primitivas. En vez de propagar cadenas sin significado, el modelo puede expresar conceptos académicos explícitos.

#### 2.6.5.4 Agregados

Un agregado agrupa objetos del dominio que deben mantener invariantes de consistencia como una unidad. Una raíz del agregado controla las modificaciones permitidas.

Microsoft señala que los agregados sirven como fronteras transaccionales del modelo de dominio y que sus invariantes deben preservarse dentro de esa frontera [(Microsoft, 2026)](#tg_ref_typescript_basics).

No debe confundirse “agregado” con “grupo de todas las tablas relacionadas”. Un agregado demasiado grande dificulta concurrencia y mantenimiento.

En el proyecto, las fronteras deberán derivarse de reglas reales. Inscripción y calificación, por ejemplo, están relacionadas pero no necesariamente forman un único agregado.

#### 2.6.5.5 Servicios de dominio

Un servicio de dominio encapsula una operación que pertenece conceptualmente al dominio pero no encaja naturalmente como responsabilidad de una única entidad u objeto de valor ([Evans, 2003](#tg_ref_evans_ddd)).

Debe utilizarse con moderación. Si toda regla se coloca en servicios, las entidades terminan convertidas en simples contenedores de datos.

Una operación que determine una condición académica combinando información de varias entidades podría justificarse como servicio de dominio si la regla no pertenece claramente a una sola de ellas.

#### 2.6.5.6 Repositorios

Los repositorios proporcionan una abstracción para acceder y persistir agregados o entidades sin exponer los detalles de la tecnología de almacenamiento ([Evans, 2003](#tg_ref_evans_ddd)).

Desde la capa interna puede existir un contrato *StudentRepository*; infraestructura implementa dicho contrato mediante Prisma y PostgreSQL.

Esta separación no significa que cada tabla requiera necesariamente un repositorio independiente. Los repositorios deben alinearse con el modelo y los casos de uso.

Su principal beneficio arquitectónico es impedir que consultas específicas del ORM se distribuyan por toda la lógica de negocio.

#### 2.6.5.7 Contextos delimitados

Un *Bounded Context* define un límite dentro del cual un modelo y su lenguaje tienen un significado consistente. El mismo término puede representar conceptos diferentes en contextos distintos.

Evans considera los contextos delimitados una herramienta estratégica para controlar modelos grandes y hacer explícitas sus fronteras [(Evans, 2003)](#tg_ref_evans_ddd).

Para este proyecto es razonable identificar contextos o módulos vinculados con gestión académica y con integración externa. El concepto “calificación local” puede existir dentro del dominio académico, mientras “registro SIE sincronizado” pertenece al contexto de interoperabilidad y auditoría.

Esta frontera evita contaminar el modelo académico con detalles particulares de la plataforma externa.

### 2.6.6 ARQUITECTURA ORIENTADA A EVENTOS INTERNOS

Los eventos de dominio permiten representar hechos que ya ocurrieron y que pueden interesar a otras partes del sistema. Un ejemplo sería *CalificacionRegistrada*.

Microsoft documenta los eventos de dominio como mecanismo para propagar efectos entre agregados y mantener desacoplamiento entre responsabilidades; también diferencia eventos internos de mensajes destinados a integración entre procesos externos [(Microsoft, 2026)](#tg_ref_typescript_basics).

Tras registrar una calificación, un controlador no necesita ejecutar directamente todas las acciones posteriores. Puede publicarse un evento que active actualización de seguimiento, creación de auditoría o generación de una solicitud de sincronización.

Los eventos internos deben usarse cuando exista una ventaja real de desacoplamiento, no como sustituto automático de llamadas directas sencillas.

### 2.6.7 PROCESAMIENTO ASÍNCRONO

El procesamiento asíncrono permite ejecutar determinados trabajos fuera de la solicitud original del usuario. Esto es especialmente importante cuando una tarea depende de un sistema externo y puede tardar segundos o minutos ([BullMQ, 2026](#tg_ref_existing_9ed9cf4c9c1b)).

La sincronización con el SIE constituye un candidato natural. El usuario solicita sincronización; el backend valida la operación, la registra y coloca un trabajo en una cola. Un worker la ejecuta posteriormente.

Esta arquitectura evita mantener una conexión HTTP abierta durante toda la navegación automatizada y permite reintentar trabajos fallidos.

Una vez finalizado el proceso, el resultado puede persistirse y notificarse al frontend mediante comunicación en tiempo real.

### 2.6.8 COLAS DE TRABAJO

Una cola de trabajo mantiene tareas pendientes que serán consumidas por uno o más trabajadores. BullMQ implementa este patrón sobre Redis para aplicaciones Node.js y proporciona colas, workers, eventos, trabajos diferidos y mecanismos de reintento [(BullMQ, 2026)](#tg_ref_bullmq_retry).

En el proyecto, un trabajo puede representar una solicitud de sincronización con identificadores suficientes para recuperar la información desde la base de datos.

Es preferible que el job contenga referencias y no copias innecesarias de toda la información académica, especialmente si se trata de datos sensibles que podrían quedar desactualizados.

Las colas permiten controlar concurrencia. Esto puede ser necesario para evitar que múltiples navegadores automaticen simultáneamente operaciones incompatibles sobre una misma cuenta externa.

## 2.7 DESARROLLO DE APLICACIONES WEB Y MÓVILES

### 2.7.1 ARQUITECTURA CLIENTE-SERVIDOR

La arquitectura cliente-servidor separa la presentación y consumo de servicios de la lógica central proporcionada por un servidor ([Fielding, 2000](#tg_ref_existing_4ce90da3b8cf)).

En el sistema propuesto existen al menos dos clientes: la aplicación web y la aplicación móvil. Ambos utilizan el backend como autoridad sobre reglas y datos.

El navegador no accede directamente a PostgreSQL y la aplicación Flutter tampoco debe contener credenciales de base de datos. Toda operación pasa por la API, donde se verifica identidad y autorización.

Esta distribución permite centralizar la lógica y reducir la posibilidad de inconsistencias entre plataformas.

### 2.7.2 API REST

REST fue formulado por Roy Fielding como un estilo arquitectónico para sistemas hipermedia distribuidos, basado en restricciones como cliente-servidor, ausencia de estado de sesión de aplicación en el servidor entre solicitudes, cacheabilidad e interfaz uniforme [(Fielding, 2000)](#tg_ref_existing_4ce90da3b8cf).

En la práctica, una API HTTP para el proyecto puede modelar recursos y operaciones mediante rutas, métodos y códigos de estado coherentes.

Es importante no reducir REST a “usar JSON”. JSON es un formato de representación; REST define restricciones arquitectónicas más amplias. Asimismo, utilizar HTTP no convierte automáticamente cualquier API en REST.

RFC 9110 proporciona la semántica normativa actual de HTTP necesaria para seleccionar apropiadamente métodos y códigos de respuesta [(Fielding et al., 2022)](#tg_ref_existing_46515d9e9555).

### 2.7.3 DESARROLLO WEB BASADO EN COMPONENTES

El desarrollo basado en componentes construye interfaces a partir de unidades reutilizables con responsabilidades visuales e interactivas delimitadas.

React describe las interfaces precisamente como composiciones de componentes, que pueden recibir información y producir elementos visuales reutilizables [(Meta Open Source, 2026)](#tg_ref_react_components).

En el proyecto pueden existir componentes para tablas de estudiantes, tarjetas de indicadores, formularios, filtros, diálogos y estados de sincronización.

La componentización debe evitar extremos. Un único componente gigantesco dificulta mantenimiento; dividir cada etiqueta HTML en un componente independiente introduce complejidad sin valor. La frontera debe corresponder a responsabilidades reutilizables o suficientemente independientes.

### 2.7.4 APLICACIONES MÓVILES MULTIPLATAFORMA

El desarrollo multiplataforma permite mantener una base de código común para diferentes sistemas operativos móviles. Flutter está diseñado para construir aplicaciones multiplataforma desde una única base de código y ofrece soporte para múltiples destinos, incluidos Android e iOS [(Google, 2026)](#tg_ref_flutter_arch).

Esta característica resulta apropiada para un proyecto de grado con recursos limitados, porque desarrollar dos aplicaciones nativas independientes incrementaría el esfuerzo de implementación y mantenimiento.

La aplicación móvil propuesta se concentra en casos de uso de padres o tutores. Por ello, compartir backend no implica compartir necesariamente la misma experiencia de usuario que la plataforma administrativa.

La arquitectura de Flutter debe igualmente separar presentación, consumo de API y gestión de estado para evitar que toda la lógica quede mezclada en widgets.

### 2.7.5 COMUNICACIÓN EN TIEMPO REAL

La comunicación en tiempo real permite que el servidor envíe información al cliente sin esperar una nueva consulta manual ([Fette & Melnikov, 2011](#tg_ref_existing_703a7e985fec)).

En el proyecto puede utilizarse para informar que una sincronización pasó de pendiente a procesando, completada o fallida.

No toda funcionalidad requiere tiempo real. Listados relativamente estáticos pueden utilizar HTTP convencional. La comunicación persistente debe reservarse para eventos donde la actualización inmediata mejore significativamente la experiencia.

Esta selección reduce complejidad y consumo innecesario de conexiones.

### 2.7.6 WEBSOCKETS

RFC 6455 define el protocolo WebSocket para comunicación bidireccional entre cliente y servidor a través de una conexión persistente, reduciendo la necesidad de realizar sondeos HTTP repetitivos para determinados escenarios interactivos [(Fette & Melnikov, 2011)](#tg_ref_existing_703a7e985fec).

NestJS proporciona gateways para construir aplicaciones WebSocket sobre adaptadores soportados por el framework [(NestJS, 2026)](#tg_ref_existing_5c873ad8d3d5).

En la solución propuesta, cuando el worker termina una sincronización, el backend puede publicar un evento y comunicarlo al usuario conectado. La interfaz actualiza entonces el estado sin recargar toda la página.

La seguridad debe mantenerse también en esta conexión: establecer un WebSocket no elimina la necesidad de autenticar y autorizar al usuario.

### 2.7.7 TECNOLOGÍAS Y HERRAMIENTAS DE DESARROLLO SELECCIONADAS

La selección tecnológica responde a las responsabilidades arquitectónicas definidas. React y TypeScript se utilizan en la interfaz web; NestJS en el backend; Flutter en la aplicación móvil; Puppeteer en automatización web; PostgreSQL en persistencia; Prisma como ORM; y Redis junto con BullMQ en procesamiento asíncrono ([Meta Open Source, 2026](#tg_ref_existing_cc539dc2cfaa); [NestJS, 2026](#tg_ref_existing_5c873ad8d3d5); [Google, 2026](#tg_ref_existing_cf2611c19d1d)).

Las tecnologías no sustituyen los principios arquitectónicos. La calidad dependerá de cómo sean utilizadas y de que las reglas centrales permanezcan correctamente delimitadas.

#### 2.7.7.1 React

React es una biblioteca para construir interfaces de usuario mediante componentes. Su modelo permite dividir una pantalla en unidades declarativas que reaccionan a cambios de datos [(Meta Open Source, 2026)](#tg_ref_react_components).

En el proyecto, React resulta apropiado para una plataforma administrativa que contiene formularios, tablas, filtros, dashboards y vistas de seguimiento.

La gestión de autorización visible en el cliente mejora la experiencia al ocultar funciones no disponibles, pero no constituye una barrera de seguridad. La autorización real debe repetirse en la API.

#### 2.7.7.2 TypeScript

TypeScript extiende JavaScript con un sistema estático de tipos. Su documentación oficial lo presenta como un verificador estático que permite detectar determinadas incompatibilidades durante el desarrollo antes de ejecutar el programa [(Microsoft, 2026)](#tg_ref_typescript_basics).

En una aplicación con numerosos modelos de datos, los tipos ayudan a expresar estructuras utilizadas en formularios, respuestas de API y componentes.

Sin embargo, los tipos de TypeScript desaparecen en tiempo de ejecución. Por ello, una solicitud proveniente de la red siempre debe validarse en el servidor; no es seguro asumir que los datos son correctos solo porque el código cliente usa TypeScript.

#### 2.7.7.3 NestJS

NestJS es un framework para aplicaciones de servidor en Node.js que organiza el código mediante módulos, controladores y proveedores, utilizando ampliamente inyección de dependencias [(NestJS, 2026)](#tg_ref_existing_5c873ad8d3d5).

Su estructura modular resulta compatible con el monolito modular planteado. Cada contexto funcional puede agrupar controladores, casos de uso, puertos e implementaciones según la estructura adoptada.

NestJS también dispone de integración con WebSockets y colas, capacidades pertinentes para el mecanismo de sincronización asíncrona [(NestJS, 2026)](#tg_ref_existing_5c873ad8d3d5).

El framework, sin embargo, debe permanecer principalmente en los bordes externos; las entidades y reglas del dominio deberían minimizar dependencias directas de decoradores propios de infraestructura.

#### 2.7.7.4 Flutter

Flutter es el framework seleccionado para la aplicación móvil de padres y tutores. Su enfoque multiplataforma permite compartir gran parte del código entre sistemas operativos móviles y construir interfaces adaptadas a diferentes dispositivos [(Google, 2026)](#tg_ref_flutter_arch).

La aplicación consumirá la API del mismo backend utilizado por la web. Esto evita duplicar reglas sobre relaciones tutor-estudiante y acceso a calificaciones.

La interfaz móvil debe enfocarse en consultas frecuentes y alertas, evitando trasladar innecesariamente la complejidad administrativa de la aplicación web.

#### 2.7.7.5 Puppeteer

Puppeteer proporciona una API para controlar programáticamente navegadores compatibles y automatizar navegación e interacción web [(Puppeteer, 2026)](#tg_ref_puppeteer_intro).

En el proyecto su función se limita a la infraestructura de interoperabilidad con interfaces web externas autorizadas. No constituye una herramienta de scraping indiscriminado.

Debe encapsularse de forma que los selectores, sesiones y pasos de navegación no se filtren hacia el dominio.

También es necesario prever mantenimiento periódico, debido a que la interfaz externa puede cambiar independientemente del sistema desarrollado.

#### 2.7.7.6 Redis

Redis proporciona estructuras de datos en memoria y capacidades utilizadas habitualmente para caché, mensajería y procesamiento de flujos. Su documentación incluye tipos como listas, streams y Pub/Sub [(Redis, 2026)](#tg_ref_redis_types).

En el presente sistema, Redis se utiliza principalmente como infraestructura para BullMQ y otras capacidades efímeras, no como sustituto de PostgreSQL para los registros académicos permanentes.

Esta distinción es importante: las calificaciones, inscripciones y auditorías requieren persistencia relacional durable; una cola de trabajos posee un propósito diferente.

#### 2.7.7.7 BullMQ

BullMQ es una biblioteca de colas para Node.js construida sobre Redis. Permite definir productores, colas y trabajadores y soporta reintentos, planificación y control de procesamiento [(BullMQ, 2026)](#tg_ref_bullmq_retry).

En el sistema, una solicitud del usuario puede generar un trabajo de sincronización que será procesado por un worker especializado.

Este patrón desacopla la API del navegador automatizado y permite que un fallo temporal no afecte la disponibilidad general de la plataforma.

Además, el número de workers puede controlarse para evitar concurrencia excesiva sobre el sistema externo.

## 2.8 SISTEMAS DE GESTIÓN DE BASES DE DATOS

### 2.8.1 BASES DE DATOS

Una base de datos permite almacenar información de manera estructurada para que pueda ser consultada, actualizada y relacionada de forma controlada ([Codd, 1970](#tg_ref_existing_2134ae8878d5)).

En un sistema académico constituye un componente crítico porque la mayor parte del valor de la aplicación está representado por sus datos: estudiantes, inscripciones, relaciones familiares, calificaciones, asistencia, usuarios y evidencia de auditoría.

La selección de una tecnología de base de datos debe considerar la estructura del dominio, consistencia requerida, volumen esperado y mecanismos de integridad.

### 2.8.2 BASES DE DATOS RELACIONALES

El modelo relacional, introducido por E. F. Codd, propone representar datos mediante relaciones manipulables de acuerdo con fundamentos formales, constituyendo la base conceptual de los sistemas relacionales modernos [(Codd, 1970)](#tg_ref_existing_2134ae8878d5).

Este paradigma resulta especialmente apropiado cuando existen relaciones bien definidas: un estudiante tiene inscripciones; una inscripción pertenece a una gestión; una calificación está asociada a una inscripción y contexto académico; un tutor se vincula con determinados estudiantes.

Las propiedades transaccionales de una base relacional permiten además agrupar operaciones que deben completarse de forma coherente.

Para el proyecto se selecciona PostgreSQL por su madurez y soporte de restricciones relacionales.

### 2.8.3 MODELADO DE DATOS

El modelado de datos traduce conceptos del dominio en estructuras persistentes. No debe comenzar preguntando “qué tablas crear”, sino qué información existe, cómo se identifica y qué relaciones deben preservarse ([Chen, 1976](#tg_ref_chen_er)).

En este proyecto es importante separar estudiante e inscripción. Si los datos de curso se guardaran directamente en la tabla *student* y se sobrescribieran cada gestión, se perdería la trayectoria histórica.

También es necesario modelar relaciones de muchos a muchos cuando corresponda, por ejemplo entre tutores y estudiantes, ya que un estudiante puede tener más de un responsable y un tutor puede estar vinculado a más de un estudiante.

El diseño debe complementarse con restricciones que reflejen invariantes importantes.

### 2.8.4 MODELO ENTIDAD-RELACIÓN

El modelo entidad-relación representa entidades, atributos y relaciones de un dominio antes o durante su traducción al esquema relacional ([Chen, 1976](#tg_ref_chen_er)).

En el proyecto pueden identificarse entidades como Usuario, Estudiante, Tutor, Gestión Académica, Curso, Asignatura, Inscripción, Calificación, Asistencia, Alerta y Sincronización.

El modelo ER facilita revisar cardinalidades. Por ejemplo, un estudiante puede tener múltiples inscripciones históricas, pero cada inscripción pertenece a una gestión específica.

Su utilidad en el documento de grado consiste en proporcionar una representación visual de la estructura persistente que pueda relacionarse con requerimientos y módulos del sistema.

### 2.8.5 INTEGRIDAD REFERENCIAL

La integridad referencial garantiza que las relaciones entre registros permanezcan válidas. PostgreSQL permite establecer claves foráneas para asegurar que los valores referenciados correspondan a filas válidas en tablas relacionadas [(PostgreSQL Global Development Group, 2026)](#tg_ref_postgres_constraints).

Si una calificación referencia una inscripción, la base de datos debe impedir que se cree para un identificador inexistente.

Las restricciones también permiten controlar unicidad. Por ejemplo, puede ser necesario impedir dos registros equivalentes de inscripción para la misma combinación de estudiante y gestión.

No todas las reglas pueden expresarse exclusivamente en SQL, por lo que integridad de base de datos y reglas de dominio deben trabajar conjuntamente.

### 2.8.6 POSTGRESQL

PostgreSQL es un sistema gestor de base de datos relacional de código abierto con soporte para restricciones, transacciones y un amplio conjunto de tipos y capacidades SQL. Su documentación oficial detalla mecanismos como claves primarias, restricciones únicas, comprobaciones y claves foráneas [(PostgreSQL Global Development Group, 2026)](#tg_ref_postgres_constraints).

Para el proyecto proporciona una base apropiada para información altamente relacional y sensible a integridad.

PostgreSQL será la fuente persistente principal, mientras Redis se reservará para necesidades transitorias o de mensajería.

El diseño deberá incorporar índices en campos utilizados frecuentemente para búsqueda y relaciones, evitando optimizaciones prematuras pero garantizando que consultas habituales puedan escalar con el crecimiento del historial.

### 2.8.7 MAPEO OBJETO-RELACIONAL

El mapeo objeto-relacional —ORM— proporciona una capa entre estructuras utilizadas por el lenguaje de programación y tablas de la base de datos ([Prisma, 2026](#tg_ref_existing_60dd5b6fa9db)).

Su ventaja principal es reducir parte del código repetitivo necesario para consultas y operaciones CRUD, además de facilitar migraciones y tipado dependiendo de la herramienta.

Sin embargo, utilizar un ORM no elimina la necesidad de comprender SQL, cardinalidades e índices. Consultas ineficientes pueden generarse aunque el código parezca sencillo.

En una Arquitectura Limpia, el ORM debe tratarse como detalle de infraestructura y no convertirse en el modelo del dominio.

### 2.8.8 PRISMA ORM

Prisma ORM proporciona herramientas para definir modelos de datos, ejecutar migraciones y acceder a bases de datos desde aplicaciones TypeScript mediante un cliente tipado [(Prisma, 2026)](#tg_ref_prisma_migrate).

Su integración con TypeScript permite detectar durante el desarrollo determinados errores relacionados con nombres de campos y tipos de consulta.

En el proyecto, Prisma puede implementar repositorios de infraestructura utilizados por la capa de aplicación.

Las entidades del dominio no tienen por qué coincidir uno a uno con los modelos generados por Prisma. Mantener esta distinción impide acoplar toda la aplicación al ORM.

### 2.8.9 AUDITORÍA Y TRAZABILIDAD DE CAMBIOS EN BASES DE DATOS

La auditoría puede implementarse en diferentes niveles: desde la aplicación, mediante tablas específicas, o mediante capacidades de base de datos según el caso.

Para un proyecto académico, una tabla de auditoría controlada por la aplicación puede registrar usuario, acción, entidad, identificador, fecha, valor anterior y nuevo valor cuando sea pertinente.

Los registros deben diseñarse para consulta y no limitarse a cadenas de texto inestructuradas. Esto permitirá responder preguntas como “qué calificaciones fueron modificadas durante determinada fecha”.

Los logs de seguridad y auditoría deben protegerse contra acceso no autorizado y evitar almacenar contraseñas, tokens o secretos, siguiendo las recomendaciones de logging y gestión de secretos de OWASP [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

## 2.9 SEGURIDAD DE LA INFORMACIÓN

### 2.9.1 SEGURIDAD EN SISTEMAS DE INFORMACIÓN

La seguridad busca proteger información y servicios frente a accesos, modificaciones, divulgaciones o interrupciones no autorizadas.

En un sistema académico, los principales activos incluyen datos personales de menores, relaciones familiares, credenciales, calificaciones, asistencia y registros de auditoría.

OWASP ASVS ofrece una base para verificar controles técnicos de seguridad en aplicaciones web y puede utilizarse como referencia para establecer requerimientos verificables durante el desarrollo [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

La seguridad debe considerarse transversalmente. No puede añadirse únicamente al final mediante una pantalla de inicio de sesión.

### 2.9.2 AUTENTICACIÓN DE USUARIOS

La autenticación es el proceso mediante el que un sistema obtiene confianza en la identidad presentada por un usuario. NIST SP 800-63B-4 establece requisitos actuales para autenticación digital y diferentes niveles de garantía de autenticación [(Temoshok et al., 2025)](#tg_ref_existing_765151a07824).

En el proyecto, administrativos, docentes y padres deben autenticarse antes de acceder a información protegida.

Las contraseñas nunca deben almacenarse en texto plano. OWASP recomienda utilizar algoritmos apropiados de hashing de contraseñas y configuraciones actualizadas, de forma que una filtración de la base de datos no revele directamente las credenciales [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

El sistema debe incluir además mecanismos adecuados para cierre de sesión, expiración o revocación de sesiones y recuperación de cuenta conforme al nivel de riesgo.

### 2.9.3 AUTORIZACIÓN

La autorización determina qué puede hacer un usuario autenticado. Ambos conceptos deben mantenerse separados: demostrar identidad no significa obtener acceso irrestricto.

Un docente puede autenticarse correctamente y aun así no estar autorizado para editar calificaciones de todos los cursos.

La autorización debe ejecutarse en el backend antes de acceder a los datos o efectuar la acción. Las restricciones implementadas exclusivamente en React o Flutter pueden ser evadidas mediante solicitudes directas a la API.

OWASP ASVS proporciona requerimientos de seguridad que pueden utilizarse para verificar estos controles de acceso [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

### 2.9.4 CONTROL DE ACCESO BASADO EN ROLES

RBAC asigna permisos a roles y usuarios a esos roles, en lugar de administrar cada permiso de manera independiente para cada usuario. NIST define RBAC como un modelo en el que las acciones permitidas sobre recursos se identifican mediante roles y no directamente mediante identidades individuales [(NIST, 2025)](#tg_ref_existing_a4e0161fc83b).

En el proyecto pueden existir perfiles como administrador, personal administrativo, docente y padre o tutor.

RBAC por sí solo no resuelve todas las restricciones. El rol “docente” puede permitir consultar calificaciones, pero además es necesario verificar si ese docente está asignado al curso correspondiente.

Igualmente, el rol “tutor” no debe conceder acceso a todos los estudiantes; necesita una condición adicional basada en la relación tutor-estudiante.

Por ello, RBAC debe combinarse con autorización contextual.

### 2.9.5 GESTIÓN SEGURA DE CREDENCIALES

El sistema administra diferentes clases de secretos: contraseñas, claves de sesión, credenciales de infraestructura y potencialmente credenciales institucionales necesarias para una integración externa.

OWASP recomienda centralizar y controlar el almacenamiento, aprovisionamiento, auditoría y rotación de secretos, así como evitar incluir claves directamente en código fuente o repositorios de control de versiones [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

Las credenciales necesarias para el SIE requieren especial cuidado porque permiten operar un sistema externo en representación de la institución.

Deben almacenarse cifradas o mediante un gestor de secretos apropiado y mantenerse fuera de logs, mensajes de error y capturas de pantalla.

El worker de Puppeteer debe obtenerlas exclusivamente durante el tiempo necesario para efectuar una operación autorizada.

### 2.9.6 PROTECCIÓN DE INFORMACIÓN ESTUDIANTIL

Los datos estudiantiles requieren protección reforzada porque pertenecen en gran medida a niñas, niños y adolescentes.

La Constitución boliviana reconoce mecanismos de protección frente al tratamiento indebido de datos personales registrados en sistemas físicos o informáticos, mientras la Ley N.º 548 reconoce expresamente la privacidad e intimidad de niñas, niños y adolescentes y obligaciones de confidencialidad en determinados contextos [(Estado Plurinacional de Bolivia, 2009, 2014)](#tg_ref_existing_4e706d338d10).

En términos de diseño, esto implica limitar la recopilación a información necesaria, restringir el acceso y evitar exponer datos sensibles en respuestas de API innecesarias.

También debe aplicarse el principio de menor privilegio. Un usuario solo necesita los datos indispensables para realizar sus funciones.

La exportación de reportes requiere los mismos controles que la visualización en pantalla; generar un PDF no convierte la información en pública.

### 2.9.7 SEGURIDAD EN LA COMUNICACIÓN ENTRE APLICACIONES

La comunicación entre frontend, aplicación móvil y backend debe protegerse mediante TLS sobre HTTPS.

TLS 1.3 está definido en RFC 8446 y tiene como objetivo permitir que aplicaciones cliente-servidor se comuniquen evitando escucha, manipulación y falsificación de mensajes en tránsito [(Rescorla, 2018)](#tg_ref_existing_aab9ca2e0195).

Esto protege credenciales y datos académicos durante su recorrido por la red.

HTTPS no reemplaza autenticación o autorización. Un canal cifrado puede transportar igualmente una solicitud no autorizada; cada control responde a un riesgo distinto.

También deben configurarse adecuadamente políticas del navegador, orígenes permitidos y almacenamiento de sesiones.

### 2.9.8 REGISTRO Y AUDITORÍA DE OPERACIONES

Los eventos de seguridad deben registrarse con suficiente contexto para detectar problemas y reconstruir acciones.

OWASP recomienda registrar eventos relevantes de aplicación y seguridad de forma consistente, considerando quién, qué, cuándo y resultado, sin incluir información confidencial que no sea necesaria para la investigación [(OWASP Foundation, 2026)](#tg_ref_existing_ab0ae252e6ea).

En el sistema académico deben registrarse especialmente cambios de información sensible, modificaciones de calificaciones, acciones administrativas, cambios de permisos y sincronizaciones.

Los registros también necesitan protección. Si un usuario puede modificar libremente su propia evidencia de auditoría, esta pierde valor.

La consulta de logs debe limitarse a perfiles autorizados.

## 2.10 EXPERIENCIA DE USUARIO Y ACCESIBILIDAD

### 2.10.1 DISEÑO CENTRADO EN EL USUARIO

El diseño centrado en el usuario busca comprender quién utilizará el sistema, qué tareas realiza y en qué contexto ([International Organization for Standardization, 2019](#tg_ref_iso9241_210)).

Una plataforma académica posee usuarios heterogéneos: personal administrativo que utiliza el sistema durante periodos prolongados; docentes que requieren registros rápidos; y padres o tutores que consultan información ocasionalmente desde dispositivos móviles.

Diseñar una única interfaz idéntica para todos ignoraría estas diferencias.

El levantamiento de requerimientos, prototipado y pruebas de usabilidad permiten incorporar la perspectiva de usuarios reales durante el desarrollo.

### 2.10.2 PRINCIPIOS DE USABILIDAD

ISO 9241-11:2018 proporciona un marco para comprender la usabilidad en función del uso de sistemas interactivos y relaciona el concepto con el desempeño de usuarios y su satisfacción en un contexto específico [(ISO, 2018)](#tg_ref_existing_584e26b5b632).

La eficacia implica que el usuario pueda completar correctamente la tarea; la eficiencia considera los recursos necesarios; y la satisfacción describe su percepción de la interacción.

Para un formulario de asistencia, por ejemplo, no basta con que técnicamente permita registrar todos los estudiantes. Si requiere abrir una pantalla independiente por alumno, puede ser funcional pero poco eficiente.

La usabilidad debe evaluarse con tareas reales y no únicamente mediante apreciación estética.

### 2.10.3 EXPERIENCIA DE USUARIO EN SISTEMAS EDUCATIVOS

La experiencia de usuario en sistemas educativos debe reducir la distancia entre el lenguaje de la interfaz y el lenguaje de la institución ([Bergamaschi et al., 2025](#tg_ref_bergamaschi_dashboards)).

Los usuarios deberían encontrar conceptos como estudiante, curso, materia, periodo y calificación en lugar de términos internos de base de datos.

La consistencia visual y terminológica reduce la carga cognitiva y facilita aprender la plataforma.

En el caso de padres y tutores, la experiencia debe priorizar comprensión. Mostrar datos técnicamente detallados de sincronización puede ser útil para un administrador, pero innecesario para una familia que únicamente necesita conocer la asistencia o calificación de su hijo.

### 2.10.4 DISEÑO DE INTERFACES WEB

La plataforma web estará destinada principalmente a operaciones administrativas y docentes, por lo que necesita optimizar tareas repetitivas ([World Wide Web Consortium, 2023](#tg_ref_existing_b7e97983c866)).

Los formularios deben utilizar etiquetas claras, indicar campos obligatorios, validar entradas y mostrar mensajes de error próximos al elemento que produjo el problema.

Las tablas deben permitir identificar rápidamente registros y, cuando exista cantidad suficiente de información, incorporar filtros o búsquedas.

Los estados asíncronos requieren indicadores explícitos. Si una sincronización continúa ejecutándose, la interfaz debe mostrar “procesando” en vez de aparentar que la aplicación se bloqueó.

Los mensajes técnicos provenientes de Puppeteer o PostgreSQL deben transformarse en explicaciones comprensibles para el usuario, mientras el detalle técnico permanece disponible en logs para personal autorizado.

### 2.10.5 DISEÑO DE APLICACIONES MÓVILES PARA PADRES Y TUTORES

La aplicación móvil debe responder a un conjunto reducido y prioritario de tareas: iniciar sesión, seleccionar un estudiante vinculado cuando corresponda, revisar calificaciones, consultar asistencia y visualizar alertas o información académica relevante.

UNESCO destaca que la tecnología puede apoyar la participación parental cuando facilita acceso a información sobre desempeño y asistencia [(UNESCO, 2023)](#tg_ref_existing_03da920d0a21).

No es recomendable trasladar automáticamente todas las funcionalidades administrativas al móvil. La experiencia debe reflejar las necesidades del tutor.

Las notificaciones deben ser relevantes y evitar saturación. Alertar ante cada modificación menor puede producir que el usuario ignore los mensajes verdaderamente importantes.

Además, la pantalla debe identificar claramente a qué hijo o dependiente corresponde la información para evitar confusión cuando una cuenta tenga múltiples estudiantes vinculados.

### 2.10.6 ACCESIBILIDAD EN APLICACIONES WEB Y MÓVILES

WCAG 2.2 constituye una recomendación del W3C para hacer contenido digital accesible a un rango amplio de personas con discapacidades. Sus directrices se organizan bajo cuatro principios: contenido perceptible, operable, comprensible y robusto [(W3C, 2023)](#tg_ref_existing_77cfc960a988).

Entre los aspectos relevantes para la aplicación web se encuentran navegación mediante teclado, contraste suficiente, identificación de campos, foco visible y mensajes comprensibles.

El W3C publicó además orientación específica sobre cómo aplicar principios y criterios de WCAG 2.2 a aplicaciones móviles nativas, web e híbridas, aunque dicha guía es informativa y no normativa [(W3C, 2025)](#tg_ref_existing_3d3e2c417a60).

Para Flutter, la accesibilidad debe considerar semántica de controles, tamaños adecuados de objetivos táctiles y compatibilidad con herramientas de asistencia.

La accesibilidad beneficia además a usuarios sin discapacidad permanente, por ejemplo personas que utilizan el sistema en una pantalla pequeña o bajo condiciones de iluminación adversas.

### 2.10.7 SIMPLICIDAD DE INTERACCIÓN

La simplicidad no significa eliminar funciones necesarias; consiste en evitar pasos, decisiones y elementos que no aportan valor a la tarea.

Una acción frecuente debe requerir una secuencia predecible. Los usuarios no deberían conocer la arquitectura interna para operar el sistema.

La interfaz debe utilizar valores predeterminados cuando sean seguros, mantener consistencia entre pantallas y evitar solicitar nuevamente información que el sistema ya conoce.

WCAG incluye criterios relacionados con navegación consistente, identificación uniforme, etiquetas e instrucciones que también contribuyen a una interacción más comprensible [(W3C, 2023)](#tg_ref_existing_77cfc960a988).

En procesos sensibles, simplicidad debe equilibrarse con seguridad. Una modificación de calificaciones puede requerir confirmación adicional aunque ello añada un paso, porque el costo de una operación accidental es elevado.

## 2.11 EVALUACIÓN Y VALIDACIÓN DE SISTEMAS

La construcción del software no demuestra por sí misma que la solución satisfaga el problema. Es necesario evaluar sistemáticamente sus funciones, integraciones, seguridad, usabilidad y calidad de datos.

La serie ISO/IEC/IEEE 29119 define un marco internacional para procesos, documentación y técnicas de pruebas de software, mientras SWEBOK reconoce las pruebas como una de las áreas fundamentales de la ingeniería de software ([ISO/IEC/IEEE, 2022](#tg_ref_existing_33688c8b4a84); [IEEE Computer Society, 2024](#tg_ref_existing_ecf887101fba)).

En el presente proyecto, las pruebas tienen además una función investigativa: proporcionan evidencia para determinar si la solución construida cumple los objetivos definidos.

### 2.11.1 CALIDAD DEL PRODUCTO SOFTWARE

La evaluación de calidad debe relacionarse con los requerimientos no funcionales previamente definidos.

ISO/IEC 25010:2023 permite utilizar su modelo de calidad para especificación, diseño, pruebas y criterios de aceptación. Esto facilita construir una matriz donde cada característica seleccionada tenga uno o más mecanismos de evaluación [(ISO/IEC, 2023)](#tg_ref_existing_e98c60c85b65).

Por ejemplo, la seguridad puede evaluarse mediante pruebas de autorización; el desempeño mediante tiempos medidos bajo escenarios determinados; la usabilidad mediante tareas con usuarios; y la fiabilidad de sincronización mediante ejecuciones controladas con fallos simulados.

No es necesario evaluar exhaustivamente cada subcaracterística de ISO 25010. Deben seleccionarse aquellas alineadas con los requerimientos y objetivos del proyecto.

### 2.11.2 PRUEBAS DE SOFTWARE

Las pruebas consisten en actividades sistemáticas destinadas a obtener evidencia sobre el comportamiento del software y encontrar diferencias entre resultados esperados y observados.

ISO/IEC/IEEE 29119-1:2022 establece conceptos generales para las pruebas, mientras la parte correspondiente a procesos describe actividades para gobernar, administrar e implementar las pruebas y la parte de técnicas aborda mecanismos de diseño de casos de prueba [(ISO/IEC/IEEE, 2022, 2021)](#tg_ref_existing_33688c8b4a84).

Un plan de pruebas debe derivar de riesgos y requerimientos. Las operaciones críticas necesitan mayor cobertura que funciones puramente decorativas.

En el sistema académico, autenticación, autorización, modificación de calificaciones y sincronización con el SIE son áreas de riesgo elevado.

### 2.11.3 PRUEBAS FUNCIONALES

Las pruebas funcionales verifican las capacidades observables del sistema frente a sus especificaciones ([ISO/IEC/IEEE, 2021](#tg_ref_existing_fdc05ef84f09)).

Para cada requerimiento puede definirse una combinación de datos iniciales, acción, resultado esperado y evidencia.

Un ejemplo para registro de calificaciones sería verificar que un docente autorizado pueda guardar una nota válida y que esta aparezca posteriormente en la consulta del estudiante.

También deben probarse escenarios negativos: un docente no autorizado no puede modificar la nota; un valor fuera del rango aceptado debe rechazarse; y una solicitud mal formada no debe crear registros parciales.

Estas pruebas proporcionan trazabilidad directa entre requerimientos funcionales y comportamiento implementado.

### 2.11.4 PRUEBAS DE INTEGRACIÓN

Las pruebas de integración verifican la colaboración entre componentes que individualmente pueden funcionar de forma correcta ([ISO/IEC/IEEE, 2021](#tg_ref_existing_fdc05ef84f09)).

En el proyecto existen varias fronteras relevantes: backend con PostgreSQL, backend con Redis/BullMQ, API con aplicación web, API con aplicación móvil y worker con el adaptador de automatización.

Una prueba de integración puede comprobar que registrar una solicitud de sincronización crea correctamente el trabajo, que el worker lo recibe y que su resultado actualiza el registro correspondiente.

Para el SIE, debe diferenciarse entre pruebas contra una implementación simulada y pruebas reales autorizadas contra el entorno disponible. Las pruebas repetitivas no deben modificar datos oficiales indiscriminadamente.

### 2.11.5 PRUEBAS DE USABILIDAD

Las pruebas de usabilidad observan a usuarios representativos mientras realizan tareas definidas.

ISO 9241-11 proporciona el marco conceptual para analizar eficacia, eficiencia y satisfacción dentro de un contexto de uso [(ISO, 2018)](#tg_ref_existing_584e26b5b632).

En la plataforma web pueden plantearse tareas como encontrar un estudiante, registrar asistencia o consultar el historial. Para la aplicación móvil, revisar la última calificación o identificar una alerta.

Pueden medirse finalización correcta de tarea, tiempo empleado, errores cometidos y percepción del participante.

Con una población pequeña, los resultados deben presentarse con prudencia: la prueba demuestra problemas observados en los participantes, no permite generalizar estadísticamente a toda la población boliviana.

### 2.11.6 PRUEBAS DE ACEPTACIÓN DE USUARIO

Las pruebas de aceptación comprueban si el sistema satisface las necesidades de los usuarios dentro de escenarios de negocio ([ISO/IEC/IEEE, 2021](#tg_ref_existing_d5aaa1c36223)).

Se diferencian de las pruebas unitarias porque su foco no está en una clase o función, sino en el resultado que obtiene el usuario.

En este proyecto deberían participar perfiles vinculados con los procesos reales: personal administrativo para registro e inscripción, docentes para información académica y padres o tutores para la aplicación móvil, dependiendo del alcance de la validación.

Los criterios de aceptación establecidos durante la ingeniería de requerimientos funcionan como referencia para decidir si una funcionalidad puede considerarse cumplida.

La evidencia puede registrarse mediante una matriz con identificador del caso, requerimiento, participante o perfil, resultado esperado, resultado obtenido y estado.

### 2.11.7 VALIDACIÓN DE INTEGRIDAD DE DATOS

La validación de integridad debe verificar tanto restricciones estructurales como coherencia del negocio.

Las pruebas pueden intentar crear referencias inexistentes, duplicados no permitidos o estados incompatibles y comprobar que el sistema los impide.

PostgreSQL proporciona restricciones de integridad como claves primarias, unicidad y claves foráneas, que pueden combinarse con validaciones de aplicación [(PostgreSQL Global Development Group, 2026)](#tg_ref_postgres_constraints).

La integridad también debe evaluarse después de operaciones complejas. Si una transacción registra calificación y auditoría, debe verificarse que un error intermedio no deje estados parciales.

Para cambios sensibles puede compararse el dato visible en la API con el registro persistido y con su evidencia de auditoría.

### 2.11.8 VALIDACIÓN DE PROCESOS DE SINCRONIZACIÓN

La validación de sincronización constituye una de las pruebas más importantes del proyecto porque concentra automatización, integración externa, manejo de errores y consistencia de datos.

No debe evaluarse únicamente si Puppeteer termina sin lanzar una excepción. El criterio principal consiste en comprobar que el valor esperado se encuentra en el destino correcto.

Un protocolo de validación puede utilizar la siguiente secuencia conceptual:

**Dato local → solicitud de sincronización → trabajo en cola → autenticación externa → navegación → registro → lectura posterior → comparación → estado final.**

Si cualquiera de las fases falla, el sistema debe registrar el estado correspondiente y proporcionar información suficiente para diagnóstico.

También deben evaluarse los reintentos. Puede simularse un fallo transitorio y comprobar que el trabajo pasa a un nuevo intento sin duplicar el resultado previamente registrado. BullMQ dispone de mecanismos de reintento y backoff que pueden utilizarse para esta finalidad [(BullMQ, 2026)](#tg_ref_bullmq_retry).

La validación de conciliación puede expresarse mediante indicadores cuantitativos. Por ejemplo:

$$
Tasa de coincidencia = \frac{registros verificados con coincidencia}{registros sincronizados y verificables} \times 100
$$

De manera complementaria:

$$
Tasa de sincronización exitosa = \frac{trabajos finalizados y verificados}{trabajos de sincronización ejecutados} \times 100
$$

También puede calcularse:

$$
Tasa de discrepancia = \frac{registros cuyo valor local difiere del valor SIE}{registros comparados} \times 100
$$

Estas medidas permiten transformar la validación en evidencia cuantitativa y relacionarla con los objetivos del proyecto.

Debe diferenciarse claramente entre transferencia, sincronización exitosa y sincronización verificada. Una transferencia indica que se intentó introducir información; una sincronización exitosa indica que el proceso terminó según las reglas técnicas; una sincronización verificada confirma mediante lectura o evidencia del destino que la información resultante coincide con la fuente institucional.

Esta distinción constituye uno de los fundamentos más importantes para el sistema propuesto, porque transforma el módulo de automatización en un mecanismo auditable y no simplemente en un conjunto de instrucciones de navegador.

### 2.11.9 REFERENTES DE CALIDAD Y GESTIÓN AMBIENTAL

Las normas cumplen funciones distintas. ISO/IEC 25012:2008 propone un modelo para evaluar la calidad de datos estructurados; ISO 9001:2026 establece requisitos para el sistema de gestión de la calidad de una organización; la familia ISO 14000 reúne instrumentos de gestión ambiental. Presentarlas como un único sello de calidad del software sería incorrecto. En este proyecto se emplean como referencias para definir controles y conservar evidencia, no como declaración de certificación ([ISO/IEC, 2008](#tg_ref_iso25012); [ISO, 2026a](#tg_ref_iso9001_2026); [ISO, s. f.](#tg_ref_iso14000_family)).

Para los registros académicos se seleccionan cinco propiedades de ISO/IEC 25012 que responden al problema estudiado: exactitud, completitud, consistencia, actualidad y trazabilidad. Se comprobarán con casos concretos: ausencia de códigos RUDE duplicados, campos obligatorios completos, calificaciones asociadas a la gestión correcta, datos vigentes y posibilidad de identificar origen, usuario y momento de cada modificación. El artículo 17 de la Resolución Ministerial N.º 0001/2026 atribuye a la dirección la responsabilidad de evitar duplicidades, omisiones y errores de inscripción en el SIE, por lo que estos controles también atienden una obligación institucional ([ISO/IEC, 2008](#tg_ref_iso25012); [Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a](#tg_ref_minedu_rm_2026)).

ISO 9001:2026 no sustituye los modelos de calidad de producto o de datos. Su aporte se sitúa en el proceso: responsabilidades definidas, información documentada, seguimiento del desempeño y corrección de resultados no conformes. En el proyecto esto se traduce en requerimientos y pruebas versionados, registro de incidencias, responsable de revisión, evidencia de aceptación y una acción correctiva cuando un caso falla ([ISO, 2026a](#tg_ref_iso9001_2026)).

ISO 14000 designa una familia y no una única norma de requisitos. Dentro de ella, ISO 14001:2026 establece el marco para un sistema de gestión ambiental. Su aplicación al proyecto queda acotada a decisiones operativas medibles: dimensionamiento del hospedaje, crecimiento del almacenamiento, retención de respaldos, vida útil del equipo y reducción de copias redundantes. No autoriza a eliminar documentación exigida; el artículo 60 de la Resolución Ministerial N.º 0001/2026 dispone mantener archivos digitales cuando corresponda e impresos actualizados. Tampoco se afirma que el colegio o el software estén certificados bajo ISO 14001 ([ISO, s. f.](#tg_ref_iso14000_family); [ISO, 2026b](#tg_ref_iso14001_2026); [Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a](#tg_ref_minedu_rm_2026)).

## 2.12 ESTADO DEL ARTE

### 2.12.1 ALCANCE Y CRITERIO DE REVISIÓN

La revisión se concentró en publicaciones académicas, informes de organismos especializados, plataformas educativas documentadas y normas técnicas relacionadas con cuatro asuntos del proyecto: gestión de información estudiantil, interoperabilidad, alertas para el seguimiento y automatización de tareas. Se priorizaron fuentes de 2021 a 2026; los trabajos anteriores se conservaron únicamente cuando fijan conceptos todavía vigentes. El diagnóstico regional de los SIGED aporta el punto de partida comparativo [(Arias Ortiz et al., 2021a)](#tg_ref_existing_307e010f1326), mientras que la OECD y UNESCO permiten contrastar esa lectura con tendencias de arquitectura, gobernanza y uso de datos [(OECD, 2023](#tg_ref_existing_5b8e9740991c); [UNESCO IIEP, 2024)](#tg_ref_existing_ff6c4950b940).

No se plantea una revisión sistemática exhaustiva. El propósito es más acotado: reconocer soluciones y criterios que afectan decisiones concretas del sistema propuesto, registrar sus límites y evitar que la selección tecnológica se apoye solo en preferencias del desarrollador.

La lectura se hizo con cinco preguntas constantes: qué dato conserva cada referente, cómo mantiene la identidad del estudiante, qué mecanismos de intercambio documenta, quién utiliza la información y qué rastro deja una modificación. Ese filtro evita comparar plataformas por cantidad de pantallas. Un SIGED puede cubrir muchas tareas y, aun así, producir registros inconexos si no define responsables, reglas de calidad y una ruta de corrección [(Arias Ortiz et al., 2021a](#tg_ref_existing_307e010f1326); [UNESCO IIEP, 2024)](#tg_ref_existing_e9b5741af95e).

Las fuentes públicas sostienen tendencias y decisiones técnicas; no prueban cómo trabaja el Colegio Comunidad Cristiana. Toda frase sobre herramientas usadas, tiempos, duplicidad de registros, número de participantes, permisos o necesidades de las familias se trata como dato institucional y queda sujeta a certificación. La Tabla 2.2 conserva esa separación.

### 2.12.2 TENDENCIAS EN LOS SISTEMAS DE INFORMACIÓN EDUCATIVA

La literatura revisada muestra un desplazamiento claro: el sistema educativo ya no se entiende como un repositorio de matrículas y notas, sino como una red de registros longitudinales que deben poder reutilizarse para operación, seguimiento y decisión. En los 16 sistemas examinados por el BID, la fragmentación y la madurez desigual siguen siendo problemas frecuentes [(Arias Ortiz et al., 2021a)](#tg_ref_existing_307e010f1326). La OECD añade dos exigencias prácticas: identificación consistente del estudiante e interoperabilidad entre herramientas [(OECD, 2023)](#tg_ref_existing_5b8e9740991c).

UNESCO IIEP describe los sistemas de información para la gestión educativa como un conjunto coordinado de personas, procesos y tecnologías para recopilar, procesar, almacenar y analizar datos, no como una aplicación aislada [(UNESCO IIEP, 2024)](#tg_ref_existing_e9b5741af95e). Para este proyecto, esa distinción obliga a conservar trazabilidad desde la captura institucional hasta la verificación en el sistema estatal. La calidad no termina cuando el formulario se guarda.

El registro longitudinal exige una identidad estable mientras cambian curso, paralelo, gestión, tutor o estado de matrícula. La OECD vincula esta continuidad con la reutilización de datos y la conexión entre herramientas; ISO/IEC 25012 suma exactitud, completitud, consistencia y trazabilidad como propiedades de calidad [(OECD, 2023](#tg_ref_existing_5b8e9740991c); [ISO/IEC, 2008)](#tg_ref_iso25012). En el proyecto esto se traduce en registro maestro, historial de cambios y validaciones antes del envío.

Interoperar tampoco equivale a exportar un archivo. Hace falta correspondencia de campos, identificación del origen, control de versiones y confirmación del resultado. Cuando dos plataformas obligan a volver a escribir la misma información, crecen la demora y las discrepancias; la OECD señala la interoperabilidad como condición para reducir recapturas y mejorar la oportunidad del dato [(OECD, 2023)](#tg_ref_existing_2b20d67be520).

### 2.12.3 PLATAFORMAS PÚBLICAS Y PRIVADAS EXAMINADAS

El SIE boliviano constituye el destino oficial de parte de la información académica y publica módulos para cursos, personal, estudiantes, inscripción y calificaciones [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b)](#tg_ref_minedu_sie). Su función estatal no reemplaza las necesidades cotidianas de una unidad educativa: control interno, consulta móvil de padres, auditoría de cambios y preparación de datos antes del registro oficial. El SIAGIE peruano ofrece un referente público comparable por su alcance nacional [(Ministerio de Educación del Perú, 2026)](#tg_ref_existing_f3069f4a4118).

En el ámbito privado, SieWeb reúne matrícula, asistencia, evaluación y comunicación con familias en una misma oferta [(SieWeb, 2026)](#tg_ref_existing_121ad1d6341e). Ese antecedente confirma que la demanda institucional excede el registro administrativo básico. También deja una diferencia decisiva: una plataforma comercial regional no documenta, para el caso revisado, la conciliación específica con el SIE boliviano ni la evidencia de cada ejecución automatizada.

Los referentes cumplen papeles distintos. El SIE es el destino estatal; SIAGIE muestra cómo otro país organiza una plataforma pública de gestión escolar; SieWeb reúne matrícula, asistencia, evaluación y comunicación en una oferta privada. Ninguno puede copiarse sin ajuste, pues cambian la normativa, los campos oficiales, los responsables y el control de datos [(Ministerio de Educación de Bolivia, 2026b](#tg_ref_minedu_sie); [Ministerio de Educación del Perú, 2026](#tg_ref_existing_f3069f4a4118); [SieWeb, 2026)](#tg_ref_existing_121ad1d6341e).

En la documentación pública oficial revisada no se identificó una API del SIE destinada a la integración de una unidad educativa. El hallazgo se limita a las páginas y documentos consultados; no demuestra que esa interfaz no exista en canales restringidos. Mientras no haya confirmación oficial, la automatización de navegador se presenta como alternativa condicionada, nunca como acceso garantizado.

### 2.12.4 ALERTAS, INTEROPERABILIDAD Y AUTOMATIZACIÓN

Los sistemas de alerta temprana convierten señales como asistencia, rendimiento y trayectoria en criterios de intervención; su utilidad depende de reglas transparentes, calidad del dato y una respuesta institucional definida [(Arias Ortiz et al., 2021b)](#tg_ref_arias_alerta). Los tableros escolares añaden otra lección: mostrar datos no garantiza su uso. La información debe llegar a docentes y directivos con contexto, periodicidad y acciones reconocibles [(Bergamaschi et al., 2025)](#tg_ref_bergamaschi_dashboards).

Cuando el sistema externo no ofrece una interfaz pública documentada, la automatización robótica puede reducir recapturas, aunque introduce dependencia de la interfaz, manejo de credenciales y fallos transitorios. La revisión sistemática de adopción de RPA identifica beneficios operativos junto con retos de gobernanza y mantenimiento [(da Silva Costa et al., 2022)](#tg_ref_existing_55bed1ec9174). De ahí se deriva una regla del diseño: cada envío debe registrar estado, reintento, resultado y verificación posterior; automatizar clics sin conciliación no resuelve la consistencia.

La consulta móvil para padres y tutores requiere información breve, actualizada y comprensible: asistencia, calificaciones, avisos y alertas con un responsable reconocible. UNESCO advierte que la tecnología favorece la participación familiar cuando se adapta al contexto y no reemplaza el vínculo entre familia y escuela [(UNESCO, 2023)](#tg_ref_existing_03da920d0a21). Por eso el sistema debe registrar si una alerta fue atendida y qué actuación siguió.

Las alertas tempranas comparten esa exigencia de cierre. La regla detecta inasistencia o caída de rendimiento; su valor aparece cuando asigna destinatario, conserva el indicador de origen y permite documentar la intervención. Los tableros deben llevar del indicador al caso que exige atención [(Arias Ortiz et al., 2021b](#tg_ref_arias_alerta); [Bergamaschi et al., 2025)](#tg_ref_bergamaschi_dashboards).

### 2.12.5 COMPARACIÓN DE REFERENTES

La Tabla 2.1 ordena los referentes por el aporte que ofrecen al proyecto y por aquello que todavía dejan sin resolver. La última columna convierte la revisión documental en una decisión verificable de diseño.

<a id="tg_table_2_1_state_art"></a>*Tabla 2.1. Comparación de referentes del estado del arte*

| **Referencia y contexto** | **Aporte observado** | **Limitación frente al proyecto** | **Decisión derivada** |
| --- | --- | --- | --- |
| [Arias Ortiz et al. (2021a)](#tg_ref_existing_307e010f1326) — diagnóstico de 16 SIGED de América Latina y el Caribe. | Expone niveles de madurez, fragmentación y ruta de transformación digital de la gestión educativa. | Trabaja a escala de sistema educativo; no especifica el flujo operativo de una unidad ni la sincronización con el SIE boliviano. | Usar un registro institucional central y diseñar la integración como proceso trazable, no como carga aislada. |
| [OECD (2023)](#tg_ref_existing_5b8e9740991c) — sistemas de información estudiantil. | Relaciona expedientes longitudinales, identificación, informes e interoperabilidad entre herramientas. | No prescribe una arquitectura ni una solución para instituciones con doble registro local y estatal. | Mantener identidad estable del estudiante y reutilizar el mismo dato en módulos web, móvil y de sincronización. |
| [UNESCO IIEP (2024)](#tg_ref_existing_e9b5741af95e) — gestión educativa basada en datos. | Sitúa personas, procesos, gobernanza y tecnología dentro del mismo sistema de información. | El marco es institucional y de política; no baja al control técnico de cada transacción. | Asignar responsables, validaciones y evidencia de auditoría a cada etapa del dato académico. |
| [SIE de Bolivia (2026)](#tg_ref_minedu_sie) — plataforma pública nacional. | Es el destino oficial para módulos de estudiantes, inscripciones, cursos, personal y calificaciones. | No cubre por sí solo la operación interna descrita por el colegio ni publica, en las fuentes revisadas, una API para esta integración. | Tratar el SIE como sistema externo; preparar, autorizar, enviar, leer y conciliar cada operación. |
| [SIAGIE de Perú (2026)](#tg_ref_existing_f3069f4a4118) — referente público regional. | Confirma el uso de plataformas nacionales para apoyar la gestión de instituciones educativas. | Su marco normativo y sus procesos no son trasladables de forma directa al contexto boliviano. | Tomarlo como comparación funcional, no como plantilla normativa o técnica. |
| [SieWeb (2026)](#tg_ref_existing_121ad1d6341e) — plataforma privada escolar. | Reúne matrícula, evaluación, asistencia y comunicación con familias en una oferta institucional. | La documentación pública revisada no acredita conciliación específica con el SIE boliviano ni control local del código. | Conservar módulos equivalentes, pero adaptar reglas, roles y sincronización a la institución estudiada. |
| [Arias Ortiz et al. (2021b)](#tg_ref_arias_alerta) y [Bergamaschi et al. (2025)](#tg_ref_bergamaschi_dashboards) — alertas y tableros. | Vinculan señales académicas con intervención y explican condiciones para que los datos se utilicen en la escuela. | Una alerta o un tablero aislado no corrige registros inconsistentes ni define responsables de actuación. | Generar alertas explicables, con datos validados, destinatario, seguimiento y cierre. |
| [da Silva Costa et al. (2022)](#tg_ref_existing_55bed1ec9174) — revisión de adopción de RPA. | Sistematiza beneficios, restricciones y condiciones organizativas de la automatización robótica. | RPA hereda cambios de interfaz y exige gobierno de credenciales, excepciones y mantenimiento. | Usarla como adaptador externo controlado, con cola, reintentos, idempotencia, verificación y auditoría. |

Fuente: Elaboración propia, 2026, con base en [Arias Ortiz et al. (2021a)](#tg_ref_existing_307e010f1326) y [Arias Ortiz et al. (2021b)](#tg_ref_arias_alerta), [OECD (2023)](#tg_ref_existing_5b8e9740991c), [UNESCO IIEP (2024)](#tg_ref_existing_e9b5741af95e), [Bergamaschi et al. (2025)](#tg_ref_bergamaschi_dashboards) y documentación oficial de las plataformas examinadas.

### 2.12.6 ELEMENTOS SOLICITADOS PARA EL SISTEMA Y RESPALDO DEL ESTADO DEL ARTE

Los elementos pedidos para el sistema coinciden con problemas estudiados en los SIGED, pero esa coincidencia no basta para afirmar que el colegio los solicitó. Cada punto se trabaja en dos planos: la razón técnica sustentada por fuentes y la necesidad local que debe quedar firmada por la institución. Así se evita presentar como hecho una inferencia del autor.

#### 2.12.6.1 REGISTRO MAESTRO DEL ESTUDIANTE, RUDE Y MATRÍCULA

Los sistemas estudiantiles necesitan una identidad persistente para relacionar matrícula, curso, gestión e historial. El proyecto propone un registro maestro que conserve los datos RUDE y evite crear alumnos distintos por cada gestión [(OECD, 2023](#tg_ref_existing_5b8e9740991c); [ISO/IEC, 2008)](#tg_ref_iso25012). Los campos usados y la existencia real de duplicados deben certificarse en los [Anexos D](#anexo_d) y [F](#anexo_f).

#### 2.12.6.2 CALIFICACIONES, ASISTENCIA E HISTORIAL ACADÉMICO

Calificaciones y asistencia forman una secuencia: se capturan, validan, consolidan y luego alimentan reportes o alertas. El historial permite revisar qué cambió, cuándo y por quién. La literatura respalda el valor de los registros longitudinales y de la calidad del dato [(OECD, 2023](#tg_ref_existing_5b8e9740991c); [UNESCO IIEP, 2024)](#tg_ref_existing_e9b5741af95e); los responsables, cierres y reglas de la institución requieren validación en el [Anexo G](#anexo_g).

#### 2.12.6.3 CONSULTA MÓVIL PARA PADRES Y TUTORES

La aplicación móvil se justifica como canal de consulta de asistencia, calificaciones, comunicados y alertas, con datos filtrados por el vínculo tutor–estudiante. La evidencia externa sostiene la necesidad de adaptar la participación familiar al contexto [(UNESCO, 2023)](#tg_ref_existing_03da920d0a21). Las pantallas, el canal preferido y las personas autorizadas deben aprobarse en los [Anexos G](#anexo_g) y [J](#anexo_j).

#### 2.12.6.4 ALERTAS Y TABLEROS DE SEGUIMIENTO

Una alerta útil conserva la condición que la disparó, el estudiante afectado, el destinatario, la actuación y el cierre. El tablero debe permitir pasar del indicador al caso que exige atención [(Arias Ortiz et al., 2021b](#tg_ref_arias_alerta); [Bergamaschi et al., 2025)](#tg_ref_bergamaschi_dashboards). Los umbrales de inasistencia o rendimiento son reglas del colegio y requieren firma en el [Anexo G](#anexo_g).

#### 2.12.6.5 ROLES, PRIVACIDAD Y AUDITORÍA

Los datos de menores exigen acceso por función, registro de operaciones sensibles y separación entre consulta y modificación. El estado del arte respalda gobernar el dato y conservar trazabilidad [(UNESCO IIEP, 2024](#tg_ref_existing_e9b5741af95e); [ISO/IEC, 2008)](#tg_ref_iso25012). La matriz concreta de director, secretaría, docente, padre o tutor debe validarse en el [Anexo G](#anexo_g).

#### 2.12.6.6 SINCRONIZACIÓN, VERIFICACIÓN Y CONCILIACIÓN CON EL SIE

El envío al SIE debe tratarse como un proceso con preparación, autorización, ejecución, lectura del resultado, verificación y conciliación. Si no existe una API habilitada, la automatización de navegador solo es admisible con autorización escrita, custodia de credenciales y registro de cada intento [(da Silva Costa et al., 2022)](#tg_ref_existing_55bed1ec9174). Los datos a transferir y el permiso institucional deben constar en el [Anexo H](#anexo_h). Esa carta no sustituye una autorización que corresponda al Ministerio.

#### 2.12.6.7 REPORTES PARA OPERACIÓN Y TOMA DE DECISIONES

Los reportes deben responder preguntas concretas: matrícula vigente, asistencia acumulada, estudiantes con alerta, cierre de notas y diferencias frente al SIE. La gestión basada en datos exige información oportuna, comprensible y vinculada a una decisión [(UNESCO IIEP, 2024](#tg_ref_existing_e9b5741af95e); [Bergamaschi et al., 2025)](#tg_ref_bergamaschi_dashboards). El catálogo final y su frecuencia deben aprobarse en los [Anexos G](#anexo_g) y [J](#anexo_j).

#### 2.12.6.8 AFIRMACIONES QUE REQUIEREN RESPALDO FIRMADO

**No requieren firma del colegio:** las definiciones, tendencias, características de plataformas y criterios técnicos respaldados por bibliografía. **Sí requieren firma o acta:** los hechos que describen la realidad, autorización o aceptación del colegio. En particular:

• herramientas realmente utilizadas, formularios vigentes y existencia de doble registro — [Anexos D](#anexo_d) y [F](#anexo_f);

• cantidad de estudiantes, personal participante, tiempos, frecuencias de error y volúmenes de trabajo — [Anexos C](#anexo_c), [E](#anexo_e) e [I](#anexo_i);

• actores, permisos, reglas de negocio, umbrales de alerta y funciones para padres o tutores — [Anexo G](#anexo_g);

• campos y procesos que se pretende sincronizar, uso de credenciales y autorización de pruebas con el SIE — [Anexo H](#anexo_h), sin reemplazar el permiso de la autoridad externa cuando corresponda;

• aceptación de requerimientos, proceso propuesto, interfaces y resultado final — [Anexos G](#anexo_g) y [J](#anexo_j);

• nombre oficial, dependencia, turno, código institucional y autorización para tratar datos — [Anexos B](#anexo_b) y [C](#anexo_c).

<a id="tg_table_2_2_state_requirements"></a>*Tabla 2.2. Elementos solicitados, respaldo documental y evidencia institucional requerida*

| **Elemento** | **Respaldo del estado del arte** | **Aplicación al proyecto** | **Evidencia que debe firmarse** |
| --- | --- | --- | --- |
| Registro maestro, RUDE y matrícula | Identidad estable, registros longitudinales y calidad del dato. | Unificar al estudiante y relacionar sus gestiones sin duplicarlo. | Anexos D y F: campos usados, duplicidades y proceso actual. |
| Calificaciones, asistencia e historial | Seguimiento longitudinal, oportunidad y trazabilidad. | Validar, cerrar periodos y conservar quién modificó cada dato. | Anexo G: responsables, reglas de cierre y aceptación. |
| Consulta móvil para familias | Participación familiar adaptada al contexto. | Mostrar solo estudiantes vinculados y datos pertinentes. | Anexos G y J: funciones, autorizaciones y aceptación. |
| Alertas y tableros | Indicadores accionables, destinatario e intervención. | Registrar origen, responsable, atención y cierre. | Anexo G: umbrales, estados y responsables. |
| Roles, privacidad y auditoría | Gobernanza, trazabilidad y control por función. | Separar consulta, registro, aprobación y administración. | Anexos G y H: acceso y autorización de datos. |
| Sincronización y conciliación con el SIE | Interoperabilidad controlada, excepciones y verificación. | Preparar, enviar, comprobar, comparar y conservar evidencia. | Anexo H y, si corresponde, autorización ministerial. |
| Reportes operativos y de decisión | Información oportuna ligada a preguntas y acciones. | Reportar matrícula, asistencia, alertas, cierres y diferencias. | Anexos G y J: catálogo y aceptación final. |

Fuente: Elaboración propia, 2026, con base en [Arias Ortiz et al. (2021a](#tg_ref_existing_307e010f1326); [OECD, 2023](#tg_ref_existing_5b8e9740991c); [UNESCO, 2023](#tg_ref_existing_03da920d0a21); [UNESCO IIEP, 2024](#tg_ref_existing_e9b5741af95e); [Bergamaschi et al., 2025](#tg_ref_bergamaschi_dashboards) e [ISO/IEC 25012:2008)](#tg_ref_iso25012).

### 2.12.7 BRECHA IDENTIFICADA Y APORTE DEL PROYECTO

Dentro del conjunto revisado no se encontró una solución documentada que reúna, en una sola propuesta para una unidad educativa boliviana, registro académico maestro, operación web, consulta móvil de familias, alertas, auditoría y sincronización asíncrona verificada con el SIE. Los referentes cubren partes del problema; la brecha aparece en la coordinación entre esas partes y en la evidencia posterior al envío.

El aporte del proyecto se ubica ahí: modela un flujo en el que la información se valida antes de salir, se procesa mediante una cola, se contrasta con el destino y conserva un resultado auditable. La secuencia completa, sus actores y decisiones se presentan en el [Anexo L](#anexo-l-diagrama-general-de-procesos-académicos-y-sincronización-con-el-sie). El diagrama emplea carriles, actividades y compuertas coherentes con el propósito de BPMN de representar procesos comprensibles para participantes técnicos y de negocio [(Object Management Group, 2014)](#tg_ref_omg_bpmn).

# CAPÍTULO III INGENIERÍA DEL PROYECTO

**ALCANCE Y CRITERIOS UTILIZADOS PARA EL DIAGNÓSTICO Y DISEÑO**

El presente capítulo desarrolla el diagnóstico del proceso de gestión académica del Colegio Comunidad Cristiana de Santa Cruz de la Sierra y transforma los problemas identificados en una propuesta de solución tecnológica formalmente especificada. A diferencia del capítulo teórico, cuya finalidad es establecer las bases conceptuales, este capítulo se concentra en el contexto real de aplicación, el análisis de los procesos actuales, la definición de requerimientos, el modelado funcional, la arquitectura, el modelo de datos, la interoperabilidad con el Sistema de Información Educativa —SIE—, la seguridad y la planificación del desarrollo.

La investigación documental realizada confirma que el Colegio Comunidad Cristiana dispone públicamente de una plataforma institucional correspondiente al turno mañana, en la cual se distinguen accesos denominados “Ingreso al Sistema” y “Sistema Administrativo”. El acceso administrativo se encuentra protegido mediante credenciales de usuario y contraseña, mientras que el ingreso general contempla selección de tipo de cuenta. Estos elementos demuestran la existencia de antecedentes de digitalización institucional, aunque las áreas autenticadas no son públicamente inspeccionables y, por tanto, no corresponde atribuirles funcionalidades que no hayan sido verificadas directamente durante el levantamiento institucional. [(Colegio Comunidad Cristiana, 2026)](#tg_ref_college_site).

En el ámbito externo, el Ministerio de Educación identifica dentro de su ecosistema SIE al SIE Académico como el sistema de administración de información académica para unidades educativas del Subsistema de Educación Regular. Entre las funciones descritas oficialmente se encuentran la creación de cursos, el registro de áreas, personal docente y administrativo, inscripciones y calificaciones. Por tanto, la solución del presente proyecto no pretende sustituir al SIE como sistema oficial del Estado, sino funcionar como plataforma operativa institucional y facilitar la preparación, seguimiento, transferencia, verificación y auditoría de la información que corresponda registrar ante dicho sistema. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b)](#tg_ref_minedu_sie).

Esta diferenciación es esencial. La plataforma propuesta se concibe como la fuente operativa institucional para la gestión cotidiana del colegio, mientras que el SIE continúa siendo el sistema externo oficial en los procesos que determine el Ministerio de Educación. En consecuencia, la sincronización no debe interpretarse como una replicación indiscriminada de bases de datos, sino como un proceso controlado de preparación, envío, comprobación y conciliación de aquellos datos cuya transferencia corresponda normativa y funcionalmente.

La Resolución Ministerial N.° 0001/2026 establece que el registro y actualización del RUDE se realiza mediante las herramientas informáticas del SIE, responsabiliza a la dirección de la unidad educativa por la calidad de la información reportada y exige evitar duplicidades del código RUDE. La misma norma asigna a los directores responsabilidad sobre la inscripción correcta del estudiante para prevenir duplicidades, omisiones y otros errores en SIE Académico. Estas disposiciones justifican que la solución diseñada incorpore controles de integridad, validaciones previas, trazabilidad y una etapa posterior de verificación. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

El diagnóstico distingue entre evidencia disponible y validaciones pendientes. La carta institucional confirma la autorización del estudio, la denominación oficial, el turno, el código SIE y las condiciones generales de acceso a información anonimizada (véase Anexo B). El cuestionario disponible recoge exclusivamente la percepción de la directora (véase Anexo A). Las cifras de población, tiempos, consumo, instrumentos aplicados y resultados generales sólo se consideran confirmadas cuando los campos y opciones de las certificaciones respectivas estén completados (véanse Anexos C, D, E, F e I). En consecuencia, esta versión no inventa porcentajes, promedios ni frecuencias y formula como propuestas los elementos que aún requieren validación.

## 3.1 ANÁLISIS DEL CONTEXTO DEL COLEGIO COMUNIDAD CRISTIANA

### 3.1.1 DESCRIPCIÓN DE LA INSTITUCIÓN

La Unidad Educativa Comunidad Cristiana B se encuentra en Santa Cruz de la Sierra, funciona en el turno mañana y posee el código SIE N.° 81981191, datos certificados por Dirección (véase Anexo B). Su sitio institucional público muestra accesos diferenciados al sistema general y al sistema administrativo, aunque las áreas autenticadas no se atribuyen a funciones que no hayan sido verificadas directamente (Colegio Comunidad Cristiana, 2026).

Desde la perspectiva del presente proyecto, la característica relevante de la institución no es únicamente su infraestructura tecnológica existente, sino la cantidad de procesos que dependen de información académica compartida. El registro de un estudiante, por ejemplo, no constituye un hecho aislado: sus datos se relacionan posteriormente con una inscripción, nivel de escolaridad, paralelo, asignaturas, calificaciones, asistencias, alertas, reportes, responsables familiares e información que eventualmente debe ser registrada o contrastada con sistemas externos.

Esta interdependencia genera la necesidad de establecer una fuente institucional coherente de información académica. Cuando diferentes actividades operan sobre registros separados, la misma información puede ser capturada varias veces y evolucionar de manera distinta entre una fuente y otra. Un cambio de domicilio, teléfono del tutor, paralelo, inscripción o dato personal puede encontrarse actualizado en un registro y permanecer desactualizado en otro. El problema deja entonces de ser exclusivamente administrativo y se convierte en un problema de integridad y gobierno de datos.

La solución tecnológica propuesta responde a este contexto mediante una plataforma web para las operaciones administrativas y académicas, acompañada de una aplicación móvil dirigida a padres y tutores. Ambas consumen un mismo backend y una misma base institucional, evitando convertir la aplicación móvil en una segunda fuente independiente.

Un tercer componente corresponde a la integración con SIE Académico. El Ministerio de Educación lo define oficialmente como el sistema que administra información académica de las unidades educativas del Subsistema de Educación Regular, incluyendo cursos, personal, inscripciones y calificaciones. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b)](#tg_ref_minedu_sie).

El proyecto se sitúa, por consiguiente, en la intersección de tres necesidades institucionales: gestión académica interna, acceso oportuno a información para las familias e interoperabilidad controlada con el sistema educativo oficial.

### 3.1.2 ORGANIZACIÓN DEL PROCESO ACADÉMICO

Para efectos del sistema, el proceso académico se modela como un ciclo de información y no únicamente como una secuencia de pantallas. El ciclo comienza con la identificación del estudiante y sus responsables, continúa con la inscripción en una gestión académica determinada, la asignación de grado y paralelo, la vinculación con asignaturas y docentes, el registro periódico de calificaciones y asistencia y, finalmente, la consolidación de información en historiales y reportes.

La normativa nacional respalda esta consideración integral de la gestión educativa. La Resolución Ministerial N.° 0001/2026 señala que la gestión educativa comprende procesos de inscripción, planificación, organización, desarrollo y evaluación de actividades pedagógicas, curriculares y administrativas. Asimismo, la disposición es de cumplimiento obligatorio para unidades educativas fiscales, privadas y de convenio. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

En la solución planteada, la organización lógica del proceso académico se divide en los siguientes dominios funcionales: identidad y acceso; registro estudiantil; estructura académica; inscripción; evaluación y calificaciones; asistencia; seguimiento y alertas; comunicación con padres y tutores; reportes e historial; integración SIE; y auditoría.

Esta división permite representar adecuadamente la relación entre procesos sin convertir cada uno en una aplicación aislada. Por ejemplo, el módulo de calificaciones no administra nuevamente estudiantes, sino que utiliza la identidad y la inscripción ya existentes. Del mismo modo, la aplicación móvil no crea una base paralela de calificaciones, sino que consulta las mismas calificaciones autorizadas desde la API.

La gestión se organiza además alrededor de una gestión académica o año escolar, lo que evita mezclar información histórica con la gestión vigente. Un estudiante puede continuar en la institución durante varios años, pero cada año genera una inscripción distinta. Este principio resulta fundamental para conservar el historial: actualizar el curso actual de un estudiante nunca debe borrar el curso al que perteneció durante una gestión anterior.

### 3.1.3 ACTORES INVOLUCRADOS EN LA GESTIÓN ACADÉMICA

Se identifican cuatro grupos de actores principales dentro del alcance funcional.

El personal administrativo interviene en los procesos de registro, actualización de información, estructura institucional, inscripciones y operaciones de soporte. Su interacción exige permisos amplios sobre información estudiantil, aunque no necesariamente sobre todas las funciones técnicas o de configuración.

La dirección posee responsabilidad de supervisión y control. Este perfil requiere acceso a reportes consolidados, historial de operaciones, estados de sincronización con el SIE, discrepancias y mecanismos de autorización para cambios considerados sensibles.

Los docentes generan una proporción importante de la información académica diaria, particularmente calificaciones y asistencia. El sistema debe limitar su acceso a los cursos, paralelos, asignaturas y estudiantes que les hayan sido asignados. Un docente no debe obtener acceso general a información académica ajena a su responsabilidad pedagógica.

Los padres, madres o tutores constituyen el principal usuario de la aplicación móvil. Su acceso es distinto al de los actores internos: se limita a información de los estudiantes respecto de los cuales exista una vinculación autorizada en el sistema. La relación tutor-estudiante, por tanto, debe existir como una relación explícita de datos y no como una inferencia basada únicamente en coincidencias de apellidos o datos de contacto.

La normativa educativa de 2026 contempla expresamente la participación de padres, madres y tutores como actores de la comunidad educativa y asigna responsabilidades formales en procesos como la documentación del RUDE. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

La matriz consolidada de actores y permisos se presenta posteriormente en la Tabla 3.3. Su validación se documenta mediante el acta correspondiente cuando se completen las opciones y observaciones (véase Anexo G).

### 3.1.4 HERRAMIENTAS UTILIZADAS ACTUALMENTE

El análisis debe diferenciar las herramientas institucionales internas de las plataformas externas. Públicamente, el colegio evidencia una plataforma con acceso general y un sistema administrativo protegido mediante credenciales. [(Colegio Comunidad Cristiana, 2026)](#tg_ref_college_site).

A ello se suma SIE Académico, que constituye una herramienta externa administrada por el Ministerio de Educación. El portal oficial del Ministerio identifica específicamente el SIE Académico como sistema para unidades educativas y expone su acceso mediante una aplicación web. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b)](#tg_ref_minedu_sie).

Dentro del diagnóstico se consideran documentos, hojas de cálculo, reportes, formularios físicos y medios de comunicación únicamente cuando su uso sea marcado y descrito en la certificación institucional. La dificultad no proviene de la herramienta por sí misma, sino de la coexistencia de fuentes independientes que puede exigir recapturas manuales. La confirmación de herramientas, finalidad y dificultades observadas debe quedar registrada en el Anexo D.

Por esta razón, la solución no se plantea simplemente como “reemplazo de Excel” o “reemplazo del sistema anterior”. Se propone reorganizar el ciclo de vida del dato académico, estableciendo dónde se crea, quién puede modificarlo, qué reglas debe cumplir, qué cambios quedan registrados y cuándo debe sincronizarse con sistemas externos.

### 3.1.5 FUENTES DE INFORMACIÓN ACADÉMICA EXISTENTES

Las fuentes de información identificadas pueden agruparse en cinco categorías: datos personales y de registro; información de inscripción y estructura académica; calificaciones; asistencia; y registros externos del SIE.

El sistema propuesto debe establecer un propietario lógico para cada dato. Por ejemplo, la base institucional será la fuente operativa de las calificaciones capturadas por docentes, mientras que la información oficialmente registrada en SIE será almacenada como evidencia de verificación, no como sustitución automática del valor institucional.

Esta separación es relevante porque una discrepancia no siempre significa que el dato local esté equivocado. Si el sistema institucional registra una calificación de 85 y la lectura posterior del SIE muestra 80, sobrescribir automáticamente el valor local destruiría la evidencia necesaria para investigar la diferencia. El diseño establece, en cambio, una entidad de conciliación que conserva ambos valores, identifica el estado de discrepancia y exige una decisión controlada.

La Tabla 3.1 resume las fuentes de información propuestas y su tratamiento.

<a id="tg_table_2_1"></a>Tabla 3.1. Fuentes de información académica y tratamiento propuesto

| **Fuente** | **Información principal** | **Tratamiento en la solución** | **Autoridad / responsabilidad** |
| --- | --- | --- | --- |
| Expediente institucional | Identificación y datos personales | Registro maestro institucional | Administración |
| Registro de tutores | Responsables y contactos | Relación explícita estudiante–tutor | Administración |
| Inscripciones | Gestión, nivel, curso, paralelo | Registro histórico por gestión | Administración / Dirección |
| Registro docente | Calificaciones | Almacenamiento institucional con trazabilidad | Docente autorizado |
| Registro de asistencia | Presencia, ausencia, atrasos | Registro centralizado | Docente autorizado |
| Sistema institucional | Historial académico | Fuente operativa para consultas | Colegio |
| SIE Académico | Inscripciones, calificaciones y datos oficialmente gestionados allí | Sistema externo; sincronización y verificación | Ministerio / responsables institucionales |
| Auditoría | Cambios y operaciones sensibles | Registro de sólo lectura para usuarios ordinarios | Sistema / Dirección |

Fuente: Elaboración propia, 2026, con base en el diagnóstico y en el [Ministerio de Educación del Estado Plurinacional de Bolivia (2026b)](#tg_ref_minedu_rm_2026).

## 3.2 DIAGNÓSTICO DEL PROCESO ACTUAL

### 3.2.1 PROCESO ACTUAL DE REGISTRO DE INFORMACIÓN ESTUDIANTIL

El registro estudiantil constituye la base de la gestión académica. Durante este proceso se recopilan datos de identificación del estudiante, información de contacto, responsables familiares, documentación e información necesaria para su inscripción.

En el ámbito nacional, el RUDE cumple una función central. La normativa de 2026 establece que el formulario de inscripción/actualización RUDE permite identificar al estudiante y que su registro y actualización se realiza empleando herramientas del SIE. Asimismo, atribuye a la dirección responsabilidad sobre la calidad de la información reportada y sobre la prevención de duplicidades del código RUDE. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Por ello, el diagnóstico considera especialmente crítico cualquier proceso en el que los mismos datos identificativos tengan que capturarse nuevamente en varias herramientas. Cada recaptura manual añade una oportunidad de generar diferencias ortográficas, códigos equivocados, campos omitidos o información desactualizada.

La propuesta establece que un estudiante sea creado una única vez en el dominio estudiantil y que sus inscripciones posteriores lo referencien mediante un identificador interno permanente. El código RUDE, cuando corresponda y se encuentre disponible, se almacena como identificador externo con restricción de unicidad.

### 3.2.2 PROCESO ACTUAL DE ACTUALIZACIÓN DE INFORMACIÓN

Los datos académicos no son estáticos. Durante la permanencia de un estudiante pueden modificarse teléfonos, domicilios, responsables, contactos de emergencia, documentación, curso, paralelo o condiciones de inscripción.

Cuando la actualización se ejecuta independientemente sobre diferentes registros, se produce el riesgo de divergencia. El sistema puede indicar un teléfono mientras otro archivo conserva el anterior; una inscripción puede reflejar un paralelo diferente al registrado en otra herramienta.

La RM N.° 0001/2026 contempla expresamente la actualización de datos RUDE para traslados, cambios de domicilio y otros datos pertinentes. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

La solución propuesta introduce un mecanismo de actualización centralizada acompañado de auditoría. La modificación no se limita a almacenar el nuevo valor: los cambios sensibles deben conservar el valor anterior, nuevo valor, usuario responsable, fecha y motivo cuando corresponda.

Con ello, preguntas como “¿quién modificó el paralelo del estudiante?” o “¿qué número de documento estaba registrado antes?” dejan de depender de memoria informal.

### 3.2.3 PROCESO ACTUAL DE REGISTRO DE CALIFICACIONES

El registro de calificaciones es uno de los procesos con mayor sensibilidad, porque su información tiene efecto académico directo y posteriormente puede requerir transferencia al SIE.

La normativa 2026 define la evaluación como un proceso sistemático y participativo orientado a apoyar decisiones oportunas sobre el aprendizaje. También establece parámetros oficiales de evaluación para el Subsistema de Educación Regular. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Desde el punto de vista del sistema, una calificación no debe almacenarse únicamente como un número asociado a un estudiante. Requiere contexto: gestión académica, inscripción, asignatura, docente o asignación académica, período de evaluación, estado de publicación y trazabilidad de modificaciones.

El principal riesgo del proceso fragmentado se presenta cuando una calificación debe ser digitada en un registro interno y luego nuevamente en SIE. Si ambas operaciones son manuales, existe una ventana de inconsistencia: el docente puede haber corregido un valor local mientras el SIE mantiene el anterior, o puede ocurrir un error al transcribirlo.

Por ello, la propuesta considera la calificación como un agregado controlado. Antes de ser sincronizable deberá satisfacer reglas de rango, período abierto, asignación válida y estado autorizado.

### 3.2.4 PROCESO ACTUAL DE CONTROL DE ASISTENCIA

El control de asistencia genera datos de alta frecuencia. Cada registro debe relacionar al estudiante con una fecha y un estado definido: presente, ausente, atraso, ausencia justificada u otra clasificación institucional formalmente aprobada.

Cuando la asistencia queda desconectada del seguimiento académico, su utilidad se reduce a un registro histórico. En cambio, si se procesa como parte de la misma plataforma, puede alimentar alertas, reportes y consultas de padres.

La solución propone integrar la asistencia con la inscripción activa del estudiante. Esto evita registrar asistencia para estudiantes que no pertenecen al curso o período seleccionado.

También se incluyen controles de unicidad para prevenir dos registros contradictorios sobre el mismo estudiante en la misma unidad temporal definida por la institución.

### 3.2.5 PROCESO ACTUAL DE SEGUIMIENTO ACADÉMICO

El seguimiento académico requiere combinar información que normalmente se origina en módulos diferentes. Una calificación baja aislada puede no representar una tendencia; varias evaluaciones por debajo del criterio institucional acompañadas de ausencias recurrentes constituyen, en cambio, un indicador que amerita revisión.

El diagnóstico identifica la necesidad de pasar de una gestión principalmente registral a una gestión también orientada al seguimiento. Esto significa que el sistema no solamente almacene acontecimientos, sino que permita identificar estudiantes que requieren atención con base en criterios explícitos definidos por la institución.

El seguimiento no se concibe como un sistema de inteligencia artificial o predicción automática. En el alcance de este proyecto, se basa en reglas transparentes, por ejemplo: calificación inferior a un umbral, número determinado de ausencias, repetición de atrasos o acumulación de alertas sin atención.

Esta elección favorece explicabilidad. Todo usuario puede conocer por qué fue generada una alerta y qué dato la originó.

### 3.2.6 PROCESO ACTUAL DE TRANSFERENCIA DE INFORMACIÓN AL SIE

La transferencia de información al SIE representa el punto de mayor dependencia externa del proyecto.

El Ministerio publica SIE Académico como una aplicación web destinada a administrar cursos, áreas, personal, inscripciones y calificaciones. En la documentación pública oficial consultada para esta investigación no se identificó una API de integración dirigida a unidades educativas para automatizar estas operaciones. Esta ausencia debe entenderse como un hallazgo de la documentación pública consultada, no como afirmación de que técnicamente nunca pueda existir un mecanismo interno o institucional no publicado. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b)](#tg_ref_minedu_sie).

Debido a esta restricción, el diseño contempla una capa de automatización de navegador mediante Puppeteer. Puppeteer proporciona una API de alto nivel para controlar navegadores compatibles, pudiendo operar sin interfaz gráfica visible. [(Puppeteer, 2026)](#tg_ref_puppeteer_intro).

Sin embargo, la automatización de interfaz debe considerarse un adaptador externo reemplazable, no una regla central del sistema. Si posteriormente el Ministerio habilitara una API, servicio web o mecanismo oficial de interoperabilidad, debería poder sustituirse el adaptador Puppeteer sin modificar el dominio académico.

Además, la automatización sólo debe operar con credenciales autorizadas por la institución y respetando las condiciones, períodos y procedimientos establecidos por el Ministerio. La autorización institucional delimita responsables, entorno, datos y condiciones de prueba, sin sustituir una eventual autorización del Ministerio de Educación (véase Anexo H).

### 3.2.7 COMUNICACIÓN ACTUAL CON PADRES Y TUTORES

Una necesidad relevante del proyecto es mejorar el acceso de las familias a información académica actualizada.

El modelo propuesto evita que padres y tutores dependan exclusivamente de solicitudes administrativas para consultar información que el colegio determine como publicable. La aplicación móvil funcionará como canal de consulta de calificaciones, asistencia, alertas e historial permitido.

Este acceso no implica apertura indiscriminada de información. El usuario únicamente podrá consultar estudiantes asociados mediante una relación tutor-estudiante previamente verificada por la institución.

La protección adquiere relevancia adicional al tratarse de datos de menores de edad. La Constitución Política del Estado reconoce derechos a la privacidad e intimidad, mientras que el Código Niña, Niño y Adolescente reconoce el derecho de niñas, niños y adolescentes a la privacidad e impone deberes de reserva y protección de su identidad en los supuestos contemplados por la normativa. [(Estado Plurinacional de Bolivia, 2009, 2014)](#tg_ref_existing_4e706d338d10).

### 3.2.8 PROBLEMAS Y NECESIDADES IDENTIFICADAS

El diagnóstico permite sintetizar el problema en cinco dimensiones.

• La primera corresponde a fragmentación de información, cuando una misma entidad académica aparece en diferentes fuentes y exige actualización independiente.

• La segunda es la duplicación de trabajo, especialmente cuando un dato previamente registrado debe introducirse nuevamente en otra plataforma.

• La tercera es la posibilidad de inconsistencia, que se manifiesta cuando dos sistemas mantienen valores diferentes para el mismo hecho académico.

• La cuarta corresponde a la limitada trazabilidad, particularmente crítica en modificaciones de calificaciones, información estudiantil y operaciones de sincronización.

• La quinta es la disponibilidad de información para familias y responsables, cuya mejora justifica el componente móvil.

La necesidad tecnológica no es, por tanto, “tener una aplicación”, sino establecer un flujo confiable que permita que la información sea capturada una vez, validada, utilizada por los distintos procesos, comunicada de acuerdo con permisos y sincronizada cuando corresponda.

La Tabla 3.2 presenta la relación consolidada entre problemas, causas, efectos y respuestas de diseño.

<a id="tg_table_2_2"></a>Tabla 3.2. Problemas, efectos y respuesta de diseño

| **Problema** | **Efecto** | **Necesidad** | **Respuesta propuesta** |
| --- | --- | --- | --- |
| Información distribuida | Datos diferentes entre fuentes | Centralización | Base institucional única |
| Recaptura manual | Mayor esfuerzo y posibilidad de error | Reutilización | Datos compartidos entre módulos |
| Duplicidad de estudiantes | Historial fragmentado | Identificación única | Restricciones de RUDE e identificadores |
| Cambios sin historial | Difícil determinar responsabilidades | Trazabilidad | Auditoría |
| Doble digitación de calificaciones | Diferencias local/SIE | Interoperabilidad | Sincronización automatizada |
| Falta de comprobación posterior | Se desconoce resultado real | Verificación | Lectura posterior en SIE |
| Diferencias entre sistemas | Riesgo de información incorrecta | Conciliación | Estado DISCREPANCY y revisión |
| Procesos externos lentos | Bloqueo de usuarios | Asincronía | Redis + BullMQ + worker |
| Consulta familiar dependiente de terceros | Información menos oportuna | Acceso controlado | Aplicación Flutter |
| Acceso demasiado amplio | Riesgo de privacidad | Autorización | RBAC + alcance contextual |

Fuente: Elaboración propia, 2026.

## 3.3 RESULTADOS DEL LEVANTAMIENTO DE INFORMACIÓN

### 3.3.1 RESULTADOS DE ENTREVISTAS Y CUESTIONARIOS

El cuestionario disponible permite describir la percepción de la directora sobre las tareas académicas y sus dificultades (véase Anexo A). Las entrevistas u otros cuestionarios se presentan como resultados sólo después de contar con las constancias individuales y la matriz de análisis correspondientes (véase Anexo I).

Las categorías empleadas para organizar el análisis son: registro estudiantil, actualización, calificaciones, asistencia, seguimiento, transferencia al SIE, comunicación familiar, errores frecuentes, repetición de tareas y expectativas sobre la solución. Estas categorías orientan la sistematización, pero no sustituyen las respuestas ni las mediciones de campo.

La respuesta de la directora sugiere, de manera preliminar, una necesidad de centralización y mayor trazabilidad del flujo de información. Esta interpretación se utiliza como insumo de diseño y debe contrastarse con las demás fuentes antes de formular una conclusión institucional general (véanse Anexos A, D y F).

Como propuesta de control de acceso se distinguen funciones de Dirección, administración, docentes y padres o tutores. La matriz de roles, permisos, requerimientos y reglas se considera validada institucionalmente sólo cuando el acta registre la decisión y los ajustes acordados (véase Anexo G).

No se consignan porcentajes ni frecuencias generales porque no se dispone de una matriz completa de instrumentos. La muestra efectiva disponible en esta versión corresponde a una directora. Los indicadores institucionales se incorporan después de completar la certificación de población, las constancias de participación y la matriz de resultados (véanse Anexos C e I).

### 3.3.2 RESULTADOS DE LA OBSERVACIÓN DIRECTA

La observación directa se estructura para seguir el recorrido de una unidad de información desde su origen hasta su utilización final. Sus resultados se consideran evidencia cuando la ficha consigna fecha, proceso, responsables, herramientas, duración, recapturas y dificultades observadas.

Para una calificación, por ejemplo, la observación no termina en el momento en que el docente la registra. Debe seguirse su recorrido hasta la generación de reportes, comunicación al responsable y, cuando corresponda, registro en SIE.

Como criterio de análisis, los puntos de transferencia manual entre procesos se consideran susceptibles de error. Su existencia concreta, frecuencia y efecto en la institución deben confirmarse mediante la certificación de procesos y la validación del modelo AS-IS (véanse Anexos D y F).

Esto conduce a una decisión de diseño: las transferencias internas entre módulos deben realizarse a través de entidades compartidas y servicios de aplicación, mientras que las transferencias externas deben gestionarse mediante adaptadores explícitos y auditables.

### 3.3.3 RESULTADOS DEL ANÁLISIS DOCUMENTAL

El análisis documental comprende fichas estudiantiles, reportes, registros de evaluación, asistencia, documentación institucional y documentación normativa vinculada al SIE.

La normativa nacional otorga relevancia jurídica y administrativa a la calidad de los datos educativos. La RM N.° 0001/2026 establece responsabilidad sobre la información reportada por las unidades educativas, exige evitar duplicidades RUDE y señala que la información generada por las direcciones educativas y unidades educativas tiene carácter de declaración jurada en el marco establecido por la norma. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

Consecuentemente, la plataforma no puede tratar la auditoría como una funcionalidad opcional exclusivamente técnica. La trazabilidad se incorpora desde el modelo de datos y los casos de uso.

### 3.3.4 IDENTIFICACIÓN DE DUPLICIDAD E INCONSISTENCIAS

Se distinguen dos conceptos.

La duplicidad ocurre cuando el mismo hecho se registra más de una vez sin necesidad; por ejemplo, dos inscripciones activas equivalentes para el mismo estudiante, gestión y curso.

La inconsistencia ocurre cuando dos representaciones de un mismo hecho poseen valores incompatibles; por ejemplo:

Sistema institucional: Matemática = 85\
SIE Académico: Matemática = 80

El diseño trata ambos problemas de manera distinta. La duplicidad se previene prioritariamente mediante restricciones de unicidad y reglas de dominio. La inconsistencia externa se identifica mediante conciliación.

No se considera correcto resolver toda discrepancia actualizando automáticamente la base institucional con el valor encontrado en SIE. El sistema debe conservar evidencia de ambos valores y permitir determinar cuál es el correcto.

### 3.3.5 IDENTIFICACIÓN DE CARGA OPERATIVA

La carga operativa se concentra en actividades que requieren repetición, búsqueda, comparación y transcripción.

Desde la perspectiva de ingeniería de software, el objetivo no es automatizar indiscriminadamente toda actividad humana. Se automatizan principalmente acciones repetitivas y deterministas: validaciones de formato, detección de duplicados, generación de listados, preparación de datos, encolado de sincronizaciones, verificación posterior y notificación del estado.

Las decisiones académicas permanecen bajo control de los usuarios responsables.

Los tiempos y ahorro de horas deberán calcularse en el capítulo de validación utilizando mediciones antes y después. Incluir una cifra en esta etapa sin haber instrumentado la medición comprometería la validez del resultado.

### 3.3.6 NECESIDADES DE LOS USUARIOS

Las necesidades pueden sintetizarse por actor.

• Administración requiere rapidez de registro, actualización centralizada y reducción de recapturas.

• Dirección requiere supervisión, reportes, control de cambios y visibilidad sobre el estado de la información enviada al SIE.

• Docentes requieren interfaces sencillas para calificaciones y asistencia, limitadas a sus asignaciones.

• Padres y tutores necesitan acceso oportuno, comprensible y seguro a información de sus estudiantes asociados.

• Todos los perfiles se benefician indirectamente de una fuente de datos coherente.

## 3.4 MODELADO DEL PROCESO ACTUAL Y PROPUESTO

### 3.4.1 MODELO DEL PROCESO ACADÉMICO ACTUAL

El proceso actual se representa conceptualmente de la siguiente manera:

Registro del estudiante → actualización → inscripción → calificaciones y asistencia → consolidación → comunicación → registro en SIE → revisión

En aquellos puntos donde intervienen fuentes diferentes, el flujo incorpora actividades adicionales de consulta, copia o conciliación manual.

La representación BPMN definitiva deberá construirse a partir de la observación institucional, distinguiendo tareas manuales, tareas de usuario, sistemas participantes y responsables.

### 3.4.2 IDENTIFICACIÓN DE PUNTOS CRÍTICOS

Se determinan cinco puntos críticos de diseño.

• El primero es la creación del estudiante, porque cualquier duplicidad se propaga a los módulos posteriores.

• El segundo es la inscripción, que determina la pertenencia del estudiante a una gestión, grado y paralelo.

• El tercero corresponde a calificaciones y asistencia, por ser datos frecuentes y sensibles.

• El cuarto es la transferencia al SIE, debido a la dependencia de una plataforma externa.

• El quinto es la corrección de inconsistencias, donde resulta indispensable conservar evidencia.

Cada uno de estos puntos recibe controles específicos: restricciones de datos, reglas de negocio, permisos, auditoría o mecanismos de idempotencia.

### 3.4.3 MODELO DEL PROCESO ACADÉMICO PROPUESTO

El proceso propuesto modifica la lógica anterior:

Captura institucional → validación → persistencia centralizada → uso por módulos → autorización → encolado → automatización SIE → verificación → conciliación → auditoría → notificación

El principal cambio es que la sincronización deja de ser una operación de “enviar y asumir que salió bien”.

El sistema considera finalizado un proceso únicamente después de verificar el resultado o clasificar explícitamente la ejecución como discrepante o fallida.

Para los usuarios, el flujo será asíncrono. Solicitar una sincronización no obliga a mantener abierta una solicitud HTTP hasta que finalice el navegador automatizado. La solicitud se registra y se coloca en una cola; un trabajador especializado la procesa y comunica posteriormente su progreso.

BullMQ soporta trabajadores que procesan trabajos almacenados en colas respaldadas por Redis y dispone de mecanismos para progreso, estados y recuperación de trabajos; además permite reintentos con estrategias de espera fija o exponencial. [(BullMQ, 2026)](#tg_ref_bullmq_retry).

La secuencia completa, con actores, decisiones, validaciones, cierres, reintentos y resultados de la sincronización, se presenta en el [Anexo L](#anexo-l-diagrama-general-de-procesos-académicos-y-sincronización-con-el-sie). La organización mediante carriles, actividades y decisiones se interpreta con criterios de modelado de procesos compatibles con el propósito de BPMN [(Object Management Group, 2014)](#tg_ref_omg_bpmn).

### 3.4.4 COMPARACIÓN ENTRE EL PROCESO ACTUAL Y EL PROCESO PROPUESTO

El modelo actual depende en mayor medida de la coordinación humana entre fuentes. El propuesto traslada parte de esa responsabilidad a controles sistemáticos.

La diferencia puede resumirse así:

• capturar varias veces → capturar una vez y reutilizar

• comparar manualmente → comparar automáticamente y revisar excepciones

• desconocer quién modificó → mantener trazabilidad

• enviar al SIE → enviar, verificar y conciliar

• consultar a administración → consulta autorizada desde aplicación móvil

Esta comparación deberá posteriormente validarse con indicadores objetivos, especialmente tiempos, cantidad de recapturas, errores detectados y porcentaje de sincronizaciones verificadas.

## 3.5 ACTORES Y ROLES DEL SISTEMA

### 3.5.1 PERSONAL ADMINISTRATIVO

El personal administrativo gestiona datos institucionales y estudiantiles, inscripciones, responsables y operaciones de apoyo.

Puede crear y actualizar estudiantes dentro de sus permisos, pero las acciones consideradas críticas deben generar auditoría.

No debe disponer automáticamente de permisos técnicos como administración de credenciales SIE o modificación de registros de auditoría.

### 3.5.2 DIRECCIÓN

Dirección posee funciones de supervisión. El rol puede consultar indicadores institucionales, reportes, discrepancias SIE, historial de cambios y aprobar operaciones que la institución clasifique como sensibles.

La dirección constituye además un actor particularmente relevante respecto al SIE, puesto que la normativa atribuye al director responsabilidad sobre la inscripción correcta y la calidad de información reportada. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

### 3.5.3 DOCENTES

Los docentes registran y consultan información dentro del alcance de sus asignaciones.

El acceso se define combinando rol y contexto. No resulta suficiente comprobar rol = docente; debe verificarse que el docente posea una asignación vigente sobre el curso, paralelo o materia objeto de la operación.

Esto evita el problema de autorización horizontal en el que un usuario correctamente autenticado accede a recursos pertenecientes a otro usuario. OWASP distingue expresamente autenticación y autorización y recomienda verificar permisos sobre las acciones solicitadas. [(OWASP Foundation, 2026b)](#tg_ref_owasp_authorization).

### 3.5.4 PADRES Y TUTORES

El perfil de tutor tiene permisos de lectura restringidos.

La autorización se resuelve mediante la relación EstudianteTutor. Cuando un usuario solicita /estudiantes/:id/calificaciones, el backend valida que exista una vinculación activa y autorizada.

Esta verificación debe ejecutarse en el servidor. Ocultar botones en la aplicación móvil no constituye un control de seguridad suficiente.

### 3.5.5 MATRIZ DE ROLES Y PERMISOS

La matriz propuesta se incluye en la Tabla 3.3. Se utiliza un modelo RBAC complementado con validaciones contextuales.

<a id="tg_table_2_3"></a>Tabla 3.3. Matriz de roles y permisos propuesta

| **Función** | **Administración** | **Dirección** | **Docente** | **Padre/Tutor** |
| --- | --- | --- | --- | --- |
| Consultar dashboard institucional | ✓ | ✓ | Parcial | — |
| Gestionar estudiantes | ✓ | Consulta | — | — |
| Gestionar tutores | ✓ | Consulta | — | — |
| Gestionar inscripciones | ✓ | ✓ | — | — |
| Gestionar estructura académica | ✓ | ✓ | — | — |
| Registrar calificaciones | Según permiso | ✓/supervisión | ✓ asignaciones | — |
| Corregir calificaciones cerradas | —/según permiso | ✓ | — | — |
| Registrar asistencia | Según permiso | Consulta | ✓ asignaciones | — |
| Consultar estudiante vinculado | — | — | Según asignación | ✓ |
| Gestionar alertas | Parcial | ✓ | ✓ | Consulta |
| Generar reportes | ✓ | ✓ | Parcial | — |
| Solicitar sincronización SIE | Según permiso | ✓ | — | — |
| Resolver discrepancias SIE | —/según permiso | ✓ | — | — |
| Consultar auditoría | Parcial | ✓ | — | — |
| Gestionar usuarios/roles | ✓ autorizado | ✓ supervisión | — | — |

Fuente: Elaboración propia, 2026.

RBAC resuelve preguntas como “¿qué módulos puede utilizar un docente?”, mientras que la autorización contextual resuelve “¿sobre qué estudiantes concretos puede operar este docente?”.

## 3.6 DEFINICIÓN DE REQUERIMIENTOS

La especificación propuesta contiene 56 requerimientos funcionales, agrupados por dominio. El detalle se incorpora en la Tabla 3.4.

<a id="tg_table_2_4"></a>Tabla 3.4. Requerimientos funcionales propuestos

| **ID** | **Módulo** | **Requerimiento** |
| --- | --- | --- |
| RF-01 | Identidad | El sistema debe permitir iniciar sesión mediante credenciales válidas. |
| RF-02 | Identidad | El sistema debe permitir cerrar sesión e invalidar la sesión correspondiente. |
| RF-03 | Identidad | El sistema debe permitir crear y actualizar cuentas de usuarios internos. |
| RF-04 | Identidad | El sistema debe asignar roles y permisos a los usuarios. |
| RF-05 | Identidad | El sistema debe permitir recuperación o restablecimiento controlado de acceso. |
| RF-06 | Identidad | El sistema debe permitir activar o desactivar cuentas sin eliminar su historial. |
| RF-07 | Estudiantes | El sistema debe registrar estudiantes. |
| RF-08 | Estudiantes | El sistema debe validar la unicidad del RUDE cuando se encuentre registrado. |
| RF-09 | Estudiantes | El sistema debe actualizar datos personales manteniendo trazabilidad. |
| RF-10 | Estudiantes | El sistema debe registrar padres, madres y tutores vinculados. |
| RF-11 | Estudiantes | El sistema debe buscar y filtrar estudiantes por criterios autorizados. |
| RF-12 | Estudiantes | El sistema debe registrar referencias de documentación del estudiante. |
| RF-13 | Gestión académica | El sistema debe administrar gestiones académicas. |
| RF-14 | Gestión académica | El sistema debe administrar niveles, grados y paralelos. |
| RF-15 | Gestión académica | El sistema debe administrar asignaturas. |
| RF-16 | Gestión académica | El sistema debe administrar asignaciones de docentes. |
| RF-17 | Gestión académica | El sistema debe registrar inscripciones por gestión académica. |
| RF-18 | Calificaciones | El sistema debe administrar períodos de evaluación. |
| RF-19 | Calificaciones | El sistema debe registrar calificaciones individuales. |
| RF-20 | Calificaciones | El sistema debe permitir carga grupal de calificaciones. |
| RF-21 | Calificaciones | El sistema debe validar los rangos definidos para cada calificación. |
| RF-22 | Calificaciones | El sistema debe cerrar períodos para impedir modificaciones ordinarias. |
| RF-23 | Calificaciones | El sistema debe registrar correcciones autorizadas con motivo. |
| RF-24 | Calificaciones | El sistema debe publicar calificaciones para consulta autorizada. |
| RF-25 | Asistencia | El sistema debe registrar asistencia por estudiante y fecha. |
| RF-26 | Asistencia | El sistema debe gestionar estados de asistencia definidos institucionalmente. |
| RF-27 | Asistencia | El sistema debe permitir correcciones de asistencia con trazabilidad. |
| RF-28 | Asistencia | El sistema debe generar resúmenes e historiales de asistencia. |
| RF-29 | Seguimiento | El sistema debe permitir configurar criterios de alerta académica. |
| RF-30 | Seguimiento | El sistema debe detectar criterios de bajo rendimiento configurados. |
| RF-31 | Seguimiento | El sistema debe detectar criterios de ausencia reiterada configurados. |
| RF-32 | Seguimiento | El sistema debe crear y gestionar el estado de alertas. |
| RF-33 | Seguimiento | El sistema debe notificar alertas a usuarios autorizados. |
| RF-34 | Reportes | El sistema debe generar historial académico por estudiante. |
| RF-35 | Reportes | El sistema debe generar reportes de calificaciones. |
| RF-36 | Reportes | El sistema debe generar reportes de asistencia. |
| RF-37 | Reportes | El sistema debe exportar reportes en formatos definidos por la institución. |
| RF-38 | Reportes | El sistema debe generar reportes de auditoría para usuarios autorizados. |
| RF-39 | Móvil | La aplicación debe autenticar padres y tutores. |
| RF-40 | Móvil | La aplicación debe mostrar únicamente estudiantes vinculados al tutor. |
| RF-41 | Móvil | La aplicación debe permitir consultar calificaciones e historial autorizado. |
| RF-42 | Móvil | La aplicación debe permitir consultar asistencia. |
| RF-43 | Móvil | La aplicación debe mostrar alertas y notificaciones autorizadas. |
| RF-44 | Móvil | La aplicación podrá conservar la última información descargada indicando su fecha de actualización. |
| RF-45 | SIE | El sistema debe crear solicitudes de sincronización SIE. |
| RF-46 | SIE | El sistema debe validar y encolar solicitudes aptas para sincronización. |
| RF-47 | SIE | El worker debe realizar la navegación autenticada autorizada sobre SIE. |
| RF-48 | SIE | El sistema debe transferir al SIE la información definida en el alcance. |
| RF-49 | SIE | El sistema debe volver a consultar la información registrada para verificarla. |
| RF-50 | SIE | El sistema debe comparar el valor institucional con el valor observado en SIE. |
| RF-51 | SIE | El sistema debe informar en tiempo real el avance de sincronización. |
| RF-52 | SIE | El sistema debe gestionar reintentos automáticos y manuales según el tipo de error. |
| RF-53 | SIE | El sistema debe conservar el historial de sincronizaciones. |
| RF-54 | Auditoría | El sistema debe auditar operaciones académicas y administrativas sensibles. |
| RF-55 | Auditoría | El sistema debe permitir consultar auditoría por estudiante, usuario, entidad o sincronización. |
| RF-56 | Auditoría | El sistema debe utilizar identificadores de correlación para reconstruir operaciones relacionadas. |

Fuente: Elaboración propia, 2026.

### 3.6.1 REQUERIMIENTOS FUNCIONALES

#### 3.6.1.1 Gestión de usuarios y autenticación

El sistema debe autenticar usuarios mediante credenciales institucionales, permitir cierre de sesión, gestionar cuentas, roles, permisos, recuperación controlada de acceso y activación o desactivación.

Toda operación protegida deberá verificar identidad y autorización en backend.

#### 3.6.1.2 Gestión de estudiantes

Comprende creación, consulta y actualización del expediente básico del estudiante; validación de identificadores; vinculación con responsables; búsquedas y filtros; y gestión de documentación referencial.

El código RUDE, cuando exista, debe poseer un control de unicidad para evitar la creación accidental de dos estudiantes asociados al mismo identificador oficial, coherente con la responsabilidad normativa de evitar duplicidades. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a)](#tg_ref_minedu_rm_2026).

#### 3.6.1.3 Gestión académica

Incluye gestiones académicas, niveles, grados, paralelos, asignaturas, asignaciones docentes e inscripciones.

La inscripción se separa de la entidad estudiante para conservar el historial entre gestiones.

#### 3.6.1.4 Gestión de calificaciones

El módulo debe registrar y modificar calificaciones en períodos habilitados, validar rangos, admitir ingreso grupal, cerrar períodos y conservar trazabilidad de correcciones.

Una calificación publicada no debe alterarse silenciosamente. Toda corrección posterior debe quedar asociada a usuario, fecha y motivo.

#### 3.6.1.5 Gestión de asistencia

El sistema debe registrar asistencia por estudiante y fecha, manejar estados institucionales, consultar historiales y producir resúmenes.

Las correcciones deberán mantener trazabilidad.

#### 3.6.1.6 Seguimiento y alertas

Se contemplan reglas configurables para detectar situaciones que ameriten seguimiento, como bajo rendimiento o ausencias recurrentes.

Las alertas deben poseer ciclo de vida: abierta, en seguimiento y resuelta, evitando confundir una alerta generada con un problema solucionado.

#### 3.6.1.7 Reportes e historiales académicos

El sistema debe generar historial por estudiante, reportes de calificaciones, asistencia, auditoría y exportaciones autorizadas.

La información histórica no debe depender exclusivamente de la gestión vigente.

#### 3.6.1.8 Aplicación móvil para padres y tutores

La aplicación móvil debe autenticar al responsable, identificar a los estudiantes asociados y permitir consultar calificaciones, asistencia, alertas y otra información autorizada.

La arquitectura recomendada por Flutter separa capa de interfaz y capa de datos, utilizando repositorios y servicios con responsabilidades diferenciadas, enfoque que se adopta para mantener una fuente coherente de información dentro de la aplicación. [(Google, 2026)](#tg_ref_flutter_arch).

#### 3.6.1.9 Sincronización con el SIE

El sistema debe generar solicitudes de sincronización, validarlas, encolarlas, procesarlas mediante el adaptador de automatización, transferir la información, leer posteriormente el resultado y clasificar la ejecución.

La finalización satisfactoria implica verificación, no únicamente interacción con un botón del SIE.

#### 3.6.1.10 Auditoría y trazabilidad

Las operaciones críticas deberán generar eventos de auditoría.

Como mínimo se conservará: usuario, acción, entidad afectada, identificador, fecha/hora, origen, correlación de solicitud y cambios relevantes. OWASP recomienda incluir registro de eventos de aplicación relevantes tanto para seguridad como para diagnóstico operacional. [(OWASP Foundation, 2026c)](#tg_ref_owasp_logging).

### 3.6.2 REQUERIMIENTOS NO FUNCIONALES

Los requerimientos no funcionales se estructuran tomando como referencia el modelo de calidad de producto ISO/IEC 25010:2023, que organiza la calidad del producto en nueve características y sus subcaracterísticas para apoyar especificación, medición y evaluación. [(International Organization for Standardization, 2023)](#tg_ref_existing_e98c60c85b65).

Se proponen veinte requerimientos medibles en la Tabla 3.5.

<a id="tg_table_2_5"></a>Tabla 3.5. Requerimientos no funcionales

| **ID** | **Característica** | **Especificación / criterio** |
| --- | --- | --- |
| RNF-01 | Seguridad | Toda comunicación de producción deberá utilizar HTTPS/TLS. |
| RNF-02 | Seguridad | La autorización deberá validarse en backend en cada operación protegida. |
| RNF-03 | Seguridad | Las sesiones o tokens deberán permitir expiración y revocación. |
| RNF-04 | Seguridad | Las credenciales SIE no deberán almacenarse en código fuente, frontend, jobs ni logs. |
| RNF-05 | Seguridad | Las operaciones sensibles deberán producir auditoría. |
| RNF-06 | Rendimiento | Las consultas locales comunes deberán responder dentro del umbral definido en las pruebas de carga. |
| RNF-07 | Rendimiento | Los listados deberán implementar paginación cuando el volumen lo requiera. |
| RNF-08 | Disponibilidad | El sistema académico deberá continuar operando aunque SIE se encuentre indisponible. |
| RNF-09 | Disponibilidad | La base de datos deberá contar con un procedimiento probado de respaldo y recuperación. |
| RNF-10 | Usabilidad | Las funciones frecuentes deberán utilizar terminología del dominio educativo. |
| RNF-11 | Usabilidad | Las interfaces deberán cumplir los criterios WCAG 2.2 aplicables definidos para el proyecto. |
| RNF-12 | Mantenibilidad | El backend deberá organizarse mediante módulos con responsabilidades delimitadas. |
| RNF-13 | Mantenibilidad | Los casos críticos deberán disponer de pruebas automatizadas. |
| RNF-14 | Mantenibilidad | El esquema de base de datos deberá gestionarse mediante migraciones versionadas. |
| RNF-15 | Mantenibilidad | El repositorio deberá incluir documentación para instalación y despliegue reproducible. |
| RNF-16 | Fiabilidad | Los trabajos de sincronización deberán diseñarse de manera idempotente. |
| RNF-17 | Fiabilidad | Los errores transitorios deberán admitir reintentos con backoff controlado. |
| RNF-18 | Fiabilidad | Las operaciones compuestas críticas deberán ejecutarse mediante transacciones cuando corresponda. |
| RNF-19 | Integridad | El sistema deberá impedir duplicidades definidas mediante restricciones y reglas de dominio. |
| RNF-20 | Privacidad | Logs, eventos y auditoría deberán excluir credenciales y secretos. |

Fuente: Elaboración propia, 2026, con base en la norma ISO/IEC 25010:2023 [(International Organization for Standardization, 2023)](#tg_ref_existing_e98c60c85b65).

#### 3.6.2.1 Seguridad

Se consideran control de acceso, transmisión cifrada, almacenamiento seguro de credenciales, protección de sesiones, registros de auditoría y separación de secretos.

OWASP establece que los servicios REST seguros deben emplear HTTPS para proteger credenciales y datos durante la transmisión. [(OWASP Foundation, 2026d)](#tg_ref_owasp_rest).

#### 3.6.2.2 Rendimiento

Las operaciones comunes contra la base institucional deben ofrecer tiempos de respuesta suficientemente bajos para tareas administrativas y docentes.

El proceso SIE se excluye del tiempo de respuesta interactivo porque depende de una plataforma externa. Por ello se maneja asíncronamente.

#### 3.6.2.3 Disponibilidad

Una indisponibilidad del SIE no debe impedir registrar asistencia, calificaciones o consultar información local.

Esta independencia constituye una decisión arquitectónica fundamental: la operación académica central no depende en tiempo real del sistema externo.

#### 3.6.2.4 Usabilidad

Las tareas frecuentes deben reducir pasos innecesarios y utilizar nomenclatura propia del dominio educativo.

Se adopta WCAG 2.2 como referencia para accesibilidad en elementos aplicables, incluyendo navegación por teclado, foco identificable, etiquetado y contraste. [(World Wide Web Consortium, 2023)](#tg_ref_existing_77cfc960a988).

#### 3.6.2.5 Mantenibilidad

La aplicación debe mantener módulos delimitados, pruebas de componentes críticos, migraciones versionadas y documentación.

La estructura de la base de datos será reproducible mediante migraciones. Prisma Migrate permite mantener sincronizado el esquema definido por la aplicación con la base de datos y aplicar migraciones pendientes durante despliegues. [(Prisma, 2026)](#tg_ref_prisma_migrate).

#### 3.6.2.6 Fiabilidad

Se incluyen idempotencia, reintentos controlados, transacciones y recuperación de procesos.

BullMQ recomienda diseñar trabajos idempotentes de manera que un reintento exitoso produzca el mismo estado final que una ejecución correcta en el primer intento. [(BullMQ, 2023)](#tg_ref_bullmq_idempotent).

### 3.6.3 REGLAS DE NEGOCIO

Las reglas de negocio se encuentran resumidas en la Tabla 3.6.

<a id="tg_table_2_6"></a>Tabla 3.6. Reglas de negocio

| **ID** | **Regla** |
| --- | --- |
| RN-01 | Un código RUDE no podrá asociarse a más de un estudiante activo en el sistema. |
| RN-02 | Un estudiante conservará un identificador institucional permanente entre gestiones. |
| RN-03 | Cada inscripción deberá pertenecer a una gestión académica válida. |
| RN-04 | Una inscripción histórica no será sobrescrita por la inscripción de una nueva gestión. |
| RN-05 | Un docente sólo podrá operar sobre asignaciones académicas vigentes autorizadas. |
| RN-06 | Toda calificación deberá encontrarse dentro del rango institucional/normativo aplicable. |
| RN-07 | No se permitirá registrar calificaciones en períodos cerrados mediante el flujo ordinario. |
| RN-08 | Toda corrección posterior al cierre deberá registrar responsable y motivo. |
| RN-09 | No se podrá registrar asistencia para un estudiante sin inscripción válida en el contexto seleccionado. |
| RN-10 | Un tutor únicamente podrá consultar estudiantes explícitamente vinculados a su cuenta. |
| RN-11 | La eliminación de un usuario no eliminará el historial de acciones que realizó. |
| RN-12 | Una alerta académica deberá conservar su estado hasta ser formalmente resuelta. |
| RN-13 | Sólo información previamente validada podrá ingresar a la cola SIE. |
| RN-14 | Una solicitud SIE deberá poseer un identificador único de correlación. |
| RN-15 | Una ejecución no se considerará confirmada hasta completar la verificación posterior. |
| RN-16 | Una discrepancia SIE no modificará automáticamente el dato institucional. |
| RN-17 | Los errores transitorios podrán reintentarse; los errores de negocio requerirán corrección. |
| RN-18 | Las credenciales SIE únicamente estarán disponibles para el componente servidor autorizado. |
| RN-19 | Toda resolución manual de una discrepancia deberá registrar usuario, fecha y justificación. |
| RN-20 | Los registros de auditoría no serán modificables mediante las funciones ordinarias del sistema. |

Fuente: Elaboración propia, 2026.

Entre las principales se encuentran: RUDE no duplicado; una inscripción activa por estudiante y contexto académico; calificaciones dentro de rangos; períodos cerrados no modificables sin autorización; docente limitado a asignaciones; tutor limitado a estudiantes vinculados; sincronización únicamente sobre datos validados; discrepancias no sobrescritas automáticamente; y auditoría obligatoria para modificaciones sensibles.

Estas reglas se ubican preferentemente en el dominio o casos de uso, no únicamente en formularios del frontend.

### 3.6.4 CRITERIOS DE ACEPTACIÓN

Los criterios se expresan de manera verificable utilizando la estructura Dado–Cuando–Entonces.

Ejemplo:

Dado un estudiante con código RUDE registrado, cuando un administrativo intente crear otro estudiante con el mismo código, entonces el sistema rechazará la operación y mostrará que el identificador ya se encuentra asociado a otro registro.

Para sincronización:

Dada una calificación válida y autorizada, cuando la sincronización sea procesada y el sistema lea del SIE el mismo valor, entonces la ejecución deberá finalizar con estado CONFIRMADO y registrar la evidencia de verificación.

Los principales criterios se presentan en la Tabla 3.7.

<a id="tg_table_2_7"></a>Tabla 3.7. Criterios de aceptación representativos

| **ID** | **Dado** | **Cuando** | **Entonces** |
| --- | --- | --- | --- |
| CA-01 | Existe un estudiante con RUDE registrado | Se intenta registrar otro con el mismo RUDE | La operación es rechazada |
| CA-02 | Un docente tiene una asignación | Ingresa a su curso | Puede visualizar sólo los estudiantes correspondientes |
| CA-03 | Un docente no posee una asignación | Intenta acceder mediante URL/API | El backend rechaza la operación |
| CA-04 | El período está abierto | Se registra una calificación válida | Se almacena correctamente |
| CA-05 | El período está cerrado | Un docente intenta modificar una nota | La modificación ordinaria es rechazada |
| CA-06 | Dirección autoriza una corrección | Se modifica una nota cerrada | Queda registrado valor anterior, nuevo y motivo |
| CA-07 | Un tutor posee un estudiante vinculado | Consulta la aplicación | Puede visualizar su información autorizada |
| CA-08 | Un tutor no está vinculado | Solicita otro estudiante por ID | Recibe acceso denegado |
| CA-09 | Existe información apta para SIE | Se solicita sincronización | Se crea y encola un trabajo |
| CA-10 | El worker envía un valor | SIE devuelve el mismo valor | El estado final es CONFIRMED |
| CA-11 | El worker envía un valor | SIE devuelve un valor diferente | El estado final es DISCREPANCY |
| CA-12 | Se produce timeout transitorio | Aún quedan intentos | El trabajo se reprograma según política |
| CA-13 | La credencial SIE es inválida | Se intenta autenticar | El estado pasa a AUTH_REQUIRED |
| CA-14 | Cambia una operación sensible | Se confirma la transacción | Se crea el evento de auditoría |
| CA-15 | Cambia el estado de un job | El usuario observa la auditoría | Recibe actualización mediante canal de tiempo real |

Fuente: Elaboración propia, 2026.

### 3.6.5 MATRIZ DE TRAZABILIDAD DE REQUERIMIENTOS

La trazabilidad conecta objetivos, requerimientos, componentes y pruebas.

La matriz evita que una funcionalidad exista únicamente porque “parecía conveniente”. Cada requerimiento debe corresponder a una necesidad y poseer al menos un mecanismo futuro de comprobación.

La Tabla 3.8 incluye una matriz resumida.

<a id="tg_table_2_8"></a>Tabla 3.8. Matriz resumida de trazabilidad

| **Objetivo del proyecto** | **Requerimientos** | **Diseño asociado** | **Evidencia de validación** |
| --- | --- | --- | --- |
| Analizar procesos actuales | RF-07 a RF-44 | Diagnóstico y procesos | Instrumentos y modelo AS-IS |
| Diseñar arquitectura y modelo | RNF-12 a RNF-19 | C4, Clean Architecture, DDD, ER | Revisión arquitectónica |
| Centralizar gestión | RF-07 a RF-38 | Backend + PostgreSQL | Pruebas funcionales/integridad |
| Facilitar acceso a familias | RF-39 a RF-44 | Aplicación Flutter | Pruebas de usabilidad/aceptación |
| Interoperar con SIE | RF-45 a RF-53 | Worker + BullMQ + Puppeteer | Pruebas de sincronización |
| Garantizar trazabilidad | RF-54 a RF-56 | AuditLog + correlationId | Pruebas de auditoría |
| Evaluar solución | RNF-01 a RNF-20 | Plan de pruebas | Resultados capítulo de validación |

Fuente: Elaboración propia, 2026.

## 3.7 MODELADO FUNCIONAL DEL SISTEMA

### 3.7.1 DIAGRAMA GENERAL DE CASOS DE USO

Los actores principales son Administración, Dirección, Docente, Padre/Tutor y SIE como sistema externo.

<a id="tg_figure_2_1"></a>Figura 3.1. Diagrama general de casos de uso

Fuente: Elaboración propia, 2026.

### 3.7.2 ESPECIFICACIÓN DE CASOS DE USO

Los casos más relevantes se describen en la Tabla 3.9.

<a id="tg_table_2_9"></a>Tabla 3.9. Especificación resumida de casos de uso

| **ID** | **Caso** | **Actor principal** | **Precondición** | **Resultado** |
| --- | --- | --- | --- | --- |
| UC-01 | Gestionar usuarios | Administración | Usuario autorizado | Cuenta/rol actualizado |
| UC-02 | Gestionar estudiante | Administración | Sesión válida | Expediente actualizado |
| UC-03 | Gestionar inscripción | Administración | Estudiante y gestión válidos | Inscripción registrada |
| UC-04 | Registrar calificaciones | Docente | Asignación y período válidos | Calificaciones almacenadas |
| UC-05 | Registrar asistencia | Docente | Inscripción válida | Asistencia registrada |
| UC-06 | Gestionar seguimiento | Docente/Dirección | Datos académicos existentes | Alerta registrada/resuelta |
| UC-07 | Consultar hijo/tutelado | Tutor | Vínculo autorizado | Información mostrada |
| UC-08 | Sincronizar con SIE | Dirección/usuario autorizado | Datos validados | Job registrado |
| UC-09 | Verificar/conciliar SIE | Dirección | Sincronización procesada | Confirmación o resolución |
| UC-10 | Consultar auditoría | Dirección | Permiso de auditoría | Historial trazable |

Fuente: Elaboración propia, 2026.

Especial atención merece UC-08 Sincronizar información con SIE, cuya precondición exige datos válidos y usuario autorizado. Su postcondición no es necesariamente “sincronización correcta”, ya que puede terminar en discrepancia o error. La postcondición garantizada es que exista un registro trazable del intento.

UC-09 Conciliar discrepancia se separa del anterior para impedir que la automatización tome decisiones académicas ante valores conflictivos.

### 3.7.3 HISTORIAS DE USUARIO

Las historias permiten organizar el desarrollo desde la perspectiva del valor esperado.

Ejemplo:

Como docente, quiero registrar las calificaciones de todos los estudiantes de una asignatura desde una misma pantalla para completar el proceso sin ingresar individualmente a cada expediente.

Otro ejemplo:

Como director, quiero conocer qué calificaciones coinciden y cuáles difieren entre el sistema institucional y el SIE para corregir inconsistencias antes de cerrar el período.

Las historias principales se presentan en la Tabla 3.10.

<a id="tg_table_2_10"></a>Tabla 3.10. Historias de usuario prioritarias

| **ID** | **Historia** |
| --- | --- |
| HU-01 | Como administrativo, quiero registrar un estudiante una sola vez para reutilizar su información durante toda su gestión académica. |
| HU-02 | Como administrativo, quiero detectar RUDE duplicados para evitar registros inconsistentes. |
| HU-03 | Como docente, quiero registrar calificaciones por curso para reducir navegación repetitiva. |
| HU-04 | Como docente, quiero registrar asistencia desde una lista grupal para completar rápidamente la actividad. |
| HU-05 | Como director, quiero consultar cambios de calificaciones para conocer quién realizó cada corrección. |
| HU-06 | Como director, quiero visualizar estudiantes con alertas para priorizar el seguimiento. |
| HU-07 | Como padre/tutor, quiero consultar las calificaciones de mis estudiantes vinculados desde el teléfono. |
| HU-08 | Como padre/tutor, quiero revisar la asistencia para conocer ausencias registradas. |
| HU-09 | Como usuario autorizado, quiero enviar datos al SIE sin volver a digitarlos manualmente. |
| HU-10 | Como director, quiero que el sistema verifique el dato posteriormente para saber si realmente coincide. |
| HU-11 | Como director, quiero visualizar discrepancias local/SIE para corregirlas antes del cierre. |
| HU-12 | Como usuario, quiero conocer en tiempo real el estado de la sincronización para no esperar sin información. |
| HU-13 | Como responsable técnico, quiero reintentar fallos transitorios sin duplicar datos. |
| HU-14 | Como dirección, quiero consultar una línea de tiempo de sincronización para auditar incidentes. |
| HU-15 | Como administrador técnico, quiero desplegar la base mediante migraciones para evitar configuraciones manuales inconsistentes. |

Fuente: Elaboración propia, 2026.

### 3.7.4 DIAGRAMAS DE ACTIVIDADES

Los diagramas de actividades prioritarios son:

• Registro de estudiante → Validar datos → Verificar duplicidad → Guardar → Registrar auditoría

• Captura de calificación → Validar período → Validar docente → Validar rango → Guardar → Generar evento → Evaluar alerta

• Solicitud SIE → Validar → Encolar → Procesar → Enviar → Leer → Comparar → Confirmar/Discrepancia/Error

Estos diagramas permiten visualizar decisiones que un caso de uso narrativo no expresa con la misma claridad.

### 3.7.5 DIAGRAMAS DE SECUENCIA

El proceso SIE es el más representativo:

<a id="tg_figure_2_2"></a>Figura 3.2. Secuencia de sincronización y verificación SIE

Fuente: Elaboración propia, 2026.

## 3.8 DISEÑO DE LA ARQUITECTURA DE LA SOLUCIÓN

### 3.8.1 VISTA DE CONTEXTO DEL SISTEMA

Se adopta el modelo C4 para representar la arquitectura. El diagrama de contexto C4 sitúa el sistema como una unidad y muestra personas y sistemas externos que interactúan directamente con él, sin entrar todavía en tecnologías internas. [(Brown, 2011)](#tg_ref_brown_c4).

En el contexto del proyecto aparecen:

<a id="tg_figure_2_3"></a>Figura 3.3. Vista de contexto del sistema

Fuente: Elaboración propia, 2026.

La aplicación interna es responsable de la gestión institucional; SIE se representa fuera de la frontera porque pertenece al Ministerio de Educación.

### 3.8.2 VISTA DE CONTENEDORES

El nivel de contenedores de C4 permite representar aplicaciones y almacenes de datos, responsabilidades y tecnologías principales. [(Brown, 2011)](#tg_ref_brown_c4).

La arquitectura queda constituida por:

<a id="tg_figure_2_4"></a>Figura 3.4. Vista de contenedores de la solución

Fuente: Elaboración propia, 2026.

La separación del worker SIE resulta intencional. Aunque pertenece al mismo sistema lógico, se ejecuta de forma desacoplada del flujo HTTP principal para que los procesos de navegador no bloqueen las peticiones de los usuarios.

### 3.8.3 COMPONENTES PRINCIPALES

Los componentes se documentan en la Tabla 3.11.

<a id="tg_table_2_11"></a>Tabla 3.11. Contenedores y componentes arquitectónicos

| **Componente** | **Tecnología** | **Responsabilidad** |
| --- | --- | --- |
| Plataforma web | React + TypeScript | Interfaz administrativa y docente |
| Aplicación móvil | Flutter | Consulta para padres y tutores |
| API/backend | NestJS + TypeScript | Casos de uso, seguridad, dominio y API |
| Base de datos | PostgreSQL | Persistencia transaccional e histórica |
| ORM/adaptador | Prisma ORM | Acceso a datos y migraciones |
| Cola | BullMQ | Gestión de trabajos asíncronos |
| Almacén de cola | Redis | Persistencia y coordinación de jobs |
| Worker SIE | Node.js + Puppeteer | Automatización de navegador |
| Tiempo real | WebSockets/NestJS Gateway | Progreso de procesos y eventos |
| Sistema externo | SIE Académico | Sistema oficial externo |

Fuente: Elaboración propia, 2026, con base en [NestJS (2026b)](#tg_ref_nestjs_queues), [BullMQ (2026)](#tg_ref_existing_a3743dc53d7b) y [Puppeteer (2026)](#tg_ref_existing_a1ab4164e63b).

El frontend web utiliza React, biblioteca que estructura interfaces a partir de componentes reutilizables. [(Meta Open Source, 2026)](#tg_ref_react_components).

TypeScript aporta comprobación estática de tipos antes de la ejecución, ayudando a identificar incompatibilidades durante el desarrollo. [(Microsoft, 2026)](#tg_ref_typescript_basics).

El backend utiliza NestJS y expone una API central consumida por web y móvil. Las operaciones asíncronas se apoyan en BullMQ y Redis. NestJS dispone de integración oficial con BullMQ, cuyo almacenamiento de trabajos se respalda en Redis [(NestJS, 2026b)](#tg_ref_nestjs_queues).

### 3.8.4 ARQUITECTURA DEL BACKEND

El backend se implementará como monolito modular.

Esto significa que los dominios se despliegan inicialmente como una aplicación principal, pero mantienen límites internos. Esta decisión evita la complejidad operacional de microservicios para una escala institucional en la que no existe justificación suficiente para distribuir cada módulo.

La estructura conceptual será:

src/\
├── identity/\
├── students/\
├── academics/\
├── enrollment/\
├── grades/\
├── attendance/\
├── monitoring/\
├── guardians/\
├── reports/\
├── sie-integration/\
└── audit/

Cada módulo aplica internamente las capas de dominio, aplicación, infraestructura y presentación/adaptadores.

El worker SIE puede ejecutarse como proceso separado debido a su perfil técnico, pero comparte contratos de aplicación y no se considera un microservicio de negocio autónomo.

### 3.8.5 ARQUITECTURA DE LA PLATAFORMA WEB

La plataforma React consume la API mediante HTTPS y organiza la interfaz por características del dominio.

React permite construir pantallas combinando componentes individuales y reutilizables. [(Meta Open Source, 2026)](#tg_ref_react_components).

La estructura propuesta evita mezclar llamadas HTTP directamente con componentes visuales. Las vistas utilizan servicios o hooks especializados que encapsulan acceso a la API.

Entre las áreas principales se encuentran Dashboard, Estudiantes, Inscripciones, Estructura Académica, Calificaciones, Asistencia, Alertas, Reportes, Sincronización SIE y Auditoría.

### 3.8.6 ARQUITECTURA DE LA APLICACIÓN MÓVIL

Flutter permite desarrollar el cliente móvil bajo una estructura separada por responsabilidades. Su guía de arquitectura recomienda distinguir al menos UI y capa de datos, con responsabilidades delimitadas. [(Google, 2026)](#tg_ref_flutter_arch).

La aplicación se organiza conceptualmente así:

presentation/\
├── screens/\
├── widgets/\
└── view_models/\
domain/\
├── entities/\
└── use_cases/\
data/\
├── repositories/\
├── remote/\
└── local/

La información disponible sin conexión, si se implementa caché, deberá indicar cuándo fue actualizada por última vez. No se deberá presentar una calificación almacenada localmente como si acabara de ser descargada.

### 3.8.7 ORGANIZACIÓN DEL MONOLITO MODULAR

Los módulos no accederán libremente a las tablas o servicios internos de otros módulos.

La comunicación se efectuará mediante contratos de aplicación, referencias autorizadas y eventos internos.

Por ejemplo, attendance puede emitir AttendanceRegistered; el módulo monitoring recibe dicho evento y evalúa reglas de alerta. De esta forma, asistencia no necesita incorporar directamente toda la lógica de seguimiento.

### 3.8.8 APLICACIÓN DE ARQUITECTURA LIMPIA

La Arquitectura Limpia busca separar políticas de negocio de frameworks, UI, base de datos y agentes externos. Su regla de dependencias establece que las dependencias del código deben orientarse hacia las capas internas. [(Martin, 2012)](#tg_ref_existing_9d9818d9ccad).

Aplicado al proyecto:

Presentación / infraestructura\
↓\
Aplicación\
↓\
Dominio

El dominio define, por ejemplo, las reglas de una calificación válida.

La aplicación implementa casos de uso como RegistrarCalificacion.

Infraestructura implementa PrismaGradeRepository.

Presentación expone GradesController.

Así, Prisma no forma parte de la entidad Grade y Puppeteer no forma parte de la regla académica de sincronización.

### 3.8.9 APLICACIÓN DE DISEÑO ORIENTADO AL DOMINIO

DDD propone estructurar software alrededor de modelos del dominio y delimitar modelos mediante contextos cuando el problema crece. Fowler describe Bounded Context como un patrón central de DDD para dividir modelos grandes y explicitar sus relaciones. [(Fowler, 2014)](#tg_ref_fowler_bounded).

Para el proyecto se proponen los contextos:

Identidad y Acceso, Registro Estudiantil, Estructura Académica, Evaluación, Asistencia y Seguimiento, Comunicación Familiar, Integración SIE y Auditoría/Reportes.

Esto resulta especialmente útil para el término “estudiante”. En registro estudiantil, el estudiante es una persona con información identificativa. En evaluación, interesa principalmente como inscripción académica activa. En SIE, además aparecen identificadores externos y estados de sincronización.

DDD permite conservar estas perspectivas sin crear un objeto global con todas las responsabilidades del sistema.

## 3.9 DISEÑO DEL MODELO DE DATOS

### 3.9.1 IDENTIFICACIÓN DE ENTIDADES DEL DOMINIO

Las principales entidades se especifican en la Tabla 3.12.

<a id="tg_table_2_12"></a>Tabla 3.12. Entidades principales del dominio

| **Entidad** | **Propósito** | **Relaciones relevantes** |
| --- | --- | --- |
| User | Identidad de acceso | Roles, auditoría |
| Role | Perfil de autorización | Usuarios/permisos |
| Student | Identidad institucional del estudiante | Tutores, inscripciones |
| Guardian | Padre/madre/tutor | Estudiantes |
| StudentGuardian | Vinculación autorizada | Student–Guardian |
| AcademicYear | Gestión académica | Inscripciones, períodos |
| GradeLevel | Año/nivel | Paralelos |
| Section | Curso/paralelo | Inscripciones/asignaciones |
| Subject | Asignatura | Asignaciones docentes |
| TeacherAssignment | Relación docente-asignatura-curso | Calificaciones |
| Enrollment | Inscripción histórica | Student + gestión + curso |
| EvaluationPeriod | Período de evaluación | Calificaciones |
| Grade | Calificación | Enrollment + asignación + período |
| AttendanceRecord | Asistencia | Enrollment + fecha |
| AcademicAlert | Seguimiento | Student/Enrollment |
| Notification | Comunicación | Usuario/alerta |
| SieSyncJob | Cabecera de sincronización | Ítems, eventos |
| SieSyncItem | Dato enviado y verificado | Job |
| AuditLog | Registro de cambios | Usuario/entidades |

Fuente: Elaboración propia, 2026.

Entre ellas se encuentran:

User, Role, Student, Guardian, StudentGuardian, AcademicYear, GradeLevel, Section, Subject, TeacherAssignment, Enrollment, EvaluationPeriod, Grade, AttendanceRecord, AcademicAlert, Notification, SieSyncJob, SieSyncItem y AuditLog.

No todas deben convertirse necesariamente en entidades DDD. Algunas pueden constituir objetos de soporte o tablas técnicas. La clasificación definitiva depende de sus reglas e identidad durante la implementación.

### 3.9.2 MODELO ENTIDAD-RELACIÓN

El núcleo del modelo puede representarse conceptualmente así:

<a id="tg_figure_2_5"></a>Figura 3.5. Modelo entidad-relación conceptual

Fuente: Elaboración propia, 2026.

La inscripción funciona como enlace histórico entre estudiante y contexto académico.

En la Figura 3.5, la matrícula conserva el vínculo histórico entre estudiante, gestión académica y nivel o grado. De ella dependen la asistencia y la calificación; la asignación docente relaciona al profesor con el nivel y la asignatura. La relación entre estudiantes y responsables se resuelve mediante una entidad asociativa, por lo que un estudiante puede tener varios responsables y un responsable puede estar vinculado con más de un estudiante.

El detalle físico —atributos, claves y cardinalidades— se trasladó al [Anexo M](#anexo-m-modelo-entidad-relación-general-del-sistema-académico) para conservarlo completo en una hoja horizontal de gran formato. Allí se presenta la [Figura 3.6](#tg_figure_2_6) sin reducirla al ancho de una página vertical.

### 3.9.3 MODELO RELACIONAL

PostgreSQL permite expresar reglas de integridad mediante restricciones NOT NULL, UNIQUE, claves primarias, claves foráneas y restricciones CHECK. [(PostgreSQL Global Development Group, 2026)](#tg_ref_postgres_constraints).

• Algunas restricciones propuestas son:

• students.rude_code UNIQUE, cuando el RUDE no sea nulo;

• enrollments(student_id, academic_year_id), complementada según las reglas institucionales para impedir inscripciones contradictorias;

• student_guardians(student_id, guardian_id) UNIQUE;

• restricciones de rango para calificaciones;

• claves foráneas para impedir calificaciones sin inscripción;

• restricciones de unicidad en asistencia.

El uso de restricciones físicas no reemplaza las reglas de dominio, sino que proporciona una segunda barrera de integridad.

### 3.9.4 INTEGRIDAD DE LOS REGISTROS ACADÉMICOS

Se aplican cuatro niveles de integridad.

La integridad de entidad garantiza identificadores únicos.

La integridad referencial evita registros huérfanos.

La integridad de dominio controla valores permitidos y estados.

La integridad transaccional garantiza que operaciones compuestas se confirmen o deshagan conjuntamente.

Las transacciones son especialmente importantes al cerrar períodos, crear inscripciones con relaciones asociadas o registrar una sincronización y sus ítems.

### 3.9.5 DISEÑO DE AUDITORÍA Y TRAZABILIDAD

El registro AuditLog contendrá como mínimo:

id, actorUserId, action, entityType, entityId, timestamp, correlationId, oldValues, newValues, reason, source

No se almacenarán contraseñas, tokens de autenticación o credenciales SIE dentro de los valores de auditoría. OWASP recomienda incluir eventos relevantes en los logs, pero la instrumentación debe evitar registrar secretos y datos innecesariamente sensibles. [(OWASP Foundation, 2026c)](#tg_ref_owasp_logging).

Para calificaciones y sincronizaciones, la trazabilidad debe ser de carácter funcional, no solamente un log técnico de servidor.

## 3.10 DISEÑO DEL MECANISMO DE SINCRONIZACIÓN CON EL SIE

### 3.10.1 RESTRICCIONES DE INTEROPERABILIDAD IDENTIFICADAS

El diseño parte de las siguientes restricciones:

SIE Académico pertenece a un sistema externo sobre el que el proyecto no tiene control.

La interfaz y condiciones de acceso pueden modificarse.

Los períodos de disponibilidad y reglas de negocio son definidos por el Ministerio.

La documentación pública consultada presenta SIE Académico como aplicación web y no permitió identificar una API pública destinada a automatizar el intercambio institucional. [(Ministerio de Educación del Estado Plurinacional de Bolivia, 2026b)](#tg_ref_minedu_sie).

La automatización de navegador debe tratarse, por tanto, como mecanismo contingente y reemplazable.

### 3.10.2 ARQUITECTURA DEL MÓDULO DE AUTOMATIZACIÓN

Se utiliza un enfoque equivalente a puertos y adaptadores. La arquitectura hexagonal busca aislar la aplicación de dispositivos externos mediante interfaces y adaptadores intercambiables. [(Cockburn, 2005)](#tg_ref_cockburn_hexagonal).

El puerto conceptual será:

interface SieGateway {\
submit(data: SieSubmission): Promise\<SieSubmissionResult>;\
verify(query: SieVerificationQuery): Promise\<SieObservedState>;\
}

Su implementación inicial puede ser:

PuppeteerSieAdapter implements SieGateway

En el futuro:

OfficialApiSieAdapter implements SieGateway

si existiese una interfaz oficial habilitada para la institución.

De esta forma, los casos de uso dependen de SieGateway y no de Puppeteer.

### 3.10.3 FLUJO DE SINCRONIZACIÓN DE INFORMACIÓN

El flujo se divide en nueve etapas:

• 1. selección de información

• 2. validación

• 3. creación de solicitud

• 4. encolado

• 5. autenticación externa

• 6. transferencia

• 7. lectura de verificación

• 8. conciliación

• 9. auditoría y notificación

El usuario recibe inmediatamente un identificador de seguimiento.

La respuesta de creación puede utilizar semánticamente HTTP 202 Accepted, indicando que el trabajo fue aceptado para procesamiento pero todavía no ha finalizado.

### 3.10.4 PROCESAMIENTO ASÍNCRONO DE SOLICITUDES

NestJS ofrece integración con BullMQ y éste utiliza Redis para persistir los datos relacionados con los trabajos. [(NestJS, 2026b)](#tg_ref_nestjs_queues).

El proceso SIE se ejecuta en un worker separado porque una sesión de navegador puede durar considerablemente más que una operación común de API.

El procesamiento asíncrono también permite limitar concurrencia. Esto evita abrir múltiples navegadores simultáneos contra la misma cuenta institucional, reduciendo riesgo de sesiones conflictivas.

Redis ofrece estructuras aptas para casos de caché, colas y procesamiento de eventos [(Redis, 2026)](#tg_ref_redis_types).

### 3.10.5 ESTADOS DEL PROCESO DE SINCRONIZACIÓN

Se propone la siguiente máquina de estados:

PENDING → QUEUED → PROCESSING → SUBMITTED → VERIFYING\
├→ CONFIRMED\
├→ DISCREPANCY\
├→ RETRY_SCHEDULED\
├→ AUTH_REQUIRED\
└→ FAILED

• PENDING: solicitud creada.

• QUEUED: trabajo disponible para worker.

• PROCESSING: worker ejecutando.

• SUBMITTED: datos enviados.

• VERIFYING: lectura posterior en curso.

• CONFIRMED: coincidencia verificada.

• DISCREPANCY: valores distintos.

• RETRY_SCHEDULED: error transitorio.

• AUTH_REQUIRED: problema de autenticación que requiere intervención.

• FAILED: error final.

• CANCELLED puede incorporarse para solicitudes anuladas antes de una operación irreversible.

La Tabla 3.13 documenta la máquina completa.

<a id="tg_table_2_13"></a>Tabla 3.13. Estados del proceso SIE

| **Estado** | **Significado** | **Acción siguiente** |
| --- | --- | --- |
| PENDING | Solicitud creada | Validación/encolado |
| QUEUED | Esperando worker | Procesamiento |
| PROCESSING | Worker activo | Navegación/envío |
| SUBMITTED | Dato enviado | Verificación |
| VERIFYING | Consultando resultado | Comparación |
| CONFIRMED | Valores coinciden | Finalización |
| DISCREPANCY | Valores diferentes | Revisión humana |
| RETRY_SCHEDULED | Fallo transitorio | Nuevo intento |
| AUTH_REQUIRED | Requiere intervención de credenciales | Corrección administrativa |
| FAILED | Fallo final | Revisión |
| CANCELLED | Solicitud anulada | Cierre |

Fuente: Elaboración propia, 2026.

### 3.10.6 VERIFICACIÓN DE INFORMACIÓN REGISTRADA EN EL SIE

La verificación constituye una diferencia central del proyecto.

Después de enviar una calificación, el worker regresa al módulo correspondiente del SIE y lee el valor visible.

Posteriormente construye una evidencia:

{\
"studentId": "STU-123",\
"period": "T2",\
"subject": "MAT",\
"localValue": 85,\
"sieValue": 85,\
"status": "CONFIRMED"\
}

En caso de diferencia:

{\
"localValue": 85,\
"sieValue": 80,\
"status": "DISCREPANCY"\
}

El valor del SIE no sustituye automáticamente al institucional.

### 3.10.7 CONCILIACIÓN ENTRE INFORMACIÓN LOCAL Y SIE

• La conciliación clasifica la comparación en:

• MATCH: igualdad;

• MISMATCH: diferencia;

• NOT_FOUND: registro esperado no localizado;

• UNREADABLE: resultado no interpretable;

• PENDING: aún no verificado.

Una discrepancia abre una tarea para revisión.

El usuario autorizado podrá determinar, conforme al procedimiento institucional, si debe corregirse el dato local, reenviarse el dato al SIE o escalarse el caso.

Toda resolución registra motivo.

### 3.10.8 GESTIÓN DE ERRORES Y REINTENTOS

Los errores se clasifican en transitorios y permanentes/de negocio.

Un timeout de red puede reintentarse.

Una credencial inválida no debe reintentarse indefinidamente.

Un dato rechazado por una regla de negocio requiere corrección antes de otro intento.

BullMQ permite configurar reintentos y espera exponencial, así como variación aleatoria o jitter para distribuir nuevos intentos. [(BullMQ, 2026)](#tg_ref_bullmq_retry).

Los trabajos deben ser idempotentes para impedir que un reintento genere duplicidades. [(BullMQ, 2023)](#tg_ref_bullmq_idempotent).

Una estrategia razonable es:

Timeout o conectividad → reintento automático\
SIE temporalmente indisponible → reintento con backoff\
Sesión expirada → renovar o reautenticar si es seguro\
Credencial inválida → AUTH_REQUIRED\
Validación SIE rechazada → FAILED_BUSINESS\
Diferencia posterior → DISCREPANCY

### 3.10.9 TRAZABILIDAD Y AUDITORÍA DE SINCRONIZACIONES

Cada proceso recibe un correlationId.

Todos los registros relacionados —solicitud, job, ítems, eventos y auditoría— comparten dicho identificador.

Así es posible reconstruir:

15:04:11  solicitud creada\
15:04:12  trabajo encolado\
15:04:15  worker iniciado\
15:04:21  autenticación completada\
15:04:30  dato enviado\
15:04:36  verificación iniciada\
15:04:40  SIE devuelve 85; local = 85\
15:04:41  CONFIRMED

Esta trazabilidad transforma un proceso automatizado potencialmente opaco en una operación auditable.

### 3.10.10 COMUNICACIÓN DEL PROGRESO EN TIEMPO REAL

El frontend no realizará consultas constantes para saber si terminó un trabajo.

WebSocket proporciona comunicación bidireccional entre cliente y servidor a través de una conexión persistente después del establecimiento inicial. [(Fette & Melnikov, 2011)](#tg_ref_existing_703a7e985fec).

NestJS permite implementar gateways WebSocket mediante @WebSocketGateway() [(NestJS, 2026a)](#tg_ref_nestjs_gateways).

El backend podrá emitir eventos:

sie.sync.queued\
sie.sync.started\
sie.sync.progress\
sie.sync.verifying\
sie.sync.confirmed\
sie.sync.discrepancy\
sie.sync.failed

Los eventos no incluirán credenciales ni información sensible innecesaria.

## 3.11 DISEÑO DE INTERFACES

### 3.11.1 LINEAMIENTOS DE EXPERIENCIA DE USUARIO

• La interfaz seguirá cinco principios:

• consistencia terminológica;

• visibilidad del estado;

• prevención de errores;

• reducción de carga cognitiva;

• retroalimentación inmediata.

La accesibilidad se tomará como criterio transversal. WCAG 2.2 establece pautas relacionadas, entre otros aspectos, con percepción del contenido, navegación por teclado, foco y contraste [(World Wide Web Consortium, 2023)](#tg_ref_existing_77cfc960a988).

Los estados nunca se comunicarán exclusivamente mediante estados.

Por ejemplo:

• Confirmado

• Discrepancia

• Procesando

• Fallido

### 3.11.2 PROTOTIPOS DE LA PLATAFORMA WEB

• Los prototipos principales deberán incluir:

• Dashboard general;

• listado y expediente de estudiantes;

• estructura académica;

• inscripciones;

• calificaciones;

• asistencia;

• seguimiento y alertas;

• reportes;

• sincronización SIE;

• auditoría.

En calificaciones se priorizará una matriz grupal que permita al docente registrar múltiples estudiantes sin navegar entre páginas individuales.

En estudiantes se utilizarán pestañas o secciones para separar datos personales, responsables, inscripción, calificaciones, asistencia, historial y sincronizaciones.

### 3.11.3 PROTOTIPOS DE LA APLICACIÓN MÓVIL

La navegación principal propuesta es:

Inicio\
├── Estudiante seleccionado\
├── Calificaciones\
├── Asistencia\
├── Alertas\
└── Historial / Perfil

Cuando un tutor tenga más de un estudiante asociado, la selección debe permanecer claramente visible para evitar consultar datos del hijo equivocado.

Las calificaciones utilizarán lenguaje comprensible y mostrarán contexto de período y asignatura.

### 3.11.4 DISEÑO DE LA PANTALLA DE AUDITORÍA SIE

Esta pantalla constituye una de las interfaces de mayor valor técnico del sistema.

Se propone:

AUDITORÍA SIE\
Filtros: \[Gestión] \[Periodo] \[Curso] \[Estudiante] \[Estado]\

Estudiante: Juan Pérez     Asignatura: Matemática\
Periodo: Segundo trimestre\

Sistema institucional: 85     SIE Académico: 85\
✓ COINCIDENCIA\
Última verificación: 20/08/2026 14:32\
Solicitud: SYNC-2026-00192

Para discrepancia:

Sistema institucional: 85     SIE Académico: 80\
⚠ DISCREPANCIA\
\[Revisar detalle] \[Reintentar] \[Registrar resolución]

La pantalla debe incluir una línea de tiempo del proceso.

### 3.11.5 DISEÑO DE ALERTAS Y NOTIFICACIONES

Las alertas académicas y las notificaciones técnicas se separan.

Una alerta académica corresponde a una situación del estudiante.

Una notificación informa un evento al usuario.

Ejemplo:

Alerta: tres ausencias según criterio institucional.

Notificación: “Se ha generado una alerta de asistencia para el estudiante”.

Esto evita confundir el hecho de notificar con la existencia de la situación académica.

## 3.12 DISEÑO DE SEGURIDAD

### 3.12.1 AUTENTICACIÓN

La autenticación verificará la identidad antes de conceder acceso. OWASP define autenticación como el proceso de comprobar que una entidad es quien afirma ser [(OWASP Foundation, 2026a)](#tg_ref_owasp_authentication).

Las contraseñas nunca se almacenarán en texto plano; se utilizará un algoritmo adaptativo de hash con salt.

Los tokens o sesiones tendrán mecanismos de expiración y revocación.

Para el cliente web se priorizará un esquema que reduzca exposición de credenciales al código del navegador. Para móvil, los secretos de sesión persistentes se almacenarán utilizando mecanismos de almacenamiento seguro del sistema operativo.

### 3.12.2 ROLES Y PERMISOS

La autorización se ejecutará en backend.

Se aplicará principio de mínimo privilegio y denegación por defecto.

Ejemplos:

Docente + curso asignado → puede registrar calificación\
Docente + curso no asignado → 403\
Tutor + estudiante vinculado → puede consultar\
Tutor + estudiante no vinculado → 403\
Administrativo sin permiso SIE → no puede ejecutar sincronización

OWASP diferencia autenticación y autorización y recomienda diseñar controles explícitos para verificar que cada acción solicitada se encuentre permitida [(OWASP Foundation, 2026b)](#tg_ref_owasp_authorization).

### 3.12.3 PROTECCIÓN DE INFORMACIÓN ESTUDIANTIL

Los datos estudiantiles reciben protección reforzada por su naturaleza y, en muchos casos, por corresponder a niñas, niños o adolescentes.

La Constitución reconoce privacidad e intimidad como derechos civiles. El Código Niña, Niño y Adolescente reconoce el derecho a la privacidad e intimidad familiar y deberes de reserva en los casos establecidos. Además, el Código Procesal Constitucional contempla la Acción de Protección de Privacidad para conocer, objetar, eliminar o rectificar datos erróneos o que afecten intimidad o privacidad. [(Estado Plurinacional de Bolivia, 2009, 2012, 2014)](#tg_ref_existing_4e706d338d10).

• El diseño adopta, por consiguiente:

• minimización de datos;

• control de acceso;

• cifrado en tránsito;

• registro de consultas sensibles cuando corresponda;

• restricción de exportaciones;

• auditoría;

• mecanismos de corrección.

### 3.12.4 SEGURIDAD DE CREDENCIALES DEL SIE

Las credenciales SIE nunca serán entregadas al frontend.

El esquema será:

Frontend → solicita sincronización\
Backend → autoriza\
Worker → obtiene la credencial protegida del servidor\
Worker → autentica contra SIE

Las credenciales se almacenarán cifradas o en un mecanismo de gestión de secretos separado del código fuente.

No se registrarán en logs.

No se incluirán en jobs persistidos en Redis.

No se enviarán mediante eventos WebSocket.

OWASP considera la gestión de secretos y el cifrado de transmisiones sensibles controles esenciales del diseño seguro [(OWASP Foundation, 2026e)](#tg_ref_owasp_secure_coding).

### 3.12.5 REGISTRO DE OPERACIONES SENSIBLES

• Las operaciones a auditar incluyen:

• inicio de sesión y fallos relevantes;

• creación/modificación de estudiantes;

• modificación de relaciones tutor-estudiante;

• creación y corrección de calificaciones;

• modificación de asistencia;

• cierre/reapertura de períodos;

• solicitud de sincronización;

• reintentos y discrepancias SIE;

• resoluciones de discrepancias;

• cambios de roles o permisos.

OWASP recomienda registro de eventos de seguridad y operación como soporte para detección, investigación y monitorización [(OWASP Foundation, 2026c)](#tg_ref_owasp_logging).

La Tabla 3.14 consolida los controles de seguridad.

<a id="tg_table_2_14"></a>Tabla 3.14. Controles de seguridad propuestos

| **Área** | **Control** |
| --- | --- |
| Autenticación | Credenciales verificadas y sesiones revocables |
| Contraseñas | Hash adaptativo con salt |
| Autorización | Backend + RBAC + alcance contextual |
| Transporte | HTTPS/TLS |
| Estudiantes | Acceso según necesidad y vínculo |
| API | Validación, autorización y límites de abuso cuando aplique |
| SIE | Credenciales exclusivamente en servidor |
| Secretos | Fuera del repositorio y logs |
| Auditoría | Registro de operaciones críticas |
| Base de datos | Restricciones, roles y respaldos |
| WebSocket | Autenticación/autorización del canal |
| Exportaciones | Permisos explícitos |
| Logs | Redacción/exclusión de secretos |
| Mobile | Almacenamiento seguro de credenciales de sesión |

Fuente: Elaboración propia, 2026, con base en OWASP ASVS y las guías de autenticación, autorización, registro y seguridad REST [(OWASP Foundation, 2025, 2026a–2026d)](#tg_ref_owasp_asvs).

## 3.13 MARCO JURÍDICO Y MODALIDADES DE LICENCIAMIENTO

La revisión jurídica responde a una duda concreta del proyecto: si la normativa boliviana obliga a entregar gratuitamente un sistema académico. Las fuentes consultadas no sostienen esa afirmación. Existen reglas sobre gratuidad educativa y sobre preferencia estatal por software libre, pero ninguna de ellas elimina el valor económico del análisis, la programación, la implantación o el soporte.

### 3.13.1 SOFTWARE LIBRE EN LA LEY N.° 164 Y SU REGLAMENTACIÓN

El artículo 77 de la Ley N.° 164 dispone que los órganos Ejecutivo, Legislativo, Judicial y Electoral, en todos sus niveles, promuevan y prioricen el uso de software libre y estándares abiertos. El D.S. N.° 1793 reglamenta esa política y encarga un plan de implementación [(Estado Plurinacional de Bolivia, 2011)](#ref_bol_ley164_2011); [(Estado Plurinacional de Bolivia, 2013)](#ref_bol_ds1793_2013). Su destinatario principal es la administración pública. El texto no fija una tarifa de cero bolivianos para el trabajo de desarrollo.

La política fue actualizada en 2025. El D.S. N.° 5309 trasladó al 12 de enero de 2030 el plazo de migración de los sistemas de las entidades públicas, y el D.S. N.° 5322 aprobó el nuevo Plan de Implementación de Software Libre y Estándares Abiertos. El plan prevé migración, capacitación, soporte, desarrollo y seguimiento; todas son actividades que consumen recursos [(Estado Plurinacional de Bolivia, 2025a)](#ref_bol_ds5309_2025); [(Estado Plurinacional de Bolivia, 2025b)](#ref_bol_ds5322_2025); [(AGETIC, 2025)](#ref_agetic_pislea_2025). La libertad de ejecutar, estudiar, modificar y redistribuir el código describe una licencia. No borra el costo de producirlo ni impide cobrar por adaptación, despliegue, formación o mantenimiento.

### 3.13.2 VIGENCIA DEL D.S. N.° 4260

El D.S. N.° 4260 fue emitido el 6 de junio de 2020, durante la emergencia sanitaria, para ordenar la complementariedad de las modalidades presencial, a distancia, virtual y semipresencial [(Estado Plurinacional de Bolivia, 2020)](#ref_bol_ds4260_2020). No es una base jurídica vigente para exigir una plataforma gratuita: el D.S. N.° 4449, de 13 de enero de 2021, lo abrogó de manera expresa [(Estado Plurinacional de Bolivia, 2021)](#ref_bol_ds4449_2021). Citarlo como si aún regulara los entornos virtuales produciría una conclusión equivocada.

La infraestructura ofrecida por el Ministerio de Educación puede reducir el gasto de una unidad educativa cuando el servicio está disponible y cubre la necesidad. Esa posibilidad administrativa tampoco equivale a una prohibición general de contratar una solución propia. Para este proyecto, la referencia operativa vigente debe buscarse en las disposiciones de la gestión educativa 2026 y en las condiciones reales de acceso al SIE.

### 3.13.3 GRATUIDAD EDUCATIVA Y COSTO DEL SOFTWARE

La Constitución reconoce el derecho a recibir educación y establece su gratuidad en los términos previstos para el sistema público. La Ley N.° 070 desarrolla esa responsabilidad del Estado y organiza el Sistema Educativo Plurinacional [(Ministerio de Educación, 2009)](#ref_minedu_cpe_2009); [(Ministerio de Educación, 2010)](#ref_minedu_ley070_2010). El beneficiario directo de esa gratuidad es el estudiante. De esos preceptos no se desprende que un proveedor tecnológico deba donar horas profesionales, infraestructura o derechos patrimoniales.

Conviene separar dos relaciones. La primera une al Estado o a la unidad educativa con el estudiante y regula el acceso a la educación. La segunda vincula a la institución con quien diseña, desarrolla o mantiene una herramienta digital. En esta última relación existen prestaciones, plazos, entregables, garantías y derechos sobre el código; su tratamiento corresponde al contrato y a la normativa de propiedad intelectual.

### 3.13.4 DERECHO DE AUTOR, CONTRATOS Y OBRA POR ENCARGO

La Ley N.° 1322 protege los programas de ordenador y reconoce derechos morales y patrimoniales desde la creación de la obra. Los derechos patrimoniales cubren su explotación económica [(SENAPI, 1992)](#ref_senapi_ley1322_1992). El D.S. N.° 24582 precisa el régimen del software: el titular puede autorizar o prohibir comercialización, arrendamiento, reproducción, adaptación y modificación; también admite licencias y transferencias mediante convenio o contrato [(SENAPI, 1997)](#ref_senapi_ds24582_1997).

El artículo 12 del D.S. N.° 24582 resulta especialmente relevante. Cuando el software se crea bajo contrato laboral o de prestación de servicios, la titularidad corresponde, por regla, a la persona natural o jurídica por cuya cuenta y riesgo se realiza, salvo pacto contrario [(SENAPI, 1997)](#ref_senapi_ds24582_1997). Por eso el contrato debe decir quién conserva el repositorio, qué derecho recibe el colegio, si se entrega el código fuente, cómo se tratan los componentes de terceros y quién asume el mantenimiento.

### 3.13.5 APLICACIÓN AL PROYECTO

El sistema puede desarrollarse mediante un servicio remunerado y, al mismo tiempo, usar tecnologías de código abierto. Son decisiones compatibles. React, NestJS, Flutter, PostgreSQL, Redis y las demás dependencias conservan sus licencias; el código escrito específicamente para el colegio puede entregarse bajo cesión, licencia exclusiva, licencia no exclusiva o una licencia de software libre, según el acuerdo que se documente.

Para una contratación real se propone un documento con seis definiciones mínimas: alcance y entregables; precio y calendario de pagos; titularidad del código y de la base de datos; licencias de terceros; niveles de soporte y continuidad; tratamiento de datos personales y credenciales del SIE. El proyecto académico describe estas condiciones sin presumir que ya existe un contrato comercial.

<a id="tg_table_3_15"></a>*Tabla 3.15. Matriz de alcance jurídico aplicable al proyecto*

| **Norma** | **Contenido verificado** | **Consecuencia para el proyecto** |
| --- | --- | --- |
| CPE y Ley N.° 070 | Reconocen el derecho a la educación y la gratuidad dentro del régimen educativo público. | No imponen trabajo gratuito a desarrolladores o proveedores. |
| Ley N.° 164 y D.S. N.° 1793 | Priorizan software libre y estándares abiertos en órganos y entidades públicas. | Orientan la licencia y la soberanía tecnológica; no fijan precio cero. |
| D.S. N.° 5309 y D.S. N.° 5322 | Actualizan el plazo y el plan estatal de migración hacia software libre. | La obligación se concentra en el sector público definido por la norma. |
| D.S. N.° 4260 y D.S. N.° 4449 | El primero reguló modalidades educativas en 2020; el segundo lo abrogó en 2021. | El D.S. N.° 4260 queda como antecedente histórico. |
| Ley N.° 1322 y D.S. N.° 24582 | Protegen el software, su explotación económica, las licencias y la obra por encargo. | Permiten desarrollo remunerado y exigen acordar titularidad y uso. |

Fuente: Elaboración propia con base en [Estado Plurinacional de Bolivia (2011, 2013, 2020, 2021, 2025a, 2025b)](#ref_bol_ley164_2011) y [SENAPI (1992, 1997)](#ref_senapi_ley1322_1992).

## 3.14 ESTIMACIÓN DEL COSTO DE DESARROLLO DE SOFTWARE ACADÉMICO EN BOLIVIA

No existe una tarifa boliviana única para un sistema académico. El precio cambia con la cantidad de módulos, la migración de datos, la integración con servicios externos, la seguridad, el soporte y la cesión del código. Por ello se aplica una estimación ascendente: se valoran meses-persona por perfil y después se agregan incertidumbre e infraestructura.

### 3.14.1 FUENTES Y CRITERIO DE CÁLCULO

La referencia principal es la escala salarial publicada por AGETIC. Registra, entre otros valores mensuales, Bs 11.343 para Profesional III, Bs 10.792 para Profesional IV y Bs 9.846 para Técnico I [(AGETIC, 2024)](#ref_agetic_salary_2024). Es una escala de una entidad tecnológica pública, no un arancel para empresas privadas. Se usa porque ofrece montos verificables en bolivianos y perfiles cercanos al trabajo requerido.

Dos referencias ayudan a leer la cifra sin confundirla. El Programa Anual de Contrataciones 2024 del Ministerio de Planificación incluyó una consultoría individual de línea para un especialista en desarrollo de sistema con precio referencial de Bs 46.812; el documento no detalla aquí la duración ni el alcance técnico, de modo que no representa el precio completo del producto [(Ministerio de Planificación del Desarrollo, 2024)](#ref_mpd_pac_2024). El salario mínimo nacional de Bs 3.300 vigente en 2026 funciona solo como piso laboral del contexto boliviano, no como tarifa profesional de desarrollo [(Ministerio de Trabajo, 2026)](#ref_mintrabajo_rm088_2026).

*Costo de trabajo = Σ (meses-persona del perfil × referencia mensual del perfil)*

<a id="tg_table_3_16"></a>*Tabla 3.16. Fuentes económicas empleadas en la estimación*

| **Fuente** | **Dato verificable** | **Uso** | **Límite** |
| --- | --- | --- | --- |
| AGETIC, escala salarial | Prof. III: Bs 11.343; Prof. IV: Bs 10.792; Técnico I: Bs 9.846 por mes. | Base mensual por perfil. | Escala pública; no incluye margen comercial ni cargas de una empresa. |
| MPD, PAC 2024 | Especialista en desarrollo de sistema: Bs 46.812. | Contraste con una contratación pública real. | El PAC no expone duración ni entregables en la línea citada. |
| MTEPS, R.M. N.° 088/26 | Salario mínimo nacional 2026: Bs 3.300. | Contexto salarial mínimo. | No corresponde al valor de un perfil especializado. |
| AlticHost, 2026 | Plan con PostgreSQL: Bs 249/mes o Bs 2.490/año; dominio .com.bo: Bs 250/año. | Piso publicado para operación anual. | Debe confirmarse soporte para Node.js, Redis, BullMQ y Puppeteer. |

Fuente: Elaboración propia con base en [AGETIC (2024)](#ref_agetic_salary_2024), [Ministerio de Planificación del Desarrollo (2024)](#ref_mpd_pac_2024), [Ministerio de Trabajo (2026)](#ref_mintrabajo_rm088_2026) y [AlticHost (2026)](#ref_altichost_2026).

### 3.14.2 VALORACIÓN DEL TRABAJO DE DESARROLLO

El alcance valorado incluye análisis, arquitectura, backend, plataforma web, aplicación móvil, modelo de datos, automatización controlada del SIE, pruebas y revisión de experiencia de usuario. Siete meses-persona se asignan al núcleo de desarrollo: seis para construcción y uno para el módulo de datos y sincronización. Las revisiones de calidad y seguridad suman un mes y medio; la revisión de interfaz y accesibilidad, medio mes.

<a id="tg_table_3_17"></a>*Tabla 3.17. Estimación del valor económico del desarrollo*

| **Componente** | **Referencia** | **Meses-persona** | **Cálculo** | **Monto** |
| --- | --- | --- | --- | --- |
| Análisis, arquitectura y construcción web/móvil | Profesional III | 6,0 | 6 × Bs 11.343 | Bs 68.058,00 |
| Modelo de datos y automatización SIE | Profesional III | 1,0 | 1 × Bs 11.343 | Bs 11.343,00 |
| Pruebas, seguridad y aceptación | Profesional IV | 1,5 | 1,5 × Bs 10.792 | Bs 16.188,00 |
| UX y accesibilidad | Técnico I | 0,5 | 0,5 × Bs 9.846 | Bs 4.923,00 |
| **Subtotal de trabajo** |  | **9,0** |  | **Bs 100.512,00** |
| **Reserva de estimación** | **10 %** |  | **Bs 100.512 × 0,10** | **Bs 10.051,20** |
| **Valor económico del desarrollo** |  |  |  | **Bs 110.563,20** |

Fuente: Elaboración propia a partir de la escala salarial de [AGETIC (2024)](#ref_agetic_salary_2024). Montos expresados en bolivianos.

### 3.14.3 INFRAESTRUCTURA Y COSTO DEL PRIMER AÑO

Como referencia local publicada, AlticHost anuncia un plan corporativo con PostgreSQL por Bs 249 al mes o Bs 2.490 al año y un dominio .com.bo por Bs 250 anuales [(AlticHost, 2026)](#ref_altichost_2026). El dato permite fijar un piso visible de Bs 2.740 por año. Antes de contratarlo debe comprobarse si el entorno admite Node.js, Redis, BullMQ, ejecución de Puppeteer, copias de seguridad y el volumen esperado; la página consultada no confirma todos esos requisitos.

<a id="tg_table_3_18"></a>*Tabla 3.18. Escenario económico referencial del primer año*

| **Concepto** | **Base** | **Monto** |
| --- | --- | --- |
| Desarrollo del sistema | Estimación por meses-persona | Bs 110.563,20 |
| Hosting anual publicado | Plan AltiCorporativo | Bs 2.490,00 |
| Dominio anual | .com.bo | Bs 250,00 |
| **Total referencial del primer año** | **Sujeto a validación técnica y cotización** | **Bs 113.303,20** |

Fuente: Elaboración propia con base en [AGETIC (2024)](#ref_agetic_salary_2024) y [AlticHost (2026)](#ref_altichost_2026).

### 3.14.4 LECTURA Y LÍMITES DE LA ESTIMACIÓN

Bs 110.563,20 expresa el valor económico del trabajo definido, aunque parte o la totalidad sea realizada por el postulante y no produzca un desembolso equivalente. En un proyecto académico, esa diferencia importa: costo económico y gasto de caja no son la misma cifra. El tiempo propio tiene costo de oportunidad; registrarlo evita concluir que el software carece de valor porque no se emitió una factura.

Una oferta comercial podría ser mayor. La tabla no incorpora aportes patronales, impuestos, utilidad del proveedor, equipos, digitalización masiva de archivos, limpieza de datos históricos, desplazamientos, capacitación extendida ni una mesa de ayuda con acuerdo de nivel de servicio. Tampoco asigna precio a cambios del SIE que obliguen a rehacer la automatización. Esos rubros deben aparecer por separado en los términos de referencia o en el contrato.

La decisión de licenciamiento modifica el precio y el riesgo. Una cesión amplia del código puede elevar el monto inicial; una licencia de uso con mantenimiento distribuye el pago en el tiempo; publicar el código bajo una licencia libre permite reutilización y auditoría, pero sigue requiriendo presupuesto para adaptación y soporte. Ninguna de estas modalidades está prohibida por la gratuidad educativa.

## 3.15 PLAN DE DESARROLLO

### 3.15.1 ORGANIZACIÓN DEL TRABAJO POR INCREMENTOS

Se propone desarrollar el sistema mediante seis incrementos funcionales.

El orden responde a dependencias del dominio. No es posible implementar correctamente calificaciones antes de disponer de estudiante, gestión, inscripción, asignatura y docente. Tampoco resulta conveniente implementar la integración SIE antes de estabilizar los datos que serán enviados.

El plan se encuentra en la Tabla 3.19.

<a id="tg_table_2_15"></a>Tabla 3.19. Plan de desarrollo por incrementos

| **Incremento** | **Alcance principal** | **Entregable** |
| --- | --- | --- |
| A | Arquitectura, repositorio, PostgreSQL, migraciones, autenticación, roles | Base técnica operativa |
| B | Estudiantes, tutores, estructura académica, inscripciones | Registro académico central |
| C | Calificaciones, asistencia, historial, reportes | Gestión académica operativa |
| D | Seguimiento, alertas, aplicación Flutter | Seguimiento y acceso familiar |
| E | Redis, BullMQ, Puppeteer, SIE, verificación, conciliación, WebSockets | Interoperabilidad auditable |
| F | Seguridad, pruebas, rendimiento, despliegue, documentación | Versión candidata a producción |

Fuente: Elaboración propia, 2026.

### 3.15.2 ALCANCE DE LOS INCREMENTOS

• El Incremento A establece infraestructura, autenticación, roles, base de datos y arquitectura.

• El Incremento B implementa estudiantes, tutores, estructura académica e inscripciones.

• El Incremento C incorpora calificaciones, asistencia, historial y reportes.

• El Incremento D incorpora seguimiento, alertas y aplicación móvil para responsables.

• El Incremento E construye la integración SIE, worker Puppeteer, colas, verificación, conciliación y estados en tiempo real.

• El Incremento F concentra endurecimiento de seguridad, pruebas, optimización, documentación y despliegue reproducible.

La implementación de migraciones permite mantener versionada la estructura de PostgreSQL y reproducir el esquema en nuevos entornos mediante el proceso de despliegue. Prisma proporciona mecanismos específicos para conservar y desplegar estas migraciones. [(Prisma, 2026)](#tg_ref_prisma_migrate).

### 3.15.3 CRITERIOS DE ACEPTACIÓN

Cada incremento se considera potencialmente entregable sólo cuando sus historias prioritarias cumplen criterios de aceptación.

Los criterios no se limitan a “la pantalla funciona”. Deben incluir:

• comportamiento funcional;

• autorización;

• integridad de datos;

• tratamiento de errores;

• auditoría cuando aplique;

• pruebas del flujo.

El incremento SIE, por ejemplo, no se considerará aceptado solamente porque Puppeteer pueda escribir en un formulario. Debe demostrar en un ambiente autorizado el ciclo encolar → ejecutar → transferir → verificar → comparar → registrar estado.

### 3.15.4 DEFINICIÓN DE TERMINADO

La Definition of Done propuesta establece que un elemento se considera terminado cuando:

• su implementación cumple el criterio funcional;

• las validaciones de dominio se encuentran implementadas;

• las restricciones de autorización se aplican en backend;

• las migraciones requeridas se encuentran versionadas;

• las pruebas del flujo crítico se ejecutan satisfactoriamente;

• los errores poseen tratamiento definido;

• las acciones sensibles generan auditoría;

• la documentación técnica relevante se encuentra actualizada;

• no existen defectos críticos conocidos que impidan su uso;

• el comportamiento fue contrastado con sus criterios de aceptación.

La calidad deberá ser evaluada posteriormente de manera coherente con el modelo establecido en ISO/IEC 25010:2023 y con controles de seguridad aplicables de OWASP ([International Organization for Standardization, 2023](#tg_ref_existing_e98c60c85b65); [OWASP Foundation, 2025](#tg_ref_owasp_asvs)).

En la aplicación práctica, cada incremento que cree, modifique o transfiera registros académicos incorporará una ficha de evidencia con el requerimiento, conjunto de prueba, responsable de revisión, resultado, incidencia encontrada, corrección y aceptación. Cuando intervengan datos académicos, la revisión comprobará exactitud, completitud, consistencia, actualidad y trazabilidad antes y después de la sincronización. Así se conectan ISO/IEC 25012:2008 e ISO 9001:2026 con criterios observables, sin declarar una certificación inexistente ([ISO/IEC, 2008](#tg_ref_iso25012); [ISO, 2026a](#tg_ref_iso9001_2026)).

La referencia ambiental se aplicará al despliegue mediante una línea base que el colegio pueda registrar: recursos de infraestructura contratados, crecimiento del almacenamiento, política de retención de respaldos, reutilización o vida útil de equipos y cantidad de reportes internos emitidos solo en formato digital frente a los impresos. Las metas se fijarán después de medir el primer periodo operativo. Este criterio deriva de la familia ISO 14000 y de ISO 14001:2026, pero no elimina los archivos impresos exigidos por el artículo 60 de la Resolución Ministerial N.º 0001/2026 ni equivale a una certificación ambiental ([ISO, s. f.](#tg_ref_iso14000_family); [ISO, 2026b](#tg_ref_iso14001_2026); [Ministerio de Educación del Estado Plurinacional de Bolivia, 2026a](#tg_ref_minedu_rm_2026)).

### 3.15.5 COMPARATIVA Y SELECCIÓN DE TECNOLOGÍAS

La selección se divide por capas y por decisión. React no comparte tabla con TypeScript, del mismo modo que PostgreSQL se evalúa aparte de Prisma: cumplen papeles distintos y una ventaja del primero no debe inflar el puntaje del segundo. Cada tabla confronta opciones realmente utilizables, registra la desventaja de la elección y deja visibles las valoraciones que producen el resultado.

#### 3.15.5.1 BASE DE LA PONDERACIÓN

Se utiliza una suma ponderada. Cada alternativa recibe de 1 a 5 puntos en cinco criterios: 1 representa un desajuste serio o un costo de adaptación alto; 3, una opción viable con compensaciones visibles; y 5, un ajuste directo sustentado por documentación oficial y por las restricciones del proyecto. La calificación final se obtiene con P = 20 × Σ(wᵢ × sᵢ), por lo que el máximo es 100 puntos.

Los pesos no provienen de una norma que prescriba tecnologías. Son una decisión documentada del proyecto. La adecuación al flujo académico y la compatibilidad reúnen 55 % porque un desacople repercute en matrícula, notas, asistencia y sincronización. Mantenibilidad recibe 20 %; integración y soporte, 15 %; y costo total, 10 %. ISO/IEC 25010 orienta la lectura de mantenibilidad y compatibilidad, ISO/IEC/IEEE 42010 exige justificar las decisiones de arquitectura y el método de suma ponderada aporta el procedimiento de cálculo.

<a id="tg_table_3_20_v2"></a>Tabla 3.20. Criterios, pesos y evidencia del ranking tecnológico

| **Código y criterio** | **Peso** | **Pregunta aplicada** | **Evidencia usada para valorar** |
| --- | --- | --- | --- |
| AF — Adecuación funcional | 30 % | ¿Resuelve el papel asignado en matrícula, seguimiento, auditoría o SIE sin forzar el diseño? | Cobertura del flujo, manejo de errores, integridad y ajuste al alcance real del colegio. |
| CE — Compatibilidad con el ecosistema | 25 % | ¿Convive con el lenguaje, los contratos API, el despliegue y las demás capas elegidas? | Interoperabilidad oficial, reutilización de tipos, soporte de plataforma y fricción de instalación. |
| MD — Mantenibilidad | 20 % | ¿Facilita separar responsabilidades, probar cambios y comprender el código durante el mantenimiento? | Convenciones, tipado, modularidad, migraciones, pruebas y claridad de la documentación. |
| IN — Integración y soporte | 15 % | ¿Dispone de bibliotecas, documentación y mecanismos de integración para el caso de uso? | Documentación oficial, controladores, conectores y compatibilidad con las herramientas del proyecto. |
| CO — Costo total | 10 % | ¿Qué exige en licencias, infraestructura, aprendizaje y operación? | Licencia, número de componentes, demanda operativa y tiempo de formación o migración. |

Fuente: Elaboración propia, 2026, con base en [ISO/IEC, 2023](#tg_ref_existing_e98c60c85b65); [ISO/IEC/IEEE, 2022](#tg_ref_existing_cc29a6f184a8); [Triantaphyllou, 2000](#tg_ref_triantaphyllou).

El puntaje es contextual, no una clasificación universal del mercado. Se recalcula si aparece una API oficial del SIE, cambia el equipo, se exige operar en una sola plataforma móvil o el sistema pasa a atender varias instituciones. Los valores comparan el ajuste al proyecto; no sustituyen una prueba de concepto ni un ensayo de carga.

#### 3.15.5.2 CAPA DE PRESENTACIÓN WEB

La capa web se descompone en biblioteca de interfaz y lenguaje. Esta separación permite verificar si React es la mejor opción para construir pantallas y, de forma independiente, si TypeScript mejora los contratos y el mantenimiento.

**React**

React se evalúa como biblioteca para los formularios de matrícula, tablas de calificaciones, control de asistencia, filtros y paneles administrativos.

<a id="tg_table_tech_3_21_v2"></a>Tabla 3.21. Comparación detallada para React

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **React (seleccionada)** | Su composición por componentes encaja con pantallas repetitivas y permite entregar módulos por incremento. El ecosistema cubre formularios, tablas, consultas y pruebas sin imponer una arquitectura de backend. | No incluye por sí solo enrutamiento, acceso a datos ni una política de estado. El equipo debe fijar esas decisiones y revisar accesibilidad para evitar una interfaz fragmentada. | 89/100<br>AF5 · CE4 · MD4 · IN5 · CO4 |
| Vue | Los componentes de archivo único y su reactividad reducen la fricción inicial. Es una opción seria para un panel administrativo y conserva un buen soporte de TypeScript. | Implicaría cambiar la base de componentes y convenciones ya alineadas con React. La ganancia de simplicidad no compensa la migración dentro del alcance actual. | 85/100<br>AF4 · CE5 · MD4 · IN4 · CO4 |
| Angular | Entrega enrutamiento, formularios, inyección de dependencias y convenciones en un solo marco. Esa disciplina beneficia equipos grandes y aplicaciones con reglas uniformes. | Para un equipo pequeño incorpora más estructura, aprendizaje y código ceremonial. Parte de sus capacidades duplicaría decisiones ya resueltas en el backend NestJS. | 82/100<br>AF4 · CE4 · MD5 · IN4 · CO3 |

**Decisión aplicada al sistema:** Se mantiene React porque el trabajo está dominado por formularios y vistas reutilizables, y el desarrollo puede avanzar por módulos sin introducir un marco completo en el cliente. La elección exige una guía de componentes, reglas de accesibilidad y una sola estrategia para estado y consultas.

Fuente: Elaboración propia, 2026, con base en [Meta Open Source, 2026](#tg_ref_react_components); [Vue.js, 2026](#tg_ref_vue); [Google, 2026](#tg_ref_angular).

**TypeScript**

El lenguaje se valora por su capacidad para mantener coherentes los modelos que viajan entre la interfaz React, la API NestJS y los trabajos de sincronización.

<a id="tg_table_tech_3_22_v2"></a>Tabla 3.22. Comparación detallada para TypeScript

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **TypeScript (seleccionada)** | Detecta incompatibilidades antes de ejecutar y permite compartir contratos, tipos de respuesta y estados del dominio. Su encaje es directo con React, Node.js y NestJS. | Los tipos desaparecen en ejecución; por eso no sustituyen la validación de entradas. También exige configurar reglas estrictas y evitar conversiones que oculten errores. | 93/100<br>AF5 · CE4 · MD5 · IN5 · CO4 |
| JavaScript + JSDoc | Conserva el lenguaje nativo y puede ofrecer ayuda del editor sin una migración completa. Reduce configuración en módulos pequeños. | La disciplina depende de comentarios y herramientas; los contratos complejos se degradan con facilidad. En una API académica, esa ambigüedad eleva el riesgo de campos omitidos o estados mal interpretados. | 80/100<br>AF3 · CE5 · MD3 · IN5 · CO5 |
| Flow | Aporta comprobación estática y una sintaxis cercana a JavaScript, con soporte específico para patrones de React. | Añade un compilador y definiciones propios, mientras NestJS y gran parte del ecosistema seleccionado publican tipos para TypeScript. Mantener dos sistemas de tipos no ofrece una ventaja operativa aquí. | 67/100<br>AF3 · CE4 · MD3 · IN3 · CO4 |

**Decisión aplicada al sistema:** Se adopta TypeScript en cliente, servidor y workers. La condición es mantener modo estricto, validar todo dato externo en tiempo de ejecución y generar contratos desde una fuente controlada; el tipado estático no convierte una respuesta del SIE en información confiable.

Fuente: Elaboración propia, 2026, con base en [Microsoft, 2026](#tg_ref_typescript_basics); [Flow, 2026](#tg_ref_flow).

#### 3.15.5.3 CAPA DE BACKEND

El backend distingue el entorno de ejecución del marco de aplicación. Node.js ejecuta el código; NestJS organiza módulos, controladores, servicios, colas y gateways.

**Node.js**

El entorno debe atender solicitudes HTTP, notificaciones, acceso a PostgreSQL y procesos de automatización con el mismo lenguaje utilizado en el cliente.

<a id="tg_table_tech_3_23_v2"></a>Tabla 3.23. Comparación detallada para Node.js

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **Node.js (seleccionada)** | Comparte JavaScript y TypeScript con la capa web, dispone de controladores maduros para PostgreSQL, Redis y navegadores, y coincide con el soporte principal de NestJS, Prisma, BullMQ y Puppeteer. | Las tareas intensivas de CPU pueden bloquear el bucle de eventos. Los trabajos pesados deben aislarse y la versión LTS debe fijarse y actualizarse con una política explícita. | 96/100<br>AF5 · CE5 · MD4 · IN5 · CO5 |
| Deno | Ejecuta TypeScript de forma directa y aplica permisos explícitos sobre red, archivos y entorno. Su distribución incluye herramientas de formato, pruebas y tareas. | El conjunto seleccionado está documentado y desplegado principalmente para Node.js. Adaptar NestJS, Prisma, BullMQ y Puppeteer agregaría validación de compatibilidad sin resolver una necesidad del colegio. | 77/100<br>AF4 · CE4 · MD4 · IN3 · CO4 |
| Bun | Reúne runtime, gestor de paquetes, pruebas y empaquetado, con arranque rápido y soporte directo de TypeScript. | La compatibilidad con Node.js continúa siendo una capa que debe probarse dependencia por dependencia. Para un sistema académico estable, la menor trayectoria del runtime pesa más que su velocidad de instalación. | 78/100<br>AF4 · CE5 · MD3 · IN3 · CO4 |

**Decisión aplicada al sistema:** Node.js ofrece la ruta con menos adaptadores para el conjunto ya elegido. Se fija una versión LTS, se separan las colas del proceso HTTP y se prohíbe ejecutar dentro de la API cualquier tarea de automatización que pueda monopolizar el proceso.

Fuente: Elaboración propia, 2026, con base en [Node.js, 2026](#tg_ref_node_intro); [Deno, 2026](#tg_ref_deno); [Bun, 2026](#tg_ref_bun).

**NestJS**

El marco del servidor debe separar identidad, matrícula, evaluación, asistencia, alertas, auditoría e integración SIE sin convertir cada módulo en un servicio independiente.

<a id="tg_table_tech_3_24_v2"></a>Tabla 3.24. Comparación detallada para NestJS

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **NestJS (seleccionada)** | Sus módulos, proveedores, controladores, guards, colas y gateways permiten traducir los límites del dominio a una estructura verificable. Funciona con TypeScript y conserva una sola plataforma de despliegue. | La inyección de dependencias y los decoradores agregan abstracción. Si se crean módulos sin límites claros, la estructura aparenta orden pero mantiene acoplamiento interno. | 93/100<br>AF5 · CE4 · MD5 · IN5 · CO4 |
| Express | Es pequeño, conocido y flexible. Permite construir una API con pocas capas y escoger cada biblioteca según la necesidad. | No define organización, validación, autorización ni pruebas. El equipo tendría que diseñar y vigilar esas convenciones, justo donde el proyecto necesita consistencia entre varios módulos. | 86/100<br>AF4 · CE5 · MD3 · IN5 · CO5 |
| FastAPI | Ofrece modelos tipados, validación y documentación automática en Python. Es adecuado para APIs con procesamiento de datos o servicios analíticos. | Introduce un segundo lenguaje y otro ecosistema operativo. La integración con BullMQ, Puppeteer y los contratos TypeScript requeriría adaptadores y duplicación de modelos. | 77/100<br>AF4 · CE4 · MD4 · IN3 · CO4 |
| Django | Incluye ORM, autenticación, migraciones y panel administrativo. Su enfoque integrado acelera sistemas CRUD convencionales. | Obligaría a reemplazar Prisma y la estructura Node.js, y no reduce la dificultad específica de la automatización del SIE. Su alcance excede las piezas que ya cubre la arquitectura propuesta. | 76/100<br>AF4 · CE3 · MD5 · IN3 · CO4 |

**Decisión aplicada al sistema:** NestJS queda como marco de la API porque expresa los módulos de dominio y ofrece integración directa con colas y WebSocket. La revisión arquitectónica comprobará que los controladores no contengan reglas de negocio y que cada módulo publique únicamente los casos de uso necesarios.

Fuente: Elaboración propia, 2026, con base en [NestJS, 2026](#tg_ref_existing_e1ad667656fc); [OpenJS Foundation, 2026](#tg_ref_express); [FastAPI, 2026](#tg_ref_fastapi); [Django Software Foundation, 2026](#tg_ref_django).

#### 3.15.5.4 CAPA MÓVIL

La aplicación móvil tiene un alcance deliberadamente menor que la plataforma web: consulta de calificaciones y asistencia, recepción de avisos y seguimiento por responsables.

**Flutter**

La comparación considera una sola base de código para Android e iOS, sin asumir que ambas plataformas tendrán la misma prioridad de despliegue.

<a id="tg_table_tech_3_25_v2"></a>Tabla 3.25. Comparación detallada para Flutter

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **Flutter (seleccionada)** | Proporciona una interfaz coherente en Android e iOS y controla su propio sistema de widgets. Es adecuado para pantallas de consulta y notificaciones con comportamiento uniforme. | Introduce Dart y un conjunto de componentes separado de React. El equipo debe mantener contratos API compartidos por especificación, no por reutilización directa de tipos. | 86/100<br>AF5 · CE4 · MD4 · IN4 · CO4 |
| React Native | Permite usar JavaScript o TypeScript y conserva conceptos de React. Facilita compartir conocimiento entre web y móvil. | Los componentes son nativos y no se reutiliza la interfaz web de forma automática. Los módulos de plataforma y las actualizaciones del ecosistema requieren pruebas por sistema operativo. | 80/100<br>AF4 · CE4 · MD4 · IN4 · CO4 |
| Kotlin para Android | Entrega acceso directo a las APIs de Android y una integración nativa sin puente. Resulta apropiado si el alcance se limita de forma contractual a Android. | Mantener iOS exigiría otra aplicación. Para el alcance multiplataforma actual duplica diseño, pruebas y publicación, aun cuando la primera versión se despliegue solo en Android. | 76/100<br>AF3 · CE4 · MD5 · IN4 · CO3 |

**Decisión aplicada al sistema:** Flutter se conserva para la aplicación de responsables porque el flujo móvil es acotado y la uniformidad entre plataformas pesa más que compartir lenguaje con la web. Antes de cerrar la elección se validará en una prueba de concepto el manejo de notificaciones, accesibilidad y consumo en dispositivos de gama media.

Fuente: Elaboración propia, 2026, con base en [Google, 2026, Flutter](#tg_ref_existing_cf5cbb4afbea); [Meta Open Source, 2026, React Native](#tg_ref_react_native); [Google, 2026, Kotlin](#tg_ref_kotlin_android).

#### 3.15.5.5 CAPA DE PERSISTENCIA

La base de datos y la herramienta de acceso se puntúan aparte. La primera protege los registros; la segunda traduce modelos y migraciones al código.

**PostgreSQL**

La información del colegio forma una red relacional: estudiante, matrícula, gestión, grado, asignatura, asistencia, calificación, responsable y auditoría deben conservar referencias válidas.

<a id="tg_table_tech_3_26_v2"></a>Tabla 3.26. Comparación detallada para PostgreSQL

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **PostgreSQL (seleccionada)** | Ofrece transacciones, claves foráneas, restricciones CHECK, índices y tipos suficientes para proteger el núcleo académico. La licencia y el soporte de Prisma encajan con el despliegue previsto. | La consistencia exige diseñar índices, respaldos y migraciones; una instalación sin mantenimiento no hereda calidad por usar PostgreSQL. El equipo debe vigilar conexiones y crecimiento de auditoría. | 100/100<br>AF5 · CE5 · MD5 · IN5 · CO5 |
| MySQL | Es relacional, ampliamente disponible y cubre transacciones, claves e índices necesarios para el sistema. También cuenta con soporte de Prisma. | Las diferencias de tipos, restricciones y comportamiento SQL obligarían a ajustar migraciones. No ofrece una ventaja concreta sobre la base ya modelada y probada para PostgreSQL. | 90/100<br>AF4 · CE5 · MD4 · IN5 · CO5 |
| MongoDB | Admite documentos flexibles y permite evolucionar estructuras sin un esquema relacional rígido. Puede servir para eventos o contenido heterogéneo. | El dominio depende de relaciones y restricciones cruzadas. Trasladar esas garantías a la aplicación haría más difícil impedir notas sin matrícula, duplicidad de vínculos o referencias huérfanas. | 79/100<br>AF3 · CE5 · MD4 · IN4 · CO4 |

**Decisión aplicada al sistema:** Se selecciona PostgreSQL porque las reglas académicas deben fallar también en la capa de datos, no solo en un formulario. El puntaje máximo responde a este caso concreto; queda condicionado a migraciones revisadas, copias de seguridad probadas y restricciones que reflejen las reglas aprobadas por la institución.

Fuente: Elaboración propia, 2026, con base en [PostgreSQL, 2026](#tg_ref_postgres_constraints); [Oracle, 2026](#tg_ref_mysql); [MongoDB, 2026](#tg_ref_mongodb).

**Prisma ORM**

El acceso a datos debe producir consultas tipadas y migraciones reproducibles sin ocultar las restricciones de PostgreSQL ni impedir consultas SQL específicas.

<a id="tg_table_tech_3_27_v2"></a>Tabla 3.27. Comparación detallada para Prisma ORM

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **Prisma ORM (seleccionada)** | Genera un cliente tipado desde el esquema, integra migraciones y mantiene una lectura clara de relaciones. Reduce discrepancias entre modelos TypeScript y la base seleccionada. | No reemplaza el conocimiento de SQL. Algunas consultas complejas, bloqueos o ajustes de rendimiento requieren SQL explícito y revisión de las consultas generadas. | 93/100<br>AF5 · CE4 · MD5 · IN5 · CO4 |
| TypeORM | Admite Data Mapper y Active Record, decoradores, repositorios y varias bases de datos. Su integración con NestJS es conocida. | El uso intensivo de decoradores puede mezclar persistencia con el dominio si no se controlan las entidades. La generación de migraciones debe revisarse con el mismo rigor que en Prisma. | 90/100<br>AF4 · CE5 · MD4 · IN5 · CO5 |
| Sequelize | Es un ORM maduro para Node.js con transacciones, relaciones y varios motores. Permite un enfoque conocido por equipos con experiencia previa. | Su experiencia TypeScript y la definición de modelos añaden más trabajo manual para este esquema. La base existente no obtiene una mejora que justifique sustituir Prisma. | 83/100<br>AF4 · CE5 · MD3 · IN4 · CO5 |

**Decisión aplicada al sistema:** Prisma se conserva por la generación tipada y el flujo de migraciones. Las entidades del dominio no dependerán del cliente de Prisma; los repositorios lo encapsulan y permiten usar SQL revisado cuando una consulta académica no se exprese con claridad mediante el ORM.

Fuente: Elaboración propia, 2026, con base en [Prisma, 2026](#tg_ref_prisma_migrate); [TypeORM, 2026](#tg_ref_typeorm); [Sequelize, 2026](#tg_ref_sequelize).

#### 3.15.5.6 CAPA DE PROCESAMIENTO ASÍNCRONO

La infraestructura temporal y el mecanismo de colas se comparan por separado: Redis almacena estructuras efímeras; BullMQ define trabajos, reintentos y workers sobre Redis.

**Redis**

Redis se destina a colas, estados temporales y comunicación de progreso; PostgreSQL continúa siendo la fuente persistente de los registros académicos.

<a id="tg_table_tech_3_28_v2"></a>Tabla 3.28. Comparación detallada para Redis

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **Redis (seleccionada)** | Sus estructuras y operaciones atómicas encajan con BullMQ y con estados de corta duración. Evita usar la base académica como canal de mensajes y dispone de integración directa en Node.js. | Es otro servicio que debe supervisarse y respaldarse según la política de colas. No debe guardar la única copia de una nota, matrícula o evidencia de auditoría. | 89/100<br>AF5 · CE4 · MD4 · IN5 · CO4 |
| Solo PostgreSQL | Reduce componentes y mantiene trabajos y estados en una base ya administrada. Puede implementar una cola pequeña mediante tablas y transacciones. | Mezcla carga operativa con datos académicos y exige desarrollar reservas, expiración, reintentos y limpieza. El costo inicial bajo se traslada al código y al mantenimiento. | 84/100<br>AF3 · CE5 · MD4 · IN5 · CO5 |
| Memcached | Es simple y eficiente para caché distribuida de objetos temporales. Su operación básica es fácil de comprender. | No ofrece las estructuras y semánticas que BullMQ necesita para colas. La propia documentación advierte que es un almacén efímero y no una base persistente. | 74/100<br>AF3 · CE5 · MD3 · IN3 · CO5 |

**Decisión aplicada al sistema:** Redis se limita a coordinación y datos reconstruibles. Las credenciales del SIE, los resultados académicos y la evidencia final de sincronización permanecen fuera de la caché; el diseño incluye expiración, métricas y recuperación ante reinicio.

Fuente: Elaboración propia, 2026, con base en [Redis, 2026](#tg_ref_redis_types); [PostgreSQL, 2026](#tg_ref_existing_cf5cbb4afbea); [Memcached Project, 2026](#tg_ref_memcached).

**BullMQ**

El trabajo de sincronización con el SIE debe salir del ciclo HTTP, reintentarse con límites y registrar cada transición sin repetir cambios ya confirmados.

<a id="tg_table_tech_3_29_v2"></a>Tabla 3.29. Comparación detallada para BullMQ

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **BullMQ (seleccionada)** | Modela colas, workers, retrasos, reintentos y trabajos idempotentes dentro del ecosistema Node.js. Su acoplamiento con Redis y NestJS reduce adaptadores. | La semántica de entrega obliga a diseñar idempotencia; un reintento no puede duplicar una nota ni una matrícula. Redis y los workers pasan a ser componentes operativos obligatorios. | 89/100<br>AF5 · CE4 · MD4 · IN5 · CO4 |
| Tabla de trabajos en PostgreSQL | Mantiene una sola infraestructura y permite transacciones junto con el registro local. Resulta viable para una carga pequeña. | El equipo debe programar bloqueo, reserva, visibilidad, expiración, reintentos y concurrencia. Esas reglas compiten con el desarrollo de funciones académicas. | 86/100<br>AF4 · CE5 · MD3 · IN5 · CO5 |
| RabbitMQ | Es un corredor de mensajes especializado con enrutamiento, confirmaciones y patrones adecuados para sistemas distribuidos. | Agrega un servicio y una disciplina operativa más amplia que la demanda actual. Sus ventajas aparecen con varios productores y consumidores, condición aún no presente. | 77/100<br>AF4 · CE3 · MD5 · IN4 · CO3 |
| Cron o memoria del proceso | Tiene un costo inicial bajo y puede ejecutar tareas simples en una sola instancia. | Pierde trabajos ante reinicios, dificulta concurrencia y no conserva un historial fiable. No es aceptable para transferencias que requieren verificación y auditoría. | 64/100<br>AF2 · CE5 · MD2 · IN3 · CO5 |

**Decisión aplicada al sistema:** BullMQ se adopta con identificadores idempotentes, máximo de reintentos, retroceso temporal y una cola de fallos que requiera revisión. El trabajo solo se marca como completado después de verificar el resultado en el SIE y persistir la evidencia en PostgreSQL.

Fuente: Elaboración propia, 2026, con base en [BullMQ, 2026](#tg_ref_bullmq_retry); [Broadcom, 2026](#tg_ref_rabbitmq); [NestJS, 2026](#tg_ref_nestjs_queues).

#### 3.15.5.7 CAPA DE INTEGRACIÓN CON EL SIE

La automatización de navegador es una solución condicionada. Solo se utiliza con autorización institucional y mientras no exista una API oficial, pública y documentada que cubra el mismo flujo.

**Puppeteer**

La herramienta debe controlar un navegador Chromium desde el worker TypeScript, capturar evidencia y detectar cambios de la interfaz externa.

<a id="tg_table_tech_3_30_v2"></a>Tabla 3.30. Comparación detallada para Puppeteer

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **Puppeteer (seleccionada)** | Su API para Chromium se integra directamente con Node.js y TypeScript. Cubre navegación, formularios, capturas y lectura posterior con menos capas para el navegador objetivo. | Los selectores pueden romperse cuando el SIE cambia. Requiere pruebas periódicas, tiempos de espera controlados, registro de versión y prohibición de eludir mecanismos de seguridad. | 94/100<br>AF5 · CE5 · MD4 · IN5 · CO4 |
| Playwright | Controla Chromium, Firefox y WebKit, incluye esperas automáticas y herramientas de prueba. Es una alternativa fuerte si se exige validar varios motores. | El proyecto no necesita hoy varios navegadores para la automatización. Cambiar implicaría reescribir rutinas y evidencia sin una mejora funcional comprobada para el portal objetivo. | 90/100<br>AF5 · CE4 · MD5 · IN4 · CO4 |
| Selenium WebDriver | Es un estándar conocido, multilenguaje y multinavegador, con una trayectoria extensa en automatización. | La configuración del driver y la capa WebDriver añaden componentes. Para un worker Node.js centrado en Chromium, la solución resulta más pesada que la necesidad actual. | 71/100<br>AF3 · CE4 · MD4 · IN3 · CO4 |
| API oficial del SIE | Sería la primera opción por estabilidad contractual, validación estructurada, menor fragilidad y mejor trazabilidad entre sistemas. | No se localizó documentación pública que habilite ese servicio para este flujo. Al no ser una alternativa disponible, no recibe puntuación; debe reevaluarse si el Ministerio la publica. | N/E<br>Alternativa no disponible públicamente |

**Decisión aplicada al sistema:** Puppeteer se usa como mecanismo provisional y revocable. Cada ejecución queda asociada a autorización, versión del flujo, registro de entrada, resultado, captura o comprobante y verificación posterior. Una API oficial desplaza esta elección, aunque el ranking de las herramientas de navegador no cambie.

Fuente: Elaboración propia, 2026, con base en [Puppeteer, 2026](#tg_ref_puppeteer_intro); [Microsoft, 2026, Playwright](#tg_ref_playwright); [Selenium Project, 2026](#tg_ref_selenium); [Ministerio de Educación, 2026](#tg_ref_minedu_sie).

#### 3.15.5.8 CAPA DE COMUNICACIÓN EN TIEMPO REAL

La interfaz necesita informar al operador cuándo un trabajo SIE está en cola, en ejecución, verificado o fallido, sin convertir ese canal en la fuente oficial del estado.

**WebSocket**

Se compara un canal bidireccional con alternativas unidireccionales o periódicas para comunicar progreso y permitir acciones controladas del operador.

<a id="tg_table_tech_3_31_v2"></a>Tabla 3.31. Comparación detallada para WebSocket

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **WebSocket (seleccionada)** | Mantiene un canal bidireccional y permite publicar cambios de estado sin consultas repetidas. NestJS ofrece gateways que comparten autenticación y estructura con la API. | Exige administrar reconexión, autorización por canal y escalado entre instancias. El cliente siempre debe recuperar el estado persistido después de reconectar. | 96/100<br>AF5 · CE5 · MD4 · IN5 · CO5 |
| Server-Sent Events | Envía eventos del servidor al navegador mediante HTTP y simplifica los casos unidireccionales. La reconexión forma parte del modelo EventSource. | No resuelve comunicación bidireccional y el soporte móvil o de infraestructura debe verificarse. Las acciones del operador seguirían usando solicitudes HTTP separadas. | 81/100<br>AF3 · CE5 · MD4 · IN4 · CO5 |
| Sondeo periódico | Funciona sobre HTTP convencional, atraviesa proxies con facilidad y requiere poca infraestructura adicional. | Produce consultas aunque el estado no cambie, aumenta latencia o carga según el intervalo y complica una experiencia fluida durante trabajos prolongados. | 69/100<br>AF2 · CE4 · MD3 · IN5 · CO5 |

**Decisión aplicada al sistema:** WebSocket se limita a notificar; PostgreSQL conserva el estado definitivo. Cada mensaje lleva identificador de trabajo y versión, y la reconexión obliga a consultar la API antes de mostrar éxito o fallo. Así, la pérdida del canal no altera la trazabilidad.

Fuente: Elaboración propia, 2026, con base en [Fette y Melnikov, 2011](#tg_ref_existing_703a7e985fec); [WHATWG, 2026](#tg_ref_sse); [NestJS, 2026](#tg_ref_nestjs_gateways).

#### 3.15.5.9 ARQUITECTURA DE DESPLIEGUE

La forma de despliegue se decide según una institución, un equipo pequeño, un dominio compartido y la necesidad de mantener transacciones coherentes.

**Monolito modular**

La comparación distingue un monolito con límites verificables de un monolito sin módulos y de arquitecturas distribuidas que requieren más operación.

<a id="tg_table_tech_3_32_v2"></a>Tabla 3.32. Comparación detallada para Monolito modular

| **Opción** | **Adecuación al proyecto** | **Costo o límite observado** | **Puntaje ponderado** |
| --- | --- | --- | --- |
| **Monolito modular (seleccionada)** | Mantiene un despliegue y una base transaccional, pero separa identidad, matrícula, evaluación, asistencia, alertas, SIE y auditoría. Permite extraer un módulo solo cuando exista evidencia de carga o autonomía. | Los límites son disciplina de diseño, no una garantía del ejecutable. Importaciones indebidas o acceso directo a tablas ajenas pueden convertirlo en un monolito acoplado. | 100/100<br>AF5 · CE5 · MD5 · IN5 · CO5 |
| Monolito por capas sin módulos | Es fácil de desplegar y puede resolver una primera versión con controladores, servicios y repositorios comunes. | A medida que crece, las capas compartidas mezclan reglas y dificultan saber quién modifica cada dato. La simplicidad inicial produce una deuda visible en pruebas y cambios. | 86/100<br>AF4 · CE5 · MD3 · IN5 · CO5 |
| Microservicios | Permiten despliegue y escalado independiente, aislamiento de fallos y autonomía de equipos por contexto. | Exigen contratos distribuidos, observabilidad, seguridad entre servicios, consistencia eventual y varios despliegues. El tamaño actual no justifica ese costo. | 53/100<br>AF3 · CE2 · MD3 · IN3 · CO2 |
| Funciones serverless | Escalan por invocación y reducen la gestión directa de servidores para tareas breves o esporádicas. | La automatización de navegador, las conexiones persistentes y los workers prolongados chocan con límites de ejecución y estado. También aumenta la dependencia del proveedor. | 60/100<br>AF3 · CE3 · MD3 · IN3 · CO3 |

**Decisión aplicada al sistema:** Se adopta un monolito modular con workers separados como procesos de ejecución, no como microservicios autónomos. Las dependencias entre módulos se documentan, cada módulo controla sus casos de uso y la extracción futura exige una razón medible: carga, ritmo de cambio, aislamiento o equipo responsable.

Fuente: Elaboración propia, 2026, con base en [ISO/IEC/IEEE, 2022](#tg_ref_existing_cc29a6f184a8); [Martin, 2012](#tg_ref_existing_9d9818d9ccad); [Microsoft, 2026](#tg_ref_existing_ca439fc5ce51).

La selección completa forma una cadena, no una colección de ganadores aislados: React y TypeScript consumen contratos de NestJS; NestJS se ejecuta en Node.js; Prisma traduce persistencia hacia PostgreSQL; BullMQ usa Redis para coordinar workers; Puppeteer ejecuta el flujo autorizado del SIE; WebSocket comunica el progreso; y el monolito modular mantiene esos componentes bajo una arquitectura que el equipo puede operar.

# CRONOGRAMA

<a id="tg_table_1"></a>Tabla 1. Cronograma de desarrollo

|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Tiempo / Actividades** | **Abril** |  |  |  | **Mayo** |  |  |  | **Junio** |  |  |  | **Julio** |  |  |  | **Agosto** |  |  |  | **Septiembre** |  |  |  | **Octubre** |  |  |  | **Noviembre** |  |  |  |
|  | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** | **1** | **2** | **3** | **4** |
| Elaboración del Marco Teórico |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Aplicación de Encuestas |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Aplicación de Entrevistas |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Análisis de Resultados |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Análisis de la información recolectada |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Levantamiento de Procesos Académicos |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Diseño Integración con SIE |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Módulo de Sincronización |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pruebas de Interoperabilidad |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Corrección de Incidencias |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pruebas Funcionales |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pruebas de Integración |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Validación con Usuarios |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Ajustes Finales |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Redacción de Conclusiones |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Elaboración de Anexos |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Corrección del Documento |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Preparación de Defensa |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Entrega Final |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

**Fuente:** Elaboración Propia, 2026

# REFERENCIAS BIBLIOGRÁFICAS

<a id="ref_agetic_salary_2024"></a>Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación \[AGETIC]. (2024). Escala salarial (expresada en bolivianos). [https://agetic.gob.bo/sites/default/files/2025-03/escala%20salarial(1).pdf](<https://agetic.gob.bo/sites/default/files/2025-03/escala%20salarial(1).pdf>)

<a id="ref_agetic_pislea_2025"></a>Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación \[AGETIC]. (2025). Plan de Implementación de Software Libre y Estándares Abiertos, anexo al D.S. N.° 5322. [https://agetic.gob.bo/sites/default/files/2025-02/ANEXO-DS-5322.pdf](https://agetic.gob.bo/sites/default/files/2025-02/ANEXO-DS-5322.pdf)

Agile Manifesto. (2001). Manifiesto por el desarrollo ágil de software. [https://agilemanifesto.org/iso/es/manifesto.html](https://agilemanifesto.org/iso/es/manifesto.html)

Agile Manifesto. (2001). Principles behind the Agile Manifesto. [https://agilemanifesto.org/principles.html](https://agilemanifesto.org/principles.html)

<a id="ref_altichost_2026"></a>AlticHost. (2026). Hosting profesional en Bolivia: planes y precios. Consulta: 27 de septiembre de 2026. [https://www.altichost.com.bo/](https://www.altichost.com.bo/)

<a id="tg_ref_existing_307e010f1326"></a>Arias Ortiz, E., Eusebio, J., Pérez Alfaro, M., Vásquez, M., & Zoido, P. (2021a). Los Sistemas de Información y Gestión Educativa (SIGED) de América Latina y el Caribe: la ruta hacia la transformación digital de la gestión educativa. Banco Interamericano de Desarrollo. [https://doi.org/10.18235/0003345](https://doi.org/10.18235/0003345)

<a id="tg_ref_arias_alerta"></a>Arias Ortiz, E., Giambruno, C., González Alarcón, N., Pérez Alfaro, M., Pombo, C., & Sánchez Ávalos, R. (2021b). ¿Cómo diseñar sistemas de alerta temprana? Desde sistemas basados en conocimiento experto e indicadores hasta inteligencia artificial. Banco Interamericano de Desarrollo. [https://publications.iadb.org/publications/spanish/document/Camino-hacia-la-inclusion-educativa-4-pasos-para-la-construccion-de-sistemas-de-proteccion-de-trayectorias-Paso-2-como-disenar-sistemas-de-alerta-temprana.pdf](https://publications.iadb.org/publications/spanish/document/Camino-hacia-la-inclusion-educativa-4-pasos-para-la-construccion-de-sistemas-de-proteccion-de-trayectorias-Paso-2-como-disenar-sistemas-de-alerta-temprana.pdf)

<a id="tg_ref_existing_83be445c797d"></a>Beck, K., Beedle, M., van Bennekum, A., Cockburn, A., Cunningham, W., Fowler, M., Grenning, J., Highsmith, J., Hunt, A., Jeffries, R., Kern, J., Marick, B., Martin, R. C., Mellor, S., Schwaber, K., Sutherland, J., & Thomas, D. (2001). Manifesto for Agile Software Development. [https://agilemanifesto.org/](https://agilemanifesto.org/)

<a id="tg_ref_bergamaschi_dashboards"></a>Bergamaschi, A., Giambruno, C., & Morales, P. (2025). Empoderando a las escuelas a través de datos: ¿cómo lograr un uso efectivo de los tableros de control educativos por parte de docentes y directivos? Banco Interamericano de Desarrollo. [https://publications.iadb.org/publications/spanish/document/Empoderando-a-las-escuelas-a-traves-de-datos-como-lograr-un-uso-efectivo-de-los-tableros-de-control-educativos-por-parte-de-docentes-y-directivos.pdf](https://publications.iadb.org/publications/spanish/document/Empoderando-a-las-escuelas-a-traves-de-datos-como-lograr-un-uso-efectivo-de-los-tableros-de-control-educativos-por-parte-de-docentes-y-directivos.pdf)

<a id="tg_ref_existing_1d1cdda4e75f"></a>Bernal, C. A. (2010). Metodología de la investigación (3.ª ed.). Pearson Educación.

<a id="tg_ref_rabbitmq"></a>Broadcom. (2026). RabbitMQ documentation. [https://www.rabbitmq.com/docs](https://www.rabbitmq.com/docs)

<a id="tg_ref_brown_c4"></a>Brown, S. (2011). The C4 model for visualising software architecture. C4 Model. [https://c4model.com/](https://c4model.com/)

<a id="tg_ref_bun"></a>Bun. (2026). Bun documentation. [https://bun.sh/docs](https://bun.sh/docs)

<a id="tg_ref_bullmq_idempotent"></a>BullMQ. (2023). Idempotent jobs. BullMQ Documentation. [https://docs.bullmq.io/patterns/idempotent-jobs](https://docs.bullmq.io/patterns/idempotent-jobs)

<a id="tg_ref_existing_a3743dc53d7b"></a>BullMQ. (2026). BullMQ documentation. [https://docs.bullmq.io/](https://docs.bullmq.io/)

<a id="tg_ref_existing_9ed9cf4c9c1b"></a>BullMQ. (2026). Queues. [https://docs.bullmq.io/guide/queues](https://docs.bullmq.io/guide/queues)

<a id="tg_ref_bullmq_retry"></a>BullMQ. (2026). Retrying failing jobs. BullMQ Documentation. [https://docs.bullmq.io/guide/retrying-failing-jobs](https://docs.bullmq.io/guide/retrying-failing-jobs)

BullMQ. (2026). Workers. [https://docs.bullmq.io/guide/workers](https://docs.bullmq.io/guide/workers)

<a id="tg_ref_chen_er"></a>Chen, P. P.-S. (1976). The entity-relationship model—toward a unified view of data. ACM Transactions on Database Systems, 1(1), 9–36. [https://doi.org/10.1145/320434.320440](https://doi.org/10.1145/320434.320440)

<a id="tg_ref_cockburn_hexagonal"></a>Cockburn, A. (2005, 4 de septiembre). Hexagonal architecture. [https://alistair.cockburn.us/hexagonal-architecture](https://alistair.cockburn.us/hexagonal-architecture)

<a id="tg_ref_existing_2134ae8878d5"></a>Codd, E. F. (1970). A relational model of data for large shared data banks. Communications of the ACM, 13(6), 377–387. [https://doi.org/10.1145/362384.362685](https://doi.org/10.1145/362384.362685)

<a id="tg_ref_college_site"></a>Colegio Comunidad Cristiana. (2026). Comunidad Cristiana Turno Mañana. [https://comunidadcristianatm.com/](https://comunidadcristianatm.com/)

<a id="tg_ref_existing_55bed1ec9174"></a>da Silva Costa, D. A., Mamede, H. S., & da Silva, M. M. (2022). Robotic Process Automation (RPA) adoption: A systematic literature review. Engineering Management in Production and Services, 14(2), 1–12. [https://doi.org/10.2478/emj-2022-0012](https://doi.org/10.2478/emj-2022-0012)

<a id="tg_ref_deno"></a>Deno. (2026). Get started with Deno. [https://docs.deno.com/runtime/](https://docs.deno.com/runtime/)

<a id="tg_ref_django"></a>Django Software Foundation. (2026). Django documentation. [https://docs.djangoproject.com/en/stable/](https://docs.djangoproject.com/en/stable/)

Domain Language. (2026). Domain-Driven Design resources. [https://www.domainlanguage.com/ddd/](https://www.domainlanguage.com/ddd/)

<a id="tg_ref_existing_4e706d338d10"></a>Estado Plurinacional de Bolivia. (2009). Constitución Política del Estado. [https://www.lexivox.org/norms/BO-CPE-20090207.html](https://www.lexivox.org/norms/BO-CPE-20090207.html)

<a id="tg_ref_existing_afab040054e9"></a>Estado Plurinacional de Bolivia. (2010). Ley N.º 070 de la Educación “Avelino Siñani–Elizardo Pérez”. [https://www.lexivox.org/norms/BO-L-N70.html](https://www.lexivox.org/norms/BO-L-N70.html)

<a id="ref_bol_ley164_2011"></a>Estado Plurinacional de Bolivia. (2011). Ley N.° 164, Ley General de Telecomunicaciones, Tecnologías de Información y Comunicación. [https://www.agetic.gob.bo/wp-content/uploads/2022/08/Ley-164-General-de-TICs.pdf](https://www.agetic.gob.bo/wp-content/uploads/2022/08/Ley-164-General-de-TICs.pdf)

Estado Plurinacional de Bolivia. (2012). Código Procesal Constitucional: Ley N.° 254. [https://www.lexivox.org/norms/BO-L-N254.html](https://www.lexivox.org/norms/BO-L-N254.html)

<a id="ref_bol_ds1793_2013"></a>Estado Plurinacional de Bolivia. (2013). Decreto Supremo N.° 1793, Reglamento para el Desarrollo de Tecnologías de Información y Comunicación. [https://agetic.gob.bo/sites/default/files/2025-02/decreto-supremo-1793.pdf](https://agetic.gob.bo/sites/default/files/2025-02/decreto-supremo-1793.pdf)

<a id="tg_ref_existing_1ffdd98416e9"></a>Estado Plurinacional de Bolivia. (2014). Ley N.º 548: Código Niña, Niño y Adolescente. [https://www.lexivox.org/norms/BO-L-N548.html](https://www.lexivox.org/norms/BO-L-N548.html)

<a id="ref_bol_ds4260_2020"></a>Estado Plurinacional de Bolivia. (2020). Decreto Supremo N.° 4260, de 6 de junio de 2020. [https://siip.produccion.gob.bo/repSIIP2/files/normativa_12345_08062020aeca.pdf](https://siip.produccion.gob.bo/repSIIP2/files/normativa_12345_08062020aeca.pdf)

<a id="ref_bol_ds4449_2021"></a>Estado Plurinacional de Bolivia. (2021). Decreto Supremo N.° 4449, de 13 de enero de 2021. [https://siip.produccion.gob.bo/repSIIP2/files/normativa_12345_150120213d56.pdf](https://siip.produccion.gob.bo/repSIIP2/files/normativa_12345_150120213d56.pdf)

<a id="ref_bol_ds5309_2025"></a>Estado Plurinacional de Bolivia. (2025a). Decreto Supremo N.° 5309, de 8 de enero de 2025. [https://agetic.gob.bo/sites/default/files/2025-07/Decreto%20Supremo%20N%C2%B0%205309.pdf](https://agetic.gob.bo/sites/default/files/2025-07/Decreto%20Supremo%20N%C2%B0%205309.pdf)

<a id="ref_bol_ds5322_2025"></a>Estado Plurinacional de Bolivia. (2025b). Decreto Supremo N.° 5322, de 23 de enero de 2025. [https://agetic.gob.bo/sites/default/files/2025-02/Decreto-Supremo-N%C2%B05322.pdf](https://agetic.gob.bo/sites/default/files/2025-02/Decreto-Supremo-N%C2%B05322.pdf)

Esteves Fajardo, Z. I., Garcés Garcés, N. N., Toala Santana, V. N., & Poveda Gurumendi, E. E. (2018). La importancia del uso del material didáctico para la construcción de aprendizajes significativos en la educación inicial. INNOVA Research Journal, 3(6), 168-176.

<a id="tg_ref_evans_ddd"></a>Evans, E. (2003). Domain-driven design: Tackling complexity in the heart of software. Addison-Wesley.

<a id="tg_ref_fastapi"></a>FastAPI. (2026). FastAPI documentation. [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)

<a id="tg_ref_existing_703a7e985fec"></a>Fette, I., & Melnikov, A. (2011). The WebSocket Protocol (RFC 6455). Internet Engineering Task Force. [https://www.rfc-editor.org/info/rfc6455](https://www.rfc-editor.org/info/rfc6455)

<a id="tg_ref_existing_4ce90da3b8cf"></a>Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures \[Tesis doctoral, University of California, Irvine]. [https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

<a id="tg_ref_existing_46515d9e9555"></a>Fielding, R., Nottingham, M., & Reschke, J. (2022). HTTP Semantics (RFC 9110). Internet Engineering Task Force. [https://www.rfc-editor.org/info/rfc9110/](https://www.rfc-editor.org/info/rfc9110/)

<a id="tg_ref_fowler_bounded"></a>Fowler, M. (2014, 15 de enero). Bounded Context. MartinFowler.com. [https://martinfowler.com/bliki/BoundedContext.html](https://martinfowler.com/bliki/BoundedContext.html)

<a id="tg_ref_existing_d15da7fce141"></a>Fowler, M. (2015). Microservice premium. MartinFowler.com. [https://martinfowler.com/bliki/MicroservicePremium.html](https://martinfowler.com/bliki/MicroservicePremium.html)

Fowler, M. (2015). Monolith First. MartinFowler.com. [https://martinfowler.com/bliki/MonolithFirst.html](https://martinfowler.com/bliki/MonolithFirst.html)

<a id="tg_ref_flow"></a>Flow. (2026). Getting started. [https://flow.org/en/docs/getting-started/](https://flow.org/en/docs/getting-started/)

<a id="tg_ref_angular"></a>Google. (2026). Angular overview. Angular Documentation. [https://angular.dev/overview](https://angular.dev/overview)

<a id="tg_ref_kotlin_android"></a>Google. (2026). Develop Android apps with Kotlin. Android Developers. [https://developer.android.com/kotlin](https://developer.android.com/kotlin)

<a id="tg_ref_existing_cf2611c19d1d"></a>Google. (2026). Flutter architectural overview. Flutter Documentation. [https://docs.flutter.dev/resources/architectural-overview](https://docs.flutter.dev/resources/architectural-overview)

Google. (2026). Flutter platform integration. Flutter Documentation. [https://docs.flutter.dev/platform-integration](https://docs.flutter.dev/platform-integration)

<a id="tg_ref_flutter_arch"></a>Google. (2026). Guide to app architecture. Flutter Documentation. [https://docs.flutter.dev/app-architecture/guide](https://docs.flutter.dev/app-architecture/guide)

Hernández Sampieri, R., Fernández Collado, C., & Baptista Lucio, P. (2014). Metodología de la investigación (6.ª ed.). McGraw-Hill.

<a id="tg_ref_existing_ecf887101fba"></a>IEEE Computer Society. (2024). Guide to the Software Engineering Body of Knowledge — SWEBOK. [https://www.computer.org/education/bodies-of-knowledge/software-engineering](https://www.computer.org/education/bodies-of-knowledge/software-engineering)

IEEE Computer Society. (2024). SWEBOK knowledge topics. [https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics)

Institute of Education Sciences. (2017). Getting students on track for graduation: Impacts of the Early Warning Intervention and Monitoring System. [https://ies.ed.gov/use-work/resource-library/report/impact-study/getting-students-track-graduation-impacts-early-warning-intervention-and-monitoring-system-after-one](https://ies.ed.gov/use-work/resource-library/report/impact-study/getting-students-track-graduation-impacts-early-warning-intervention-and-monitoring-system-after-one)

<a id="tg_ref_existing_041f24552aea"></a>Institute of Education Sciences. (2024). Chronic absenteeism. U.S. Department of Education. [https://ies.ed.gov/use-work/supporting-recovery-with-evidence-based-practices/chronic-absenteeism](https://ies.ed.gov/use-work/supporting-recovery-with-evidence-based-practices/chronic-absenteeism)

<a id="tg_ref_existing_584e26b5b632"></a>International Organization for Standardization. (2018). ISO 9241-11:2018 Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts. [https://www.iso.org/standard/63500.html](https://www.iso.org/standard/63500.html)

<a id="tg_ref_iso9241_210"></a>International Organization for Standardization. (2019). ISO 9241-210:2019 Ergonomics of human-system interaction—Part 210: Human-centred design for interactive systems. [https://www.iso.org/standard/77520.html](https://www.iso.org/standard/77520.html)

<a id="tg_ref_iso9001_2026"></a>International Organization for Standardization. (2026a). ISO 9001:2026 Quality management systems—Requirements. [https://www.iso.org/standard/9001](https://www.iso.org/standard/9001)

<a id="tg_ref_iso14001_2026"></a>International Organization for Standardization. (2026b). ISO 14001:2026 Environmental management systems—Requirements with guidance for use. [https://www.iso.org/standard/14001](https://www.iso.org/standard/14001)

<a id="tg_ref_iso14000_family"></a>International Organization for Standardization. (s. f.). Familia ISO 14000—Gestión ambiental. Recuperado el 2 de octubre de 2026, de [https://www.iso.org/es/normas/mas-comunes/familia-iso-14000](https://www.iso.org/es/normas/mas-comunes/familia-iso-14000)

<a id="tg_ref_iso25012"></a>ISO/IEC. (2008). ISO/IEC 25012:2008 Software engineering—Software product Quality Requirements and Evaluation (SQuaRE)—Data quality model. International Organization for Standardization. [https://www.iso.org/standard/35736.html](https://www.iso.org/standard/35736.html)

<a id="tg_ref_existing_09bdb02ad70b"></a>ISO/IEC. (2021). ISO/IEC TR 29119-6:2021 Software and systems engineering — Software testing — Part 6: Guidelines for the use of ISO/IEC/IEEE 29119 in agile projects. [https://www.iso.org/standard/81293.html](https://www.iso.org/standard/81293.html)

<a id="tg_ref_existing_e98c60c85b65"></a>ISO/IEC. (2023). ISO/IEC 25010:2023 Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model. International Organization for Standardization. [https://www.iso.org/standard/78176.html](https://www.iso.org/standard/78176.html)

<a id="tg_ref_existing_d9050faa16ef"></a>ISO/IEC/IEEE. (2018). ISO/IEC/IEEE 29148:2018 Systems and software engineering — Life cycle processes — Requirements engineering. International Organization for Standardization. [https://www.iso.org/standard/72089.html](https://www.iso.org/standard/72089.html)

<a id="tg_ref_existing_d5aaa1c36223"></a>ISO/IEC/IEEE. (2021). ISO/IEC/IEEE 29119-2:2021 Software and systems engineering — Software testing — Part 2: Test processes. International Organization for Standardization. [https://www.iso.org/obp/ui/en/](https://www.iso.org/obp/ui/en/)

<a id="tg_ref_existing_fdc05ef84f09"></a>ISO/IEC/IEEE. (2021). ISO/IEC/IEEE 29119-4:2021 Software and systems engineering — Software testing — Part 4: Test techniques. International Organization for Standardization. [https://www.iso.org/standard/79430.html](https://www.iso.org/standard/79430.html)

<a id="tg_ref_existing_33688c8b4a84"></a>ISO/IEC/IEEE. (2022). ISO/IEC/IEEE 29119-1:2022 Software and systems engineering — Software testing — Part 1: General concepts. International Organization for Standardization. [https://www.iso.org/standard/81291.html](https://www.iso.org/standard/81291.html)

<a id="tg_ref_existing_cc29a6f184a8"></a>ISO/IEC/IEEE. (2022). ISO/IEC/IEEE 42010:2022 Software, systems and enterprise — Architecture description. International Organization for Standardization. [https://www.iso.org/standard/74393.html](https://www.iso.org/standard/74393.html)

Librería IRBE. (2026). Paquete de 500 hojas de papel bond blanco de 75 g/m² BRIO tamaño carta. [https://libreriairbe.com/producto/paquete-500-hojas-de-papel-bond-blanco-75-g-m%c2%b2-brio-tamano-carta/](https://libreriairbe.com/producto/paquete-500-hojas-de-papel-bond-blanco-75-g-m%c2%b2-brio-tamano-carta/)

<a id="tg_ref_existing_9d9818d9ccad"></a>Martin, R. C. (2012). The Clean Architecture. Clean Coder Blog. [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

<a id="tg_ref_existing_198bc1d28085"></a>Martin, R. C. (2014). The Single Responsibility Principle. Clean Coder Blog. [https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

<a id="tg_ref_memcached"></a>Memcached Project. (2026). Memcached documentation. [https://docs.memcached.org/](https://docs.memcached.org/)

<a id="tg_ref_react_components"></a>Meta Open Source. (2026). Describing the UI. React Documentation. [https://react.dev/learn/describing-the-ui](https://react.dev/learn/describing-the-ui)

<a id="tg_ref_react_native"></a>Meta Open Source. (2026). React Native documentation: Introduction. [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)

<a id="tg_ref_existing_cc539dc2cfaa"></a>Meta Open Source. (2026). React. [https://react.dev/](https://react.dev/)

Meta Open Source. (2026). Thinking in React. React Documentation. [https://react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)

Meta Open Source. (2026). Your first component. React Documentation. [https://react.dev/learn/your-first-component](https://react.dev/learn/your-first-component)

<a id="tg_ref_existing_ca439fc5ce51"></a>Microsoft. (2026). Design a DDD-oriented microservice. Microsoft Learn. [https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/)

Microsoft. (2026). Domain analysis. Microsoft Learn. [https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

<a id="tg_ref_playwright"></a>Microsoft. (2026). Playwright documentation: Installation. [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

<a id="tg_ref_typescript_basics"></a>Microsoft. (2026). TypeScript documentation: The basics. TypeScript Documentation. [https://www.typescriptlang.org/docs/handbook/2/basic-types.html](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)

Microsoft. (2026). TypeScript Handbook. [https://www.typescriptlang.org/docs/handbook/intro.html](https://www.typescriptlang.org/docs/handbook/intro.html)

Microsoft. (2026). Use domain events to explicitly implement side effects of changes within your domain. Microsoft Learn. [https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation)

<a id="ref_minedu_cpe_2009"></a>Ministerio de Educación del Estado Plurinacional de Bolivia. (2009). Constitución Política del Estado Plurinacional de Bolivia. [https://biblioteca.minedu.gob.bo/biblio/book/59946](https://biblioteca.minedu.gob.bo/biblio/book/59946)

Ministerio de Educación del Estado Plurinacional de Bolivia. (2010). Ley de Educación Avelino Siñani–Elizardo Pérez. [https://www.minedu.gob.bo/index.php?Itemid=933&catid=233&id=1524%3Aley-avelino-sinani-elizardo-perez&option=com_content&view=article](https://www.minedu.gob.bo/index.php?Itemid=933&catid=233&id=1524%3Aley-avelino-sinani-elizardo-perez&option=com_content&view=article)

<a id="ref_minedu_ley070_2010"></a>Ministerio de Educación del Estado Plurinacional de Bolivia. (2010). Ley N.° 070 de la Educación “Avelino Siñani–Elizardo Pérez”. [https://biblioteca.minedu.gob.bo/biblio/book/58288](https://biblioteca.minedu.gob.bo/biblio/book/58288)

<a id="tg_ref_minedu_rm_2026"></a>Ministerio de Educación del Estado Plurinacional de Bolivia. (2026a). Resolución Ministerial N.° 0001/2026: Normas generales para la gestión educativa 2026 del Subsistema de Educación Regular. [https://www.minedu.gob.bo/files/documentos-normativos/resoluciones-ministeriales/1_RM_0001_EDUCACIN_REGULAR.pdf](https://www.minedu.gob.bo/files/documentos-normativos/resoluciones-ministeriales/1_RM_0001_EDUCACIN_REGULAR.pdf)

<a id="tg_ref_minedu_sie"></a>Ministerio de Educación del Estado Plurinacional de Bolivia. (2026b). Sistema de Información Educativa. [https://www.minedu.gob.bo/index.php?Itemid=470&catid=191&id=2315&option=com_content&view=article](https://www.minedu.gob.bo/index.php?Itemid=470&catid=191&id=2315&option=com_content&view=article)

<a id="tg_ref_existing_f3069f4a4118"></a>Ministerio de Educación del Perú. (2026). Sistema de Información de Apoyo a la Gestión de la Institución Educativa (SIAGIE). [https://siagie.minedu.gob.pe/inicio/](https://siagie.minedu.gob.pe/inicio/)

Ministerio de Educación y Cultura. (1993). Reglamento de faltas y sanciones del magisterio y personal docente y administrativo (Resolución Suprema N.º 212414). [https://red.minedu.gob.bo/fuente/recurso/84186](https://red.minedu.gob.bo/fuente/recurso/84186)

<a id="ref_mpd_pac_2024"></a>Ministerio de Planificación del Desarrollo. (2024). Programa Anual de Contrataciones publicado en SICOES: consultoría individual de línea, especialista en desarrollo de sistema. [https://www.planificacion.gob.bo/uploads/SICOES_version_completa.pdf](https://www.planificacion.gob.bo/uploads/SICOES_version_completa.pdf)

<a id="ref_mintrabajo_rm088_2026"></a>Ministerio de Trabajo, Empleo y Previsión Social. (2026). Resolución Ministerial N.° 088/26: reglamentación del incremento salarial y salario mínimo nacional. [https://mintrabajo.gob.bo/wp-content/uploads/2026/01/RM-N%C2%B0-088-26.pdf](https://mintrabajo.gob.bo/wp-content/uploads/2026/01/RM-N%C2%B0-088-26.pdf)

<a id="tg_ref_mongodb"></a>MongoDB. (2026). Data modeling in MongoDB. MongoDB Documentation. [https://www.mongodb.com/docs/manual/data-modeling/](https://www.mongodb.com/docs/manual/data-modeling/)

National Institute of Standards and Technology. (2025). Role Based Access Control. [https://csrc.nist.gov/projects/role-based-access-control](https://csrc.nist.gov/projects/role-based-access-control)

<a id="tg_ref_existing_a4e0161fc83b"></a>National Institute of Standards and Technology. (2025). Role-based access control — Glossary. [https://csrc.nist.gov/glossary/term/role_based_access_control](https://csrc.nist.gov/glossary/term/role_based_access_control)

<a id="tg_ref_existing_5c873ad8d3d5"></a>NestJS. (2026). Controllers. [https://docs.nestjs.com/controllers](https://docs.nestjs.com/controllers)

<a id="tg_ref_existing_e1ad667656fc"></a>NestJS. (2026). Modules. [https://docs.nestjs.com/modules](https://docs.nestjs.com/modules)

NestJS. (2026). Providers. [https://docs.nestjs.com/providers](https://docs.nestjs.com/providers)

<a id="tg_ref_nestjs_gateways"></a>NestJS. (2026a). Gateways. NestJS Documentation. [https://docs.nestjs.com/websockets/gateways](https://docs.nestjs.com/websockets/gateways)

<a id="tg_ref_nestjs_queues"></a>NestJS. (2026b). Queues. NestJS Documentation. [https://docs.nestjs.com/techniques/queues](https://docs.nestjs.com/techniques/queues)

<a id="tg_ref_omg_bpmn"></a>Object Management Group. (2014). Business Process Model and Notation (BPMN), version 2.0.2. [https://www.omg.org/spec/BPMN/2.0.2/](https://www.omg.org/spec/BPMN/2.0.2/)

<a id="tg_ref_existing_5b8e9740991c"></a>OECD. (2023). Education and student information systems. En OECD Digital Education Outlook 2023. [https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/education-and-student-information-systems_ef9f7b25.html](https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/education-and-student-information-systems_ef9f7b25.html)

<a id="tg_ref_existing_2b20d67be520"></a>OECD. (2023). Learning management systems and other digital tools for system and institutional management. [https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/learning-management-systems-and-other-digital-tools-for-system-and-institutional-management_21f10cd0.html](https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/learning-management-systems-and-other-digital-tools-for-system-and-institutional-management_21f10cd0.html)

OECD. (2023). OECD Digital Education Outlook 2023: Towards an effective digital education ecosystem. OECD Publishing. [https://doi.org/10.1787/c74f03de-en](https://doi.org/10.1787/c74f03de-en)

OECD. (2026). Every Day Counts: Policy and practice for supporting school attendance. [https://www.oecd.org/en/publications/every-day-counts_7c6f6c3e-en/full-report/policy-and-practice-for-supporting-school-attendance_315dcb1d.html](https://www.oecd.org/en/publications/every-day-counts_7c6f6c3e-en/full-report/policy-and-practice-for-supporting-school-attendance_315dcb1d.html)

<a id="tg_ref_node_intro"></a>Node.js. (2026). Introduction to Node.js. [https://nodejs.org/learn/getting-started/introduction-to-nodejs](https://nodejs.org/learn/getting-started/introduction-to-nodejs)

<a id="tg_ref_express"></a>OpenJS Foundation. (2026). Express: Fast, unopinionated, minimalist web framework for Node.js. [https://expressjs.com/](https://expressjs.com/)

<a id="tg_ref_mysql"></a>Oracle. (2026). MySQL 8.4 Reference Manual. [https://dev.mysql.com/doc/refman/8.4/en/](https://dev.mysql.com/doc/refman/8.4/en/)

<a id="tg_ref_owasp_asvs"></a>OWASP Foundation. (2025). Application Security Verification Standard 5.0.0. [https://owasp.org/www-project-application-security-verification-standard/](https://owasp.org/www-project-application-security-verification-standard/)

<a id="tg_ref_existing_ab0ae252e6ea"></a>OWASP Foundation. (2026). Cryptographic Storage Cheat Sheet. [https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

OWASP Foundation. (2026). Password Storage Cheat Sheet. [https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

OWASP Foundation. (2026). Secrets Management Cheat Sheet. [https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

<a id="tg_ref_owasp_authentication"></a>OWASP Foundation. (2026a). Authentication Cheat Sheet. OWASP Cheat Sheet Series. [https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

<a id="tg_ref_owasp_authorization"></a>OWASP Foundation. (2026b). Authorization Cheat Sheet. OWASP Cheat Sheet Series. [https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

<a id="tg_ref_owasp_logging"></a>OWASP Foundation. (2026c). Logging Cheat Sheet. OWASP Cheat Sheet Series. [https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

<a id="tg_ref_owasp_rest"></a>OWASP Foundation. (2026d). REST Security Cheat Sheet. OWASP Cheat Sheet Series. [https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

<a id="tg_ref_owasp_secure_coding"></a>OWASP Foundation. (2026e). Secure Coding Practices Checklist. [https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/stable-en/02-checklist/05-checklist](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/stable-en/02-checklist/05-checklist)

<a id="tg_ref_existing_cf5cbb4afbea"></a>PostgreSQL Global Development Group. (2026). Data definition — PostgreSQL documentation. [https://www.postgresql.org/docs/current/ddl.html](https://www.postgresql.org/docs/current/ddl.html)

<a id="tg_ref_postgres_constraints"></a>PostgreSQL Global Development Group. (2026). PostgreSQL documentation: Constraints. [https://www.postgresql.org/docs/current/ddl-constraints.html](https://www.postgresql.org/docs/current/ddl-constraints.html)

<a id="tg_ref_existing_60dd5b6fa9db"></a>Prisma. (2026). Data models. [https://www.prisma.io/docs/orm/prisma-schema/data-model/models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

Prisma. (2026). Prisma Client. [https://www.prisma.io/docs/orm/prisma-client](https://www.prisma.io/docs/orm/prisma-client)

<a id="tg_ref_prisma_migrate"></a>Prisma. (2026). Prisma Migrate. Prisma Documentation. [https://www.prisma.io/docs/orm/prisma-migrate](https://www.prisma.io/docs/orm/prisma-migrate)

Prisma. (2026). Prisma ORM documentation. [https://www.prisma.io/docs/orm](https://www.prisma.io/docs/orm)

<a id="tg_ref_existing_a1ab4164e63b"></a>Puppeteer. (2026). Getting started. [https://pptr.dev/guides/getting-started](https://pptr.dev/guides/getting-started)

<a id="tg_ref_puppeteer_intro"></a>Puppeteer. (2026). What is Puppeteer? Puppeteer Documentation. [https://pptr.dev/guides/what-is-puppeteer](https://pptr.dev/guides/what-is-puppeteer)

<a id="tg_ref_redis_types"></a>Redis. (2026). Redis data types. Redis Documentation. [https://redis.io/docs/latest/develop/data-types/](https://redis.io/docs/latest/develop/data-types/)

Redis. (2026). Redis documentation. [https://redis.io/docs/latest/](https://redis.io/docs/latest/)

Redis. (2026). Redis Pub/Sub. [https://redis.io/docs/latest/develop/pubsub/](https://redis.io/docs/latest/develop/pubsub/)

<a id="tg_ref_existing_aab9ca2e0195"></a>Rescorla, E. (2018). The Transport Layer Security (TLS) Protocol Version 1.3 (RFC 8446). Internet Engineering Task Force. [https://www.rfc-editor.org/info/rfc8446/](https://www.rfc-editor.org/info/rfc8446/)

<a id="tg_ref_existing_f3927709de94"></a>Schwaber, K., & Sutherland, J. (2020). The Scrum Guide: The definitive guide to Scrum. [https://scrumguides.org/scrum-guide.html](https://scrumguides.org/scrum-guide.html)

<a id="tg_ref_sequelize"></a>Sequelize. (2026). Sequelize v6 documentation. [https://sequelize.org/docs/v6/](https://sequelize.org/docs/v6/)

<a id="tg_ref_selenium"></a>Selenium Project. (2026). WebDriver. Selenium Documentation. [https://www.selenium.dev/documentation/webdriver/](https://www.selenium.dev/documentation/webdriver/)

<a id="ref_senapi_ley1322_1992"></a>Servicio Nacional de Propiedad Intelectual \[SENAPI]. (1992). Ley N.° 1322, Ley de Derecho de Autor. [https://www.senapi.gob.bo/normativas/leyes/ley-de-derecho-de-autor](https://www.senapi.gob.bo/normativas/leyes/ley-de-derecho-de-autor)

<a id="ref_senapi_ds24582_1997"></a>Servicio Nacional de Propiedad Intelectual \[SENAPI]. (1997). Decreto Supremo N.° 24582, Reglamento del soporte lógico o software. [https://www.senapi.gob.bo/sites/default/files/senapi/normativa/normativa-19970425-01-nro-24582-reglamento-del-soporte-logico-o-software.pdf](https://www.senapi.gob.bo/sites/default/files/senapi/normativa/normativa-19970425-01-nro-24582-reglamento-del-soporte-logico-o-software.pdf)

<a id="tg_ref_existing_121ad1d6341e"></a>SieWeb. (2026). Sistema Intranet Educativo Web. [https://sieweb.com.pe/](https://sieweb.com.pe/)

<a id="tg_ref_existing_d6b4d5adf7d0"></a>Sommerville, I. (2020). Software engineering (10th ed.). Pearson.

<a id="tg_ref_existing_765151a07824"></a>Temoshok, D., Choong, Y.-Y., Proud-Madruga, D., Galluzzo, R., Gupta, S., LaSalle, C., Lefkovitz, N., & Regenscheid, A. (2025). NIST SP 800-63B-4: Digital Identity Guidelines — Authentication and authenticator management. National Institute of Standards and Technology. [https://csrc.nist.gov/pubs/sp/800/63/b/4/final](https://csrc.nist.gov/pubs/sp/800/63/b/4/final)

<a id="tg_ref_triantaphyllou"></a>Triantaphyllou, E. (2000). Multi-Criteria Decision Making Methods: A Comparative Study. Springer. [https://doi.org/10.1007/978-1-4757-3157-6](https://doi.org/10.1007/978-1-4757-3157-6)

<a id="tg_ref_existing_e9b5741af95e"></a>UNESCO International Institute for Educational Planning. (2024). Datos y evidencias: Sistemas de información para la gestión educativa. [https://www.iiep.unesco.org/es/proyecto/datos-y-evidencias](https://www.iiep.unesco.org/es/proyecto/datos-y-evidencias)

<a id="tg_ref_existing_ff6c4950b940"></a>UNESCO International Institute for Educational Planning. (2024). Los sistemas de información y gestión educativa. [https://www.iiep.unesco.org/](https://www.iiep.unesco.org/)

<a id="tg_ref_existing_03da920d0a21"></a>UNESCO. (2023). EdTech and parental engagement. UNESCO Digital Transformation Collaborative. [https://unesdoc.unesco.org/ark:/48223/pf0000386106](https://unesdoc.unesco.org/ark:/48223/pf0000386106)

<a id="tg_ref_typeorm"></a>TypeORM. (2026). Getting started. [https://typeorm.io/docs/getting-started/](https://typeorm.io/docs/getting-started/)

<a id="tg_ref_vue"></a>Vue.js. (2026). Introduction. Vue.js Documentation. [https://vuejs.org/guide/introduction.html](https://vuejs.org/guide/introduction.html)

<a id="tg_ref_sse"></a>WHATWG. (2026). Server-sent events. HTML Living Standard. [https://html.spec.whatwg.org/multipage/server-sent-events.html](https://html.spec.whatwg.org/multipage/server-sent-events.html)

<a id="tg_ref_existing_890f87570899"></a>World Wide Web Consortium. (2004). Web Services Architecture. [https://www.w3.org/TR/ws-arch/](https://www.w3.org/TR/ws-arch/)

<a id="tg_ref_existing_77cfc960a988"></a>World Wide Web Consortium. (2023). WCAG 2 Overview. Web Accessibility Initiative. [https://www.w3.org/WAI/standards-guidelines/wcag/](https://www.w3.org/WAI/standards-guidelines/wcag/)

<a id="tg_ref_existing_b7e97983c866"></a>World Wide Web Consortium. (2023). Web Content Accessibility Guidelines — WCAG 2.2. [https://www.w3.org/TR/WCAG22/](https://www.w3.org/TR/WCAG22/)

<a id="tg_ref_existing_3d3e2c417a60"></a>World Wide Web Consortium. (2025). Guidance on applying WCAG 2.2 to mobile applications. [https://www.w3.org/TR/wcag2mobile-22/](https://www.w3.org/TR/wcag2mobile-22/)

# ANEXOS

<a id="tg_annex_a"></a>Anexo A. CUESTIONARIO A LA DIRECTORA DEL COLEGIO COMUNIDAD CRISTIANA

<a id="anexo_b"></a>***Anexo B. CARTA DE AUTORIZACIÓN Y CERTIFICACIÓN INSTITUCIONAL***

<a id="anexo_c"></a>***Anexo C. CERTIFICACIÓN DE POBLACIÓN Y PERSONAL PARTICIPANTE***

<a id="anexo_d"></a>***Anexo D. CERTIFICACIÓN DE PROCESOS, HERRAMIENTAS Y DUPLICIDAD DE REGISTROS***

<a id="anexo_e"></a>***Anexo E. CERTIFICACIÓN DE TIEMPOS OPERATIVOS Y CONSUMO DE RECURSOS***

<a id="anexo_f"></a>***Anexo F. ACTA DE VALIDACIÓN DEL DIAGNÓSTICO Y PROCESO ACTUAL***

<a id="anexo_g"></a>***Anexo G. ACTA DE VALIDACIÓN DE REQUERIMIENTOS, ROLES Y REGLAS DE NEGOCIO***

<a id="anexo_h"></a>***Anexo H. CARTA DE AUTORIZACIÓN PARA TRATAMIENTO DE DATOS Y PRUEBAS CON EL SIE***

<a id="anexo_i"></a>***Anexo I. CONSTANCIAS INDIVIDUALES DE PARTICIPACIÓN EN EL LEVANTAMIENTO DE INFORMACIÓN***

***Anexo I (continuación). Constancia individual adicional***

<a id="anexo_j"></a>***Anexo J. ACTA DE ACEPTACIÓN Y VALIDACIÓN FINAL DEL SISTEMA***

# ANEXO K. REQUERIMIENTOS DE USUARIO

Se incorpora la especificación de requerimientos de usuario derivada del levantamiento institucional y del blueprint funcional de la solución. El contenido se presenta como material complementario del proyecto para conservar la estructura capitular existente.

### 1. PROPÓSITO Y NATURALEZA DE LOS REQUERIMIENTOS DE USUARIO

Este documento especifica los requerimientos de usuario (RU) del sistema de gestión académica para el Colegio Comunidad Cristiana. Un requerimiento de usuario expresa, en el lenguaje del negocio y desde la perspectiva de quien realiza el trabajo, qué necesita poder hacer un actor para cumplir su función. No describe cómo lo resuelve el sistema: esa descripción corresponde a los requerimientos funcionales del Documento 05.

La distinción es relevante para la validación con la institución. El personal del colegio puede confirmar o rechazar un requerimiento de usuario porque está formulado en términos de su propia actividad; en cambio, no está en condiciones de validar una especificación técnica. Por esta razón, los RU constituyen el nivel de acuerdo con el cliente y son el punto de partida de la trazabilidad hacia el resto de la especificación.

#### 1.1 FUENTES DE DERIVACIÓN

Cada requerimiento declara explícitamente su origen. Las fuentes empleadas son cuatro:

Tabla 21. Fuentes de derivación de los requerimientos de usuario

| **Código de origen** | **Fuente** | **Descripción** |
| --- | --- | --- |
| **ENT** | Entrevistas estructuradas | Guías E-DIR, E-ADM, E-DOC y E-TUT aplicadas en el acercamiento institucional (Documento 01). |
| **OBS** | Observación directa | Fichas O-01 a O-07 sobre la ejecución real de los procesos (Documento 01). |
| **BP** | Blueprint funcional | Prototipos de pantalla y recorridos de usuario definidos para la plataforma web y la aplicación móvil (sección 3 de este documento). |
| **NOR** | Análisis documental y normativo | Fichas FD-01 a FD-08, con especial referencia a la Resolución Ministerial N.° 0001/2026, a la Constitución Política del Estado y al Código Niña, Niño y Adolescente. |

Fuente: Elaboración propia, 2026.

#### 1.2 CONVENCIÓN DE CODIFICACIÓN

Los requerimientos se codifican como RU-XXX-NN, donde XXX identifica al actor y NN es un correlativo de dos dígitos dentro de ese actor. Esta codificación permite localizar de inmediato a quién pertenece la necesidad y facilita la validación por perfil durante la reunión de devolución con la institución.

| **Prefijo** | **Actor** | **Cantidad de RU** |
| --- | --- | --- |
| **RU-ADM** | Personal administrativo / Secretaría | 14 |
| **RU-DIR** | Dirección | 14 |
| **RU-DOC** | Docente | 10 |
| **RU-TUT** | Padre, madre o tutor | 8 |
| **RU-SIS** | Requerimientos transversales del sistema (expresados por la institución como condiciones generales) | 8 |
| **Total** | — | 54 |

Fuente: Elaboración propia, 2026.

#### 1.3 CRITERIO DE PRIORIZACIÓN

La priorización utiliza el esquema MoSCoW, que resulta apropiado para un desarrollo organizado por incrementos porque distingue lo que condiciona la utilidad del sistema de lo que la mejora.

| **Prioridad** | **Significado** | **Criterio de asignación** |
| --- | --- | --- |
| **Debe** | Imprescindible (Must have) | Sin este requerimiento el sistema no resuelve el problema planteado ni cumple una obligación normativa. |
| **Debería** | Importante (Should have) | Su ausencia degrada significativamente el valor del sistema, pero existe una alternativa temporal aceptable. |
| **Podría** | Deseable (Could have) | Aporta valor adicional; puede diferirse a un incremento posterior sin comprometer los objetivos. |
| **No ahora** | Fuera del alcance actual (Won’t have this time) | Reconocido como necesidad válida, excluido del alcance del presente proyecto. |

Fuente: Elaboración propia, 2026.

### 2. ACTORES Y NECESIDADES GENERALES

El levantamiento identificó cuatro grupos de actores dentro del alcance funcional, cada uno con un perfil de necesidad claramente diferenciado. Esta diferenciación es determinante para el diseño: una única interfaz idéntica para todos ignoraría que las tareas, la frecuencia de uso y el nivel de autorización son sustancialmente distintos entre perfiles.

Tabla 22. Perfil de necesidad por actor

| **Actor** | **Función en el proceso académico** | **Necesidad general declarada** | **Interfaz principal** |
| --- | --- | --- | --- |
| Personal administrativo | Registro, actualización, estructura institucional e inscripciones. | Rapidez de registro, actualización centralizada y reducción de recapturas. | Plataforma web |
| Dirección | Supervisión, control y autorización de operaciones sensibles. | Supervisión, reportes, control de cambios y visibilidad del estado de la información enviada al SIE. | Plataforma web |
| Docente | Generación de la información académica diaria: calificaciones y asistencia. | Interfaces sencillas y rápidas, limitadas a sus asignaciones académicas. | Plataforma web |
| Padre, madre o tutor | Consulta de la información académica del estudiante a su cargo. | Acceso oportuno, comprensible y seguro a información de sus estudiantes vinculados. | Aplicación móvil |

Fuente: Elaboración propia, 2026.

El acceso del padre o tutor es cualitativamente distinto al de los actores internos: se limita a la información de los estudiantes respecto de los cuales exista una vinculación autorizada en el sistema. Esa relación debe existir como un dato explícito y no como una inferencia basada en coincidencias de apellidos o de datos de contacto.

### 3. BLUEPRINT FUNCIONAL DE LA SOLUCIÓN

El blueprint funcional define el conjunto de pantallas y recorridos que la solución pondrá a disposición de cada actor. Su elaboración es previa a la especificación de los requerimientos de usuario porque permite validar con la institución, de forma concreta y visual, qué podrá hacer cada perfil. Cada pantalla del blueprint origina uno o varios requerimientos de usuario, y ningún requerimiento carece de una pantalla que lo materialice.

#### 3.1 LINEAMIENTOS DE EXPERIENCIA DE USUARIO

El blueprint se construye bajo los siguientes lineamientos, derivados de las expectativas recogidas en las entrevistas:

• Terminología del dominio educativo: la interfaz utiliza gestión, nivel, grado, paralelo, asignatura, período y calificación, y no denominaciones técnicas.

• Reducción de la navegación repetitiva: las tareas de alta frecuencia, como el registro de calificaciones y de asistencia, se resuelven desde una sola pantalla con la lista completa del curso.

• Consistencia visual y terminológica entre pantallas, para reducir la carga cognitiva y facilitar el aprendizaje de la plataforma.

• Retroalimentación inmediata: cada validación se comunica en el punto de la interfaz donde ocurre y no como un mensaje genérico al final del formulario.

• Simplicidad en la aplicación móvil: la consulta debe resolverse en pocos toques, considerando que el usuario puede tener familiaridad tecnológica variable.

#### 3.2 PANTALLAS DE LA PLATAFORMA WEB

Tabla 23. Blueprint de la plataforma web

| **ID** | **Pantalla** | **Actor** | **Propósito funcional** | **RU que origina** |
| --- | --- | --- | --- | --- |
| **BP-01** | Inicio de sesión | Todos los internos | Autenticación con credenciales y acceso según rol. | RU-SIS-01 |
| **BP-02** | Panel institucional | Administración, Dirección | Vista consolidada de indicadores académicos y estado de sincronizaciones. | RU-DIR-01 |
| **BP-03** | Gestión de usuarios y roles | Administración | Alta, modificación, activación y desactivación de cuentas internas. | RU-ADM-11, RU-ADM-12 |
| **BP-04** | Búsqueda de estudiantes | Administración, Dirección | Localización de un estudiante por criterios autorizados. | RU-ADM-03 |
| **BP-05** | Registro y ficha del estudiante | Administración | Creación y consulta del expediente con verificación de existencia previa. | RU-ADM-01, RU-ADM-02 |
| **BP-06** | Edición de estudiante con historial | Administración | Modificación de datos con visualización del historial de cambios. | RU-ADM-06, RU-ADM-07 |
| **BP-07** | Gestión de tutores y vinculación | Administración | Registro del tutor como entidad y vinculación autorizada con estudiantes. | RU-ADM-04, RU-ADM-05 |
| **BP-08** | Estructura académica | Administración, Dirección | Administración de gestiones, niveles, grados, paralelos y asignaturas. | RU-ADM-08, RU-ADM-09 |
| **BP-09** | Asignaciones docentes | Administración, Dirección | Asignación de docente a asignatura y curso por gestión. | RU-ADM-09 |
| **BP-10** | Inscripciones por gestión | Administración, Dirección | Registro de la inscripción del estudiante en la gestión vigente. | RU-ADM-13 |
| **BP-11** | Períodos de evaluación | Dirección | Definición, apertura y cierre de los períodos de evaluación. | RU-DIR-02, RU-DIR-03 |
| **BP-12** | Registro de calificaciones por curso | Docente | Captura grupal de calificaciones sobre la lista completa del curso. | RU-DOC-01, RU-DOC-02, RU-DOC-03 |
| **BP-13** | Corrección autorizada de calificación | Dirección | Modificación de calificación cerrada con motivo obligatorio. | RU-DIR-04, RU-DOC-05 |
| **BP-14** | Registro de asistencia por curso | Docente | Captura grupal de asistencia con estados normalizados. | RU-DOC-06, RU-DOC-07 |
| **BP-15** | Configuración de criterios de alerta | Dirección | Definición de umbrales de bajo rendimiento y ausentismo. | RU-DIR-07 |
| **BP-16** | Panel de alertas académicas | Docente, Dirección | Consulta, atención y resolución de alertas activas. | RU-DOC-08, RU-DIR-13 |
| **BP-17** | Reportes e historial académico | Administración, Dirección | Generación y exportación de reportes y del historial del estudiante. | RU-DIR-14, RU-ADM-14 |
| **BP-18** | Solicitud de sincronización SIE | Dirección | Selección de información y solicitud de transferencia al sistema externo. | RU-DIR-08 |
| **BP-19** | Monitor de sincronización en tiempo real | Dirección | Seguimiento del avance y estado de cada trabajo de sincronización. | RU-DIR-09, RU-SIS-05 |
| **BP-20** | Conciliación de discrepancias SIE | Dirección | Comparación de valores y resolución justificada de diferencias. | RU-DIR-10, RU-DIR-11 |
| **BP-21** | Historial de sincronizaciones | Dirección | Consulta del historial completo de transferencias realizadas. | RU-DIR-12 |
| **BP-22** | Consulta de auditoría | Dirección | Reconstrucción de operaciones por estudiante, usuario, entidad o sincronización. | RU-DIR-05, RU-DIR-06 |

Fuente: Elaboración propia, 2026.

#### 3.3 PANTALLAS DE LA APLICACIÓN MÓVIL

Tabla 24. Blueprint de la aplicación móvil para padres y tutores

| **ID** | **Pantalla** | **Propósito funcional** | **RU que origina** |
| --- | --- | --- | --- |
| **BPM-01** | Inicio de sesión del tutor | Autenticación de la cuenta de padre, madre o tutor. | RU-TUT-05 |
| **BPM-02** | Selector de estudiantes vinculados | Presentación exclusiva de los estudiantes asociados a la cuenta. | RU-TUT-01 |
| **BPM-03** | Calificaciones del estudiante | Consulta de las calificaciones publicadas por período y asignatura. | RU-TUT-02 |
| **BPM-04** | Asistencia del estudiante | Consulta del registro de asistencia y de las ausencias acumuladas. | RU-TUT-03 |
| **BPM-05** | Alertas y notificaciones | Visualización de las alertas que la institución determine comunicables. | RU-TUT-04 |
| **BPM-06** | Historial académico autorizado | Consulta del recorrido académico del estudiante por gestión. | RU-TUT-06 |
| **BPM-07** | Información sin conexión | Consulta de la última información descargada con indicación de su fecha. | RU-TUT-07 |
| **BPM-08** | Perfil y seguridad de la cuenta | Gestión de la sesión y cierre seguro de la cuenta en el dispositivo. | RU-TUT-08 |

Fuente: Elaboración propia, 2026.

### 4. REQUERIMIENTOS DE USUARIO DEL PERSONAL ADMINISTRATIVO

El personal administrativo interviene en los procesos de registro, actualización de información, estructura institucional, inscripciones y operaciones de soporte. Su necesidad central, expresada de forma transversal en el levantamiento, es dejar de escribir varias veces la misma información.

Tabla 25. Requerimientos de usuario del personal administrativo

| **ID** | **Necesidad expresada por el usuario** | **Origen** | **Prioridad** | **Criterio de satisfacción** |
| --- | --- | --- | --- | --- |
| **RU-ADM-01** | Necesito registrar a un estudiante una sola vez y que su información se reutilice durante toda su permanencia en la institución. | ENT, OBS, BP-05 | Debe | Un estudiante creado en una gestión puede inscribirse en gestiones posteriores sin volver a escribir sus datos personales. |
| **RU-ADM-02** | Necesito que el sistema me advierta si el estudiante que voy a registrar ya existe en la institución. | ENT, OBS, NOR, BP-05 | Debe | Al ingresar el documento o el código RUDE, el sistema presenta los candidatos existentes antes de permitir la creación. |
| **RU-ADM-03** | Necesito localizar rápidamente a un estudiante por nombre, documento, código o curso. | ENT, BP-04 | Debe | La búsqueda devuelve resultados por cualquiera de los criterios autorizados sin requerir el identificador interno. |
| **RU-ADM-04** | Necesito registrar al padre, madre o tutor una sola vez, aunque tenga varios estudiantes en la institución. | ENT, OBS, BP-07 | Debe | Un tutor ya registrado puede vincularse a un segundo estudiante sin volver a escribir sus datos. |
| **RU-ADM-05** | Necesito dejar establecido de forma verificable qué tutor está autorizado respecto de cada estudiante. | ENT, NOR, BP-07 | Debe | La vinculación queda registrada con su parentesco y es la única base del acceso del tutor a la información. |
| **RU-ADM-06** | Necesito actualizar un dato en un solo lugar y que quede actualizado en todo el sistema. | ENT, OBS, BP-06 | Debe | Modificado el dato, todas las pantallas y reportes que lo utilizan muestran el nuevo valor sin acción adicional. |
| **RU-ADM-07** | Necesito poder ver qué valor tenía antes un dato que fue modificado. | ENT, BP-06 | Debe | La ficha del estudiante muestra el historial de cambios con valor anterior, valor nuevo, responsable y fecha. |
| **RU-ADM-08** | Necesito administrar las gestiones académicas, niveles, grados, paralelos y asignaturas de la institución. | ENT, BP-08 | Debe | La estructura académica puede definirse por gestión sin intervención técnica externa. |
| **RU-ADM-09** | Necesito asignar qué docente dicta cada asignatura en cada curso. | ENT, BP-09 | Debe | La asignación determina automáticamente a qué estudiantes y asignaturas accede el docente. |
| **RU-ADM-10** | Necesito que la información que ya registré internamente no tenga que volver a digitarse en el sistema del Ministerio. | ENT, OBS, BP-18 | Debe | La transferencia al SIE se origina en el dato institucional existente y no requiere recaptura manual. |
| **RU-ADM-11** | Necesito crear cuentas de acceso para el personal de la institución y asignarles su perfil. | ENT, BP-03 | Debe | Cada cuenta queda asociada a un rol que determina las funciones a las que accede. |
| **RU-ADM-12** | Necesito desactivar la cuenta de una persona que deja la institución sin perder el registro de lo que hizo. | ENT, NOR, BP-03 | Debe | La cuenta desactivada no permite acceso, y su historial de operaciones permanece consultable. |
| **RU-ADM-13** | Necesito inscribir al estudiante en la gestión vigente indicando su nivel, grado y paralelo. | ENT, BP-10 | Debe | La inscripción se crea seleccionando al estudiante existente, sin reescribir datos personales. |
| **RU-ADM-14** | Necesito emitir listados y reportes de estudiantes por curso para las tareas administrativas cotidianas. | ENT, BP-17 | Debería | Los listados se generan desde el sistema y pueden exportarse en el formato definido por la institución. |

Fuente: Elaboración propia, 2026.

### 5. REQUERIMIENTOS DE USUARIO DE LA DIRECCIÓN

La Dirección posee responsabilidad de supervisión y control. La normativa vigente atribuye a la dirección de la unidad educativa responsabilidad sobre la calidad de la información reportada y sobre la prevención de duplicidades del código RUDE, lo que convierte varias de sus necesidades en requerimientos de cumplimiento obligatorio y no meramente deseables.

Tabla 26. Requerimientos de usuario de la Dirección

| **ID** | **Necesidad expresada por el usuario** | **Origen** | **Prioridad** | **Criterio de satisfacción** |
| --- | --- | --- | --- | --- |
| **RU-DIR-01** | Necesito una vista consolidada del estado académico de la institución sin tener que pedir reportes. | ENT, BP-02 | Debería | El panel presenta indicadores de matrícula, rendimiento, asistencia y estado de sincronizaciones actualizados. |
| **RU-DIR-02** | Necesito definir cuándo se abre y cuándo se cierra cada período de evaluación. | ENT, BP-11 | Debe | El período define por sí mismo la ventana en la que los docentes pueden registrar calificaciones. |
| **RU-DIR-03** | Necesito que nadie pueda modificar una calificación después del cierre del período por la vía ordinaria. | ENT, NOR, BP-11 | Debe | Cerrado el período, el registro y la modificación ordinaria quedan bloqueados para el docente. |
| **RU-DIR-04** | Necesito poder autorizar una corrección de calificación cerrada y que quede constancia del motivo. | ENT, NOR, BP-13 | Debe | La corrección exige motivo obligatorio y conserva el valor anterior, el nuevo y el responsable. |
| **RU-DIR-05** | Necesito saber quién modificó un dato académico, cuándo lo hizo y por qué. | ENT, NOR, BP-22 | Debe | La consulta de auditoría devuelve la operación con usuario, fecha, valor anterior, valor nuevo y motivo. |
| **RU-DIR-06** | Necesito poder reconstruir todo lo ocurrido con un estudiante o con una sincronización determinada. | ENT, NOR, BP-22 | Debe | La auditoría permite filtrar por estudiante, usuario, entidad o sincronización y presenta la secuencia completa. |
| **RU-DIR-07** | Necesito definir a partir de qué criterio el sistema debe avisar que un estudiante requiere atención. | ENT, BP-15 | Debe | Los umbrales de calificación, ausencias y atrasos se configuran institucionalmente sin intervención técnica. |
| **RU-DIR-08** | Necesito solicitar el envío de información al sistema del Ministerio sin que alguien deba digitarla nuevamente. | ENT, OBS, BP-18 | Debe | La solicitud se genera desde la información institucional validada y devuelve un identificador de seguimiento. |
| **RU-DIR-09** | Necesito saber si el dato quedó efectivamente registrado en el sistema del Ministerio y no solo si fue enviado. | ENT, OBS, NOR, BP-19 | Debe | El trabajo no se considera confirmado hasta que el sistema vuelve a leer el dato y comprueba su coincidencia. |
| **RU-DIR-10** | Necesito ver claramente cuándo el valor de nuestro sistema difiere del valor registrado en el Ministerio. | ENT, BP-20 | Debe | La pantalla de conciliación presenta ambos valores lado a lado con el estado de discrepancia. |
| **RU-DIR-11** | Necesito decidir yo cuál es el valor correcto ante una diferencia, y que quede registrada mi decisión. | ENT, NOR, BP-20 | Debe | El sistema no modifica automáticamente el dato institucional; la resolución exige usuario, fecha y justificación. |
| **RU-DIR-12** | Necesito disponer del historial de todo lo que se envió al Ministerio, cuándo y bajo qué responsable. | ENT, NOR, BP-21 | Debe | El historial conserva cada sincronización con su estado final, responsable y evidencia de verificación. |
| **RU-DIR-13** | Necesito ver qué estudiantes tienen alertas activas para priorizar el seguimiento. | ENT, BP-16 | Debe | El panel lista las alertas activas con el dato que las originó y su estado de atención. |
| **RU-DIR-14** | Necesito generar reportes de calificaciones, asistencia e historial académico cuando la institución los requiera. | ENT, BP-17 | Debe | Los reportes se generan desde el sistema y pueden exportarse en los formatos definidos por la institución. |

Fuente: Elaboración propia, 2026.

### 6. REQUERIMIENTOS DE USUARIO DEL DOCENTE

Los docentes generan una proporción importante de la información académica diaria. Su necesidad predominante, expresada en las entrevistas, no es disponer de más funciones sino de menos pasos: completar el registro de un curso completo en una sola operación y con la menor navegación posible. El sistema debe además limitar su acceso a los cursos, paralelos, asignaturas y estudiantes que le hayan sido asignados.

Tabla 27. Requerimientos de usuario del docente

| **ID** | **Necesidad expresada por el usuario** | **Origen** | **Prioridad** | **Criterio de satisfacción** |
| --- | --- | --- | --- | --- |
| **RU-DOC-01** | Necesito registrar las calificaciones de todo un curso desde una sola pantalla. | ENT, OBS, BP-12 | Debe | La pantalla presenta la lista completa del curso y permite guardar todas las calificaciones en una sola operación. |
| **RU-DOC-02** | Necesito que el sistema me impida guardar una calificación fuera del rango permitido. | ENT, OBS, BP-12 | Debe | El valor inválido se señala en la celda correspondiente sin descartar el resto de la carga. |
| **RU-DOC-03** | Necesito ver únicamente los cursos y asignaturas que tengo asignados. | ENT, BP-12 | Debe | El sistema no presenta ni permite operar sobre cursos ajenos a la asignación del docente. |
| **RU-DOC-04** | Necesito saber en qué período estoy registrando y si aún está abierto. | ENT, BP-12 | Debe | La pantalla indica el período activo y su estado antes de habilitar la captura. |
| **RU-DOC-05** | Necesito poder solicitar la corrección de una calificación ya cerrada, explicando el motivo. | ENT, BP-13 | Debe | La solicitud queda registrada y la corrección se aplica únicamente con autorización de la Dirección. |
| **RU-DOC-06** | Necesito tomar la asistencia de todo el curso marcando solo las excepciones. | ENT, OBS, BP-14 | Debe | La lista propone el estado de presencia por defecto y solo se marcan ausencias, atrasos y justificaciones. |
| **RU-DOC-07** | Necesito poder corregir un registro de asistencia si me equivoqué al marcarlo. | ENT, BP-14 | Debe | La corrección es posible dentro de la ventana definida y conserva el estado anterior. |
| **RU-DOC-08** | Necesito que el sistema me avise cuando un estudiante mío acumula bajo rendimiento o ausencias. | ENT, BP-16 | Debería | El docente recibe la alerta con el dato que la originó, sin necesidad de revisar manualmente el curso. |
| **RU-DOC-09** | Necesito consultar el rendimiento de mis estudiantes a lo largo del período sin pedir reportes. | ENT, BP-16 | Debería | El docente accede al resumen de calificaciones y asistencia de sus cursos asignados. |
| **RU-DOC-10** | Necesito que los padres puedan consultar la información por la aplicación y no por mi teléfono personal. | ENT, BPM-03 | Debería | La consulta familiar se resuelve por el canal institucional, sin requerir la intervención del docente. |

Fuente: Elaboración propia, 2026.

### 7. REQUERIMIENTOS DE USUARIO DEL PADRE, MADRE O TUTOR

El acceso del tutor se limita a información de los estudiantes respecto de los cuales exista una vinculación autorizada en el sistema. Dado que se trata de información de menores de edad, los requerimientos de este actor incorporan de manera explícita las condiciones de resguardo derivadas del derecho a la privacidad e intimidad reconocido constitucionalmente y de los deberes de reserva previstos en el Código Niña, Niño y Adolescente.

Tabla 28. Requerimientos de usuario del padre, madre o tutor

| **ID** | **Necesidad expresada por el usuario** | **Origen** | **Prioridad** | **Criterio de satisfacción** |
| --- | --- | --- | --- | --- |
| **RU-TUT-01** | Necesito ver únicamente a los estudiantes que están efectivamente a mi cargo. | ENT, NOR, BPM-02 | Debe | La aplicación presenta exclusivamente los estudiantes vinculados a la cuenta y rechaza cualquier otro acceso. |
| **RU-TUT-02** | Necesito consultar las calificaciones de mi hijo o tutelado desde mi teléfono. | ENT, BPM-03 | Debe | Las calificaciones publicadas se consultan por período y asignatura sin gestión administrativa previa. |
| **RU-TUT-03** | Necesito saber si mi hijo faltó a clases y cuántas ausencias acumula. | ENT, BPM-04 | Debe | La aplicación presenta el registro de asistencia y el acumulado de ausencias del período. |
| **RU-TUT-04** | Necesito ser avisado cuando el colegio detecte una situación que requiere mi atención. | ENT, BPM-05 | Debería | El tutor recibe las alertas que la institución determine comunicables, con su fecha y motivo. |
| **RU-TUT-05** | Necesito ingresar a la aplicación con una cuenta propia y segura. | ENT, NOR, BPM-01 | Debe | La cuenta es creada por la institución y su sesión puede cerrarse y revocarse. |
| **RU-TUT-06** | Necesito consultar el recorrido académico de gestiones anteriores de mi hijo. | ENT, BPM-06 | Debería | El historial autorizado se consulta por gestión sin solicitarlo a la administración. |
| **RU-TUT-07** | Necesito poder ver la información aunque en ese momento no tenga buena conexión. | ENT, BPM-07 | Podría | La aplicación conserva la última información descargada indicando de forma visible su fecha de actualización. |
| **RU-TUT-08** | Necesito tener la certeza de que nadie más puede ver la información de mi hijo. | ENT, NOR, BPM-08 | Debe | El acceso se valida en cada consulta contra la vinculación autorizada, y la sesión se protege en el dispositivo. |

Fuente: Elaboración propia, 2026.

### 8. REQUERIMIENTOS DE USUARIO TRANSVERSALES

Los requerimientos transversales corresponden a condiciones generales expresadas por la institución que no pertenecen a un actor específico, sino que atraviesan todos los procesos. Aunque su naturaleza es próxima a la de un requerimiento no funcional, se consignan aquí porque fueron formulados por los usuarios como condiciones de aceptación del sistema y deben validarse con ellos.

Tabla 29. Requerimientos de usuario transversales

| **ID** | **Necesidad expresada por el usuario** | **Origen** | **Prioridad** | **Criterio de satisfacción** |
| --- | --- | --- | --- | --- |
| **RU-SIS-01** | Necesitamos que cada persona ingrese con su propia cuenta y vea solo lo que le corresponde. | ENT, NOR, BP-01 | Debe | Cada operación protegida valida el permiso del usuario en el servidor y no únicamente en la interfaz. |
| **RU-SIS-02** | Necesitamos que la información de los estudiantes esté protegida por tratarse de menores de edad. | ENT, NOR | Debe | El acceso se rige por necesidad de conocer y por vínculo autorizado; la comunicación viaja cifrada. |
| **RU-SIS-03** | Necesitamos que las claves de acceso al sistema del Ministerio no queden en manos de cualquiera. | ENT, NOR | Debe | Las credenciales del sistema externo residen exclusivamente en el componente servidor autorizado. |
| **RU-SIS-04** | Necesitamos que, si el Ministerio habilita una vía oficial de integración, el sistema pueda adoptarla sin rehacerse. | ENT, NOR | Debería | La interoperabilidad se encapsula tras una interfaz sustituible sin modificar el resto del sistema. |
| **RU-SIS-05** | Necesitamos poder seguir trabajando aunque un proceso largo esté en ejecución. | ENT, OBS, BP-19 | Debe | Las sincronizaciones se ejecutan en segundo plano y su avance se informa sin bloquear al usuario. |
| **RU-SIS-06** | Necesitamos que el colegio pueda seguir operando aunque el sistema del Ministerio no esté disponible. | ENT, OBS | Debe | La indisponibilidad del sistema externo no impide el registro ni la consulta de la información institucional. |
| **RU-SIS-07** | Necesitamos que la información no se pierda ante una falla. | ENT | Debe | Existe un procedimiento probado de respaldo y recuperación de la base de datos institucional. |
| **RU-SIS-08** | Necesitamos que el sistema use el lenguaje que usamos en el colegio y no términos técnicos. | ENT, BP-02 | Debería | La interfaz emplea la terminología del dominio educativo verificada con la institución. |

Fuente: Elaboración propia, 2026.

### 9. TRAZABILIDAD DE LOS REQUERIMIENTOS DE USUARIO

La trazabilidad se establece en dos direcciones. Hacia atrás, cada requerimiento de usuario se vincula con el hallazgo del levantamiento que lo originó, lo que acredita que no existen requerimientos incorporados sin sustento. Hacia adelante, cada requerimiento se vincula con los requerimientos funcionales que lo materializan, lo que permite verificar que ninguna necesidad declarada haya quedado sin especificación.

#### 9.1 TRAZABILIDAD HACIA EL LEVANTAMIENTO Y HACIA LOS REQUERIMIENTOS FUNCIONALES

Tabla 30. Matriz de trazabilidad de requerimientos de usuario

| **RU** | **Hallazgo de origen** | **Proceso TO-BE** | **RF que lo materializan** |
| --- | --- | --- | --- |
| **RU-ADM-01** | H-01 | FP-01 | RF-07, RF-17 |
| **RU-ADM-02** | H-02 | FP-01 | RF-08, RF-11 |
| **RU-ADM-03** | H-01 | FP-01 | RF-11 |
| **RU-ADM-04** | H-03 | FP-01 | RF-10 |
| **RU-ADM-05** | H-03 | FP-01, FP-07 | RF-10, RF-40 |
| **RU-ADM-06** | H-04 | FP-02 | RF-09 |
| **RU-ADM-07** | H-05 | FP-02, FP-08 | RF-09, RF-54, RF-55 |
| **RU-ADM-08** | H-01 | FP-01 | RF-13, RF-14, RF-15 |
| **RU-ADM-09** | H-06 | FP-03 | RF-16 |
| **RU-ADM-10** | H-11 | FP-06 | RF-45, RF-46, RF-48 |
| **RU-ADM-11** | — | Transversal | RF-03, RF-04 |
| **RU-ADM-12** | H-05 | Transversal | RF-06 |
| **RU-ADM-13** | H-01 | FP-01 | RF-17 |
| **RU-ADM-14** | — | FP-03, FP-04 | RF-35, RF-37 |
| **RU-DIR-01** | — | Transversal | RF-34, RF-35, RF-36 |
| **RU-DIR-02** | H-08 | FP-03 | RF-18 |
| **RU-DIR-03** | H-08 | FP-03 | RF-22 |
| **RU-DIR-04** | H-08 | FP-03 | RF-23 |
| **RU-DIR-05** | H-05 | FP-08 | RF-54, RF-55 |
| **RU-DIR-06** | H-05, H-14 | FP-08 | RF-55, RF-56 |
| **RU-DIR-07** | H-10 | FP-05 | RF-29 |
| **RU-DIR-08** | H-11 | FP-06 | RF-45, RF-46, RF-47, RF-48 |
| **RU-DIR-09** | H-12 | FP-06 | RF-49, RF-50 |
| **RU-DIR-10** | H-13 | FP-06 | RF-50 |
| **RU-DIR-11** | H-13 | FP-06 | RF-50, RF-53, RF-54 |
| **RU-DIR-12** | H-14 | FP-06 | RF-53, RF-55 |
| **RU-DIR-13** | H-10 | FP-05 | RF-32, RF-33 |
| **RU-DIR-14** | — | FP-03, FP-04 | RF-34, RF-35, RF-36, RF-37 |
| **RU-DOC-01** | H-06 | FP-03 | RF-19, RF-20 |
| **RU-DOC-02** | H-07 | FP-03 | RF-21 |
| **RU-DOC-03** | H-06 | FP-03 | RF-16 |
| **RU-DOC-04** | H-08 | FP-03 | RF-18, RF-22 |
| **RU-DOC-05** | H-08 | FP-03 | RF-23 |
| **RU-DOC-06** | H-09 | FP-04 | RF-25, RF-26 |
| **RU-DOC-07** | H-09 | FP-04 | RF-27 |
| **RU-DOC-08** | H-10 | FP-05 | RF-30, RF-31, RF-33 |
| **RU-DOC-09** | H-09, H-10 | FP-03, FP-04 | RF-28, RF-35 |
| **RU-DOC-10** | H-15 | FP-07 | RF-41, RF-42 |
| **RU-TUT-01** | H-03, H-15 | FP-07 | RF-40 |
| **RU-TUT-02** | H-15 | FP-07 | RF-41 |
| **RU-TUT-03** | H-15 | FP-07 | RF-42 |
| **RU-TUT-04** | H-10, H-15 | FP-05, FP-07 | RF-43 |
| **RU-TUT-05** | H-15 | FP-07 | RF-39 |
| **RU-TUT-06** | H-15 | FP-07 | RF-34, RF-41 |
| **RU-TUT-07** | H-15 | FP-07 | RF-44 |
| **RU-TUT-08** | H-15 | FP-07 | RF-40, RNF-01, RNF-02 |
| **RU-SIS-01** | — | Transversal | RF-01, RF-02, RF-04, RNF-02 |
| **RU-SIS-02** | — | Transversal | RNF-01, RNF-02, RNF-20 |
| **RU-SIS-03** | H-16 | FP-06 | RNF-04 |
| **RU-SIS-04** | H-16 | FP-06 | RF-47, RNF-12 |
| **RU-SIS-05** | H-11 | FP-06 | RF-46, RF-51 |
| **RU-SIS-06** | H-11 | FP-06 | RNF-08 |
| **RU-SIS-07** | — | Transversal | RNF-09 |
| **RU-SIS-08** | — | Transversal | RNF-10, RNF-11 |

Fuente: Elaboración propia, 2026.

#### 9.2 DISTRIBUCIÓN POR PRIORIDAD

Tabla 31. Distribución de los requerimientos de usuario por prioridad

| **Prioridad** | **Administración** | **Dirección** | **Docente** | **Tutor** | **Transversal** | **Total** |
| --- | --- | --- | --- | --- | --- | --- |
| **Debe** | 13 | 13 | 7 | 5 | 6 | 44 |
| **Debería** | 1 | 1 | 3 | 2 | 2 | 9 |
| **Podría** | 0 | 0 | 0 | 1 | 0 | 1 |
| **Total** | 14 | 14 | 10 | 8 | 8 | 54 |

Fuente: Elaboración propia, 2026.

#### 9.3 CORRESPONDENCIA CON LOS OBJETIVOS DEL PROYECTO

Tabla 32. Cobertura de los objetivos específicos por los requerimientos de usuario

| **Objetivo específico del proyecto** | **RU que lo sustentan** |
| --- | --- |
| **Analizar los procesos actuales e identificar causas de duplicidad y errores, determinando los requerimientos del sistema.** | La totalidad de los RU, en tanto derivan del diagnóstico documentado en los Documentos 01 y 02. |
| **Diseñar la arquitectura, el modelo de datos y los componentes funcionales conforme a los requerimientos identificados.** | RU-SIS-01 a RU-SIS-08, RU-ADM-08, RU-ADM-09 |
| **Construir los módulos de registro, actualización y seguimiento, con mecanismos de interoperabilidad y automatización.** | RU-ADM-01 a RU-ADM-14, RU-DOC-01 a RU-DOC-10, RU-DIR-07, RU-DIR-08, RU-DIR-13 |
| **Evaluar el funcionamiento mediante pruebas de validación y aceptación de usuarios.** | Los criterios de satisfacción de cada RU constituyen la base de los casos de prueba de aceptación. |

Fuente: Elaboración propia, 2026.

#### 9.4 VERIFICACIÓN DE COMPLETITUD

La revisión de la matriz permite verificar tres condiciones de calidad de la especificación:

• Cada hallazgo H-01 a H-16 del levantamiento origina al menos un requerimiento de usuario, de modo que ningún problema diagnosticado quedó sin respuesta.

• Cada requerimiento de usuario se materializa en al menos un requerimiento funcional o no funcional especificado, de modo que ninguna necesidad quedó sin implementación prevista.

• Cada pantalla del blueprint corresponde a al menos un requerimiento de usuario, de modo que no existen pantallas sin justificación funcional ni requerimientos sin materialización en la interfaz.

Los criterios de satisfacción consignados en cada requerimiento están redactados en términos observables por el usuario. Constituyen, por esa razón, el insumo directo de las pruebas de aceptación de usuario previstas en la fase de evaluación del proyecto, y deben ser validados con la institución antes de iniciar la construcción de cada incremento.

# ANEXO L. DIAGRAMA GENERAL DE PROCESOS ACADÉMICOS Y SINCRONIZACIÓN CON EL SIE

La lámina conserva el diagrama en una sola hoja. Para que el texto sea legible al imprimir, el flujo se presenta en dos tramos horizontales con una zona central solapada: el tramo 1 se lee de izquierda a centro y el tramo 2 continúa desde el solapamiento hasta el cierre. Los carriles, decisiones y conexiones mantienen el orden del diagrama original.

**TRAMO 1 — CONFIGURACIÓN, REGISTRO, ASISTENCIA Y AVANCE HACIA EL CIERRE**

**TRAMO 2 — CONTINUACIÓN, SINCRONIZACIÓN, VERIFICACIÓN Y TRATAMIENTO DE ERRORES**

<a id="tg_fig_l1"></a>Figura L.1. Diagrama general de procesos académicos y sincronización con el SIE

Fuente: Elaboración propia, 2026. Representación por tramos del diagrama original; ambos tramos pertenecen a una sola lámina.

# ANEXO M. MODELO ENTIDAD-RELACIÓN GENERAL DEL SISTEMA ACADÉMICO

<a id="tg_figure_2_6"></a>Figura 3.6. Modelo entidad-relación general del sistema académico

Fuente: Elaboración propia, 2026, con base en el modelo de datos del sistema académico.
