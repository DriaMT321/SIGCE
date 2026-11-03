import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresautenticacion.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/barranavegacionaplicacion.dart';
import '../../../core/widgets/estadomensaje.dart';
import '../../../core/widgets/introduccionpagina.dart';
import '../../auth/domain/puertoautenticacion.dart';

class pantallaperfil extends ConsumerStatefulWidget {
  const pantallaperfil({super.key});

  @override
  ConsumerState<pantallaperfil> createState() => _perfilpantallaestado();
}

class _perfilpantallaestado extends ConsumerState<pantallaperfil> {
  late final Future<perfilusuarioactual?> _futurousuario;
  bool _estacerrandosesion = false;

  @override
  void initState() {
    super.initState();
    _futurousuario = ref
        .read(proveedorcasodeusoobtenerperfilusuarioactual)
        .ejecutar();
  }

  Future<void> _cerrarsesion() async {
    if (_estacerrandosesion) return;
    setState(() => _estacerrandosesion = true);
    try {
      await ref.read(proveedorcasodeusocerrarsesion).ejecutar();
    } finally {
      if (mounted) context.go('/login');
    }
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
              height: 28,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(Icons.school, size: 24),
            ),
            const SizedBox(width: 8),
            const Text('Mi Perfil'),
          ],
        ),
      ),
      body: FutureBuilder<perfilusuarioactual?>(
        future: _futurousuario,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const estadomensaje(
              icono: Icons.person_outline,
              titulo: 'No se pudo cargar el perfil.',
              mensaje: 'Cierra la sesión e ingresa nuevamente.',
            );
          }

          final usuario = snapshot.data;
          final nombre = usuario?.nombrevisible ?? '';
          final correo = usuario?.correo;
          final rol = usuario?.rol;
          final displaynombre = nombre.isEmpty ? 'Usuario SIGCE' : nombre;
          final initial = displaynombre.trim().characters.first.toUpperCase();

          return ListView(
            padding: const EdgeInsets.fromLTRB(18, 14, 18, 26),
            children: [
              const introduccionpagina(
                titulo: 'Cuenta y Configuración',
                descripcion: 'Información del usuario y servicios institucionales.',
              ),
              // Card de Usuario
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: temaaplicacion.borde),
                  boxShadow: const [
                    BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 1)),
                  ],
                ),
                padding: const EdgeInsets.all(18),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: temaaplicacion.fondomarca,
                      foregroundColor: temaaplicacion.marca,
                      child: Text(
                        initial,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: temaaplicacion.marca,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            displaynombre,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: temaaplicacion.tinta,
                            ),
                          ),
                          if (correo != null && correo.isNotEmpty) ...[
                            const SizedBox(height: 3),
                            Text(
                              correo,
                              style: const TextStyle(
                                fontSize: 13,
                                color: temaaplicacion.tintatenue,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              // Opciones institucionales
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: temaaplicacion.borde),
                ),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.handshake_outlined, color: temaaplicacion.marca),
                      title: const Text('Solicitar cita con docente o dirección', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                      subtitle: const Text('Agenda entrevistas pedagógicas o justificaciones', style: TextStyle(fontSize: 12)),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => context.push('/request-meeting'),
                    ),
                    const Divider(height: 1, indent: 56),
                    ListTile(
                      leading: const Icon(Icons.assignment_outlined, color: temaaplicacion.secundario),
                      title: const Text('Tareas y Exámenes del alumno', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                      subtitle: const Text('Ver actividades pendientes y fechas de entrega', style: TextStyle(fontSize: 12)),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => context.push('/assignments'),
                    ),
                    const Divider(height: 1, indent: 56),
                    ListTile(
                      leading: const Icon(Icons.calendar_month_outlined, color: temaaplicacion.acento),
                      title: const Text('Horario de clases semanal', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                      subtitle: const Text('Revisar materias, aulas y periodos pedagógicos', style: TextStyle(fontSize: 12)),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => context.push('/schedules'),
                    ),
                    const Divider(height: 1, indent: 56),
                    ListTile(
                      leading: const Icon(Icons.verified_user_outlined, color: temaaplicacion.tintatenue),
                      title: const Text('Rol institucional', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                      subtitle: Text(rol?.replaceAll('_', ' ') ?? 'Usuario institucional', style: const TextStyle(fontSize: 12)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Card Institucional
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: temaaplicacion.borde),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.shield_outlined, size: 20, color: temaaplicacion.marca),
                    SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Colegio Comunidad Cristiana', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: temaaplicacion.tinta)),
                          Text('Servidor central: api.sigce.lat (HTTPS)', style: TextStyle(fontSize: 11, color: temaaplicacion.tintatenue)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Botón Cerrar Sesión
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: temaaplicacion.error,
                  side: const BorderSide(color: temaaplicacion.error),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                icon: _estacerrandosesion
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: temaaplicacion.error),
                      )
                    : const Icon(Icons.logout),
                label: Text(
                  _estacerrandosesion ? 'Cerrando sesión…' : 'Cerrar sesión',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                onPressed: _estacerrandosesion ? null : _cerrarsesion,
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 4,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }
}
