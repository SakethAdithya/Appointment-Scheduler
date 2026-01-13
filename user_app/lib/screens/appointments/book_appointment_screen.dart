import 'package:flutter/material.dart';
import '../../models/models.dart';
import '../../services/api_service.dart';

class BookAppointmentScreen extends StatefulWidget {
  final Consultant consultant;
  const BookAppointmentScreen({super.key, required this.consultant});

  @override
  State<BookAppointmentScreen> createState() => _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends State<BookAppointmentScreen> {
  final api = ApiService();
  DateTime selectedDate = DateTime.now();
  List<String> slots = [];
  String? selectedSlot;
  bool loading = false;

  Future<void> loadSlots() async {
    setState(() => loading = true);
    final res = await api.getAvailableSlots(
      consultantId: widget.consultant.id,
      date: selectedDate.toIso8601String().split('T')[0],
    );
    if (res['success']) {
      slots = List<String>.from(res['availableSlots']);
    }
    setState(() => loading = false);
  }

  @override
  void initState() {
    super.initState();
    loadSlots();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text("Appointment Scheduler", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text("Book Appointment", style: TextStyle(fontSize: 18)),
          ],
        ),
        centerTitle: true,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.person, color: Theme.of(context).primaryColor),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      widget.consultant.name,
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      widget.consultant.specialization,
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.calendar_today, color: Theme.of(context).primaryColor),
                              const SizedBox(width: 12),
                              const Text(
                                "Select Date",
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                final date = await showDatePicker(
                                  context: context,
                                  firstDate: DateTime.now(),
                                  lastDate: DateTime.now().add(const Duration(days: 30)),
                                  initialDate: selectedDate,
                                );
                                if (date != null) {
                                  selectedDate = date;
                                  await loadSlots();
                                  setState(() {});
                                }
                              },
                              icon: const Icon(Icons.date_range),
                              label: Text(
                                "${selectedDate.toLocal().toString().split(' ')[0]}",
                                style: const TextStyle(fontSize: 16),
                              ),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (slots.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.access_time, color: Theme.of(context).primaryColor),
                                const SizedBox(width: 12),
                                const Text(
                                  "Available Time Slots",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Wrap(
                              spacing: 12,
                              runSpacing: 12,
                              children: slots.map((slot) {
                                return ChoiceChip(
                                  label: Text(slot),
                                  selected: selectedSlot == slot,
                                  onSelected: (_) => setState(() => selectedSlot = slot),
                                  selectedColor: Theme.of(context).primaryColor.withOpacity(0.2),
                                  labelStyle: TextStyle(
                                    color: selectedSlot == slot
                                        ? Theme.of(context).primaryColor
                                        : Colors.grey[700],
                                    fontWeight: selectedSlot == slot
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 12,
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ] else if (!loading) ...[
                    const SizedBox(height: 24),
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          children: [
                            Icon(Icons.info_outline, color: Colors.orange),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                "No available slots for this date. Please select another date.",
                                style: TextStyle(color: Colors.grey[700]),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: selectedSlot == null
                          ? null
                          : () async {
                              await api.createAppointment(
                                consultantId: widget.consultant.id,
                                date: selectedDate.toIso8601String().split('T')[0],
                                timeSlot: selectedSlot!,
                              );
                              if (mounted) {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text("Appointment booked successfully!"),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              }
                            },
                      icon: const Icon(Icons.check_circle),
                      label: const Text(
                        "Confirm Booking",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
