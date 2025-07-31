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
import InviteForm from './pages/admin/InviteForm';
import CreateTasksPage from './pages/admin/CreateTasksPage';
import ViewTasksPage from './pages/admin/ViewTasksPage';
import User from './pages/admin/User';
import ViewSingleTask from './pages/admin/ViewSingleTask';
import InviteTaskPage from './components/InviteTaskPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManagerUserTaskDetails from './pages/manager/ManagerUserTaskDetails';
import ManagerDashboard from './pages/manager/Dashboard';
import TaskForm from './pages/manager/TaskForm';
import TeamView from './pages/manager/TeamView';
import GroupTasksPage from './pages/admin/GroupTasksPage';
import EmployeeDashboard from './pages/employee/Dashboard';
import TaskSubmission from './pages/employee/TaskSubmission';
import MyTasks from './pages/employee/MyTasks';
import Profile from './pages/employee/Profile';
import TaskDetailsPage from './pages/employee/TaskDetailsPage';
import AdminUpdateTaskForm from './pages/admin/AdminUpdateTaskForm';
import ManagerUpdateTaskForm from './pages/manager/ManagerUpdateTaskForm';

import AssignedTasksPage from './pages/manager/AssignedTasksPage';
import AdminProfile from './pages/admin/AdminProfile';
import GrouptaskPage from './pages/manager/GrouptaskPage';
import TopBar from './components/TopBar';
import ManagerLayout from './components/ManagerLayout';
import UserTaskDetailsPage from './pages/admin/UserTaskDetailsPage';
import ManagerTaskForm from './pages/manager/ManagerTaskForm';
import ManagerTaskList from './pages/manager/ManagerTaskList';
import DepartmentList from './pages/admin/DepartmentList';
import OrganizationDetails from './pages/admin/OrganizationDetails';
import OrganizationChoice from './components/OrganizationChoice';
import CreateOrganization from './pages/admin/CreateOrganization';
import JoinOrganization from './pages/admin/JoinOrganization';
import Organization from './pages/admin/Orignatization';
import Button from './pages/admin/Button';
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
  if (role === 'admin' || role === 'manager') return <TopBar />;

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
         <Route path="departments" element={<DepartmentList />} />
          <Route path="tasks" element={<CreateTasksPage />} />
          <Route path="view-tasks" element={<ViewTasksPage />} />
        <Route path="/admin/user" element={<User />} />
        <Route path="/admin/completed-tasks" element={<CompletedTasksPage />} /> 
         <Route path="/admin/group-tasks" element={<  GroupTasksPage />} />
         <Route path="/admin/detail" element={<AdminProfile />} />
         <Route path="/admin/invite" element={<InviteForm />} />
         </Route>
        <Route path="/invite/:token" element={<InviteTaskPage />} />
        <Route path="/admin/viewtask/:taskId" element={<ViewSingleTask />} />
        <Route path="/admin/detail" element={<AdminProfile />} />
        <Route path="/admin/user/:id" element={<User />} />
       <Route path="/user/specific/:id" element={<UserTaskDetailsPage />} />
         {/* Organization routes */}
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/join-organization" element={<JoinOrganization />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/organization/getUser/:orgid" element={<OrganizationDetails />} />
        <Route path="/admin/update-task/:id" element={<AdminUpdateTaskForm />} />
       {/*manager  */}
<Route path="/manager" element={<ManagerLayout />}>
  <Route path="dashboard" element={<ManagerDashboard />} />  
  <Route path="task-form" element={<TaskForm />} />
  <Route path="team-view" element={<TeamView />} />
  <Route path="create" element={<ManagerTaskForm />} />
  <Route path="assigned-tasks" element={<AssignedTasksPage />} />
  <Route path="group-tasks" element={<  GrouptaskPage />} />
<Route path="/manager/update-task/:id" element={<ManagerUpdateTaskForm />} />
   <Route path="viewuser/:id" element={<ManagerTaskList />} />
   
   <Route path="/manager/user/:id" element={<ManagerUserTaskDetails />} />

</Route>
 <Route path="/organization-choice" element={<OrganizationChoice />} />







        {/* Employee Routes */}
   
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/task-submission" element={<TaskSubmission />} />
        <Route path="/employee/mytask" element={<MyTasks />} />
        <Route path="/employee/profile" element={<Profile />} />
         <Route path="/task/:id" element={<TaskDetailsPage />} />
        <Route path='/button' element={<Button />} />
        {/* Shared/Utility Routes */}
      
      </Routes>
  <ToastContainer position="top-center" autoClose={2000} />



    </>
  );
}

export default App;
