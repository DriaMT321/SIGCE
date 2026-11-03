import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresautenticacion.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../domain/use_cases/casosdeusoautenticacion.dart';
import '../domain/excepcionautenticacion.dart';

enum _loginrole { familia, estudiante, docente, administrativo }

extension _LoginRoleDetails on _loginrole {
  String get valorapi => switch (this) {
    _loginrole.familia => 'FAMILY',
    _loginrole.estudiante => 'STUDENT',
    _loginrole.docente => 'TEACHER',
    _loginrole.administrativo => 'ADMINISTRATIVE',
  };

  String get titulo => switch (this) {
    _loginrole.familia => 'Familia / Tutor',
    _loginrole.estudiante => 'Estudiante',
    _loginrole.docente => 'Docente',
    _loginrole.administrativo => 'Administrativo',
  };

  String get subtitulo => switch (this) {
    _loginrole.familia => 'C.I., Celular y Contraseña',
    _loginrole.estudiante => 'Código RUDE y Contraseña',
    _loginrole.docente => 'Código Ítem / C.I. y Contraseña',
    _loginrole.administrativo => 'Correo institucional',
  };

  IconData get icono => switch (this) {
    _loginrole.familia => Icons.family_restroom,
    _loginrole.estudiante => Icons.school,
    _loginrole.docente => Icons.cast_for_education,
    _loginrole.administrativo => Icons.admin_panel_settings,
  };

  String get etiquetadeidentificador => switch (this) {
    _loginrole.familia => 'Cédula de identidad (C.I.) del Tutor',
    _loginrole.estudiante => 'Código RUDE o Cédula de Identidad',
    _loginrole.docente => 'Código Ítem, C.I. o Correo',
    _loginrole.administrativo => 'Correo institucional asignado',
  };

  String get ayudadeidentificador => switch (this) {
    _loginrole.familia => 'Ej. 4567890',
    _loginrole.estudiante => 'Ej. 807300012026001',
    _loginrole.docente => 'Ej. DOC-2026',
    _loginrole.administrativo => 'admin@sigce.lat',
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
  _loginrole _rolseleccionado = _loginrole.familia;
  bool _estacargando = false;
  bool _ocultarclave = true;
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
    } catch (_) {
      if (mounted) {
        setState(
          () => _mensajeerror =
              'No se pudo conectar con el servidor central de SIGCE.',
        );
      }
    } finally {
      if (mounted) setState(() => _estacargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tematexto = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: temaaplicacion.lienzo,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 26),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Form(
                  key: claveformulario,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _construirmarca(),
                      const SizedBox(height: 28),
                      Text(
                        'Iniciar Sesión',
                        style: tematexto.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: temaaplicacion.tinta,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Selecciona tu rol institucional e ingresa tus credenciales.',
                        style: tematexto.bodyMedium,
                      ),
                      const SizedBox(height: 20),
                      _construirselectorrol(),
                      const SizedBox(height: 20),
                      if (_mensajeerror != null) ...[
                        _construirmensajeerror(),
                        const SizedBox(height: 18),
                      ],
                      // Campo Identificador Principal (CI / RUDE / Item)
                      _construircampotexto(
                        controller: controladoridentificador,
                        label: _rolseleccionado.etiquetadeidentificador,
                        hint: _rolseleccionado.ayudadeidentificador,
                        icon: Icons.badge_outlined,
                        keyboardType:
                            _rolseleccionado == _loginrole.familia ||
                                    _rolseleccionado == _loginrole.estudiante
                                ? TextInputType.number
                                : TextInputType.text,
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Ingrese el identificador solicitado.'
                            : null,
                      ),
                      // Campo Secundario exclusivo de FAMILIA (Celular)
                      if (_rolseleccionado.usasegundoidentificador) ...[
                        const SizedBox(height: 14),
                        _construircampotexto(
                          controller: controladoridentificadorsecundario,
                          label: 'Número de celular del tutor',
                          hint: 'Ej. 71234567',
                          icon: Icons.phone_android_outlined,
                          keyboardType: TextInputType.phone,
                          validator: (value) =>
                              value == null || value.trim().isEmpty
                              ? 'Ingrese el número de celular del tutor.'
                              : null,
                        ),
                      ],
                      // Campo Contraseña
                      if (_rolseleccionado.usaclave) ...[
                        const SizedBox(height: 14),
                        TextFormField(
                          controller: controladorclave,
                          obscureText: _ocultarclave,
                          keyboardType: TextInputType.visiblePassword,
                          decoration: InputDecoration(
                            labelText: 'Contraseña de acceso',
                            hintText: '••••••••••••',
                            prefixIcon: const Icon(Icons.key_outlined),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _ocultarclave
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                              ),
                              onPressed: () => setState(
                                () => _ocultarclave = !_ocultarclave,
                              ),
                            ),
                          ),
                          validator: (value) =>
                              value == null || value.length < 6
                              ? 'La contraseña debe tener al menos 6 caracteres.'
                              : null,
                        ),
                      ],
                      const SizedBox(height: 24),
                      SizedBox(
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _estacargando
                              ? null
                              : _procesariniciosesion,
                          child: _estacargando
                              ? const SizedBox(
                                  height: 22,
                                  width: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'Ingresar al sistema',
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    SizedBox(width: 8),
                                    Icon(Icons.arrow_forward_rounded, size: 18),
                                  ],
                                ),
                        ),
                      ),
                      if (_rolseleccionado == _loginrole.estudiante) ...[
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.go('/activate-student'),
                          child: const Text('Activar mi cuenta estudiantil'),
                        ),
                      ],
                      const SizedBox(height: 22),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          vertical: 12,
                          horizontal: 14,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: temaaplicacion.borde),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.verified_user_outlined,
                              size: 18,
                              color: temaaplicacion.marca,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _rolseleccionado == _loginrole.familia
                                    ? 'Acceso para Padres y Tutores legales acreditados.'
                                    : 'Acceso seguro al portal institucional.',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: temaaplicacion.tintatenue,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
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
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: temaaplicacion.borde),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            height: 52,
            width: 52,
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: temaaplicacion.fondomarca),
            ),
            child: Image.asset(
              'assets/brand/logo-sf.png',
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(
                Icons.school,
                color: temaaplicacion.marca,
                size: 32,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'COLEGIO COMUNIDAD CRISTIANA',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.2,
                    color: temaaplicacion.marca,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'SIGCE · Gestión Escolar Móvil',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: temaaplicacion.tintatenue,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _construirselectorrol() {
    return LayoutBuilder(
      builder: (context, constraints) {
        const spacing = 8.0;
        final itemwidth = (constraints.maxWidth - spacing) / 2;
        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: _loginrole.values.map((role) {
            final isselected = role == _rolseleccionado;
            return SizedBox(
              width: itemwidth,
              child: Material(
                color: isselected
                    ? temaaplicacion.fondomarca
                    : Colors.white,
                borderRadius: BorderRadius.circular(10),
                child: InkWell(
                  onTap: () => _seleccionarrol(role),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 11,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isselected
                            ? temaaplicacion.marca
                            : temaaplicacion.borde,
                        width: isselected ? 1.6 : 1,
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
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                role.titulo,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 12,
                                  color: isselected
                                      ? temaaplicacion.marca
                                      : temaaplicacion.tinta,
                                ),
                              ),
                              const SizedBox(height: 1),
                              Text(
                                role.subtitulo,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 10,
                                  color: isselected
                                      ? temaaplicacion.marca.withOpacity(0.8)
                                      : temaaplicacion.tintatenue,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
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
        borderRadius: BorderRadius.circular(10),
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
              style: const TextStyle(
                color: temaaplicacion.error,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
