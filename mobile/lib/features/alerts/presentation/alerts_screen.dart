import 'package:flutter/material.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../academic/data/academic_repository.dart';

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  late Future<List<AlertSummary>> _alertsFuture;

  @override
  void initState() {
    super.initState();
    _loadAlerts();
  }

  void _loadAlerts() {
    _alertsFuture = AcademicRepository(ApiClient(SecureStorageService())).getAlerts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notificaciones y alertas')),
      body: FutureBuilder<List<AlertSummary>>(
        future: _alertsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return Center(child: ElevatedButton(onPressed: () => setState(_loadAlerts), child: const Text('Reintentar')));
          final alerts = snapshot.data ?? [];
          if (alerts.isEmpty) return const Center(child: Text('No tienes alertas nuevas.', style: TextStyle(color: Colors.white70)));
          return ListView.separated(padding: const EdgeInsets.all(16), itemCount: alerts.length, separatorBuilder: (_, __) => const SizedBox(height: 12), itemBuilder: (_, index) => _buildAlert(alerts[index]));
        },
      ),
    );
  }

  Widget _buildAlert(AlertSummary alert) {
    final color = alert.severity == 'DANGER' ? AppTheme.accentColor : alert.severity == 'WARNING' ? Colors.amberAccent : AppTheme.secondaryColor;
    return Card(
      color: const Color(0xFF1E293B),
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(10)), child: Icon(Icons.notifications_active_outlined, color: color, size: 20)),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(alert.title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14)), const SizedBox(height: 4), Text(alert.message, style: const TextStyle(color: Colors.white70, fontSize: 12)), const SizedBox(height: 6), Text(_formatDate(alert.createdAt), style: const TextStyle(color: Colors.white38, fontSize: 10))])),
        ]),
      ),
    );
  }

  String _formatDate(DateTime date) => '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
}
