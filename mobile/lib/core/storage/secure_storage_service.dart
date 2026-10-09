import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String _accessTokenKey = 'jwt_access_token';
  static const String _refreshTokenKey = 'jwt_refresh_token';
  static const String _userDataKey = 'auth_user_data';

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: _accessTokenKey);
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  Future<void> saveUserData(String userDataJson) async {
    await _storage.write(key: _userDataKey, value: userDataJson);
  }

  Future<String?> getUserData() async {
    return await _storage.read(key: _userDataKey);
  }

  Future<void> saveCache(String key, String jsonString) async {
    await _storage.write(key: 'cache_$key', value: jsonString);
    await _storage.write(key: 'cache_time_$key', value: DateTime.now().toIso8601String());
  }

  Future<String?> getCache(String key) async {
    return await _storage.read(key: 'cache_$key');
  }

  Future<DateTime?> getCacheTimestamp(String key) async {
    final str = await _storage.read(key: 'cache_time_$key');
    if (str == null) return null;
    return DateTime.tryParse(str);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
