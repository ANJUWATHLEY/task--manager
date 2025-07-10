// 📁 pages/ForgotPasswordFlow.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return alert('Please enter your email.');

    try {
      const res = await axios.put('/user/forgot', { email });
      console.log(res);

      localStorage.setItem('reset_otp', String(res.data));
      localStorage.setItem('reset_email', email); // ✅ email store karna zaroori hai

      alert('✅ OTP sent to your email');
      setStep(2);
    } catch (err) {
      alert('❌ Error sending OTP');
      console.error(err);
    }
  };

  const handleVerifyOtp = () => {
    const storedOtp = localStorage.getItem('reset_otp');

    if (storedOtp === otp) {
      alert('✅ OTP verified');
      navigate('/reset-password');
    } else {
      alert('❌ Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? 'Forgot Password' : 'Verify OTP'}
        </h2>

        {step === 1 ? (
          <>
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
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
