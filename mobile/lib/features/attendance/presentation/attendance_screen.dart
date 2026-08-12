import 'package:flutter/material.dart';

class AttendanceScreen extends StatelessWidget {
  const AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registro de Asistencia'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildAttendanceRecord('12 de Agosto, 2026', 'PRESENTE', Colors.emeraldAccent),
          _buildAttendanceRecord('11 de Agosto, 2026', 'PRESENTE', Colors.emeraldAccent),
          _buildAttendanceRecord('10 de Agosto, 2026', 'ATRASO (Justificado)', Colors.amberAccent),
          _buildAttendanceRecord('07 de Agosto, 2026', 'PRESENTE', Colors.emeraldAccent),
          _buildAttendanceRecord('06 de Agosto, 2026', 'FALTA (Permiso Médico)', Colors.blueAccent),
        ],
      ),
    );
  }

  Widget _buildAttendanceRecord(String date, String status, Color color) {
    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(Icons.check_circle_outline, color: color),
        title: Text(date, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
        trailing: Text(
          status,
          style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12),
        ),
      ),
    );
  }
}
