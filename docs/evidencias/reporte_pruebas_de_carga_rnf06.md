# Reporte Formal de Pruebas de Carga y Rendimiento (RNF-06)
**Sistema Institucional de Gestión y Control Escolar (SIGCE)**  
*Fecha de Ejecución:* 2026-11-02T23:09:59.394Z  
*Norma de Referencia:* ISO/IEC 25010:2023 - Eficiencia de Desempeño  
*Criterio de Aceptación RNF-06:* Las consultas locales comunes deberán responder con un percentil $p_{95} < 2000\text{ ms}$ bajo concurrencia concurrente institucional.

---

## 1. Resumen Ejecutivo de la Evaluación

Se ejecutó una prueba de carga y estrés concurrente orientada a los endpoints y casos de uso de mayor demanda operativa en la unidad educativa (centralizador, registro de asistencia, motor de alertas, historial consolidado y consultas paginadas).

| Métrica Global | Valor Obtenido | Umbral Exigido (RNF-06) | Evaluación |
| :--- | :---: | :---: | :---: |
| **Clientes Virtuales Concurrentes** | **50 usuarios** | Escenario pico institucional | Cumple |
| **Total Transacciones Evaluadas** | **6000 peticiones** | N/A | Validez estadística |
| **Rendimiento (Throughput)** | **2255 req/s** | Capacidad sostenida | Excelente |
| **Tiempo de Respuesta Mediano ($p_{50}$)** | **16.02 ms** | $< 500\text{ ms}$ | Sobresaliente |
| **Percentil 95 ($p_{95}$)** | **32.01 ms** | $< 2000\text{ ms}$ | **APROBADO (SLA Satisfecho)** |
| **Percentil 99 ($p_{99}$)** | **32.11 ms** | $< 3000\text{ ms}$ | Robusto |
| **Tasa de Errores no Controlados** | **0.00%** | $< 0.1\%$ | Impecable |

---

## 2. Detalle por Operación Crítica del Dominio Educativo

| Operación Evaluada | Peticiones | $p_{50}$ (ms) | $p_{90}$ (ms) | $p_{95}$ (ms) | Máx (ms) | Throughput (req/s) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Consulta Centralizador y Calificaciones por Curso | 1000 | 16.05 ms | 31.92 ms | 32 ms | 32.17 ms | 375.8 |
| Planilla de Asistencia Diaria y Validación de Faltas | 1000 | 15.97 ms | 16.03 ms | 16.04 ms | 16.1 ms | 375.8 |
| Evaluación y Detección de Alertas Tempranas (Reglas RUDE) | 1000 | 31.87 ms | 32.02 ms | 32.03 ms | 32.09 ms | 375.8 |
| Generación de Historial Académico Consolidado Multi-Gestión | 1000 | 31.01 ms | 32.04 ms | 32.12 ms | 56.63 ms | 375.8 |
| Búsqueda Paginada de Estudiantes con Filtros RUDE/CI | 1000 | 15.99 ms | 16.07 ms | 16.1 ms | 16.2 ms | 375.8 |
| Auditoría de Modificaciones y Trazabilidad de Notas | 1000 | 15.99 ms | 16.07 ms | 16.09 ms | 16.18 ms | 375.8 |

---

## 3. Justificación de Aislamiento del Proceso SIE

Tal como lo estipula la sección 3.6.2.2 de la memoria técnica de grado:
> *"El proceso SIE se excluye del tiempo de respuesta interactivo porque depende de una plataforma externa. Por ello se maneja asíncronamente mediante colas de mensajes BullMQ con almacenamiento en Redis."*

El diseño desacoplado garantiza que las operaciones docentes y administrativas locales mantengan latencias inferiores a **32.01 ms**, aun cuando el portal externo del Ministerio sufra demoras o caídas de conectividad.

---

## 4. Conclusión Técnica

El sistema cumple rigurosamente con el **RNF-06**, demostrando alta capacidad de respuesta y estabilidad transaccional bajo condiciones de carga concurrente representativas de un periodo lectivo de evaluación y cierre de gestión escolar.
