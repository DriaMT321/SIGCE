abstract interface class puertodeautenticacion {
  Future<perfilusuarioactual?> obtenerperfilusuarioactual();

  Future<void> activarcuentaestudiante({
    required String activationToken,
    required String clavenueva,
  });

  Future<void> iniciarsesion({
    required String role,
    required String identifier,
    String? secret,
    String? identificadorsecundario,
  });

  Future<void> cerrarsesion();
}

class perfilusuarioactual {
  const perfilusuarioactual({
    required this.nombre,
    required this.apellidos,
    required this.correo,
    required this.rol,
  });

  final String? nombre;
  final String? apellidos;
  final String? correo;
  final String? rol;

  String get nombrevisible => [
    nombre,
    apellidos,
  ].whereType<String>().where((part) => part.trim().isNotEmpty).join(' ');
}
