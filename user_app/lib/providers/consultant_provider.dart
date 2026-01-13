import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class ConsultantProvider extends ChangeNotifier {
  final ApiService _api = ApiService();
  List<Consultant> consultants = [];
  bool loading = false;

  Future<void> fetchConsultants() async {
    loading = true;
    notifyListeners();

    final res = await _api.getConsultants();
    if (res['success']) {
      consultants = (res['consultants'] as List)
          .map((e) => Consultant.fromJson(e))
          .toList();
    }

    loading = false;
    notifyListeners();
  }
}
