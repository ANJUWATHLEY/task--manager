import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarPublic from './components/NavbarPublic';
import EmployeeNavbar from './components/EmployeeNavbar';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import ResetPasswordPage from './pages/ResetPasswordPage';
import CompletedTasksPage from './pages/admin/CompletedTasksPage';
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';

import CreateTasksPage from './pages/admin/CreateTasksPage';
import ViewTasksPage from './pages/admin/ViewTasksPage';
import User from './pages/admin/User';
import ViewSingleTask from './pages/admin/ViewSingleTask';
import InviteTaskPage from './components/InviteTaskPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import ManagerDashboard from './pages/manager/Dashboard';
import TaskForm from './pages/manager/TaskForm';
import TeamView from './pages/manager/TeamView';
import GroupTasksPage from './pages/admin/GroupTasksPage';
import EmployeeDashboard from './pages/employee/Dashboard';
import TaskSubmission from './pages/employee/TaskSubmission';
import MyTasks from './pages/employee/MyTasks';
import Profile from './pages/employee/Profile';
import TaskDetailsPage from './pages/employee/TaskDetailsPage';
import AssignedTasks from './components/AssignedTasks';
import UpdateTaskForm from './components/UpdateTask';
import ManagerNavbar from './components/ManagerNavbar';
import AdminProfile from './pages/admin/AdminProfile';
import AdminTopBar from './components/AdminTopBar';
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
  if (role === 'admin') return <AdminTopBar />;
  if (role === 'manager') return <ManagerNavbar />;

  return null;
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
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
         
          <Route path="tasks" element={<CreateTasksPage />} />
          <Route path="view-tasks" element={<ViewTasksPage />} />
        <Route path="/admin/user" element={<User />} />
        <Route path="/admin/completed-tasks" element={<CompletedTasksPage />} /> 
         <Route path="/admin/group-tasks" element={<  GroupTasksPage />} />
         <Route path="/admin/detail" element={<AdminProfile />} />
         </Route>
        <Route path="/invite/:token" element={<InviteTaskPage />} />
        <Route path="/admin/viewtask/:taskId" element={<ViewSingleTask />} />
        <Route path="/admin/detail" element={<AdminProfile />} />
        
       
         

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
         <Route path="/task/:id" element={<TaskDetailsPage />} />

        {/* Shared/Utility Routes */}
        <Route path="/updatetask/:id" element={<UpdateTaskForm />} />
      </Routes>
  <ToastContainer position="top-center" autoClose={2000} />



    </>
  );
}

export default App;
