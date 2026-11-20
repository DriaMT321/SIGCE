import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../domain/entities/registrosacademicos.dart';

/// Pantalla del Calendario Académico Integrado con Tareas y Exámenes
class pantallacalendario extends ConsumerStatefulWidget {
  const pantallacalendario({super.key});

  @override
  ConsumerState<pantallacalendario> createState() => _pantallacalendarioestado();
}

class _pantallacalendarioestado extends ConsumerState<pantallacalendario> {
  late DateTime _mesActual;
  DateTime? _diaSeleccionado;

  // Filtros
  String _filtroAudiencia = 'TODOS'; // TODOS, ESTUDIANTES, PADRES, PROFESORES
  String _filtroPlazo = 'MES'; // MES, HOY, SEMANA, TODO
  String _filtroTipo = 'TODOS'; // TODOS, TAREAS, EVENTOS

  late Future<
      (resultadoencache<List<eventoacademico>>,
       resultadoencache<List<resumendeasignacion>>)> _futuroDatos;

  @override
  void initState() {
    super.initState();
    final ahora = DateTime.now();
    _mesActual = DateTime(ahora.year, ahora.month, 1);
    _diaSeleccionado = DateTime(ahora.year, ahora.month, ahora.day);
    _cargarDatos();
  }

  void _cargarDatos() {
    final casoEventos = ref.read(proveedorobtenereventosacademicosencache);
    final casoAsignaciones = ref.read(proveedorobtenerasignacionesencache);

    _futuroDatos = Future.wait([
      casoEventos.ejecutar(),
      casoAsignaciones.ejecutar(),
    ]).then((resultados) {
      return (
        resultados[0] as resultadoencache<List<eventoacademico>>,
        resultados[1] as resultadoencache<List<resumendeasignacion>>,
      );
    });
  }

  void _cambiarMes(int delta) {
    setState(() {
      _mesActual = DateTime(_mesActual.year, _mesActual.month + delta, 1);
      _diaSeleccionado = DateTime(_mesActual.year, _mesActual.month, 1);
    });
  }

  void _irAHoy() {
    final ahora = DateTime.now();
    setState(() {
      _mesActual = DateTime(ahora.year, ahora.month, 1);
      _diaSeleccionado = DateTime(ahora.year, ahora.month, ahora.day);
    });
  }

  void _abrirdestino(int indice) {
    switch (indice) {
      case 0:
        context.go('/students');
      case 1:
        context.go('/assignments');
      case 2:
        context.go('/schedules');
      case 3:
        context.go('/announcements');
      case 4:
        context.go('/profile');
    }
  }

  bool _esMismoDia(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  String _formatearFecha(DateTime fecha) {
    final d = fecha.day.toString().padLeft(2, '0');
    final m = fecha.month.toString().padLeft(2, '0');
    final y = fecha.year.toString();
    return '$d/$m/$y';
  }

  String _nombreMes(int mes) {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];
    return meses[mes - 1];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/brand/logo-sf.png',
              height: 28,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(Icons.school, size: 24),
            ),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                'Calendario Académico',
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Ir al día de hoy',
            icon: const Icon(Icons.today),
            onPressed: _irAHoy,
          ),
          IconButton(
            tooltip: 'Actualizar',
            icon: const Icon(Icons.refresh),
            onPressed: () => setState(_cargarDatos),
          ),
        ],
      ),
      body: FutureBuilder<
          (resultadoencache<List<eventoacademico>>,
           resultadoencache<List<resumendeasignacion>>)>(
        future: _futuroDatos,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return estadomensaje(
              icono: Icons.error_outline,
              titulo: 'No se pudo cargar el calendario.',
              mensaje: 'Verifica tu conexión a internet e inténtalo nuevamente.',
              textoBoton: 'Reintentar',
              alpresionar: () => setState(_cargarDatos),
            );
          }

          final (eventosCache, asignacionesCache) = snapshot.data!;
          final eventos = eventosCache.datos;
          final asignaciones = asignacionesCache.datos;
          final estaOffline = eventosCache.estaoffline || asignacionesCache.estaoffline;

          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargarDatos);
              await _futuroDatos;
            },
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              children: [
                if (estaOffline) ...[
                  const avisosinconexion(),
                  const SizedBox(height: 12),
                ],

                const introduccionpagina(
                  titulo: 'Calendario y Actividades',
                  subtitulo:
                      'Actividades escolares, reuniones, evaluaciones y tareas asignadas por docentes.',
                ),
                const SizedBox(height: 12),

                // BARRA 1: FILTRO DE AUDIENCIA / DESTINATARIOS
                _construirFiltroAudiencia(),
                const SizedBox(height: 8),

                // BARRA 2: FILTRO DE PLAZO
                _construirFiltroPlazo(),
                const SizedBox(height: 12),

                // NAVEGACIÓN DE MES
                _construirControlMes(),
                const SizedBox(height: 10),

                // CUADRÍCULA DE DÍAS DEL MES
                _construirCuadriculaCalendario(eventos, asignaciones),
                const SizedBox(height: 16),

                // LISTA DE ACTIVIDADES Y TAREAS FILTRADAS
                _construirListaActividades(eventos, asignaciones),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 2,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _construirFiltroAudiencia() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          const Text(
            'Para: ',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: temaaplicacion.tintatenue,
            ),
          ),
          const SizedBox(width: 4),
          _pildoraFiltro(
            label: 'Todos',
            activo: _filtroAudiencia == 'TODOS',
            onTap: () => setState(() => _filtroAudiencia = 'TODOS'),
          ),
          const SizedBox(width: 6),
          _pildoraFiltro(
            label: 'Estudiantes',
            activo: _filtroAudiencia == 'ESTUDIANTES',
            icono: Icons.backpack_outlined,
            onTap: () => setState(() => _filtroAudiencia = 'ESTUDIANTES'),
          ),
          const SizedBox(width: 6),
          _pildoraFiltro(
            label: 'Padres',
            activo: _filtroAudiencia == 'PADRES',
            icono: Icons.family_restroom,
            onTap: () => setState(() => _filtroAudiencia = 'PADRES'),
          ),
          const SizedBox(width: 6),
          _pildoraFiltro(
            label: 'Profesores',
            activo: _filtroAudiencia == 'PROFESORES',
            icono: Icons.school_outlined,
            onTap: () => setState(() => _filtroAudiencia = 'PROFESORES'),
          ),
        ],
      ),
    );
  }

  Widget _construirFiltroPlazo() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          const Text(
            'Plazo: ',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: temaaplicacion.tintatenue,
            ),
          ),
          const SizedBox(width: 4),
          _pildoraFiltro(
            label: 'Este mes',
            activo: _filtroPlazo == 'MES',
            onTap: () => setState(() => _filtroPlazo = 'MES'),
          ),
          const SizedBox(width: 6),
          _pildoraFiltro(
            label: 'Hoy',
            activo: _filtroPlazo == 'HOY',
            onTap: () {
              final ahora = DateTime.now();
              setState(() {
                _filtroPlazo = 'HOY';
                _diaSeleccionado = DateTime(ahora.year, ahora.month, ahora.day);
                _mesActual = DateTime(ahora.year, ahora.month, 1);
              });
            },
          ),
          const SizedBox(width: 6),
          _pildoraFiltro(
            label: 'Próximos 7 días',
            activo: _filtroPlazo == 'SEMANA',
            onTap: () => setState(() => _filtroPlazo = 'SEMANA'),
          ),
          const SizedBox(width: 6),
          _pildoraFiltro(
            label: 'Todas las fechas',
            activo: _filtroPlazo == 'TODO',
            onTap: () => setState(() => _filtroPlazo = 'TODO'),
          ),
        ],
      ),
    );
  }

  Widget _pildoraFiltro({
    required String label,
    required bool activo,
    required VoidCallback onTap,
    IconData? icono,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: activo ? temaaplicacion.marca : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: activo ? temaaplicacion.marca : temaaplicacion.borde,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icono != null) ...[
              Icon(
                icono,
                size: 13,
                color: activo ? Colors.white : temaaplicacion.tintatenue,
              ),
              const SizedBox(width: 4),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: activo ? FontWeight.w800 : FontWeight.w600,
                color: activo ? Colors.white : temaaplicacion.tinta,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _construirControlMes() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: temaaplicacion.borde),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            iconSize: 20,
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
            onPressed: () => _cambiarMes(-1),
          ),
          Text(
            '${_nombreMes(_mesActual.month)} ${_mesActual.year}',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: temaaplicacion.tinta,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            iconSize: 20,
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
            onPressed: () => _cambiarMes(1),
          ),
        ],
      ),
    );
  }

  Widget _construirCuadriculaCalendario(
    List<eventoacademico> eventos,
    List<resumendeasignacion> asignaciones,
  ) {
    const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    final primerDiaMes = DateTime(_mesActual.year, _mesActual.month, 1);
    final diasEnMes = DateTime(_mesActual.year, _mesActual.month + 1, 0).day;
    final diaSemanaInicio = primerDiaMes.weekday; // 1 = Lunes, 7 = Domingo

    final celdas = <Widget>[];

    // Encabezados Lun - Dom
    for (final dia in diasSemana) {
      celdas.add(
        Center(
          child: Text(
            dia,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: temaaplicacion.tintatenue,
            ),
          ),
        ),
      );
    }

    // Celdas vacías antes del primer día
    for (var i = 1; i < diaSemanaInicio; i++) {
      celdas.add(const SizedBox.shrink());
    }

    final hoy = DateTime.now();

    // Días del mes
    for (var dia = 1; dia <= diasEnMes; dia++) {
      final fechaDia = DateTime(_mesActual.year, _mesActual.month, dia);
      final esHoy = _esMismoDia(fechaDia, hoy);
      final esSeleccionado = _diaSeleccionado != null && _esMismoDia(fechaDia, _diaSeleccionado!);

      // Conteo de eventos y tareas para este día
      final tieneEventos = eventos.any((e) =>
          _esMismoDia(e.fechainicio, fechaDia) ||
          (fechaDia.isAfter(e.fechainicio) && fechaDia.isBefore(e.fechafin.add(const Duration(days: 1)))));
      final tieneTareas = asignaciones.any((a) => _esMismoDia(a.fechalimite, fechaDia));

      celdas.add(
        InkWell(
          onTap: () {
            setState(() {
              _diaSeleccionado = fechaDia;
              _filtroPlazo = 'MES';
            });
          },
          borderRadius: BorderRadius.circular(8),
          child: Container(
            margin: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: esSeleccionado
                  ? temaaplicacion.marca
                  : (esHoy ? temaaplicacion.fondomarca : Colors.transparent),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: esSeleccionado
                    ? temaaplicacion.marca
                    : (esHoy ? temaaplicacion.marca.withValues(alpha: 0.4) : Colors.transparent),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  dia.toString(),
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: esSeleccionado || esHoy ? FontWeight.w800 : FontWeight.w600,
                    color: esSeleccionado
                        ? Colors.white
                        : (esHoy ? temaaplicacion.marca : temaaplicacion.tinta),
                  ),
                ),
                if (tieneEventos || tieneTareas) ...[
                  const SizedBox(height: 2),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (tieneEventos)
                        Container(
                          width: 4,
                          height: 4,
                          margin: const EdgeInsets.symmetric(horizontal: 1),
                          decoration: BoxDecoration(
                            color: esSeleccionado ? Colors.amberAccent : Colors.amber.shade700,
                            shape: BoxShape.circle,
                          ),
                        ),
                      if (tieneTareas)
                        Container(
                          width: 4,
                          height: 4,
                          margin: const EdgeInsets.symmetric(horizontal: 1),
                          decoration: BoxDecoration(
                            color: esSeleccionado ? Colors.lightBlueAccent : Colors.indigo.shade600,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: temaaplicacion.borde),
      ),
      child: Column(
        children: [
          GridView.count(
            crossAxisCount: 7,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.1,
            children: celdas,
          ),
          const Divider(height: 20, thickness: 0.5),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(width: 6, height: 6, decoration: BoxDecoration(color: Colors.amber.shade700, shape: BoxShape.circle)),
              const SizedBox(width: 4),
              const Text('Evento escolar', style: TextStyle(fontSize: 10, color: temaaplicacion.tintatenue)),
              const SizedBox(width: 14),
              Container(width: 6, height: 6, decoration: BoxDecoration(color: Colors.indigo.shade600, shape: BoxShape.circle)),
              const SizedBox(width: 4),
              const Text('Tarea o Examen', style: TextStyle(fontSize: 10, color: temaaplicacion.tintatenue)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _construirListaActividades(
    List<eventoacademico> todosEventos,
    List<resumendeasignacion> todasAsignaciones,
  ) {
    final hoy = DateTime.now();

    // 1. Filtrar por plazo
    final eventosFiltrados = todosEventos.filter((e) {
      if (_filtroPlazo == 'HOY') {
        return _esMismoDia(e.fechainicio, hoy);
      }
      if (_filtroPlazo == 'SEMANA') {
        final limite = hoy.add(const Duration(days: 7));
        return e.fechainicio.isAfter(hoy.subtract(const Duration(days: 1))) &&
            e.fechainicio.isBefore(limite);
      }
      if (_filtroPlazo == 'MES') {
        if (_diaSeleccionado != null) {
          return _esMismoDia(e.fechainicio, _diaSeleccionado!) ||
              (_diaSeleccionado!.isAfter(e.fechainicio) &&
                  _diaSeleccionado!.isBefore(e.fechafin.add(const Duration(days: 1))));
        }
        return e.fechainicio.year == _mesActual.year && e.fechainicio.month == _mesActual.month;
      }
      return true;
    }).where((e) {
      // 2. Filtrar por audiencia
      if (_filtroAudiencia == 'TODOS') return true;
      if (_filtroAudiencia == 'ESTUDIANTES') {
        return e.audiencia == 'ESTUDIANTES' || e.audiencia == 'TODOS' || !e.esInstitucional;
      }
      if (_filtroAudiencia == 'PADRES') {
        return e.audiencia == 'PADRES' || e.audiencia == 'TODOS' || e.tipo == 'REUNION';
      }
      if (_filtroAudiencia == 'PROFESORES') {
        return e.audiencia == 'PROFESORES' || e.audiencia == 'TODOS' || e.tipo == 'ACTIVIDAD';
      }
      return true;
    }).toList();

    // Tareas y Exámenes creados por profesores para estudiantes
    final asignacionesFiltradas = todasAsignaciones.filter((a) {
      // Las tareas están orientadas principalmente a estudiantes y padres (seguimiento)
      if (_filtroAudiencia == 'PROFESORES') return false;

      if (_filtroPlazo == 'HOY') {
        return _esMismoDia(a.fechalimite, hoy);
      }
      if (_filtroPlazo == 'SEMANA') {
        final limite = hoy.add(const Duration(days: 7));
        return a.fechalimite.isAfter(hoy.subtract(const Duration(days: 1))) &&
            a.fechalimite.isBefore(limite);
      }
      if (_filtroPlazo == 'MES') {
        if (_diaSeleccionado != null) {
          return _esMismoDia(a.fechalimite, _diaSeleccionado!);
        }
        return a.fechalimite.year == _mesActual.year && a.fechalimite.month == _mesActual.month;
      }
      return true;
    }).toList();

    final totalItems = eventosFiltrados.length + asignacionesFiltradas.length;

    String encabezado;
    if (_filtroPlazo == 'HOY') {
      encabezado = 'Actividades para Hoy (${_formatearFecha(hoy)})';
    } else if (_filtroPlazo == 'SEMANA') {
      encabezado = 'Próximos 7 días';
    } else if (_diaSeleccionado != null) {
      encabezado = 'Actividades del ${_formatearFecha(_diaSeleccionado!)}';
    } else {
      encabezado = 'Actividades del mes';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              encabezado,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: temaaplicacion.tinta,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: temaaplicacion.fondomarca,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '$totalItems',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: temaaplicacion.marca,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        if (totalItems == 0)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: temaaplicacion.borde),
            ),
            child: const Center(
              child: Column(
                children: [
                  Icon(Icons.event_available, size: 36, color: temaaplicacion.tintatenue),
                  SizedBox(height: 8),
                  Text(
                    'No hay actividades ni tareas registradas para esta selección.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: temaaplicacion.tintatenue),
                  ),
                ],
              ),
            ),
          )
        else ...[
          // 1. Tareas y Exámenes asignados por docentes
          ...asignacionesFiltradas.map((tarea) => _construirTarjetaTarea(tarea)),

          // 2. Eventos escolares
          ...eventosFiltrados.map((evento) => _construirTarjetaEvento(evento)),
        ],
      ],
    );
  }

  Widget _construirTarjetaTarea(resumendeasignacion tarea) {
    final esExamen = tarea.tipo == 'EXAMEN';
    final fechaLimiteStr = _formatearFecha(tarea.fechalimite);
    final horaStr =
        '${tarea.fechalimite.hour.toString().padLeft(2, '0')}:${tarea.fechalimite.minute.toString().padLeft(2, '0')}';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: esExamen ? Colors.indigo.shade200 : temaaplicacion.borde,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _mostrarDetalleTarea(tarea),
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: esExamen ? Colors.indigo.shade50 : Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: esExamen ? Colors.indigo.shade200 : Colors.blue.shade200,
                    ),
                  ),
                  child: Icon(
                    esExamen ? Icons.quiz_outlined : Icons.assignment_outlined,
                    color: esExamen ? Colors.indigo.shade700 : Colors.blue.shade700,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: esExamen ? Colors.indigo.shade50 : Colors.blue.shade50,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              tarea.tiponormalizado.toUpperCase(),
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color: esExamen ? Colors.indigo.shade800 : Colors.blue.shade800,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              tarea.nombremateria,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: temaaplicacion.tintatenue,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        tarea.titulo,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: temaaplicacion.tinta,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Row(
                        children: [
                          const Icon(Icons.person_outline, size: 12, color: temaaplicacion.tintatenue),
                          const SizedBox(width: 3),
                          Expanded(
                            child: Text(
                              tarea.nombredocente,
                              style: const TextStyle(
                                fontSize: 11,
                                color: temaaplicacion.tintatenue,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Text(
                            '$fechaLimiteStr $horaStr',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: tarea.esvencida ? Colors.rose : temaaplicacion.tinta,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _construirTarjetaEvento(eventoacademico evento) {
    final horaInicio =
        '${evento.fechainicio.hour.toString().padLeft(2, '0')}:${evento.fechainicio.minute.toString().padLeft(2, '0')}';
    final fechaInicioStr = _formatearFecha(evento.fechainicio);

    final colorFondo = switch (evento.tipo) {
      'REUNION' => Colors.indigo.shade50,
      'ACTO_ESCOLAR' => Colors.purple.shade50,
      'SUSPENSION_CLASES' => Colors.rose.shade50,
      _ => Colors.emerald.shade50,
    };

    final colorTexto = switch (evento.tipo) {
      'REUNION' => Colors.indigo.shade800,
      'ACTO_ESCOLAR' => Colors.purple.shade800,
      'SUSPENSION_CLASES' => Colors.rose.shade800,
      _ => Colors.emerald.shade800,
    };

    final icono = switch (evento.tipo) {
      'REUNION' => Icons.groups_outlined,
      'ACTO_ESCOLAR' => Icons.flag_outlined,
      'SUSPENSION_CLASES' => Icons.warning_amber_rounded,
      _ => Icons.calendar_today_outlined,
    };

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: temaaplicacion.borde),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: colorFondo,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icono, color: colorTexto, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: colorFondo,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          evento.tiponormalizado.toUpperCase(),
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: colorTexto,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      if (evento.audiencia != 'TODOS')
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: Colors.slate.shade100,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            evento.audiencia,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: Colors.slate.shade700,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    evento.titulo,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: temaaplicacion.tinta,
                    ),
                  ),
                  if (evento.descripcion != null && evento.descripcion!.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      evento.descripcion!,
                      style: const TextStyle(
                        fontSize: 11,
                        color: temaaplicacion.tintatenue,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (evento.lugar != null && evento.lugar!.isNotEmpty) ...[
                        const Icon(Icons.location_on_outlined, size: 12, color: temaaplicacion.tintatenue),
                        const SizedBox(width: 2),
                        Text(
                          evento.lugar!,
                          style: const TextStyle(fontSize: 11, color: temaaplicacion.tintatenue),
                        ),
                        const Spacer(),
                      ] else ...[
                        const Spacer(),
                      ],
                      Text(
                        evento.tododia ? '$fechaInicioStr (Todo el día)' : '$fechaInicioStr $horaInicio',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: temaaplicacion.tinta,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _mostrarDetalleTarea(resumendeasignacion tarea) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: tarea.tipo == 'EXAMEN' ? Colors.indigo.shade50 : Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${tarea.tiponormalizado} · ${tarea.nombremateria}',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: tarea.tipo == 'EXAMEN' ? Colors.indigo.shade800 : Colors.blue.shade800,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                tarea.titulo,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: temaaplicacion.tinta,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.person, size: 14, color: temaaplicacion.marca),
                  const SizedBox(width: 4),
                  Text(
                    'Profesor: ${tarea.nombredocente}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.alarm, size: 14, color: temaaplicacion.tintatenue),
                  const SizedBox(width: 4),
                  Text(
                    'Entrega límite: ${_formatearFecha(tarea.fechalimite)} ${tarea.fechalimite.hour.toString().padLeft(2, '0')}:${tarea.fechalimite.minute.toString().padLeft(2, '0')}',
                    style: const TextStyle(fontSize: 12, color: temaaplicacion.tintatenue),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (tarea.descripcion.isNotEmpty) ...[
                const Text(
                  'Instrucciones del profesor:',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 4),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.slate.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: temaaplicacion.borde),
                  ),
                  child: Text(
                    tarea.descripcion,
                    style: const TextStyle(fontSize: 12, height: 1.4),
                  ),
                ),
                const SizedBox(height: 14),
              ],
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Puntaje Máximo', style: TextStyle(fontSize: 10, color: temaaplicacion.tintatenue)),
                      Text('${tarea.puntajemaximo.toStringAsFixed(0)} pts', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                    ],
                  ),
                  if (tarea.notaObtenida != null)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('Calificación', style: TextStyle(fontSize: 10, color: temaaplicacion.tintatenue)),
                        Text('${tarea.notaObtenida} / ${tarea.puntajemaximo.toStringAsFixed(0)}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Colors.emerald)),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    context.go('/assignments');
                  },
                  icon: const Icon(Icons.arrow_forward),
                  label: const Text('Ir a la sección de Tareas'),
                  style: FilledButton.styleFrom(
                    backgroundColor: temaaplicacion.marca,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

extension _ListFilter<T> on List<T> {
  List<T> filter(bool Function(T) test) {
    return where(test).toList();
  }
}
