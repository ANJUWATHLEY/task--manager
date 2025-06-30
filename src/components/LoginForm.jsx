import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/login', { email, password });
      const { token, user } = res.data;

      // ✅ Save token & role
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      alert('Login successful ✅');
      setEmail('');
      setPassword('');

      // ✅ Role-based redirect
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Login Error:', err.response?.data || err.message);
      alert('Login failed! Check your credentials.');
    }
  };

  // ✅ Handle Forgot Password (send OTP)
  const handleForgotPassword = async () => {
    if (!forgotEmail) return alert('Please enter your email!');
    try {
      const res = await axios.post('/user/forgot-password', {
        email: forgotEmail,
      });
      console.log('📨 OTP Sent:', res.data);
      alert('OTP sent to your email 📩');
      setOtpSent(true);
      setForgotEmail('');
      setShowForgot(false);
    } catch (err) {
      console.error('❌ OTP Error:', err.response?.data || err.message);
      alert('Failed to send OTP. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Login
        </h2>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Login
          </button>

          <p
            className="text-sm text-blue-600 text-center cursor-pointer hover:underline"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </p>

          {otpSent && (
            <p className="text-green-600 text-sm text-center">
              OTP has been sent to your email ✅
            </p>
          )}
        </div>

        <p className="mt-8 text-center text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-semibold"
          >
            Signup
          </Link>
        </p>
      </form>

      {/* 🔐 Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Forgot Password
            </h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleForgotPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send OTP
              </button>
              <button
                onClick={() => setShowForgot(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
