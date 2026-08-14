import 'dart:convert';

import 'package:dio/dio.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';

class AuthRepository {
  AuthRepository(this._apiClient, this._storageService);

  final ApiClient _apiClient;
  final SecureStorageService _storageService;

  Future<void> login({
    required String role,
    required String identifier,
    String? secret,
    String? secondaryIdentifier,
  }) async {
    try {
      final response = await _apiClient.client.post(
        '/auth/role-login',
        data: <String, String>{
          'role': role,
          'identifier': identifier,
          if (secret != null && secret.isNotEmpty) 'secret': secret,
          if (secondaryIdentifier != null && secondaryIdentifier.isNotEmpty)
            'secondaryIdentifier': secondaryIdentifier,
        },
      );

      final responseBody = response.data;
      final data = responseBody is Map<String, dynamic> ? responseBody['data'] : null;
      if (data is! Map<String, dynamic>) {
        throw const AuthException('La respuesta de autenticación no es válida.');
      }

      final accessToken = data['accessToken'];
      final refreshToken = data['refreshToken'];
      if (accessToken is! String || refreshToken is! String) {
        throw const AuthException('La respuesta de autenticación está incompleta.');
      }

      await _storageService.saveTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
      );

      final user = data['user'];
      if (user is Map<String, dynamic>) {
        await _storageService.saveUserData(jsonEncode(user));
      }
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        throw const AuthException('El usuario o la contraseña son incorrectos.');
      }
      throw const AuthException('No se pudo conectar con el servidor. Intenta nuevamente.');
    }
  }
}

class AuthException implements Exception {
  const AuthException(this.message);

  final String message;
}
