import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../data/auth_repository.dart';

enum _LoginRole { student, teacher, family, administrative }

extension _LoginRoleDetails on _LoginRole {
  String get apiValue {
    switch (this) {
      case _LoginRole.student:
        return 'STUDENT';
      case _LoginRole.teacher:
        return 'TEACHER';
      case _LoginRole.family:
        return 'FAMILY';
      case _LoginRole.administrative:
        return 'ADMINISTRATIVE';
    }
  }

  String get title {
    switch (this) {
      case _LoginRole.student:
        return 'Estudiante';
      case _LoginRole.teacher:
        return 'Docente';
      case _LoginRole.family:
        return 'Familiar';
      case _LoginRole.administrative:
        return 'Administrativo';
    }
  }

  String get description {
    switch (this) {
      case _LoginRole.student:
        return 'Código de alumno';
      case _LoginRole.teacher:
        return 'Código y clave';
      case _LoginRole.family:
        return 'CI y celular';
      case _LoginRole.administrative:
        return 'Código y clave';
    }
  }

  IconData get icon {
    switch (this) {
      case _LoginRole.student:
        return Icons.school_outlined;
      case _LoginRole.teacher:
        return Icons.cast_for_education_outlined;
      case _LoginRole.family:
        return Icons.family_restroom_outlined;
      case _LoginRole.administrative:
        return Icons.admin_panel_settings_outlined;
    }
  }

  String get identifierLabel {
    switch (this) {
      case _LoginRole.student:
        return 'Código de alumno';
      case _LoginRole.teacher:
        return 'Código de docente';
      case _LoginRole.family:
        return 'Cédula de identidad';
      case _LoginRole.administrative:
        return 'Código de administrador';
    }
  }

  String get identifierHint {
    switch (this) {
      case _LoginRole.student:
        return 'Ej. RUDE-000123';
      case _LoginRole.teacher:
        return 'Ej. DOC-000123';
      case _LoginRole.family:
        return 'Ej. 1234567';
      case _LoginRole.administrative:
        return 'Correo institucional asignado';
    }
  }

  bool get usesSecret => this == _LoginRole.teacher || this == _LoginRole.administrative;

  bool get usesSecondaryIdentifier => this == _LoginRole.family;
}

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _secretController = TextEditingController();
  final _secondaryIdentifierController = TextEditingController();
  late final AuthRepository _authRepository;
  _LoginRole _selectedRole = _LoginRole.administrative;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    final storageService = SecureStorageService();
    _authRepository = AuthRepository(ApiClient(storageService), storageService);
  }

  @override
  void dispose() {
    _identifierController.dispose();
    _secretController.dispose();
    _secondaryIdentifierController.dispose();
    super.dispose();
  }

  void _selectRole(_LoginRole role) {
    setState(() {
      _selectedRole = role;
      _errorMessage = null;
    });
    _formKey.currentState?.reset();
  }

  Future<void> _handleLogin() async {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await _authRepository.login(
        role: _selectedRole.apiValue,
        identifier: _identifierController.text.trim(),
        secret: _selectedRole.usesSecret ? _secretController.text : null,
        secondaryIdentifier: _selectedRole.usesSecondaryIdentifier
            ? _secondaryIdentifierController.text.trim()
            : null,
      );
      if (mounted) {
        context.go('/students');
      }
    } on AuthException catch (error) {
      if (mounted) {
        setState(() => _errorMessage = error.message);
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          const Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFFF8C311), Color(0xFFF37022), Color(0xFFB91329)],
                ),
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Card(
                    color: Colors.white,
                    clipBehavior: Clip.antiAlias,
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _buildBrand(),
                            const SizedBox(height: 24),
                            const Text(
                              'Selecciona tu acceso',
                              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Elige tu rol e ingresa los datos asignados por la institución.',
                              style: TextStyle(color: Color(0xFF64748B)),
                            ),
                            const SizedBox(height: 20),
                            _buildRoleSelector(),
                            const SizedBox(height: 22),
                            if (_errorMessage != null) ...[
                              _buildErrorMessage(),
                              const SizedBox(height: 18),
                            ],
                            _buildTextField(
                              controller: _identifierController,
                              label: _selectedRole.identifierLabel,
                              hint: _selectedRole.identifierHint,
                              icon: Icons.badge_outlined,
                              keyboardType: TextInputType.text,
                              validator: (value) => value == null || value.trim().isEmpty
                                  ? 'Ingresa el identificador solicitado.'
                                  : null,
                            ),
                            if (_selectedRole.usesSecondaryIdentifier) ...[
                              const SizedBox(height: 16),
                              _buildTextField(
                                controller: _secondaryIdentifierController,
                                label: 'Número de celular',
                                hint: 'Ej. 70000000',
                                icon: Icons.phone_android_outlined,
                                keyboardType: TextInputType.phone,
                                validator: (value) => value == null || value.trim().isEmpty
                                    ? 'Ingresa el número de celular.'
                                    : null,
                              ),
                            ],
                            if (_selectedRole.usesSecret) ...[
                              const SizedBox(height: 16),
                              _buildTextField(
                                controller: _secretController,
                                label: 'Clave',
                                hint: '••••••••',
                                icon: Icons.key_outlined,
                                obscureText: true,
                                keyboardType: TextInputType.visiblePassword,
                                validator: (value) => value == null || value.length < 6
                                    ? 'La clave debe tener al menos 6 caracteres.'
                                    : null,
                              ),
                            ],
                            const SizedBox(height: 24),
                            SizedBox(
                              height: 50,
                              child: ElevatedButton(
                                onPressed: _isLoading ? null : _handleLogin,
                                child: _isLoading
                                    ? const SizedBox(
                                        height: 22,
                                        width: 22,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                      )
                                    : const Text('Ingresar al sistema'),
                              ),
                            ),
                            const SizedBox(height: 18),
                            const Text(
                              'Utiliza los datos asignados por tu institución.',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBrand() {
    return Column(
      children: [
        Container(
          height: 56,
          width: 56,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: const LinearGradient(
              colors: [Color(0xFFF8C311), Color(0xFFF37022), Color(0xFFB91329)],
            ),
          ),
          child: const Icon(Icons.school_rounded, size: 32, color: Colors.white),
        ),
        const SizedBox(height: 12),
        const Text(
          'Gestión Académica Móvil',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }

  Widget _buildRoleSelector() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final itemWidth = (constraints.maxWidth - 12) / 2;
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: _LoginRole.values.map((role) {
            final isSelected = role == _selectedRole;
            return SizedBox(
              width: itemWidth,
              child: OutlinedButton.icon(
                onPressed: () => _selectRole(role),
                icon: Icon(role.icon, size: 21),
                label: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(role.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(role.description, style: TextStyle(fontSize: 11, color: isSelected ? Colors.white70 : const Color(0xFF64748B))),
                  ],
                ),
                style: OutlinedButton.styleFrom(
                  alignment: Alignment.centerLeft,
                  foregroundColor: isSelected ? Colors.white : AppTheme.accentColor,
                  backgroundColor: isSelected ? AppTheme.accentColor : Colors.white,
                  side: BorderSide(color: isSelected ? AppTheme.accentColor : const Color(0xFFE2E8F0)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }

  Widget _buildTextField({
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
      style: const TextStyle(color: Color(0xFF0F172A)),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: const TextStyle(color: Color(0xFF475569)),
        hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
        prefixIcon: Icon(icon, color: AppTheme.accentColor),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppTheme.secondaryColor, width: 2),
        ),
      ),
      validator: validator,
    );
  }

  Widget _buildErrorMessage() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.accentColor.withOpacity(0.08),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppTheme.accentColor.withOpacity(0.25)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.error_outline, size: 20, color: AppTheme.accentColor),
          const SizedBox(width: 10),
          Expanded(child: Text(_errorMessage!, style: const TextStyle(color: AppTheme.accentColor))),
        ],
      ),
    );
  }
}
