import 'package:flutter/material.dart';

import '../theme/temaaplicacion.dart';

class estadomensaje extends StatelessWidget {
  const estadomensaje({
    super.key,
    required this.icono,
    required this.titulo,
    required this.mensaje,
    this.etiquetaaccion,
    this.alaccion,
  });

  final IconData icono;
  final String titulo;
  final String mensaje;
  final String? etiquetaaccion;
  final VoidCallback? alaccion;

  @override
  Widget build(BuildContext context) {
    final tematexto = Theme.of(context).textTheme;
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 340),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: const BoxDecoration(
                  color: temaaplicacion.fondomarca,
                  shape: BoxShape.circle,
                ),
                child: Icon(icono, color: temaaplicacion.marca, size: 26),
              ),
              const SizedBox(height: 18),
              Text(
                titulo,
                style: tematexto.titleLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 7),
              Text(
                mensaje,
                style: tematexto.bodyMedium,
                textAlign: TextAlign.center,
              ),
              if (etiquetaaccion != null && alaccion != null) ...[
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: alaccion,
                  child: Text(etiquetaaccion!),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
