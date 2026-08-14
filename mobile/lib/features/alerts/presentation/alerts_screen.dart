import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notificaciones y Alertas'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildAlertItem(
            title: 'Sincronización SIE Confirmada',
            message: 'Las calificaciones del 1er Trimestre fueron verificadas en el SIE.',
            time: 'Hace 10 min',
            icon: Icons.sync_lock_rounded,
            color: Colors.emeraldAccent,
          ),
          _buildAlertItem(
            title: 'Reunión General de Padres',
            message: 'Se convoca a reunión informativa este viernes a las 18:00.',
            time: 'Ayer',
            icon: Icons.campaign_rounded,
            color: AppTheme.secondaryColor,
          ),
        ],
      ),
    );
  }

  Widget _buildAlertItem({
    required String title,
    required String message,
    required String time,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    message,
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    time,
                    style: const TextStyle(color: Colors.white38, fontSize: 10),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
