import 'package:flutter/material.dart';

class GradesScreen extends StatelessWidget {
  const GradesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Boletín de Calificaciones'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSubjectGrade('Matemática', 85, '1er Trimestre'),
          _buildSubjectGrade('Lenguaje y Comunicación', 78, '1er Trimestre'),
          _buildSubjectGrade('Ciencias Sociales: Historia', 90, '1er Trimestre'),
          _buildSubjectGrade('Ciencias Naturales: Física', 82, '1er Trimestre'),
          _buildSubjectGrade('Educación Física y Deportes', 95, '1er Trimestre'),
        ],
      ),
    );
  }

  Widget _buildSubjectGrade(String subject, int grade, String period) {
    final bool isPassing = grade >= 51;

    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(
          subject,
          style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
        ),
        subtitle: Text(period, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isPassing ? const Color(0xFF10B981).withValues(alpha: 0.15) : const Color(0xFFEF4444).withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isPassing ? const Color(0xFF10B981) : const Color(0xFFEF4444),
              width: 1,
            ),
          ),
          child: Text(
            '$grade pts',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: isPassing ? const Color(0xFF10B981) : const Color(0xFFEF4444),
            ),
          ),
        ),
      ),
    );
  }
}
