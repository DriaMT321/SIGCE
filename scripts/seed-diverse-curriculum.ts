import { PrismaClient, CurriculumStatus } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

interface TopicDefinition {
  subjectCode: string;
  gradeLevels: number[];
  campo: string;
  periodNumber: number;
  unitTitle: string;
  title: string;
  description: string;
  status: CurriculumStatus;
  progressPercent: number;
}

const DIVERSE_CURRICULUM_DATA: TopicDefinition[] = [
  // ==========================================
  // INICIAL (Grade levels 1 to 4)
  // ==========================================
  {
    subjectCode: 'DII',
    gradeLevels: [1, 2, 3, 4],
    campo: 'Desarrollo Infantil',
    periodNumber: 1,
    unitTitle: 'Identidad, Convivencia y Esquema Corporal',
    title: 'Reconocimiento de la identidad personal, partes del cuerpo y hábitos higiénicos',
    description: 'Exploración de la autoimagen, lateralidad básica y prácticas de autocuidado en el aula.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'DII',
    gradeLevels: [1, 2, 3, 4],
    campo: 'Desarrollo Infantil',
    periodNumber: 1,
    unitTitle: 'Expresión Grafoplástica y Sensorial',
    title: 'Técnicas de rasgado, dactilopintura, modelado en plastilina y colores primarios',
    description: 'Desarrollo de la motricidad fina, prensión pinza y discriminación perceptiva táctil y visual.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'DII',
    gradeLevels: [1, 2, 3, 4],
    campo: 'Desarrollo Infantil',
    periodNumber: 2,
    unitTitle: 'Lenguaje Oral y Expresión Sonora',
    title: 'Rimas, trabalenguas infantiles, canciones tradicionales y narración de vivencias',
    description: 'Ampliación del vocabulario receptivo-expresivo y articulación fonética a través del juego.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 75,
  },
  {
    subjectCode: 'DII',
    gradeLevels: [1, 2, 3, 4],
    campo: 'Desarrollo Infantil',
    periodNumber: 2,
    unitTitle: 'Nociones Lógico-Matemáticas y Espaciales',
    title: 'Relaciones espaciales (arriba-abajo, dentro-fuera), seriación y conteo concreto del 1 al 10',
    description: 'Clasificación por atributos de color, forma y tamaño con material manipulativo comunitario.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 60,
  },
  {
    subjectCode: 'DII',
    gradeLevels: [1, 2, 3, 4],
    campo: 'Desarrollo Infantil',
    periodNumber: 3,
    unitTitle: 'Exploración del Entorno Natural y la Madre Tierra',
    title: 'Cuidado de las plantas, animales del contexto y elementos de la naturaleza (agua y tierra)',
    description: 'Sensibilización ecológica vivencial y preservación del entorno escolar y familiar.',
    status: CurriculumStatus.PLANIFICADO,
    progressPercent: 0,
  },

  // ==========================================
  // COMUNIDAD Y SOCIEDAD: LENGUA CASTELLANA (LC)
  // ==========================================
  {
    subjectCode: 'LC',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Comprensión Lectora y Producción Textual',
    title: 'El texto narrativo: el cuento tradicional, la fábula y estructura de inicio, nudo y desenlace',
    description: 'Identificación de personajes principales, valores comunitarios y recreación de relatos orales.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'LC',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Gramática y Ortografía Aplicada',
    title: 'Clases de palabras (sustantivos, verbos, adjetivos) y acentuación de palabras agudas, graves y esdrújulas',
    description: 'Uso correcto del punto, la coma y conectores cronológicos en redacción de crónicas escolares.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },
  {
    subjectCode: 'LC',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 3,
    unitTitle: 'Expresión Literaria y Tradición Oral',
    title: 'Mitos y leyendas regionales de Bolivia, teatro infantil y declamación poética',
    description: 'Dramatización y rescate de la memoria colectiva y leyendas del altiplano, valles y llanos.',
    status: CurriculumStatus.PLANIFICADO,
    progressPercent: 0,
  },
  {
    subjectCode: 'LC',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Literatura Boliviana y Latinoamericana',
    title: 'El ensayo crítico, literatura de la Guerra del Chaco, realismo mágico y narrativa social',
    description: 'Análisis textual de obras fundamentales (Gesta Bárbara, Augusto Céspedes, Gabriel García Márquez).',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'LC',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Comunicación Estratégica y Medios Masivos',
    title: 'El discurso oratorio, técnicas de debate argumentativo y análisis semiótico de redes y medios digitales',
    description: 'Desarrollo de oratoria formal, pensamiento crítico ante noticias falsas y ética discursiva.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },
  {
    subjectCode: 'LC',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 3,
    unitTitle: 'Investigación Académica y Redacción Científica',
    title: 'Monografía estudiantil, normas APA 7ma edición, citas bibliográficas y síntesis temática',
    description: 'Estructuración del marco teórico y redacción de artículos académicos comunitarios.',
    status: CurriculumStatus.PLANIFICADO,
    progressPercent: 0,
  },

  // ==========================================
  // COMUNIDAD Y SOCIEDAD: CIENCIAS SOCIALES (CSO)
  // ==========================================
  {
    subjectCode: 'CSO',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Historia y Geografía de Bolivia',
    title: 'Pueblos originarios y naciones precoloniales (Tiwanaku, Señoríos Aymaras y Culturas Amazónicas)',
    description: 'Comprende la organización socioeconómica y tecnológica del ayllu y la reciprocidad andina.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'CSO',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Formación Cívica y Derechos Fundamentales',
    title: 'Símbolos patrios, Constitución Política del Estado y deberes y derechos de niños, niñas y adolescentes',
    description: 'Fomento de la ciudadanía democrática, cultura de paz y despatriarcalización.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },
  {
    subjectCode: 'CSO',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 3,
    unitTitle: 'Geografía Física y Recursos Hídricos',
    title: 'Cuencas hidrográficas de Bolivia, departamentos, pisos ecológicos y zonas de producción',
    description: 'Mapeo y valoración de los recursos naturales renovables y no renovables del Estado Plurinacional.',
    status: CurriculumStatus.PLANIFICADO,
    progressPercent: 0,
  },
  {
    subjectCode: 'CSO',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Historia Contemporánea y Procesos de Liberación',
    title: 'La Revolución Nacional de 1952, reformas estructurales, dictaduras militares y recuperación democrática',
    description: 'Análisis sociopolítico de las luchas sociales, sindicales e indígenas del siglo XX en Bolivia.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'CSO',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Geopolítica y Economía Mundial',
    title: 'Modelos económicos mundiales, globalización, soberanía marítima boliviana y organismos internacionales',
    description: 'Debate de la integración regional sudamericana (CELAC, UNASUR) y el derecho al acceso oceánico.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 60,
  },
  {
    subjectCode: 'CSO',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 3,
    unitTitle: 'Estado Plurinacional y Autonomías',
    title: 'Descentralización, autonomías indígenas originarias campesinas y justicia comunitaria',
    description: 'Estudio de la ley de deslinde jurisdiccional y participación y control social.',
    status: CurriculumStatus.PLANIFICADO,
    progressPercent: 0,
  },

  // ==========================================
  // COMUNIDAD Y SOCIEDAD: LENGUA EXTRANJERA: INGLÉS (LEX)
  // ==========================================
  {
    subjectCode: 'LEX',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Greetings and Everyday Life',
    title: 'Personal pronouns, verb to be, family members, classroom objects and daily routines',
    description: 'Basic oral communication: introducing oneself and asking simple questions.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'LEX',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Action and Description',
    title: 'Present simple and continuous, adjectives for character and appearance, numbers up to 100',
    description: 'Describing daily activities, hobbies and physical traits in simple short dialogues.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },
  {
    subjectCode: 'LEX',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Past Events and Narratives',
    title: 'Past simple, past continuous, regular and irregular verbs in historic and personal storytelling',
    description: 'Narrating past experiences, historical events and biographical sketches in English.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'LEX',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Future Visions and Conditional Reasoning',
    title: 'Future forms (will / going to), modal verbs (must, should, could) and First Conditional',
    description: 'Expressing probability, future academic goals and ethical problem-solving discussions.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },

  // ==========================================
  // COMUNIDAD Y SOCIEDAD: ARTES PLÁSTICAS Y VISUALES (APV)
  // ==========================================
  {
    subjectCode: 'APV',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Dibujo Artístico y Teoría del Color',
    title: 'Círculo cromático, colores cálidos y fríos, texturas visuales y degradado tonal',
    description: 'Elaboración de composiciones paisajísticas con lápices de color, acuarelas y témperas.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'APV',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Modelado y Artesanía con Identidad',
    title: 'Modelado en arcilla y plastilina: vasijas ceremoniales, máscaras folclóricas y relieves',
    description: 'Rescate de iconografía precolombina y técnicas alfareras de las culturas bolivianas.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },
  {
    subjectCode: 'APV',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Dibujo Técnico y Geometría Descriptiva',
    title: 'Proyecciones ortogonales (vistas diédricas), escalas 1:50 y 1:100, acotación y perspectiva cónica',
    description: 'Trazado técnico instrumental para proyectos de arquitectura y diseño industrial.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'APV',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Pintura al Óleo, Acrílico y Muralismo Comunitario',
    title: 'Técnicas de composición mural, claroscuro, proporción áurea y arte urbano con mensaje social',
    description: 'Creación de murales escolares que promueven valores ecológicos y orgullo intercultural.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 60,
  },

  // ==========================================
  // COMUNIDAD Y SOCIEDAD: EDUCACIÓN MUSICAL (EMU)
  // ==========================================
  {
    subjectCode: 'EMU',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Lenguaje Musical e Himnos Patrios',
    title: 'Pentagrama, figuras rítmicas (redonda, blanca, negra), entonación del Himno Nacional y marchas',
    description: 'Desarrollo auditivo, métrica musical en compases de 2/4, 3/4 y técnica vocal coral.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'EMU',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Práctica Instrumental Comunitaria: Flauta Dulce y Zampoña',
    title: 'Escala de Do Mayor en flauta dulce y melodías del repertorio folclórico andino (kantu, huayño)',
    description: 'Ejecución en ensamble instrumental promoviendo la armonía colectiva y sincronización.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },
  {
    subjectCode: 'EMU',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Historia y Ritmos de la Música Tradicional de Bolivia',
    title: 'Música de las tres zonas geográficas: cueca, taquirari, caporal, tinku y chovena',
    description: 'Análisis armónico, formas musicales folclóricas e interpretación de guitarra y charango.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'EMU',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Composición y Creación Sonora Digital',
    title: 'Acordes tríadas, funciones tonales (I-IV-V), software de edición musical y paisajes sonoros',
    description: 'Grabación de pistas instrumentales y producción de piezas musicales estudiantiles.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 60,
  },

  // ==========================================
  // COMUNIDAD Y SOCIEDAD: EDUCACIÓN FÍSICA Y DEPORTES (EFD)
  // ==========================================
  {
    subjectCode: 'EFD',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Acondicionamiento Físico Básico y Atletismo',
    title: 'Carreras de velocidad (50m, 100m), saltos en longitud, relevos y ejercicios de flexibilidad',
    description: 'Mejora de la resistencia cardiorrespiratoria, postura corporal y trabajo aeróbico.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'EFD',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Deportes Colectivos I: Fútbol de Salón y Básquetbol',
    title: 'Fundamentos técnicos: pase, recepción, dribleo, tiro al arco/canasta y juego limpio (fair play)',
    description: 'Práctica del compañerismo, trabajo en equipo y respeto a las reglas deportivas.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 80,
  },
  {
    subjectCode: 'EFD',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 1,
    unitTitle: 'Voleibol y Táctica Deportiva Avanzada',
    title: 'Digitación, antebrazo, saque alto, remate, bloqueo y rotaciones reglamentarias de voleibol',
    description: 'Desarrollo de estrategias de juego ofensivo y defensivo en torneos intercolegiales.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'EFD',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Comunidad y Sociedad',
    periodNumber: 2,
    unitTitle: 'Salud Integral, Nutrición Deportiva y Primeros Auxilios',
    title: 'Índice de masa corporal (IMC), hidratación, prevención de lesiones y maniobras de RCP básica',
    description: 'Promoción del hábito de vida saludable y prevención del sedentarismo en jóvenes.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 75,
  },

  // ==========================================
  // COSMOS Y PENSAMIENTO: COSMOVISIONES, FILOSOFÍA Y PSICOLOGÍA (CFS)
  // ==========================================
  {
    subjectCode: 'CFS',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 1,
    unitTitle: 'Introducción al Pensamiento Filosófico',
    title: 'El asombro filosófico, mitos cosmogónicos, filosofía presocrática y pensamiento andino del Vivir Bien',
    description: 'Comparación entre la filosofía occidental tradicional y la ontología holística originaria.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'CFS',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 2,
    unitTitle: 'Lógica Simbólica y Razonamiento Crítico',
    title: 'Tablas de verdad, falacias no formales, silogismos aristotélicos y argumentación válida',
    description: 'Desarrollo del rigor deductivo para detectar manipulaciones en discursos mediáticos.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },
  {
    subjectCode: 'CFS',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 3,
    unitTitle: 'Psicología del Desarrollo y Proyecto de Vida',
    title: 'Identidad en la adolescencia, inteligencia emocional, autoestima y orientación vocacional',
    description: 'Diseño del plan de vida ético-profesional y toma de decisiones autónomas y reflexivas.',
    status: CurriculumStatus.PLANIFICADO,
    progressPercent: 0,
  },

  // ==========================================
  // COSMOS Y PENSAMIENTO: VALORES, ESPIRITUALIDADES Y RELIGIONES (VER)
  // ==========================================
  {
    subjectCode: 'VER',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 1,
    unitTitle: 'Valores Sociocomunitarios y Convivencia Armónica',
    title: 'Ama suwa, ama llulla, ama qhilla (no seas ladrón, no seas mentiroso, no seas flojo) y solidaridad escolar',
    description: 'Práctica diaria de valores ancestrales y respeto a los adultos mayores y la familia.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'VER',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 2,
    unitTitle: 'Espiritualidad de los Pueblos Indígenas Originarios',
    title: 'Ritos de agradecimiento a la Pachamama, respeto a los achachilas y la armonía con la naturaleza',
    description: 'Comprensión del diálogo interreligioso y la libertad de culto consagrada constitucionalmente.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 75,
  },
  {
    subjectCode: 'VER',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 1,
    unitTitle: 'Grandes Tradiciones Religiosas y Espirituales del Mundo',
    title: 'Cristianismo, Budismo, Judaísmo, Islam y cosmovisiones indígenas: aportes éticos a la humanidad',
    description: 'Análisis ecuménico enfocado en los derechos humanos, tolerancia y erradicación del odio.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'VER',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Cosmos y Pensamiento',
    periodNumber: 2,
    unitTitle: 'Bioética y Responsabilidad Social Comunitaria',
    title: 'Dilemas éticos contemporáneos: justicia social, ecología integral y servicio solidario al prójimo',
    description: 'Ejecución de proyectos de voluntariado y apoyo comunitario en asilos o barrios vulnerables.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },

  // ==========================================
  // CIENCIA, TECNOLOGÍA Y PRODUCCIÓN: TÉCNICA TECNOLÓGICA (TTG)
  // ==========================================
  {
    subjectCode: 'TTG',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 1,
    unitTitle: 'Ofimática y Alfabetización Digital Segura',
    title: 'Procesador de textos, mecanografía digital, normas de seguridad y prevención de ciberacoso (grooming)',
    description: 'Uso ético y productivo de herramientas tecnológicas y navegación segura en internet.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'TTG',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 2,
    unitTitle: 'Pensamiento Computacional y Robótica Educativa Inicial',
    title: 'Algoritmos simples, secuencias lógicas con Scratch y armado de mecanismos con poleas y engranajes',
    description: 'Resolución de problemas interactivos programando historias animadas y prototipos mecánicos.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },
  {
    subjectCode: 'TTG',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 1,
    unitTitle: 'Programación Web y Electrónica con Arduino',
    title: 'Fundamentos de HTML5/CSS3, sensores analógicos y digitales, placas Arduino y lógica de control',
    description: 'Automatización de pequeños proyectos: domótica escolar y sistemas de riego automatizado.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'TTG',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 2,
    unitTitle: 'Gestión de Proyectos Productivos Sociocomunitarios (PSP)',
    title: 'Emprendimiento, modelo Canvas, estudio de costos, marketing digital y planes de negocio cooperativos',
    description: 'Formulación de proyectos productivos con valor agregado para responder a necesidades locales.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },

  // ==========================================
  // CIENCIA, TECNOLOGÍA Y PRODUCCIÓN: MATEMÁTICA (MAT)
  // ==========================================
  {
    subjectCode: 'MAT',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 1,
    unitTitle: 'Aritmética y Números Naturales en la Vida Cotidiana',
    title: 'Operaciones combinadas de adición, sustracción, multiplicación y división con números hasta seis cifras',
    description: 'Resolución de problemas de compra-venta y presupuestos familiares comunitarios.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'MAT',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 2,
    unitTitle: 'Fracciones, Decimales y Geometría Plana',
    title: 'Fracciones equivalentes, operaciones con números decimales, cálculo de áreas y perímetros de polígonos',
    description: 'Medición de terrenos escolares y proporcionalidad aplicada a recetas e ingredientes.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 70,
  },
  {
    subjectCode: 'MAT',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 1,
    unitTitle: 'Álgebra Polinómica y Ecuaciones Lineales',
    title: 'Factorización de polinomios, productos notables y sistemas de ecuaciones lineales 2x2 y 3x3',
    description: 'Modelación matemática de problemáticas financieras y de optimización de recursos.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'MAT',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Ciencia, Tecnología y Producción',
    periodNumber: 2,
    unitTitle: 'Trigonometría Plana y Geometría Analítica',
    title: 'Funciones trigonométricas, ley de senos y cosenos, ecuación de la recta y cónicas en el plano cartesiano',
    description: 'Determinación de alturas inaccesibles y levantamientos topográficos con teodolitos caseros.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },

  // ==========================================
  // VIDA TIERRA TERRITORIO: CIENCIAS NATURALES (CNA / BIO)
  // ==========================================
  {
    subjectCode: 'CNA',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Vida Tierra Territorio',
    periodNumber: 1,
    unitTitle: 'Anatomía Humana y Salud Preventiva',
    title: 'Sistemas digestivo, circulatorio, respiratorio y reproductor humano, nutrición y prevención de enfermedades',
    description: 'Hábitos de higiene, dieta equilibrada basada en alimentos andino-amazónicos (quinua, tarwi, amaranto).',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'CNA',
    gradeLevels: [5, 6, 7, 8, 9, 10],
    campo: 'Vida Tierra Territorio',
    periodNumber: 2,
    unitTitle: 'Ecología y Biodiversidad de los Pisos Ecológicos',
    title: 'Cadenas tróficas, flora y fauna endémica de Bolivia, conservación de cuencas y gestión de residuos',
    description: 'Campañas escolares de reciclaje y cuidado de las reservas naturales de la biosfera.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 75,
  },
  {
    subjectCode: 'BIO',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Vida Tierra Territorio',
    periodNumber: 1,
    unitTitle: 'Biología Celular y Genética Molecular',
    title: 'Estructura celular (procariota y eucariota), ciclo celular (mitosis y meiosis), replicación del ADN y leyes de Mendel',
    description: 'Observación en microscopio óptico y análisis bioético de la manipulación genética moderna.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'BIO',
    gradeLevels: [11, 12, 13, 14, 15, 16],
    campo: 'Vida Tierra Territorio',
    periodNumber: 2,
    unitTitle: 'Fisiología de los Seres Vivos y Ecología Aplicada',
    title: 'Sistemas nervioso y endocrino, inmunología, cambio climático global y bioclimatología andina',
    description: 'Evaluación del impacto del calentamiento global en el deshielo de glaciares bolivianos.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 65,
  },

  // ==========================================
  // VIDA TIERRA TERRITORIO: FÍSICA (FIS)
  // ==========================================
  {
    subjectCode: 'FIS',
    gradeLevels: [13, 14, 15, 16],
    campo: 'Vida Tierra Territorio',
    periodNumber: 1,
    unitTitle: 'Cinemática Vectorial y Movimiento',
    title: 'Vectores en dos y tres dimensiones, MRU, MRUV, tiro parabólico y movimiento circular uniforme',
    description: 'Medición experimental de trayectorias, aceleración y velocidad en el laboratorio escolar.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'FIS',
    gradeLevels: [13, 14, 15, 16],
    campo: 'Vida Tierra Territorio',
    periodNumber: 2,
    unitTitle: 'Dinámica, Energía Mecánica y Termodinámica',
    title: 'Leyes de Newton, rozamiento estático/cinético, trabajo, energía potencial y cinética, calor y temperatura',
    description: 'Cálculo de eficiencia energética en máquinas simples y energías renovables (solar y eólica).',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 60,
  },

  // ==========================================
  // VIDA TIERRA TERRITORIO: QUÍMICA (QUI)
  // ==========================================
  {
    subjectCode: 'QUI',
    gradeLevels: [13, 14, 15, 16],
    campo: 'Vida Tierra Territorio',
    periodNumber: 1,
    unitTitle: 'Estructura Atómica y Enlace Químico',
    title: 'Teoría atómica cuántica, tabla periódica moderna, enlaces iónicos, covalentes y metálicos',
    description: 'Relación entre la estructura molecular y las propiedades físicas y químicas de los materiales.',
    status: CurriculumStatus.COMPLETADO,
    progressPercent: 100,
  },
  {
    subjectCode: 'QUI',
    gradeLevels: [13, 14, 15, 16],
    campo: 'Vida Tierra Territorio',
    periodNumber: 2,
    unitTitle: 'Nomenclatura Inorgánica y Reacciones Químicas',
    title: 'Formulación de óxidos, hidróxidos, ácidos y sales; balanceo de ecuaciones químicas por tanteo y redox',
    description: 'Experimentación de laboratorio: preparación de soluciones molares y titulación ácido-base.',
    status: CurriculumStatus.EN_DESARROLLO,
    progressPercent: 60,
  },
];

async function seedDiverseCurriculum() {
  console.log('🚀 Iniciando siembra de Avance Curricular diverso e integral...');

  const academicYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
  });

  if (!academicYear) {
    throw new Error('No se encontró gestión académica activa.');
  }

  // Obtener cursos y materias
  const [courses, subjects] = await Promise.all([
    prisma.course.findMany({ where: { academicYearId: academicYear.id } }),
    prisma.subject.findMany(),
  ]);

  const subjectMap = new Map<string, string>(); // code -> id
  subjects.forEach((s) => subjectMap.set(s.code, s.id));

  // Mapa de cursos por gradeLevel
  const coursesByGrade = new Map<number, string[]>();
  courses.forEach((c) => {
    const list = coursesByGrade.get(c.gradeLevel) || [];
    list.push(c.id);
    coursesByGrade.set(c.gradeLevel, list);
  });

  // Limpiar temas previos para reemplazarlos con la oferta completa y diversa
  const deleted = await prisma.curriculumTopic.deleteMany({
    where: { academicYearId: academicYear.id },
  });
  console.log(`🧹 Eliminados ${deleted.count} temas previos desactualizados.`);

  let insertedCount = 0;

  for (const item of DIVERSE_CURRICULUM_DATA) {
    const subjectId = subjectMap.get(item.subjectCode);
    if (!subjectId) {
      console.warn(`⚠️ Materia con código ${item.subjectCode} no encontrada. Saltando...`);
      continue;
    }

    // Por cada gradeLevel al que aplica este tema
    for (const gLevel of item.gradeLevels) {
      const courseIds = coursesByGrade.get(gLevel) || [];

      if (courseIds.length === 0) {
        // Si no hay curso con ese gradeLevel, crear registro a nivel de grado general
        await prisma.curriculumTopic.create({
          data: {
            subjectId,
            courseId: null,
            academicYearId: academicYear.id,
            periodNumber: item.periodNumber,
            gradeLevel: gLevel,
            campo: item.campo,
            unitTitle: item.unitTitle,
            title: item.title,
            description: item.description,
            progressPercent: item.progressPercent,
            status: item.status,
          },
        });
        insertedCount++;
      } else {
        // Asociar a cada curso de ese nivel
        for (const cId of courseIds) {
          await prisma.curriculumTopic.create({
            data: {
              subjectId,
              courseId: cId,
              academicYearId: academicYear.id,
              periodNumber: item.periodNumber,
              gradeLevel: gLevel,
              campo: item.campo,
              unitTitle: item.unitTitle,
              title: item.title,
              description: item.description,
              progressPercent: item.progressPercent,
              status: item.status,
            },
          });
          insertedCount++;
        }
      }
    }
  }

  console.log(`✅ ¡Se insertaron exitosamente ${insertedCount} temas curriculares diversos!`);
}

seedDiverseCurriculum()
  .catch((e) => {
    console.error('❌ Error sembrando contenidos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
