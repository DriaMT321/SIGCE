import 'package:flutter/material.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../academic/data/academic_repository.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  late Future<List<AttendanceSummary>> _attendanceFuture;

  @override
  void initState() {
    super.initState();
    _loadAttendance();
  }

  void _loadAttendance() {
    _attendanceFuture = AcademicRepository(ApiClient(SecureStorageService())).getAttendance();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Registro de asistencia')),
      body: FutureBuilder<List<AttendanceSummary>>(
        future: _attendanceFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return Center(child: ElevatedButton(onPressed: () => setState(_loadAttendance), child: const Text('Reintentar')));
          final records = snapshot.data ?? [];
          if (records.isEmpty) return const Center(child: Text('No hay registros de asistencia.', style: TextStyle(color: Colors.white70)));
          return ListView.separated(padding: const EdgeInsets.all(16), itemCount: records.length, separatorBuilder: (_, __) => const SizedBox(height: 12), itemBuilder: (_, index) => _buildRecord(records[index]));
        },
      ),
    );
  }

  Widget _buildRecord(AttendanceSummary record) {
    final color = record.status == 'PRESENT' ? Colors.greenAccent : record.status == 'ABSENT' ? Colors.redAccent : Colors.amberAccent;
    return Card(
      color: const Color(0xFF1E293B),
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(Icons.event_available_outlined, color: color),
        title: Text(_formatDate(record.date), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
        subtitle: Text(record.studentName, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        trailing: Text(_statusLabel(record.status), style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
      ),
    );
  }

  String _formatDate(DateTime date) => '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  String _statusLabel(String status) => ({'PRESENT': 'PRESENTE', 'ABSENT': 'AUSENTE', 'LATE': 'ATRASO', 'JUSTIFIED': 'JUSTIFICADO'}[status] ?? status);
}
