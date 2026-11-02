import 'package:flutter/material.dart';

import '../theme/temaaplicacion.dart';

class avisosinconexion extends StatelessWidget {
  const avisosinconexion({super.key, required this.fechaactualizacion});

  final String fechaactualizacion;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
      decoration: BoxDecoration(
        color: temaaplicacion.fondoadvertencia,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: temaaplicacion.bordeadvertencia),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.cloud_off_outlined,
            size: 19,
            color: temaaplicacion.advertencia,
          ),
          const SizedBox(width: 9),
          Expanded(
            child: Text(
              'Modo sin conexión · $fechaactualizacion',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: const Color(0xFF5E4811),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
