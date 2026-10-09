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
  late Future<CachedResult<List<GradeSummary>>> _gradesFuture;

  @override
  void initState() {
    super.initState();
    _loadGrades();
  }

  void _loadGrades() {
    _gradesFuture = AcademicRepository(ApiClient(SecureStorageService())).getGradesWithCache();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Boletín de calificaciones')),
      body: FutureBuilder<CachedResult<List<GradeSummary>>>(
        future: _gradesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: ElevatedButton(
                onPressed: () => setState(_loadGrades),
                child: const Text('Reintentar'),
              ),
            );
          }
          final result = snapshot.data;
          final grades = result?.data ?? [];
          final isOffline = result?.isOffline ?? false;

          return RefreshIndicator(
            onRefresh: () async {
              setState(_loadGrades);
              await _gradesFuture;
            },
            child: Column(
              children: [
                if (isOffline)
                  Container(
                    width: double.infinity,
                    color: const Color(0xFF78350F),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        const Icon(Icons.cloud_off, size: 16, color: Color(0xFFFDE68A)),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Modo sin conexión · ${result?.formattedUpdatedDate ?? "Caché local"}',
                            style: const TextStyle(fontSize: 12, color: Color(0xFFFDE68A), fontWeight: FontWeight.w500),
                          ),
                        ),
                      ],
                    ),
                  ),
                Expanded(
                  child: grades.isEmpty
                      ? const Center(
                          child: Text(
                            'No hay calificaciones registradas.',
                            style: TextStyle(color: Colors.white70),
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: grades.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (_, index) => _buildGrade(grades[index]),
                        ),
                ),
              ],
            ),
          );
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
