import 'package:flutter/material.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../academic/data/academic_repository.dart';

class GradesScreen extends StatefulWidget {
  const GradesScreen({super.key});

  @override
  State<GradesScreen> createState() => _GradesScreenState();
}

class _GradesScreenState extends State<GradesScreen> {
  late Future<List<GradeSummary>> _gradesFuture;

  @override
  void initState() {
    super.initState();
    _loadGrades();
  }

  void _loadGrades() {
    _gradesFuture = AcademicRepository(ApiClient(SecureStorageService())).getGrades();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Boletín de calificaciones')),
      body: FutureBuilder<List<GradeSummary>>(
        future: _gradesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return Center(child: ElevatedButton(onPressed: () => setState(_loadGrades), child: const Text('Reintentar')));
          final grades = snapshot.data ?? [];
          if (grades.isEmpty) return const Center(child: Text('No hay calificaciones registradas.', style: TextStyle(color: Colors.white70)));
          return ListView.separated(padding: const EdgeInsets.all(16), itemCount: grades.length, separatorBuilder: (_, __) => const SizedBox(height: 12), itemBuilder: (_, index) => _buildGrade(grades[index]));
        },
      ),
    );
  }

  Widget _buildGrade(GradeSummary grade) {
    final isPassing = grade.value >= 51;
    return Card(
      color: const Color(0xFF1E293B),
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(grade.subject, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white)),
        subtitle: Text('${grade.studentName} · ${grade.period}', style: const TextStyle(color: Colors.white54, fontSize: 12)),
        trailing: Text('${grade.value.toStringAsFixed(0)} pts', style: TextStyle(fontWeight: FontWeight.bold, color: isPassing ? Colors.greenAccent : Colors.redAccent)),
      ),
    );
  }
}
