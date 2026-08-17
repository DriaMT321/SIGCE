import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../academic/data/academic_repository.dart';

class StudentsScreen extends StatefulWidget {
  const StudentsScreen({super.key});

  @override
  State<StudentsScreen> createState() => _StudentsScreenState();
}

class _StudentsScreenState extends State<StudentsScreen> {
  late Future<List<StudentSummary>> _studentsFuture;

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  void _loadStudents() {
    _studentsFuture = AcademicRepository(ApiClient(SecureStorageService())).getStudents();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis hijos y tutelados'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () => context.push('/alerts')),
          IconButton(icon: const Icon(Icons.person_outline), onPressed: () => context.push('/profile')),
        ],
      ),
      body: FutureBuilder<List<StudentSummary>>(
        future: _studentsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return _ErrorState(onRetry: () => setState(_loadStudents));
          final students = snapshot.data ?? [];
          if (students.isEmpty) return const Center(child: Text('No tienes estudiantes asociados.', style: TextStyle(color: Colors.white70)));
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: students.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) => _buildStudentCard(context, students[index]),
          );
        },
      ),
    );
  }

  Widget _buildStudentCard(BuildContext context, StudentSummary student) {
    return Card(
      color: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            CircleAvatar(backgroundColor: AppTheme.primaryColor, child: Text(student.name.substring(0, 1), style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold))),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(student.name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)), Text('RUDE: ${student.rude} · ${student.courseName}', style: const TextStyle(fontSize: 12, color: Colors.white60))])),
          ]),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(child: OutlinedButton.icon(icon: const Icon(Icons.assessment_outlined, size: 18), label: const Text('Calificaciones'), onPressed: () => context.push('/grades'))),
            const SizedBox(width: 8),
            Expanded(child: OutlinedButton.icon(icon: const Icon(Icons.calendar_today_outlined, size: 18), label: const Text('Asistencia'), onPressed: () => context.push('/attendance'))),
          ]),
        ]),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.onRetry});
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) => Center(child: Column(mainAxisSize: MainAxisSize.min, children: [const Text('No se pudo cargar la información.', style: TextStyle(color: Colors.white70)), const SizedBox(height: 12), ElevatedButton(onPressed: onRetry, child: const Text('Reintentar'))]));
}
