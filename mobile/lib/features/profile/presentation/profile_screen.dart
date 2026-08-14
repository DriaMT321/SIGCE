import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Perfil'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundColor: AppTheme.primaryColor,
              child: Icon(Icons.person, size: 48, color: Colors.black),
            ),
            const SizedBox(height: 16),
            const Text(
              'Carlos Pérez',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const Text(
              'padre@academic.edu.bo',
              style: TextStyle(fontSize: 14, color: Colors.white54),
            ),
            const SizedBox(height: 32),
            Card(
              color: const Color(0xFF1E293B),
              child: ListTile(
                leading: const Icon(Icons.security, color: AppTheme.secondaryColor),
                title: const Text('Rol de Usuario', style: TextStyle(color: Colors.white)),
                trailing: const Text('PADRE / TUTOR', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
              ),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.accentColor,
                ),
                icon: const Icon(Icons.logout),
                label: const Text('Cerrar Sesión'),
                onPressed: () => context.go('/login'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
