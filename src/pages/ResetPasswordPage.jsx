// 📁 pages/ResetPasswordPage.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const email = localStorage.getItem('reset_email');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post('/user/reset-password', {
        email,
        password: newPassword,
      });
      alert('✅ Password reset successful');
      localStorage.removeItem('reset_email');
      navigate('/');
    } catch (err) {
      alert('❌ Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={handleReset}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
