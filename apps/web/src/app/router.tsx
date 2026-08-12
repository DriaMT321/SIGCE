import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardOverviewPage } from '../features/dashboard/pages/DashboardOverviewPage';
import { SieSyncDashboardPage } from '../features/sie-sync/pages/SieSyncDashboardPage';
import { StudentsPage } from '../features/students/pages/StudentsPage';
import { CoursesPage } from '../features/courses/pages/CoursesPage';
import { GradesPage } from '../features/grades/pages/GradesPage';
import { AttendancePage } from '../features/attendance/pages/AttendancePage';
import { AuditPage } from '../features/audit/pages/AuditPage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardOverviewPage />,
      },
      {
        path: 'sie-sync',
        element: <SieSyncDashboardPage />,
      },
      {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'courses',
        element: <CoursesPage />,
      },
      {
        path: 'grades',
        element: <GradesPage />,
      },
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
      {
        path: 'audit',
        element: <AuditPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
