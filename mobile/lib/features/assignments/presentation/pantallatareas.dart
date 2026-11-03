import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../academic/domain/entities/registrosacademicos.dart';

class pantallatareas extends ConsumerStatefulWidget {
  const pantallatareas({super.key, this.materiaInicial});

  final String? materiaInicial;

  @override
  ConsumerState<pantallatareas> createState() => _pantallatareasestado();
}

class _pantallatareasestado extends ConsumerState<pantallatareas> {
  late Future<resultadoencache<List<resumendeasignacion>>> _futuroasignaciones;
  String _filtro = 'TODAS'; // TODAS, PENDIENTES, EXAMENES, PRACTICOS
  String? _materiaFiltro;

  @override
  void initState() {
    super.initState();
    _materiaFiltro = widget.materiaInicial;
    _cargartareas();
  }

  @override
  void didUpdateWidget(covariant pantallatareas oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.materiaInicial != oldWidget.materiaInicial) {
      setState(() {
        _materiaFiltro = widget.materiaInicial;
      });
    }
  }

  void _cargartareas() {
    _futuroasignaciones =
        ref.read(proveedorobtenerasignacionesencache).ejecutar();
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

  String _formatearFechaHora(DateTime fecha) {
    final d = fecha.day.toString().padLeft(2, '0');
    final m = fecha.month.toString().padLeft(2, '0');
    final y = fecha.year.toString();
    final h = fecha.hour.toString().padLeft(2, '0');
    final min = fecha.minute.toString().padLeft(2, '0');
    return '$d/$m/$y $h:$min';
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
            Expanded(
              child: Text(
                _materiaFiltro != null && _materiaFiltro!.isNotEmpty
                    ? 'Tareas: $_materiaFiltro'
                    : 'Tareas y Evaluaciones',
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
      body: FutureBuilder<resultadoencache<List<resumendeasignacion>>>(
        future: _futuroasignaciones,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return estadomensaje(
              icono: Icons.assignment_outlined,
              titulo: 'No se pudieron cargar las tareas.',
              mensaje: 'Verifique su conexión e intente nuevamente.',
              etiquetaaccion: 'Reintentar',
              alaccion: () => setState(_cargartareas),
            );
          }

          final cache = snapshot.data!;
          final todas = cache.datos;

          final filtradas = todas.where((a) {
            if (_materiaFiltro != null && _materiaFiltro!.isNotEmpty) {
              final matA = a.nombremateria.trim().toLowerCase();
              final matF = _materiaFiltro!.trim().toLowerCase();
              if (!matA.contains(matF) && !matF.contains(matA)) {
                return false;
              }
            }
            if (_filtro == 'PENDIENTES') return a.espendiente;
            if (_filtro == 'EXAMENES') return a.tipo == 'EXAMEN';
            if (_filtro == 'PRACTICOS') {
              return a.tipo == 'TRABAJO_PRACTICO' || a.tipo == 'PROYECTO';
            }
            return true;
          }).toList();

          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargartareas);
              await _futuroasignaciones;
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
              children: [
                const introduccionpagina(
                  titulo: 'Actividades Académicas',
                  descripcion:
                      'Revisa las tareas, trabajos prácticos y exámenes programados.',
                ),
                if (cache.estaoffline) ...[
                  avisosinconexion(
                    fechaactualizacion: cache.fechaactualizacionformateada,
                  ),
                  const SizedBox(height: 12),
                ],
                if (_materiaFiltro != null && _materiaFiltro!.isNotEmpty) ...[
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: temaaplicacion.marca.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: temaaplicacion.marca.withValues(alpha: 0.25),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.filter_alt,
                          size: 18,
                          color: temaaplicacion.marca,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Filtrando por materia: $_materiaFiltro',
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                              color: temaaplicacion.marca,
                            ),
                          ),
                        ),
                        TextButton.icon(
                          icon: const Icon(Icons.close, size: 16),
                          label: const Text('Ver todas', style: TextStyle(fontSize: 12)),
                          onPressed: () => setState(() => _materiaFiltro = null),
                          style: TextButton.styleFrom(
                            visualDensity: VisualDensity.compact,
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                // Chips de filtro
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _filtroChip('TODAS', 'Todas (${todas.length})'),
                      const SizedBox(width: 8),
                      _filtroChip(
                        'PENDIENTES',
                        'Pendientes (${todas.where((a) => a.espendiente).length})',
                      ),
                      const SizedBox(width: 8),
                      _filtroChip(
                        'EXAMENES',
                        'Exámenes (${todas.where((a) => a.tipo == 'EXAMEN').length})',
                      ),
                      const SizedBox(width: 8),
                      _filtroChip('PRACTICOS', 'Prácticos / Proyectos'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                if (filtradas.isEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 40),
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        Icon(
                          Icons.check_circle_outline,
                          size: 48,
                          color: temaaplicacion.exito.withValues(alpha: 0.7),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _materiaFiltro != null
                              ? 'No hay tareas registradas para "$_materiaFiltro".'
                              : 'No hay tareas pendientes en esta sección.',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: temaaplicacion.tintatenue,
                          ),
                        ),
                        if (_materiaFiltro != null) ...[
                          const SizedBox(height: 12),
                          OutlinedButton.icon(
                            icon: const Icon(Icons.all_inclusive, size: 16),
                            label: const Text('Ver tareas de todas las materias'),
                            onPressed: () => setState(() => _materiaFiltro = null),
                          ),
                        ],
                      ],
                    ),
                  )
                else
                  ...filtradas.map(
                    (tarea) => _construirTarjetaTarea(tarea),
                  ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 1,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _filtroChip(String clave, String label) {
    final isSel = _filtro == clave;
    return ChoiceChip(
      label: Text(label),
      selected: isSel,
      selectedColor: temaaplicacion.fondomarca,
      labelStyle: TextStyle(
        color: isSel ? temaaplicacion.marca : temaaplicacion.tinta,
        fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
        fontSize: 12,
      ),
      onSelected: (_) => setState(() => _filtro = clave),
    );
  }

  Widget _construirTarjetaTarea(resumendeasignacion tarea) {
    final esExamen = tarea.tipo == 'EXAMEN';
    final esUrgente = tarea.esvencida;

    Color badgeColor = temaaplicacion.marca;
    Color badgeFondo = temaaplicacion.fondomarca;

    if (esExamen) {
      badgeColor = const Color(0xFFBE123C);
      badgeFondo = const Color(0xFFFFE4E6);
    } else if (tarea.tipo == 'TRABAJO_PRACTICO') {
      badgeColor = temaaplicacion.secundario;
      badgeFondo = temaaplicacion.fondosecundario;
    }

    final fechaStr = _formatearFechaHora(tarea.fechalimite);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: esUrgente ? temaaplicacion.error : temaaplicacion.borde,
          width: esUrgente ? 1.5 : 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Fila superior: Materia + Tipo chip
            Row(
              children: [
                Expanded(
                  child: Text(
                    tarea.nombremateria,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: temaaplicacion.tintatenue,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: badgeFondo,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    tarea.tiponormalizado,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: badgeColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            // Título de la tarea
            Text(
              tarea.titulo,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: temaaplicacion.tinta,
              ),
            ),
            if (tarea.descripcion.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                tarea.descripcion,
                style: const TextStyle(
                  fontSize: 13,
                  color: temaaplicacion.tintatenue,
                  height: 1.35,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 12),
            const Divider(height: 1, color: temaaplicacion.borde),
            const SizedBox(height: 10),
            // Fila inferior: Fecha límite, Puntaje y Docente / Estudiante
            Row(
              children: [
                Icon(
                  Icons.schedule,
                  size: 14,
                  color: esUrgente
                      ? temaaplicacion.error
                      : temaaplicacion.tintatenue,
                ),
                const SizedBox(width: 4),
                Text(
                  'Vence: $fechaStr',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: esUrgente ? FontWeight.w800 : FontWeight.w600,
                    color: esUrgente
                        ? temaaplicacion.error
                        : temaaplicacion.tintatenue,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 7,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: tarea.estaCalificada
                        ? const Color(0xFFDCFCE7)
                        : tarea.estado == 'FINALIZADO'
                            ? const Color(0xFFF1F5F9)
                            : const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text(
                    tarea.estaCalificada
                        ? 'Finalizada'
                        : (tarea.estado == 'FINALIZADO' ? 'Concluida' : 'Pendiente'),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: tarea.estaCalificada
                          ? const Color(0xFF15803D)
                          : tarea.estado == 'FINALIZADO'
                              ? const Color(0xFF475569)
                              : const Color(0xFFB45309),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 7,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text(
                    '${tarea.puntajemaximo.toInt()} pts',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: temaaplicacion.tinta,
                    ),
                  ),
                ),
              ],
            ),
            if (tarea.nombreestudiante != null) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(
                    Icons.face_outlined,
                    size: 13,
                    color: temaaplicacion.marca,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Alumno: ${tarea.nombreestudiante}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: temaaplicacion.marca,
                    ),
                  ),
                ],
              ),
            ],
            // Calificación y Retroalimentación individual del profesor
            if (tarea.notaObtenida != null ||
                (tarea.retroalimentacion != null &&
                    tarea.retroalimentacion!.isNotEmpty)) ...[
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBEB),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: const Color(0xFFFDE68A),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (tarea.notaObtenida != null)
                      Row(
                        children: [
                          Icon(
                            Icons.military_tech_rounded,
                            size: 16,
                            color: tarea.notaObtenida! >= 51
                                ? const Color(0xFF059669)
                                : const Color(0xFFDC2626),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Calificación: ${tarea.notaObtenida!.toInt()} / ${tarea.puntajemaximo.toInt()} pts',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: tarea.notaObtenida! >= 51
                                  ? const Color(0xFF059669)
                                  : const Color(0xFFDC2626),
                            ),
                          ),
                        ],
                      ),
                    if (tarea.retroalimentacion != null &&
                        tarea.retroalimentacion!.isNotEmpty) ...[
                      if (tarea.notaObtenida != null) const SizedBox(height: 6),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.chat_bubble_outline_rounded,
                            size: 13,
                            color: Color(0xFFB45309),
                          ),
                          const SizedBox(width: 5),
                          Expanded(
                            child: Text(
                              '"${tarea.retroalimentacion}"',
                              style: const TextStyle(
                                fontSize: 11,
                                fontStyle: FontStyle.italic,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF78350F),
                                height: 1.3,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
