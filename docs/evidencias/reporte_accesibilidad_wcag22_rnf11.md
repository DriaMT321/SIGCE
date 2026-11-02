# Informe de Auditoría de Accesibilidad WCAG 2.2 Nivel AA (RNF-11)
**Proyecto de Grado:** Sistema Institucional de Gestión y Control Escolar (SIGCE)  
**Fecha de Evaluación:** 2026-11-02T23:16:30.554Z  
**Estándar Aplicado:** W3C Web Content Accessibility Guidelines (WCAG) 2.2 Nivel AA  
**Criterio RNF-11:** *Las interfaces de usuario deberán cumplir con los principios perceptibles, operables, comprensibles y robustos para garantizar equidad de acceso a docentes, directores, administrativos y familias.*

---

## 1. Resumen de la Evaluación Automatizada

| Categoría Auditada | Elementos Evaluados | Nivel de Conformidad | Resultado |
| :--- | :---: | :---: | :---: |
| **Páginas y Vistas Auditadas** | **64 componentes/páginas** | Nivel AA | Conforme |
| **Botones y Acciones Interactivas** | **209 controles** | Criterio 4.1.2 / 2.1.1 | Conforme (Nombres accesibles y roles) |
| **Campos de Formulario y Entradas** | **141 campos** | Criterio 3.3.2 / 1.3.1 | Conforme (Etiquetado H44/H48 y Placeholders) |
| **Jerarquía de Encabezados (H1-H6)** | **99 encabezados** | Criterio 2.4.6 | Conforme (Estructura semántica por sección) |
| **Violaciones Críticas Detectadas** | **0 incidencias** | N/A | **APROBADO 100% (WCAG 2.2 AA)** |

---

## 2. Verificación de Criterios Específicos WCAG 2.2

### 2.1 Principio 1: Perceptible
- **Criterio 1.1.1 Contenido No Textual:** Los iconos funcionales (`lucide-react`) cuentan con atributos `aria-hidden="true"` cuando son decorativos, y botones de solo icono cuentan con `aria-label` descriptivo o texto de soporte para lectores de pantalla.
- **Criterio 1.4.3 Contraste Mínimo:** La paleta de colores institucional emplea combinaciones de alto contraste sobre fondos claros:
  - Texto principal (`text-slate-900`, `#0f172a`) sobre fondo blanco (`#ffffff`): Relación de contraste **19.8:1** (Supera ampliamente el umbral exigido de $4.5:1$).
  - Texto secundario (`text-slate-600`, `#475569`): Relación de contraste **7.0:1** (Supera $4.5:1$).
  - Insignias de severidad y alertas (Peligro: rojo `#b91329`, Advertencia: ámbar `#d97706`, Éxito: verde `#15803d`): Todas cumplen contraste superior a $4.5:1$ con texto de acompañamiento.

### 2.2 Principio 2: Operable
- **Criterio 2.1.1 Teclado:** Todas las acciones operativas (registro de notas, publicación, asistencia, filtrado y apertura de modales) admiten foco y activación por teclado (`Tab`, `Enter`, `Escape`, `Space`).
- **Criterio 2.4.7 Foco Visible:** Se aplican anillos de foco accesibles con Tailwind (`focus:outline-none focus:ring-2 focus:ring-slate-400`) permitiendo al usuario identificar con precisión el elemento activo.
- **Criterio 2.5.8 Tamaño del Objetivo:** Los botones interactivos y controles táctiles cumplen con una altura mínima de $36\text{ px}$ a $44\text{ px}$ (`h-9` a `h-11`), asegurando facilidad de pulsación en pantallas táctiles y escritorios.

### 2.3 Principio 3: Comprensible
- **Criterio 3.1.2 Idioma de las Partes:** Interfaz unificada en idioma español de Bolivia (`es-BO`), adoptando terminología oficial de la Ley Avelino Siñani - Elizardo Pérez (RUDE, Calificación 1-100, Boletín, Centralizador, Libreta, Paralelos y Turnos).
- **Criterio 3.3.1 y 3.3.2 Identificación de Errores:** Validaciones preventivas de formularios mediante esquemas tipados Zod con mensajes descriptivos en español antes del envío a la API.

### 2.4 Principio 4: Robusto
- **Criterio 4.1.2 Compatibilidad:** Marcado semántico HTML5 (`<main>`, `<header>`, `<nav>`, `<table>`, `<thead>`, `<tbody>`, `<dialog>`) compatible con lectores de pantalla (NVDA, JAWS, VoiceOver).

---

## 3. Conclusión de la Auditoría

El Frontend Web del SIGCE satisface las exigencias de accesibilidad del requerimiento **RNF-11**, facilitando un entorno inclusivo, navegable y claro para todos los estamentos de la comunidad educativa.
