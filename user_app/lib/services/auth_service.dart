// import 'package:flutter/foundation.dart';
// import 'package:shared_preferences/shared_preferences.dart';
// import 'dart:convert';
// import '../models/models.dart';
// import 'api_service.dart';

// class AuthService extends ChangeNotifier {
//   final ApiService _apiService = ApiService();
//   User? _currentUser;
//   String? _token;
//   bool _isLoading = false;

//   User? get currentUser => _currentUser;
//   String? get token => _token;
//   bool get isAuthenticated => _currentUser != null && _token != null;
//   bool get isLoading => _isLoading;
//   ApiService get apiService => _apiService;

//   AuthService() {
//     _loadUserFromStorage();
//   }

//   Future<void> _loadUserFromStorage() async {
//     try {
//       final prefs = await SharedPreferences.getInstance();
//       final userJson = prefs.getString('user');
//       final token = prefs.getString('token');

//       if (userJson != null && token != null) {
//         _currentUser = User.fromJson(jsonDecode(userJson));
//         _token = token;
//         _apiService.setToken(token);
//         notifyListeners();
//       }
//     } catch (e) {
//       debugPrint('Error loading user from storage: $e');
//     }
//   }

//   Future<void> login(String email, String password) async {
//     _isLoading = true;
//     notifyListeners();

//     try {
//       final response = await _apiService.login(email, password);
      
//       if (response['user']['role'] != 'user') {
//         throw Exception('Please use user credentials');
//       }

//       _currentUser = User.fromJson(response['user']);
//       _token = response['token'];
//       _apiService.setToken(_token!);

//       // Save to storage
//       final prefs = await SharedPreferences.getInstance();
//       await prefs.setString('user', jsonEncode(_currentUser!.toJson()));
//       await prefs.setString('token', _token!);

//       _isLoading = false;
//       notifyListeners();
//     } catch (e) {
//       _isLoading = false;
//       notifyListeners();
//       rethrow;
//     }
//   }

//   Future<void> register(Map<String, dynamic> userData) async {
//     _isLoading = true;
//     notifyListeners();

//     try {
//       userData['role'] = 'user';
//       await _apiService.register(userData);
//       _isLoading = false;
//       notifyListeners();
//     } catch (e) {
//       _isLoading = false;
//       notifyListeners();
//       rethrow;
//     }
//   }

//   Future<void> logout() async {
//     _currentUser = null;
//     _token = null;
//     _apiService.clearToken();

//     final prefs = await SharedPreferences.getInstance();
//     await prefs.remove('user');
//     await prefs.remove('token');

//     notifyListeners();
//   }
// }