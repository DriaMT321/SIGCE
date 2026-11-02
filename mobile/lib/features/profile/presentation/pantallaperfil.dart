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
        context.go('/alerts');
      case 2:
        context.go('/profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mi perfil')),
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
          final displaynombre = nombre.isEmpty ? 'Usuario' : nombre;
          final initial = displaynombre.trim().characters.first.toUpperCase();

          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 26),
            children: [
              const introduccionpagina(
                titulo: 'Tu cuenta',
                descripcion: 'Datos de acceso y opciones de sesión.',
              ),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 27,
                        backgroundColor: temaaplicacion.fondomarca,
                        foregroundColor: temaaplicacion.marca,
                        child: Text(
                          initial,
                          style: Theme.of(context).textTheme.titleLarge
                              ?.copyWith(color: temaaplicacion.marca),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              displaynombre,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            if (correo != null && correo.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                correo,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (rol != null && rol.isNotEmpty) ...[
                const SizedBox(height: 12),
                Card(
                  child: ListTile(
                    leading: const Icon(
                      Icons.verified_user_outlined,
                      color: temaaplicacion.marca,
                    ),
                    title: const Text('Rol de usuario'),
                    subtitle: Text(rol.replaceAll('_', ' ')),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 5,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 24),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: temaaplicacion.error,
                  side: const BorderSide(color: temaaplicacion.error),
                ),
                icon: _estacerrandosesion
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.logout),
                label: Text(
                  _estacerrandosesion ? 'Cerrando sesión…' : 'Cerrar sesión',
                ),
                onPressed: _estacerrandosesion ? null : _cerrarsesion,
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: barranavegacionaplicacion(
        indiceactual: 2,
        alseleccionardestino: _abrirdestino,
      ),
    );
  }
}
