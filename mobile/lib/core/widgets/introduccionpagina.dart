import 'package:flutter/material.dart';

class introduccionpagina extends StatelessWidget {
  const introduccionpagina({
    super.key,
    required this.titulo,
    required this.descripcion,
    this.complemento,
  });

  final String titulo;
  final String descripcion;
  final Widget? complemento;

  @override
  Widget build(BuildContext context) {
    final tematexto = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(titulo, style: tematexto.headlineSmall),
                const SizedBox(height: 5),
                Text(descripcion, style: tematexto.bodyMedium),
              ],
            ),
          ),
          if (complemento != null) ...[const SizedBox(width: 12), complemento!],
        ],
      ),
    );
  }
}
