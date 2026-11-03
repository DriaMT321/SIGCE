import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../core/providers/proveedoresacademicos.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../../../core/widgets/introduccionpagina.dart';

class pantallasolicitudcita extends ConsumerStatefulWidget {
  const pantallasolicitudcita({super.key});

  @override
  ConsumerState<pantallasolicitudcita> createState() =>
      _pantallasolicitudcitaestado();
}

class _pantallasolicitudcitaestado extends ConsumerState<pantallasolicitudcita> {
  final _formKey = GlobalKey<FormState>();
  final _motivoController = TextEditingController();
  final _detallesController = TextEditingController();

  String _destinatario = 'Prof. Carlos Mendoza (Matemáticas)';
  String _motivo = 'Seguimiento de rendimiento académico';
  DateTime _fechaSeleccionada = DateTime.now().add(const Duration(days: 2));
  String _turno = 'Mañana (10:00 - 11:30)';
  bool _enviando = false;
  List<Map<String, dynamic>> _solicitudesPrevias = [];

  final _docentes = [
    'Prof. Carlos Mendoza (Matemáticas)',
    'Profa. Elena Quispe (Lenguaje y Literatura)',
    'Dirección Académica',
    'Coordinación de Psicopedagogía',
    'Secretaría General',
  ];

  final _motivos = [
    'Seguimiento de rendimiento académico',
    'Consulta sobre tareas y evaluaciones',
    'Justificación de inasistencia / licencia médica',
    'Orientación psicopedagógica y conducta',
    'Revisión de calificaciones trimestrales',
  ];

  @override
  void initState() {
    super.initState();
    _cargarSolicitudesPrevias();
  }

  @override
  void dispose() {
    _motivoController.dispose();
    _detallesController.dispose();
    super.dispose();
  }

  Future<void> _cargarSolicitudesPrevias() async {
    final storage = ref.read(proveedoralmacenamientoseguro);
    final jsonStr = await storage.obtenercache('meeting_requests');
    if (jsonStr != null && mounted) {
      try {
        final decoded = jsonDecode(jsonStr);
        if (decoded is List<dynamic>) {
          setState(() {
            _solicitudesPrevias = decoded.whereType<Map<String, dynamic>>().toList().reversed.toList();
          });
        }
      } catch (_) {}
    }
  }

  Future<void> _enviarSolicitud() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    setState(() => _enviando = true);
    final repo = ref.read(proveedorrepositorioacademico);

    final fechaStr = DateFormat('dd/MM/yyyy', 'es').format(_fechaSeleccionada);
    final motivoCompleto = '$_motivo - $_turno. ${_detallesController.text.trim()}';

    try {
      await repo.solicitarentrevista(
        idestudiante: 'default-student',
        nombreestudiante: 'Estudiante',
        docenteomateria: _destinatario,
        fecha: fechaStr,
        motivo: motivoCompleto,
      );

      await _cargarSolicitudesPrevias();

      if (mounted) {
        _detallesController.clear();
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            icon: const Icon(Icons.check_circle_outline, size: 48, color: temaaplicacion.exito),
            title: const Text('Solicitud Enviada'),
            content: Text(
              'Su citación o entrevista con "$_destinatario" para el día $fechaStr ha sido registrada exitosamente en secretaría.',
              style: const TextStyle(fontSize: 13, height: 1.4),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('Entendido'),
              ),
            ],
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy', 'es');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Entrevistas y Citas'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(18, 14, 18, 28),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const introduccionpagina(
                titulo: 'Solicitar Reunión con Docente',
                descripcion: 'Agende una entrevista individual con profesores o autoridades del colegio.',
              ),
              const SizedBox(height: 14),
              // Card del formulario
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: temaaplicacion.borde),
                  boxShadow: const [
                    BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 1)),
                  ],
                ),
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Destinatario
                    const Text('Docente o Área', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: temaaplicacion.tinta)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: _destinatario,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.person_pin_outlined),
                      ),
                      items: _docentes.map((d) => DropdownMenuItem(value: d, child: Text(d, style: const TextStyle(fontSize: 13)))).toList(),
                      onChanged: (v) {
                        if (v != null) setState(() => _destinatario = v);
                      },
                    ),
                    const SizedBox(height: 16),
                    // Motivo
                    const Text('Motivo Principal', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: temaaplicacion.tinta)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: _motivo,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.help_outline),
                      ),
                      items: _motivos.map((m) => DropdownMenuItem(value: m, child: Text(m, style: const TextStyle(fontSize: 13)))).toList(),
                      onChanged: (v) {
                        if (v != null) setState(() => _motivo = v);
                      },
                    ),
                    const SizedBox(height: 16),
                    // Fecha y Horario
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Fecha solicitada', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: temaaplicacion.tinta)),
                              const SizedBox(height: 6),
                              OutlinedButton.icon(
                                icon: const Icon(Icons.calendar_today, size: 16),
                                label: Text(dateFormat.format(_fechaSeleccionada), style: const TextStyle(fontSize: 12)),
                                onPressed: () async {
                                  final pick = await showDatePicker(
                                    context: context,
                                    initialDate: _fechaSeleccionada,
                                    firstDate: DateTime.now(),
                                    lastDate: DateTime.now().add(const Duration(days: 60)),
                                  );
                                  if (pick != null) setState(() => _fechaSeleccionada = pick);
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Horario preferido', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: temaaplicacion.tinta)),
                              const SizedBox(height: 6),
                              DropdownButtonFormField<String>(
                                initialValue: _turno,
                                isExpanded: true,
                                decoration: const InputDecoration(
                                  contentPadding: EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                                ),
                                items: const [
                                  DropdownMenuItem(value: 'Mañana (08:30 - 10:00)', child: Text('08:30 - 10:00', style: TextStyle(fontSize: 12))),
                                  DropdownMenuItem(value: 'Mañana (10:00 - 11:30)', child: Text('10:00 - 11:30', style: TextStyle(fontSize: 12))),
                                  DropdownMenuItem(value: 'Tarde (14:30 - 16:00)', child: Text('14:30 - 16:00', style: TextStyle(fontSize: 12))),
                                ],
                                onChanged: (v) {
                                  if (v != null) setState(() => _turno = v);
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Detalles opcionales
                    const Text('Detalles o aclaraciones (opcional)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: temaaplicacion.tinta)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _detallesController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'Explique brevemente el asunto a tratar para que el docente prepare la información...',
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Botón Enviar
                    ElevatedButton.icon(
                      onPressed: _enviando ? null : _enviarSolicitud,
                      icon: _enviando
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Icon(Icons.send_rounded),
                      label: Text(_enviando ? 'Enviando solicitud...' : 'Enviar Solicitud de Cita'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Historial de solicitudes
              const Text(
                'Solicitudes Registradas',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: temaaplicacion.tinta),
              ),
              const SizedBox(height: 10),
              if (_solicitudesPrevias.isEmpty)
                Container(
                  padding: const EdgeInsets.all(20),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: temaaplicacion.borde),
                  ),
                  child: const Text(
                    'Aún no tiene citas solicitadas.',
                    style: TextStyle(fontSize: 13, color: temaaplicacion.tintatenue),
                  ),
                )
              else
                ..._solicitudesPrevias.map((s) => Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: temaaplicacion.borde),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  s['teacherOrSubject'] ?? '',
                                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: temaaplicacion.tinta),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: temaaplicacion.fondoexito,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  s['status'] ?? 'ENVIADA',
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: temaaplicacion.exito),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Fecha: ${s['requestedDate']}',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: temaaplicacion.marca),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            s['reason'] ?? '',
                            style: const TextStyle(fontSize: 12, color: temaaplicacion.tintatenue),
                          ),
                        ],
                      ),
                    )),
            ],
          ),
        ),
      ),
    );
  }
}
