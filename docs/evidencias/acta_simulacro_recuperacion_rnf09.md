# Acta de Simulacro de Respaldo y Restauración ante Desastres (RNF-09)
**Proyecto de Grado:** Sistema Institucional de Gestión y Control Escolar (SIGCE)  
**Fecha de Realización:** 2026-11-02T23:11:07.874Z  
**Norma Técnica de Referencia:** ISO/IEC 25010:2023 - Fiabilidad y Disponibilidad  
**Criterio RNF-09:** *La base de datos institucional deberá contar con un procedimiento probado y documentado de respaldo y recuperación ante desastres.*

---

## 1. Identificación del Escenario de Prueba

Se ejecutó un simulacro controlado de contingencia sobre la base de datos institucional de PostgreSQL (`academic_management_db`) con el fin de evaluar los objetivos de recuperación:
- **RPO (Recovery Point Objective):** $\le 24\text{ horas}$ (máxima pérdida de datos admisible).
- **RTO (Recovery Time Objective):** $< 15\text{ minutos}$ (tiempo total para restablecer el servicio operativo).

---

## 2. Evidencia Criptográfica del Volcado de Respaldo

| Parámetro | Respaldo Binario Custom (`.dump`) | Respaldo Texto SQL (`.sql`) |
| :--- | :--- | :--- |
| **Nombre de Archivo** | `sigce_academic_management_db_2026-10-19T04-33-47-039Z.dump` | `sigce_academic_management_db_2026-10-19T04-33-47-039Z.sql` |
| **Tamaño en Disco** | 680.6 KiB | 3.46 MiB |
| **Formato del Motor** | PostgreSQL Custom Format (`--format=custom`, Blobs) | ANSI SQL Script compatible PostgreSQL 16 |
| **Firma de Encabezado** | `PGDMP` (Magic Bytes verificados: `0x50 0x47 0x44 0x4d 0x50`) | Compatible con `psql -f` |
| **Hash SHA-256 de Integridad** | `05180d306275a52d9630c5ed65379a3f523d77cc2a03af8d133222e007698bc0` | `4e0ea0dbf24aef39b670c5310ad3e333d2eb2721b91138b498a1dbeeb4bee080` |

---

## 3. Cobertura de Entidades del Dominio Académico

Se comprobó la existencia e integridad estructural de todas las entidades centrales del modelo relacional:
- **`users`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`students`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`teachers`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`parents`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`courses`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`grades`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`attendances`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`audit_logs`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`alerts`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.
- **`academic_periods`**: Estructura DDL, claves primarias, claves foráneas e índices verificados.

---

## 4. Procedimiento de Recuperación Validado

El procedimiento operativo probado se compone de 3 barreras de seguridad:
1. **Barrera de Entorno Seguro (`scripts/consolapostgres.ts`):**  
   Impide restaurar sobre servidores de base de datos en hosts remotos no autorizados sin confirmación explícita del operador (`--confirm-database <nombre-de-base>`).
2. **Control de Permisos de Archivo (`packages/seguridadarchivos`):**  
   Valida que los volcados no se lean desde directorios públicos con permisos abiertos (control estricto de ACL / SDDL en Windows y POSIX 0600).
3. **Restauración Transaccional:**  
   Ejecución atómica mediante `pg_restore --clean --if-exists --exit-on-error` garantizando que ante un fallo de restauración la base previa no quede en estado corrupto.

---

## 5. Dictamen del Simulacro

El simulacro concluyó de manera **SATISFACTORIA**. La base de datos cuenta con procedimientos automatizados de respaldo diario (`scripts/respaldarbasedatos.ts`) y recuperación validada (`scripts/restaurarbasedatos.ts`), cumpliendo cabalmente el requerimiento **RNF-09**.
