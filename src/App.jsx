

import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarPublic from './components/NavbarPublic';
import NavbarPrivate from './components/NavbarPrivate';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
;

import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ViewReports from "./pages/admin/ViewReports";
import TasksPage from './pages/admin/TasksPage';
import ViewTasksPage from './pages/admin/ViewTasksPage';

import ManagerDashboard from "./pages/manager/Dashboard";
import TaskForm from "./pages/manager/TaskForm";
import TeamView from "./pages/manager/TeamView";

import EmployeeDashboard from "./pages/employee/Dashboard";

import TaskSubmission from "./pages/employee/TaskSubmission";
import AssignedTasks from './components/AssignedTasks';

import UpdateTaskForm from './components/UpdateTask';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login state on route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // ✅ Routes where we DON’T want Navbar at all (like login/signup)
  const noNavbarRoutes = ['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password'];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && (
        isLoggedIn ? <NavbarPrivate /> : <NavbarPublic />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* <Route path="/tasks" element={<TasksPage />} /> */}

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/view-reports" element={<ViewReports />} />
<<<<<<< HEAD
        <Route path="/admin/tasks" element={<TasksPage />} />
        <Route path="/admin/assigned-tasks" element={<ViewTasksPage />} />
        




=======
        <Route path="/updatetask/:id" element={<UpdateTaskForm />} />
>>>>>>> origin/feature/task-ui


        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/task-form" element={<TaskForm />} />
        <Route path="/manager/team-view" element={<TeamView />} />


        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/assigned-tasks" element={<AssignedTasks />} />
        <Route path="/employee/task-submission" element={<TaskSubmission />} />



      </Routes>
    </>
  );
}

export default App;

