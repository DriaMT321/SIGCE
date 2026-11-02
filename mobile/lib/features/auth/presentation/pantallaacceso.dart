import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresautenticacion.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../domain/use_cases/casosdeusoautenticacion.dart';
import '../domain/excepcionautenticacion.dart';

enum _loginrole { estudiante, docente, familia, administrativo }

extension _LoginRoleDetails on _loginrole {
  String get valorapi => switch (this) {
    _loginrole.estudiante => 'STUDENT',
    _loginrole.docente => 'TEACHER',
    _loginrole.familia => 'FAMILY',
    _loginrole.administrativo => 'ADMINISTRATIVE',
  };

  String get titulo => switch (this) {
    _loginrole.estudiante => 'Estudiante',
    _loginrole.docente => 'Docente',
    _loginrole.familia => 'Familiar',
    _loginrole.administrativo => 'Administrativo',
  };

  String get descripcion =>
      this == _loginrole.familia ? 'CI, celular y clave' : 'Código y clave';

  IconData get icono => switch (this) {
    _loginrole.estudiante => Icons.school_outlined,
    _loginrole.docente => Icons.cast_for_education_outlined,
    _loginrole.familia => Icons.family_restroom_outlined,
    _loginrole.administrativo => Icons.admin_panel_settings_outlined,
  };

  String get etiquetadeidentificador => switch (this) {
    _loginrole.estudiante => 'Código de alumno',
    _loginrole.docente => 'Código de docente',
    _loginrole.familia => 'Cédula de identidad',
    _loginrole.administrativo => 'Código de administrador',
  };

  String get ayudadeidentificador => switch (this) {
    _loginrole.estudiante => 'Ej. RUDE-000123',
    _loginrole.docente => 'Ej. DOC-000123',
    _loginrole.familia => 'Ej. 1234567',
    _loginrole.administrativo => 'Correo institucional asignado',
  };

  bool get usaclave => true;

  bool get usasegundoidentificador => this == _loginrole.familia;
}

class pantallaacceso extends ConsumerStatefulWidget {
  const pantallaacceso({super.key});

  @override
  ConsumerState<pantallaacceso> createState() => _loginpantallaestado();
}

class _loginpantallaestado extends ConsumerState<pantallaacceso> {
  final claveformulario = GlobalKey<FormState>();
  final controladoridentificador = TextEditingController();
  final controladorclave = TextEditingController();
  final controladoridentificadorsecundario = TextEditingController();
  late final casodeusoiniciarsesion _iniciarsesion;
  _loginrole _rolseleccionado = _loginrole.administrativo;
  bool _estacargando = false;
  String? _mensajeerror;

  @override
  void initState() {
    super.initState();
    _iniciarsesion = ref.read(proveedorcasodeusoiniciarsesion);
  }

  @override
  void dispose() {
    controladoridentificador.dispose();
    controladorclave.dispose();
    controladoridentificadorsecundario.dispose();
    super.dispose();
  }

  void _seleccionarrol(_loginrole rol) {
    setState(() {
      _rolseleccionado = rol;
      _mensajeerror = null;
    });
    claveformulario.currentState?.reset();
  }

  Future<void> _procesariniciosesion() async {
    if (!(claveformulario.currentState?.validate() ?? false)) return;

    setState(() {
      _estacargando = true;
      _mensajeerror = null;
    });

    try {
      await _iniciarsesion.ejecutar(
        role: _rolseleccionado.valorapi,
        identifier: controladoridentificador.text.trim(),
        secret: _rolseleccionado.usaclave ? controladorclave.text : null,
        identificadorsecundario: _rolseleccionado.usasegundoidentificador
            ? controladoridentificadorsecundario.text.trim()
            : null,
      );
      if (mounted) context.go('/students');
    } on excepcionautenticacion catch (error) {
      if (mounted) setState(() => _mensajeerror = error.mensaje);
    } finally {
      if (mounted) setState(() => _estacargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tematexto = Theme.of(context).textTheme;
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Form(
                  key: claveformulario,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _construirmarca(),
                      const SizedBox(height: 34),
                      Text(
                        'Selecciona tu acceso',
                        style: tematexto.headlineSmall,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Elige tu rol e ingresa los datos asignados por la institución.',
                        style: tematexto.bodyMedium,
                      ),
                      const SizedBox(height: 22),
                      _construirselectorrol(),
                      const SizedBox(height: 22),
                      if (_mensajeerror != null) ...[
                        _construirmensajeerror(),
                        const SizedBox(height: 18),
                      ],
                      _construircampotexto(
                        controller: controladoridentificador,
                        label: _rolseleccionado.etiquetadeidentificador,
                        hint: _rolseleccionado.ayudadeidentificador,
                        icon: Icons.badge_outlined,
                        keyboardType: TextInputType.text,
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Ingresa el identificador solicitado.'
                            : null,
                      ),
                      if (_rolseleccionado.usasegundoidentificador) ...[
                        const SizedBox(height: 14),
                        _construircampotexto(
                          controller: controladoridentificadorsecundario,
                          label: 'Número de celular',
                          hint: 'Ej. 70000000',
                          icon: Icons.phone_android_outlined,
                          keyboardType: TextInputType.phone,
                          validator: (value) =>
                              value == null || value.trim().isEmpty
                              ? 'Ingresa el número de celular.'
                              : null,
                        ),
                      ],
                      if (_rolseleccionado.usaclave) ...[
                        const SizedBox(height: 14),
                        _construircampotexto(
                          controller: controladorclave,
                          label: 'Clave',
                          hint: '••••••••',
                          icon: Icons.key_outlined,
                          obscureText: true,
                          keyboardType: TextInputType.visiblePassword,
                          validator: (value) =>
                              value == null || value.length < 6
                              ? 'La clave debe tener al menos 6 caracteres.'
                              : null,
                        ),
                      ],
                      const SizedBox(height: 22),
                      SizedBox(
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _estacargando
                              ? null
                              : _procesariniciosesion,
                          child: _estacargando
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Text('Ingresar al sistema'),
                        ),
                      ),
                      if (_rolseleccionado == _loginrole.estudiante) ...[
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.go('/activate-student'),
                          child: const Text('Activar mi cuenta estudiantil'),
                        ),
                      ],
                      const SizedBox(height: 15),
                      Text(
                        'Utiliza los datos asignados por tu institución.',
                        textAlign: TextAlign.center,
                        style: tematexto.bodySmall,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _construirmarca() {
    return Row(
      children: [
        Container(
          height: 52,
          width: 52,
          padding: const EdgeInsets.all(5),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Image.asset(
            'assets/brand/logo-sf.png',
            fit: BoxFit.contain,
          ),
        ),
        const SizedBox(width: 13),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('SIGCE', style: Theme.of(context).textTheme.titleLarge),
            Text(
              'Gestión académica móvil',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ],
    );
  }

  Widget _construirselectorrol() {
    return LayoutBuilder(
      builder: (context, constraints) {
        const spacing = 10.0;
        final itemwidth = (constraints.maxWidth - spacing) / 2;
        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: _loginrole.values.map((role) {
            final isselected = role == _rolseleccionado;
            return SizedBox(
              width: itemwidth,
              child: OutlinedButton(
                onPressed: () => _seleccionarrol(role),
                style: OutlinedButton.styleFrom(
                  alignment: Alignment.centerLeft,
                  backgroundColor: isselected
                      ? temaaplicacion.fondomarca
                      : temaaplicacion.superficie,
                  foregroundColor: isselected
                      ? temaaplicacion.tinta
                      : temaaplicacion.tintatenue,
                  side: BorderSide(
                    color: isselected
                        ? temaaplicacion.marca
                        : temaaplicacion.bordedecontrol,
                    width: isselected ? 1.4 : 1,
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 11,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(9),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      role.icono,
                      size: 20,
                      color: isselected
                          ? temaaplicacion.marca
                          : temaaplicacion.tintatenue,
                    ),
                    const SizedBox(width: 9),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            role.titulo,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            role.descripcion,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }

  Widget _construircampotexto({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    required TextInputType keyboardType,
    required String? Function(String?) validator,
    bool obscureText = false,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon),
      ),
      validator: validator,
    );
  }

  Widget _construirmensajeerror() {
    return Container(
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: temaaplicacion.fondoerror,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: temaaplicacion.bordeerror),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.error_outline,
            size: 20,
            color: temaaplicacion.error,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              _mensajeerror!,
              style: const TextStyle(color: temaaplicacion.error),
            ),
          ),
        ],
      ),
    );
  }
}
