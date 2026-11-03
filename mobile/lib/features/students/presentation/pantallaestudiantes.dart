import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../../core/widgets/avisosinconexion.dart';
import '../../academic/domain/use_cases/consultasacademicas.dart';
import '../../academic/domain/entities/registrosacademicos.dart';
import '../../academic/domain/repositories/repositorioacademico.dart';

class pantallaestudiantes extends ConsumerStatefulWidget {
  const pantallaestudiantes({super.key, this.repositorio});

  final puertorepositorioacademico? repositorio;

  @override
  ConsumerState<pantallaestudiantes> createState() =>
      _estudiantespantallaestado();
}

class _estudiantespantallaestado extends ConsumerState<pantallaestudiantes> {
  late final casoobtenerestudiantesencache _obtenerestudiantes;
  late Future<resultadoencache<List<resumendeestudiante>>> _futuroestudiantes;

  @override
  void initState() {
    super.initState();
    _obtenerestudiantes = widget.repositorio == null
        ? ref.read(proveedorobtenerestudiantesencache)
        : casoobtenerestudiantesencache(widget.repositorio!);
    _cargarestudiantes();
  }

  void _cargarestudiantes() {
    _futuroestudiantes = _obtenerestudiantes.ejecutar();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/brand/logo-sf.png',
              height: 30,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(Icons.school, size: 24),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SIGCE Móvil',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                Text(
                  'Colegio Comunidad Cristiana',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: temaaplicacion.tintatenue,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: FutureBuilder<resultadoencache<List<resumendeestudiante>>>(
        future: _futuroestudiantes,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _estadoerror(
              alreintentar: () => setState(_cargarestudiantes),
            );
          }
          final resultado = snapshot.data;
          final estudiantes = resultado?.datos ?? [];

          final esUnico = estudiantes.length == 1;
          final titulo = esUnico
              ? 'Bienvenido(a), ${estudiantes.first.nombre}'
              : 'Seguimiento Académico';
          final descripcion = esUnico
              ? 'Consulta tus notas, asistencia, horario y tareas.'
              : 'Consulta notas, asistencia, tareas y horarios de tus hijos/as.';

          return RefreshIndicator(
            onRefresh: () async {
              setState(_cargarestudiantes);
              await _futuroestudiantes;
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(18, 14, 18, 24),
              children: [
                introduccionpagina(
                  titulo: titulo,
                  descripcion: descripcion,
                ),
                if (resultado?.estaoffline ?? false) ...[
                  avisosinconexion(
                    fechaactualizacion:
                        resultado?.fechaactualizacionformateada ??
                        'Caché local',
                  ),
                  const SizedBox(height: 12),
                ],
                // Tarjeta de acceso rápido a citas con docentes
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: temaaplicacion.fondomarca.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: temaaplicacion.marca.withValues(alpha: 0.2),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: temaaplicacion.marca,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.handshake_outlined,
                          color: Colors.white,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '¿Necesitas hablar con un profesor?',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                                color: temaaplicacion.tinta,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Agenda una entrevista presencial o justificación.',
                              style: TextStyle(
                                fontSize: 11,
                                color: temaaplicacion.tintatenue,
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/request-meeting'),
                        style: TextButton.styleFrom(
                          foregroundColor: temaaplicacion.marca,
                          textStyle: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        child: const Text('Solicitar'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                if (estudiantes.isEmpty)
                  const SizedBox(
                    height: 240,
                    child: estadomensaje(
                      icono: Icons.school_outlined,
                      titulo: 'No tienes estudiantes asociados.',
                      mensaje:
                          'Cuando la institución vincule estudiantes a tu cuenta, aparecerán aquí.',
                    ),
                  )
                else
                  ...estudiantes.map(
                    (student) => _construirtarjetaestudiante(context, student),
                  ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 0,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }

  Widget _construirtarjetaestudiante(
    BuildContext contexto,
    resumendeestudiante estudiante,
  ) {
    final initial = estudiante.nombre.trim().isEmpty
        ? '?'
        : estudiante.nombre.trim().characters.first.toUpperCase();
    final tematexto = Theme.of(contexto).textTheme;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
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
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: temaaplicacion.fondomarca,
                  foregroundColor: temaaplicacion.marca,
                  child: Text(
                    initial,
                    style: tematexto.titleMedium?.copyWith(
                      color: temaaplicacion.marca,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        estudiante.nombre,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: temaaplicacion.tinta,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 1.5,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          estudiante.nombrecurso,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: temaaplicacion.tintatenue,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'RUDE: ${estudiante.rude}',
              style: tematexto.labelSmall?.copyWith(
                color: temaaplicacion.tintatenue,
                letterSpacing: 0.25,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 14),
            const Divider(height: 1, color: temaaplicacion.borde),
            const SizedBox(height: 12),
            // Matriz de 4 botones de acción rápida
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.assessment_outlined, size: 16),
                    label: const Text('Notas', maxLines: 1),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => contexto.push(
                      '/students/${estudiante.identificador}/grades',
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.event_available_outlined, size: 16),
                    label: const Text('Asistencia', maxLines: 1),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => contexto.push(
                      '/students/${estudiante.identificador}/attendance',
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.calendar_month_outlined, size: 16),
                    label: const Text('Horario', maxLines: 1),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => contexto.push('/schedules'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.assignment_outlined, size: 16),
                    label: const Text('Tareas', maxLines: 1),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => contexto.push('/assignments'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _estadoerror extends StatelessWidget {
  const _estadoerror({required this.alreintentar});

  final VoidCallback alreintentar;

  @override
  Widget build(BuildContext context) {
    return estadomensaje(
      icono: Icons.cloud_off_outlined,
      titulo: 'No se pudo cargar la información.',
      mensaje: 'Comprueba la conexión e inténtalo de nuevo.',
      etiquetaaccion: 'Reintentar',
      alaccion: alreintentar,
    );
  }
}
