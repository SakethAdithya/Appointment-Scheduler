import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class AppointmentProvider extends ChangeNotifier {
  final ApiService _api = ApiService();
  List<Appointment> appointments = [];
  bool loading = false;

  String? errorMessage;

  Future<void> fetchMyAppointments() async {
    loading = true;
    errorMessage = null;
    notifyListeners();

    try {
      final res = await _api.getMyAppointments();
      if (res['success']) {
        try {
          appointments = (res['appointments'] as List)
              .map((e) => Appointment.fromJson(e))
              .toList();
          errorMessage = null;
        } catch (e) {
          errorMessage = 'Error parsing appointments: $e';
          appointments = [];
        }
      } else {
        errorMessage = res['message'] ?? 'Failed to load appointments';
        appointments = [];
      }
    } catch (e) {
      errorMessage = 'Network error: $e';
      appointments = [];
    }

    loading = false;
    notifyListeners();
  }

  Future<void> cancelAppointment(String id) async {
    await _api.cancelAppointment(id);
    await fetchMyAppointments();
  }
}
