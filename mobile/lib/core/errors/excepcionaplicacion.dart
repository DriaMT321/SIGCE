class excepcionaplicacion implements Exception {
  final String mensaje;
  final int? codigorespuesta;

  excepcionaplicacion(this.mensaje, [this.codigorespuesta]);

  @override
  String toString() => 'AppException: $mensaje (Status: $codigorespuesta)';
}
