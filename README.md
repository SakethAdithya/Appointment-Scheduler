# Appointment Scheduler

A full-stack appointment scheduling system with a Flutter mobile app for users and a React admin panel for administrators. Built with Node.js, Express, MongoDB, Flutter, and React.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Credentials](#credentials)
- [System Logic & Architecture](#system-logic--architecture)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### User App (Flutter)
- **User Authentication**: Register and login with email/password
- **Consultant Browsing**: View available consultants with their specializations
- **Appointment Booking**: Book appointments with consultants
  - Select date (Monday-Friday only)
  - Choose from available time slots (10:00 AM - 6:00 PM)
  - View appointment details
- **Appointment Management**: 
  - View all appointments
  - Cancel pending/confirmed appointments
  - See appointment status (Pending, Confirmed, Cancelled, Completed)
- **Profile Management**: View profile and logout

### Admin Panel (React)
- **Admin Authentication**: Secure admin login
- **Appointment Management**: View all appointments in a table
- **Status Updates**: Update appointment status (Pending → Confirmed → Completed)
- **Dashboard**: Overview of all appointments with filtering capabilities

### Backend Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Separate permissions for Admin and User roles
- **Business Rules**:
  - Appointments only on weekdays (Monday-Friday)
  - Working hours: 10:00 AM - 6:00 PM
  - Maximum 3 appointments per user per day
  - No overlapping appointments for consultants
  - Users can only cancel their own appointments
  - Admins can update appointment statuses

---

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **Flutter** (Dart) - User mobile app
- **React** - Admin web panel
- **Provider** - State management (Flutter)
- **Axios** - HTTP client (React)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
3. **Flutter SDK** (v3.0 or higher) - [Install Flutter](https://docs.flutter.dev/get-started/install)
4. **Git** (optional, for cloning)

---

## 🚀 Setup Instructions

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd Appointment_Schedular_project
```

### Step 2: Setup Backend

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment File

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/appointment_scheduler
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment_scheduler
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

#### 2.4 Start MongoDB

**Local MongoDB:**
- **Windows**: MongoDB should start automatically as a service, or run `mongod` in a terminal
- **Mac/Linux**: Run `mongod` or `brew services start mongodb-community`

**MongoDB Atlas:**
- No local setup needed, just use your Atlas connection string in `.env`

#### 2.5 Seed Database (Create Test Data)

This will create the admin user, test users, and sample consultants:

```bash
npm run seed
```

#### 2.6 Start Backend Server

```bash
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
📱 Flutter App can connect to: http://localhost:5000/api
💻 Admin Panel can connect to: http://localhost:5000/api
```

**Keep this terminal open!** The backend must be running.

---

### Step 3: Setup Flutter User App

#### 3.1 Open a NEW Terminal Window

Keep the backend terminal running, open a new terminal.

#### 3.2 Navigate to Flutter App Directory
```bash
cd user_app
```

#### 3.3 Install Flutter Dependencies
```bash
flutter pub get
```

#### 3.4 Run the App

**For Web (Chrome):**
```bash
flutter run -d chrome
```

**For Android:**
```bash
flutter run -d android
```

**For iOS (Mac only):**
```bash
flutter run -d ios
```

**For Windows Desktop:**
```bash
flutter run -d windows
```

The app will open automatically in the selected platform.

---

### Step 4: Setup Admin Panel (React)

#### 4.1 Open a NEW Terminal Window

Keep the backend terminal running, open a new terminal.

#### 4.2 Navigate to Admin Panel Directory
```bash
cd admin-panel
```

#### 4.3 Install Dependencies
```bash
npm install
```

#### 4.4 Start Admin Panel
```bash
npm start
```

The admin panel will open at `http://localhost:3000`

---

## 🔐 Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Access**: Admin Panel (React) - `http://localhost:3000`

### User Account
- **Email**: `sakethpatike15@gmail.com`
- **Password**: `Saketh@2004`
- **Access**: Flutter User App

### Additional Test Users (Created by seed script)
- **Email**: `john@example.com`
- **Password**: `user123`

- **Email**: `jane@example.com`
- **Password**: `user123`

---

## 🧠 System Logic & Architecture

### Authentication Flow

1. **User Registration/Login**:
   - User provides email and password
   - Backend validates credentials
   - Password is hashed using bcryptjs
   - JWT token is generated with user ID and role
   - Token is stored in Flutter app (SharedPreferences) or React (localStorage)
   - Token is sent with every API request in Authorization header

2. **Role-Based Access**:
   - **USER**: Can book appointments, view own appointments, cancel own appointments
   - **ADMIN**: Can view all appointments, update appointment statuses

### Appointment Booking Logic

1. **Date Selection**:
   - Only weekdays (Monday-Friday) are allowed
   - Cannot book appointments in the past
   - Date picker restricts selection to valid dates

2. **Time Slot Selection**:
   - Working hours: 10:00 AM - 6:00 PM
   - Time slots are generated in 1-hour intervals (10:00, 11:00, 12:00, ..., 18:00)
   - Available slots exclude:
     - Already booked appointments (non-cancelled)
     - Past time slots for today

3. **Booking Validation**:
   - **Consultant Availability**: Checks if consultant has an existing appointment at the same date/time
   - **User Limit**: Maximum 3 appointments per user per day
   - **Status Check**: Only non-cancelled and non-completed appointments block slots

4. **Appointment Status Flow**:
   ```
   PENDING → CONFIRMED → COMPLETED
        ↓
    CANCELLED (can be cancelled from PENDING or CONFIRMED)
   ```

5. **Cancellation Rules**:
   - Users can only cancel their own appointments
   - Only PENDING or CONFIRMED appointments can be cancelled
   - COMPLETED and CANCELLED appointments cannot be changed

### Data Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String (optional),
  role: "USER" | "ADMIN"
}
```

#### Consultant Model
```javascript
{
  name: String,
  specialization: String,
  email: String (optional),
  phone: String (optional)
}
```

#### Appointment Model
```javascript
{
  user: ObjectId (ref: User),
  consultant: ObjectId (ref: Consultant),
  date: Date,
  timeSlot: String (e.g., "10:00", "11:00"),
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
  createdAt: Date,
  updatedAt: Date
}
```

### State Management (Flutter)

- **Provider Pattern**: Used for state management
  - `AuthProvider`: Handles authentication state
  - `ConsultantProvider`: Manages consultant list
  - `AppointmentProvider`: Manages user appointments

### API Communication

- **Flutter App**: Uses `http` package to make REST API calls
- **React Admin**: Uses `axios` for API requests
- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT token in `Authorization: Bearer <token>` header

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (Admin or User)

### Consultants
- `GET /api/consultants` - Get all consultants (Public)
- `GET /api/consultants/:id` - Get consultant details (Public)
- `GET /api/consultants/:id/available-slots` - Get available time slots for a consultant on a date

### Appointments
- `POST /api/appointments` - Create appointment (User only)
- `GET /api/appointments/my-appointments` - Get user's appointments (User only)
- `GET /api/appointments` - Get all appointments (Admin only)
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update appointment status (Admin can update any, User can only cancel own)

### Health Check
- `GET /api/health` - Check backend status

---

## 📁 Project Structure

```
Appointment_Schedular_project/
├── backend/                    # Node.js Backend
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   └── consultantController.js
│   ├── models/                # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── appointment.model.js
│   │   └── consultant.model.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── consultantRoutes.js
│   ├── middleware/            # Custom middleware
│   │   └── auth.js           # JWT authentication
│   ├── utils/                 # Utility functions
│   │   └── timeUtils.js      # Time slot generation
│   ├── server.js              # Express server
│   ├── seedData.js            # Database seeding script
│   └── package.json
│
├── user_app/                   # Flutter User App
│   ├── lib/
│   │   ├── main.dart          # App entry point
│   │   ├── models/            # Data models
│   │   ├── providers/         # State management
│   │   │   ├── auth_provider.dart
│   │   │   ├── consultant_provider.dart
│   │   │   └── appointment_provider.dart
│   │   ├── screens/           # UI screens
│   │   │   ├── auth/
│   │   │   │   ├── login_screen.dart
│   │   │   │   └── register_screen.dart
│   │   │   ├── home/
│   │   │   │   └── home_screen.dart
│   │   │   ├── consultants/
│   │   │   │   ├── consultant_list_screen.dart
│   │   │   │   └── consultant_detail_screen.dart
│   │   │   ├── appointments/
│   │   │   │   ├── my_appointments_screen.dart
│   │   │   │   ├── book_appointment_screen.dart
│   │   │   │   └── appointment_detail_screen.dart
│   │   │   └── profile/
│   │   │       └── profile_screen.dart
│   │   └── services/
│   │       └── api_service.dart  # API communication
│   └── pubspec.yaml
│
├── admin-panel/                # React Admin Panel
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   └── Dashboard.js
│   │   ├── components/
│   │   │   └── AppointmentTable.js
│   │   └── api/
│   │       └── axios.js        # API configuration
│   └── package.json
│
└── README.md                   # This file
```

---

## Troubleshooting

### Backend Issues

**Problem: "MongoDB connection error"**
- ✅ Make sure MongoDB is running (if using local MongoDB)
- ✅ Check your `MONGO_URI` in `.env` file is correct
- ✅ For Atlas: Make sure your IP is whitelisted and credentials are correct

**Problem: "Port 5000 already in use"**
- ✅ Change `PORT=5001` in `.env` file
- ✅ Update Flutter app `baseUrl` in `user_app/lib/services/api_service.dart` to match
- ✅ Update React admin `baseURL` in `admin-panel/src/api/axios.js` to match

**Problem: "Cannot find module"**
- ✅ Run `npm install` again in the backend folder

**Problem: "JWT_SECRET is not defined"**
- ✅ Make sure `.env` file exists in `backend` folder
- ✅ Check that `JWT_SECRET` is set in `.env`

### Flutter App Issues

**Problem: "Network error" or "Connection refused"**
- ✅ Make sure backend is running on port 5000
- ✅ Check that backend shows "Server running on port 5000"
- ✅ Verify `baseUrl` in `api_service.dart` is `http://localhost:5000/api` for web
- ✅ For mobile/emulator, use `http://10.0.2.2:5000/api` (Android) or `http://localhost:5000/api` (iOS)

**Problem: "Invalid credentials"**
- ✅ Make sure you ran `npm run seed` in the backend folder
- ✅ Try registering a new account using the Register button
- ✅ Check credentials in [Credentials](#credentials) section

**Problem: Flutter dependencies error**
- ✅ Run `flutter clean` then `flutter pub get`
- ✅ Make sure Flutter SDK is up to date: `flutter upgrade`

**Problem: "No available slots"**
- ✅ Check that consultants exist in database (run `npm run seed`)
- ✅ Make sure you're selecting a weekday (Monday-Friday)
- ✅ Verify working hours are 10:00 AM - 6:00 PM

### Admin Panel Issues

**Problem: "Cannot connect to backend"**
- ✅ Make sure backend is running
- ✅ Check `baseURL` in `admin-panel/src/api/axios.js` is `http://localhost:5000/api`
- ✅ Verify CORS is enabled in backend (should be enabled by default)

**Problem: "Admin access only"**
- ✅ Make sure you're using admin credentials: `admin@example.com` / `admin123`
- ✅ Verify user role is "ADMIN" in database

### General Issues

**Problem: Login not working?**
1. **Check Backend is Running:**
   - Open browser and go to: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK",...}`

2. **Check Browser Console:**
   - Press `F12` in Chrome
   - Go to "Console" tab
   - Look for any error messages

3. **Check Backend Terminal:**
   - Look for any error messages when you try to login
   - Should see request logs

**Problem: Appointments not showing?**
- ✅ Make sure you're logged in
- ✅ Check backend terminal for errors
- ✅ Verify appointments exist in database
- ✅ Check appointment status filters

---

## Additional Commands

### Backend Commands
```bash
npm start          # Start server
npm run dev        # Start with auto-reload (requires nodemon)
npm run seed       # Seed database with test data
npm run create-admin  # Create admin user only
```

### Flutter Commands
```bash
flutter run -d chrome      # Run on Chrome
flutter run -d windows     # Run on Windows desktop
flutter run -d android     # Run on Android emulator
flutter clean              # Clean build files
flutter pub get            # Install dependencies
```

### React Admin Commands
```bash
npm start          # Start development server
npm run build      # Build for production
```

---

## Quick Start Summary

**Terminal 1 (Backend):**
```bash
cd backend
npm install
# Create .env file (see Step 2.3)
npm run seed
npm start
```

**Terminal 2 (Flutter App):**
```bash
cd user_app
flutter pub get
flutter run -d chrome
```

**Terminal 3 (Admin Panel - Optional):**
```bash
cd admin-panel
npm install
npm start
```

---

## License

This project is for educational purposes.

---

## Author

Created as part of the Appointment Scheduling System project.

---

## Acknowledgments

- Flutter team for the amazing framework
- Express.js and MongoDB communities
- React team for the admin panel framework

---

