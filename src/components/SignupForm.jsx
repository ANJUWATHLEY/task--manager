import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/user/send-otp', { email });
      if (res.status === 200) {
        setOtpSent(true);
        alert('📨 OTP sent to your email');
      } else {
        alert('❌ Failed to send OTP');
      }
    } catch (err) {
      console.error('OTP Send Error:', err.response?.data || err.message);
      alert('❌ Failed to send OTP. Try again.');
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    try {
      const verifyRes = await axios.post('/user/verify-otp', {
        email,
        otp,
      });

      if (verifyRes.status === 200) {
        const registerRes = await axios.post('/user/register', {
          name,
          email,
          password,
          role,
        });

        if (registerRes.status === 200 || registerRes.status === 201) {
          alert('✅ Signup successful! Please login.');
          setName('');
          setEmail('');
          setPassword('');
          setRole('employee');
          setOtp('');
          setOtpSent(false);
          navigate('/');
        } else {
          alert('❌ Registration failed.');
        }
      } else {
        alert('❌ OTP is incorrect.');
      }
    } catch (err) {
      console.error('OTP Verify Error:', err.response?.data || err.message);
      alert('❌ OTP verification or registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={otpSent ? handleVerifyAndRegister : handleSendOtp}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {otpSent ? 'Verify OTP & Register' : 'Create an Account'}
        </h2>

        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-4 px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mt-4 px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        )}

        {!otpSent && (
          <>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-4 px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-4 px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {otpSent ? 'Verify OTP & Register' : 'Send OTP'}
        </button>

        {!otpSent && (
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link
              to="/"
              className="text-blue-500 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
