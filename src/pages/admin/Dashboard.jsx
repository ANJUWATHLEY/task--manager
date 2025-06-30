import { useLocation } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';

const AdminDashboard = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname === '/admin/dashboard';

  return (
    <>
      <AdminNavbar />

      {/* Show welcome message only on dashboard */}
      {isDashboardPage && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <h1 className="text-3xl font-bold text-blue-800">
            Welcome to the Admin Dashboard 👋
          </h1>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
