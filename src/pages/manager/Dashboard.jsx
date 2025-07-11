import { useLocation } from 'react-router-dom';
import ManagerNavbar from '../../components/ManagerNavbar';

const ManagerDashboard = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/manager/dashboard';

  return (
    <>
      <ManagerNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {isDashboard && (
          <h1 className="text-3xl font-bold text-green-800">
            Welcome to the Manager Dashboard 👋
          </h1>
        )}
      </div>
    </>
  );
};

export default ManagerDashboard;
