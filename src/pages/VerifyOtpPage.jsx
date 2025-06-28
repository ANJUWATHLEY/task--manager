// 📁 pages/VerifyOtpPage.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('reset_email');

  const handleVerify = async () => {
    try {
      const res = await axios.post('/user/verify-otp', { email, otp });
      alert('✅ OTP verified');
      navigate('/reset-password');
    } catch (err) {
      alert('❌ Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
