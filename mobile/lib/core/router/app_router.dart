import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/students/presentation/students_screen.dart';
import '../../features/grades/presentation/grades_screen.dart';
import '../../features/attendance/presentation/attendance_screen.dart';
import '../../features/alerts/presentation/alerts_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  routes: <RouteBase>[
    GoRoute(
      path: '/login',
      builder: (BuildContext context, GoRouterState state) {
        return const LoginScreen();
      },
    ),
    GoRoute(
      path: '/students',
      builder: (BuildContext context, GoRouterState state) {
        return const StudentsScreen();
      },
    ),
    GoRoute(
      path: '/grades',
      builder: (BuildContext context, GoRouterState state) {
        return const GradesScreen();
      },
    ),
    GoRoute(
      path: '/attendance',
      builder: (BuildContext context, GoRouterState state) {
        return const AttendanceScreen();
      },
    ),
    GoRoute(
      path: '/alerts',
      builder: (BuildContext context, GoRouterState state) {
        return const AlertsScreen();
      },
    ),
    GoRoute(
      path: '/profile',
      builder: (BuildContext context, GoRouterState state) {
        return const ProfileScreen();
      },
    ),
  ],
);
