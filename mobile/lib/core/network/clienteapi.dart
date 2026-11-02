import 'package:dio/dio.dart';

import '../config/configuracionaplicacion.dart';
import '../storage/servicioalmacenamientoseguro.dart';
import './interceptordautenticacion.dart';

class clienteapi {
  final Dio _clientehttp;
  final seguroalmacenamientoservicio _servicioalmacenamiento;

  clienteapi(this._servicioalmacenamiento)
    : _clientehttp = Dio(_opcionespredeterminadas()),
      _diotorenovacion = Dio(_opcionespredeterminadas()) {
    _clientehttp.interceptors.add(
      interceptordautenticacion(
        _servicioalmacenamiento,
        _clientehttp,
        _diotorenovacion,
      ),
    );
  }

  final Dio _diotorenovacion;

  static BaseOptions _opcionespredeterminadas() => BaseOptions(
    baseUrl: configuracionaplicacion.urlbaseapi,
    connectTimeout: configuracionaplicacion.tiempolimiteconexion,
    receiveTimeout: configuracionaplicacion.tiempolimiteespera,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
  );

  Dio get cliente => _clientehttp;
}
