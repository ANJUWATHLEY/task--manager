// src/pages/admin/Dashboard.jsx
import AdminNavbar from '../../components/AdminNavbar';

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, Admin 👋
        </h1>
      </div>
    </>
  );
};

export default AdminDashboard;
