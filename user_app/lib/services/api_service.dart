import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Change this based on your setup:
  // Android Emulator: http://10.0.2.2:5000/api
  // iOS Simulator: http://localhost:5000/api
  // Web/Chrome: http://localhost:5000/api
  // Real Device: http://YOUR_IP_ADDRESS:5000/api
  static String get baseUrl {
    if (kIsWeb) {
      // For web/Chrome, use localhost
      return "http://localhost:5000/api";
    } else {
      // For Android emulator
      return "http://10.0.2.2:5000/api";
    }
  }

  // Get stored token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // Save token
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  // Clear token (logout)
  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  // Common headers
  Future<Map<String, String>> getHeaders({bool needsAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (needsAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // ==================== AUTH ENDPOINTS ====================

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${baseUrl}/auth/login'),
        headers: await getHeaders(needsAuth: false),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      // Handle non-JSON responses
      if (response.body.isEmpty) {
        return {'success': false, 'message': 'Empty response from server'};
      }

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body) as Map<String, dynamic>;
      } catch (e) {
        return {'success': false, 'message': 'Invalid response format: ${response.body}'};
      }

      if (response.statusCode == 200) {
        // Save token
        if (data['token'] != null) {
          await saveToken(data['token']);
          return {'success': true, 'data': data};
        } else {
          return {'success': false, 'message': 'Token not received from server'};
        }
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Register
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${baseUrl}/auth/register'),
        headers: await getHeaders(needsAuth: false),
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'phone': phone,
        }),
      );

      if (response.body.isEmpty) {
        return {'success': false, 'message': 'Empty response from server'};
      }

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body) as Map<String, dynamic>;
      } catch (e) {
        return {'success': false, 'message': 'Invalid response format: ${response.body}'};
      }

      if (response.statusCode == 201) {
        // Save token
        if (data['token'] != null) {
          await saveToken(data['token']);
          return {'success': true, 'data': data};
        } else {
          return {'success': false, 'message': 'Token not received from server'};
        }
      } else {
        return {'success': false, 'message': data['message'] ?? 'Registration failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Get Profile
  Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile'),
        headers: await getHeaders(),
      );

      if (response.body.isEmpty) {
        return {'success': false, 'message': 'Empty response from server'};
      }

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body) as Map<String, dynamic>;
      } catch (e) {
        return {'success': false, 'message': 'Invalid response format: ${response.body}'};
      }

      if (response.statusCode == 200) {
        return {'success': true, 'user': data['user']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Failed to get profile'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // ==================== CONSULTANT ENDPOINTS ====================

  // Get all consultants
  Future<Map<String, dynamic>> getConsultants() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/consultants'),
        headers: await getHeaders(),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'consultants': data['consultants']};
      } else {
        return {'success': false, 'message': data['message']};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Get consultant by ID
  Future<Map<String, dynamic>> getConsultantById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/consultants/$id'),
        headers: await getHeaders(),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'consultant': data['consultant']};
      } else {
        return {'success': false, 'message': data['message']};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // ==================== APPOINTMENT ENDPOINTS ====================

  // Get available slots
  Future<Map<String, dynamic>> getAvailableSlots({
    required String consultantId,
    required String date, // Format: YYYY-MM-DD
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/appointments/available-slots?consultantId=$consultantId&date=$date'),
        headers: await getHeaders(),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'availableSlots': data['availableSlots'],
          'bookedSlots': data['bookedSlots'],
        };
      } else {
        return {'success': false, 'message': data['message']};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Create appointment
  Future<Map<String, dynamic>> createAppointment({
    required String consultantId,
    required String date, // Format: YYYY-MM-DD
    required String timeSlot, // Format: HH:MM
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/appointments'),
        headers: await getHeaders(),
        body: jsonEncode({
          'consultantId': consultantId,
          'date': date,
          'timeSlot': timeSlot,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        return {'success': true, 'appointment': data['appointment']};
      } else {
        return {'success': false, 'message': data['message']};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Get user's appointments
  Future<Map<String, dynamic>> getMyAppointments({String? status}) async {
    try {
      String url = '$baseUrl/appointments/my-appointments';
      if (status != null) {
        url += '?status=$status';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: await getHeaders(),
      );

      if (response.body.isEmpty) {
        return {'success': false, 'message': 'Empty response from server'};
      }

      Map<String, dynamic> data;
      try {
        data = jsonDecode(response.body) as Map<String, dynamic>;
      } catch (e) {
        return {'success': false, 'message': 'Invalid response format: ${response.body}'};
      }

      if (response.statusCode == 200) {
        return {
          'success': true,
          'appointments': data['appointments'] ?? []
        };
      } else {
        return {'success': false, 'message': data['message'] ?? 'Failed to fetch appointments'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  // Cancel appointment
  Future<Map<String, dynamic>> cancelAppointment(String appointmentId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/appointments/$appointmentId/cancel'),
        headers: await getHeaders(),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'message': data['message']};
      } else {
        return {'success': false, 'message': data['message']};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Get appointment details
  Future<Map<String, dynamic>> getAppointmentById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/appointments/$id'),
        headers: await getHeaders(),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {'success': true, 'appointment': data['appointment']};
      } else {
        return {'success': false, 'message': data['message']};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Logout
  Future<void> logout() async {
    await clearToken();
  }
}