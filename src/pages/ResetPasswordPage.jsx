// 📁 pages/ResetPasswordPage.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const email = localStorage.getItem('reset_email');
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      return alert('❌ Please fill in both password fields.');
    }

    if (newPassword !== confirmPassword) {
      return alert('❌ Passwords do not match.');
    }

    try {
      console.log('Resetting password for:', email);

      await axios.put('/user/reset', {
        email,
        password: newPassword,
      });

      alert('✅ Password reset successful');
      localStorage.removeItem('reset_email');
      localStorage.removeItem('reset_otp');
      navigate('/');
    } catch (err) {
      alert('❌ Failed to reset password');
      console.error(err);
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

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
