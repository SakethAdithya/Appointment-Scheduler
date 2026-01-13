import 'package:flutter/material.dart';
import '../models/models.dart';

class AppointmentCard extends StatelessWidget {
  final Appointment appointment;
  final VoidCallback? onCancel;

  const AppointmentCard({
    super.key,
    required this.appointment,
    this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(appointment.consultant.name),
        subtitle: Text(
          "${appointment.date.toLocal().toString().split(' ')[0]} • ${appointment.timeSlot}",
        ),
        trailing: appointment.canCancel
            ? IconButton(
                icon: const Icon(Icons.cancel, color: Colors.red),
                onPressed: onCancel,
              )
            : Text(appointment.status),
      ),
    );
  }
}
