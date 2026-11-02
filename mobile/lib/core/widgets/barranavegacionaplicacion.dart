import 'package:flutter/material.dart';

class barranavegacionaplicacion extends StatelessWidget {
  const barranavegacionaplicacion({
    super.key,
    required this.indiceactual,
    required this.alseleccionardestino,
  });

  final int indiceactual;
  final ValueChanged<int> alseleccionardestino;

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: indiceactual,
      onDestinationSelected: alseleccionardestino,
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.school_outlined),
          selectedIcon: Icon(Icons.school),
          label: 'Estudiantes',
        ),
        NavigationDestination(
          icon: Icon(Icons.notifications_outlined),
          selectedIcon: Icon(Icons.notifications),
          label: 'Alertas',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person),
          label: 'Perfil',
        ),
      ],
    );
  }
}
