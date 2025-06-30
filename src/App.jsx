import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import NavbarPublic from './components/NavbarPublic';
// import NavbarPrivate from './components/NavbarPrivate';
import EmployeeNavbar from './components/EmployeeNavbar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ViewReports from './pages/admin/ViewReports';
import CreateTasksPage from './pages/admin/CreateTasksPage';
import ViewTasksPage from './pages/admin/ViewTasksPage';
import User from './pages/admin/User';

import ManagerDashboard from './pages/manager/Dashboard';
import TaskForm from './pages/manager/TaskForm';
import TeamView from './pages/manager/TeamView';

import EmployeeDashboard from './pages/employee/Dashboard';
import TaskSubmission from './pages/employee/TaskSubmission';
import MyTasks from './pages/employee/MyTasks';
import Profile from './pages/employee/Profile';

import AssignedTasks from './components/AssignedTasks';
import UpdateTaskForm from './components/UpdateTask';
import ManagerNavbar from './components/ManagerNavbar';
import AdminNavbar from './components/AdminNavbar';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Stored during login
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, [location.pathname]);

  const noNavbarRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
  ];

  // ✅ Clean Navbar rendering logic
  const renderNavbar = () => {
    if (noNavbarRoutes.includes(location.pathname)) return null;

    if (!isLoggedIn) return <NavbarPublic />;

    if (role === 'employee') return <EmployeeNavbar />;
    if (role === 'admin' ) return <AdminDashboard />;
    
    if (role === 'manager' ) return <ManagerDashboard />;


    return null; // fallback
  };

  return (
    <>
      {renderNavbar()}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/view-reports" element={<ViewReports />} />
        <Route path="/admin/tasks" element={<CreateTasksPage />} />
        <Route path="/admin/view-tasks" element={<ViewTasksPage />} />
        <Route path="/admin/user" element={<User />} />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/task-form" element={<TaskForm />} />
        <Route path="/manager/team-view" element={<TeamView />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/assigned-tasks" element={<AssignedTasks />} />
        <Route path="/employee/task-submission" element={<TaskSubmission />} />
        <Route path="/employee/mytask" element={<MyTasks />} />
        <Route path="/employee/profile" element={<Profile />} />

        {/* Shared/Utility Routes */}
        <Route path="/updatetask/:id" element={<UpdateTaskForm />} />
      </Routes>
    </>
  );
}

export default App;
