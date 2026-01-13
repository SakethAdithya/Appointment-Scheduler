// User Model
class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? phone;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'USER',
      phone: json['phone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'phone': phone,
    };
  }
}

// Consultant Model
class Consultant {
  final String id;
  final String name;
  final String specialization;
  final String? email;
  final String? phone;
  final bool isActive;

  Consultant({
    required this.id,
    required this.name,
    required this.specialization,
    this.email,
    this.phone,
    this.isActive = true,
  });

  factory Consultant.fromJson(Map<String, dynamic> json) {
    return Consultant(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      specialization: json['specialization'] ?? '',
      email: json['email'],
      phone: json['phone'],
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'specialization': specialization,
      'email': email,
      'phone': phone,
      'isActive': isActive,
    };
  }
}

// Appointment Model
class Appointment {
  final String id;
  final User user;
  final Consultant consultant;
  final DateTime date;
  final String timeSlot;
  final String status;
  final DateTime? createdAt;

  Appointment({
    required this.id,
    required this.user,
    required this.consultant,
    required this.date,
    required this.timeSlot,
    required this.status,
    this.createdAt,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    // Handle user - could be populated object or just ID
    User userObj;
    if (json['user'] is Map) {
      userObj = User.fromJson(json['user']);
    } else {
      // If user is just an ID, create a minimal user object
      userObj = User(
        id: json['user']?.toString() ?? '',
        name: '',
        email: '',
        role: 'USER',
      );
    }

    // Handle consultant - could be populated object or just ID
    Consultant consultantObj;
    if (json['consultant'] is Map) {
      consultantObj = Consultant.fromJson(json['consultant']);
    } else {
      // If consultant is just an ID, create a minimal consultant object
      consultantObj = Consultant(
        id: json['consultant']?.toString() ?? '',
        name: 'Unknown',
        specialization: '',
      );
    }

    // Handle date - could be string or DateTime
    DateTime appointmentDate;
    if (json['date'] is String) {
      appointmentDate = DateTime.parse(json['date']);
    } else {
      appointmentDate = json['date'] as DateTime;
    }

    return Appointment(
      id: json['_id'] ?? json['id'] ?? '',
      user: userObj,
      consultant: consultantObj,
      date: appointmentDate,
      timeSlot: json['timeSlot'] ?? '',
      status: json['status'] ?? 'PENDING',
      createdAt: json['createdAt'] != null 
          ? (json['createdAt'] is String 
              ? DateTime.parse(json['createdAt'])
              : json['createdAt'] as DateTime)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'user': user.toJson(),
      'consultant': consultant.toJson(),
      'date': date.toIso8601String(),
      'timeSlot': timeSlot,
      'status': status,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  // Status helpers
  bool get isPending => status == 'PENDING';
  bool get isConfirmed => status == 'CONFIRMED';
  bool get isCancelled => status == 'CANCELLED';
  bool get isCompleted => status == 'COMPLETED';

  // Can user cancel?
  bool get canCancel => isPending || isConfirmed;

  // Get status color
  String get statusColor {
    switch (status) {
      case 'PENDING':
        return '#FFA500'; // Orange
      case 'CONFIRMED':
        return '#4CAF50'; // Green
      case 'CANCELLED':
        return '#F44336'; // Red
      case 'COMPLETED':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Grey
    }
  }
}