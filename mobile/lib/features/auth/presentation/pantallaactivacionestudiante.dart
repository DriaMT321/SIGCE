import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/providers/proveedoresautenticacion.dart';
import '../../../core/theme/temaaplicacion.dart';
import '../domain/use_cases/casosdeusoautenticacion.dart';
import '../domain/excepcionautenticacion.dart';

class pantallaactivacionestudiante extends ConsumerStatefulWidget {
  const pantallaactivacionestudiante({super.key});

  @override
  ConsumerState<pantallaactivacionestudiante> createState() =>
      _estudianteactivacionpantallaestado();
}

class _estudianteactivacionpantallaestado
    extends ConsumerState<pantallaactivacionestudiante> {
  final claveformulario = GlobalKey<FormState>();
  final controladortokenactivacion = TextEditingController();
  final controladorclave = TextEditingController();
  final controladorconfirmacion = TextEditingController();
  late final casodeusoactivarestudiante _activarcuentaestudiante;
  bool _estaenviando = false;
  bool _estaactivada = false;
  String? _mensajeerror;

  @override
  void initState() {
    super.initState();
    _activarcuentaestudiante = ref.read(proveedorcasodeusoactivarestudiante);
  }

  @override
  void dispose() {
    controladortokenactivacion.dispose();
    controladorclave.dispose();
    controladorconfirmacion.dispose();
    super.dispose();
  }

  Future<void> _activar() async {
    if (!(claveformulario.currentState?.validate() ?? false)) return;
    setState(() {
      _estaenviando = true;
      _mensajeerror = null;
    });

    try {
      await _activarcuentaestudiante.ejecutar(
        activationToken: controladortokenactivacion.text.trim(),
        clavenueva: controladorclave.text,
      );
      controladortokenactivacion.clear();
      controladorclave.clear();
      controladorconfirmacion.clear();
      if (mounted) setState(() => _estaactivada = true);
    } on excepcionautenticacion catch (error) {
      if (mounted) setState(() => _mensajeerror = error.mensaje);
    } finally {
      if (mounted) setState(() => _estaenviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tematexto = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Activar cuenta estudiantil')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 460),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(22),
                  child: _estaactivada
                      ? _construirexito(tematexto)
                      : _construirformulario(tematexto),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _construirformulario(TextTheme tematexto) {
    return Form(
      key: claveformulario,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Icon(
            Icons.school_outlined,
            size: 36,
            color: temaaplicacion.marca,
          ),
          const SizedBox(height: 12),
          Text(
            'Crea tu clave personal',
            textAlign: TextAlign.center,
            style: tematexto.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            'Usa el código entregado por la institución. Vence en siete días y solo se puede usar una vez.',
            textAlign: TextAlign.center,
            style: tematexto.bodyMedium,
          ),
          const SizedBox(height: 22),
          TextFormField(
            controller: controladortokenactivacion,
            autocorrect: false,
            enableSuggestions: false,
            textCapitalization: TextCapitalization.none,
            decoration: const InputDecoration(
              labelText: 'Código de activación',
              prefixIcon: Icon(Icons.key_outlined),
            ),
            validator: (value) {
              final token = value?.trim() ?? '';
              return token.length < 32 || token.length > 100
                  ? 'Ingresa el código de activación completo.'
                  : null;
            },
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: controladorclave,
            obscureText: true,
            enableSuggestions: false,
            autocorrect: false,
            maxLength: 72,
            decoration: const InputDecoration(
              labelText: 'Nueva clave',
              helperText: 'Mínimo 12 caracteres; máximo 72 bytes UTF-8.',
              prefixIcon: Icon(Icons.lock_outline),
            ),
            validator: (value) {
              final clave = value ?? '';
              final bytelength = utf8.encode(clave).length;
              return clave.trim().isEmpty ||
                      clave.runes.length < 12 ||
                      bytelength > 72
                  ? 'No uses solo espacios; mínimo 12 caracteres y máximo 72 bytes UTF-8.'
                  : null;
            },
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: controladorconfirmacion,
            obscureText: true,
            enableSuggestions: false,
            autocorrect: false,
            decoration: const InputDecoration(
              labelText: 'Repetir nueva clave',
              prefixIcon: Icon(Icons.lock_reset_outlined),
            ),
            validator: (value) => value != controladorclave.text
                ? 'Las claves no coinciden.'
                : null,
          ),
          if (_mensajeerror != null) ...[
            const SizedBox(height: 14),
            Semantics(
              liveRegion: true,
              child: Text(
                _mensajeerror!,
                style: const TextStyle(color: temaaplicacion.error),
              ),
            ),
          ],
          const SizedBox(height: 20),
          SizedBox(
            height: 50,
            child: ElevatedButton(
              onPressed: _estaenviando ? null : _activar,
              child: _estaenviando
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Guardar clave y activar'),
            ),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => context.go('/login'),
            child: const Text('Volver al inicio de sesión'),
          ),
        ],
      ),
    );
  }

  Widget _construirexito(TextTheme tematexto) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.verified_user_outlined,
          size: 40,
          color: temaaplicacion.exito,
        ),
        const SizedBox(height: 12),
        Text('Cuenta activada', style: tematexto.titleLarge),
        const SizedBox(height: 8),
        Text(
          'Ya puedes ingresar con tu RUDE o cédula y la nueva clave.',
          textAlign: TextAlign.center,
          style: tematexto.bodyMedium,
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => context.go('/login'),
            child: const Text('Ir al inicio de sesión'),
          ),
        ),
      ],
    );
  }
}
