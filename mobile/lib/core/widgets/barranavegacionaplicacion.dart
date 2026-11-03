import 'package:flutter/material.dart';
import '../theme/temaaplicacion.dart';

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
      selectedIndex: indiceactual.clamp(0, 4),
      onDestinationSelected: alseleccionardestino,
      indicatorColor: temaaplicacion.fondomarca,
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.school_outlined),
          selectedIcon: Icon(Icons.school, color: temaaplicacion.marca),
          label: 'Inicio',
        ),
        NavigationDestination(
          icon: Icon(Icons.assignment_outlined),
          selectedIcon: Icon(Icons.assignment, color: temaaplicacion.marca),
          label: 'Tareas',
        ),
        NavigationDestination(
          icon: Icon(Icons.calendar_month_outlined),
          selectedIcon: Icon(Icons.calendar_month, color: temaaplicacion.marca),
          label: 'Horario',
        ),
        NavigationDestination(
          icon: Icon(Icons.campaign_outlined),
          selectedIcon: Icon(Icons.campaign, color: temaaplicacion.marca),
          label: 'Avisos',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person, color: temaaplicacion.marca),
          label: 'Perfil',
        ),
      ],
    );
  }
}
