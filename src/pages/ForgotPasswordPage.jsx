// 📁 pages/ForgotPasswordFlow.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react'; // cross icon from lucide-react

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return alert('Please enter your email.');

    try {
      const res = await axios.put('/user/forgot', { email });
      localStorage.setItem('reset_otp', String(res.data));
      localStorage.setItem('reset_email', email);
      alert('OTP sent to your email');
      setStep(2);
    } catch (err) {
      alert('Error sending OTP');
      console.error(err);
    }
  };

  const handleVerifyOtp = () => {
    const storedOtp = localStorage.getItem('reset_otp');
    if (storedOtp === otp) {
      alert('OTP verified');
      navigate('/reset-password');
    } else {
      alert('Invalid OTP');
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('reset_otp');
    localStorage.removeItem('reset_email');
    setEmail('');
    setOtp('');
    setStep(1);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative max-w-md w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
       
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {step === 1 ? 'Forgot Password' : 'Verify OTP'}
        </h2>

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mb-3"
            >
              Send OTP
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-300 text-black py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition mb-3"
            >
              Verify OTP
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-300 text-black py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
