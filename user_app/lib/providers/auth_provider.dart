import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  User? user;
  bool isLoading = false;
  String? errorMessage;

  bool get isLoggedIn => user != null;

  Future<bool> login(String email, String password) async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    final res = await _api.login(email, password);
    if (res['success']) {
      try {
        final profile = await _api.getProfile();
        if (profile['success'] && profile['user'] != null) {
          user = User.fromJson(profile['user']);
          isLoading = false;
          errorMessage = null;
          notifyListeners();
          return true;
        } else {
          errorMessage = profile['message'] ?? 'Failed to load user profile';
          isLoading = false;
          notifyListeners();
          return false;
        }
      } catch (e) {
        errorMessage = 'Failed to load user profile: $e';
        isLoading = false;
        notifyListeners();
        return false;
      }
    }

    errorMessage = res['message'] ?? 'Login failed';
    isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    final res = await _api.register(
      name: name,
      email: email,
      password: password,
      phone: phone,
    );

    if (res['success']) {
      try {
        // After registration, automatically log in by getting profile
        final profile = await _api.getProfile();
        if (profile['success'] && profile['user'] != null) {
          user = User.fromJson(profile['user']);
          isLoading = false;
          errorMessage = null;
          notifyListeners();
          return true;
        } else {
          errorMessage = profile['message'] ?? 'Registration successful but failed to load profile';
          isLoading = false;
          notifyListeners();
          return false;
        }
      } catch (e) {
        errorMessage = 'Registration successful but failed to load profile: $e';
        isLoading = false;
        notifyListeners();
        return false;
      }
    }

    errorMessage = res['message'] ?? 'Registration failed';
    isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _api.logout();
    user = null;
    notifyListeners();
  }
}
