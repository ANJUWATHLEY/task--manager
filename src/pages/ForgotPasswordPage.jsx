// 📁 pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return alert('Please enter your email.');

    try {
      const res = await axios.post('/user/forgot-password', { email });
      alert('✅ OTP sent to your email');
      localStorage.setItem('reset_email', email); // Save email to use later
      navigate('/verify-otp');
    } catch (err) {
      alert('❌ Error sending OTP. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={handleSendOtp}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
