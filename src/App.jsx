import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavbarPublic from './components/NavbarPublic';
import EmployeeNavbar from './components/EmployeeNavbar';
import AdminLayout from './components/AdminLayout';
import ManagerLayout from './components/ManagerLayout';
import TopBar from './components/TopBar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import CreateTasksPage from './pages/admin/CreateTasksPage';
import ViewTasksPage from './pages/admin/ViewTasksPage';
import CompletedTasksPage from './pages/admin/CompletedTasksPage';
import GroupTasksPage from './pages/admin/GroupTasksPage';
import AdminProfile from './pages/admin/AdminProfile';
import InviteForm from './pages/admin/InviteForm';
import User from './pages/admin/User';
import ViewSingleTask from './pages/admin/ViewSingleTask';
import UserTaskDetailsPage from './pages/admin/UserTaskDetailsPage';
import AdminUpdateTaskForm from './pages/admin/AdminUpdateTaskForm';
import CreateDepartmentList from './pages/admin/CreateDepartmentList';
import AssignRoleForm from './pages/admin/AssignRoleForm';
import OrganizationDetails from './pages/admin/OrganizationDetails';
import CreateOrganization from './pages/admin/CreateOrganization';
import JoinOrganization from './pages/admin/JoinOrganization';
import BusinessUnitList from './pages/admin/BusinessUnitList';
import BusinessUnitDetails from './pages/admin/BusinessUnitDetails';

import InviteTaskPage from './components/InviteTaskPage';
import OrganizationChoice from './components/OrganizationChoice';

import ManagerDashboard from './pages/manager/Dashboard';
import TaskForm from './pages/manager/TaskForm';
import TeamView from './pages/manager/TeamView';
import ManagerTaskForm from './pages/manager/ManagerTaskForm';
import ManagerTaskList from './pages/manager/ManagerTaskList';
import AssignedTasksPage from './pages/manager/AssignedTasksPage';
import GrouptaskPage from './pages/manager/GrouptaskPage';
import ManagerUserTaskDetails from './pages/manager/ManagerUserTaskDetails';
import ManagerUpdateTaskForm from './pages/manager/ManagerUpdateTaskForm';

import EmployeeDashboard from './pages/employee/Dashboard';
import TaskSubmission from './pages/employee/TaskSubmission';
import MyTasks from './pages/employee/MyTasks';
import Profile from './pages/employee/Profile';
import TaskDetailsPage from './pages/employee/TaskDetailsPage';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
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

 const renderNavbar = () => {
  if (noNavbarRoutes.includes(location.pathname)) return null;
  if (!isLoggedIn) return <NavbarPublic />;

  const Member_org = localStorage.getItem("Member_org");
  const orgRef = localStorage.getItem("orgRef");

  if (Member_org && !orgRef) return <EmployeeNavbar />; 
  if (!Member_org && orgRef) return <TopBar />;         
  if (!Member_org && !orgRef) return null;              
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
          <Route path="departments" element={<CreateDepartmentList />} />
          <Route path="tasks" element={<CreateTasksPage />} />
          <Route path="view-tasks" element={<ViewTasksPage />} />
          <Route path="user" element={<User />} />
          <Route path="user/:id" element={<User />} />
          <Route path="completed-tasks" element={<CompletedTasksPage />} />
          <Route path="group-tasks" element={<GroupTasksPage />} />
          <Route path="detail" element={<AdminProfile />} />
          <Route path="invite" element={<InviteForm />} />
        
        </Route>
  <Route path="/assign-role" element={<AssignRoleForm />} />
        <Route path="/admin/viewtask/:taskId" element={<ViewSingleTask />} />
        <Route path="/admin/update-task/:id" element={<AdminUpdateTaskForm />} />
        <Route path="/user/specific/:id/:taskId" element={<UserTaskDetailsPage />} />

        {/* Organization Routes */}
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/join-organization" element={<JoinOrganization />} />
     
        <Route path="/organization/getUser/:orgid" element={<OrganizationDetails />} />
        <Route path="/organization-choice" element={<OrganizationChoice />} />
        <Route path="/invite/:token" element={<InviteTaskPage />} />

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="task-form" element={<TaskForm />} />
          <Route path="team-view" element={<TeamView />} />
          <Route path="create" element={<ManagerTaskForm />} />
          <Route path="assigned-tasks" element={<AssignedTasksPage />} />
          <Route path="group-tasks" element={<GrouptaskPage />} />
          <Route path="update-task/:id" element={<ManagerUpdateTaskForm />} />
          <Route path="viewuser/:id" element={<ManagerTaskList />} />
          <Route path="user/:id" element={<ManagerUserTaskDetails />} />
        </Route>

        {/* Business Units */}
        <Route path="/businessUnitList" element={<BusinessUnitList />} />
        <Route path="/business-unit/:id" element={<BusinessUnitDetails />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/task-submission" element={<TaskSubmission />} />
        <Route path="/employee/mytask" element={<MyTasks />} />
        <Route path="/employee/profile" element={<Profile />} />
        <Route path="/task/:id" element={<TaskDetailsPage />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
