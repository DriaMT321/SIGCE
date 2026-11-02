import 'package:flutter/material.dart';

class etiquetaestado extends StatelessWidget {
  const etiquetaestado({
    super.key,
    required this.etiqueta,
    required this.colortexto,
    required this.colorfondo,
  });

  final String etiqueta;
  final Color colortexto;
  final Color colorfondo;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 28),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: colorfondo,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        etiqueta,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
          color: colortexto,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
        ),
      ),
    );
  }
}
