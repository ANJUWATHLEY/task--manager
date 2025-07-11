import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useForm } from "react-hook-form";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [otpSent, setOtpSent] = useState(false);
  const [otpFromServer, setOtpFromServer] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const handleSendOtp = async () => {
    try {
      const res = await axios.post("/user/otp", { email });
      console.log(res.data);

      if (res.data) {
        setOtpSent(true);
        setOtpFromServer(res.data); // Set correct OTP here
        alert(" OTP sent to your email");
      }
    } catch (err) {
      console.error("Send OTP Error:", err.response?.data || err.message);
      alert("Failed to send OTP.");
    }
  };

  const handleVerifyOTP = (data) => {
    if (!otpFromServer) {
      alert("No OTP to verify. Please request a new one.");
      return;
    }
    if (data.otp === otpFromServer.toString()) {
      setIsOtpVerified(true);
      alert("✅ OTP Verified");
    } else {
      alert("❌ Invalid OTP");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      alert("❌ Please verify OTP first.");
      return;
    }

    try {
      const res = await axios.post("/user/register", {
        name,
        email,
        password,
        role,
      });

      alert("✅ Signup successful! Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("employee");
      setOtpSent(false);
      setOtpFromServer("");
      setIsOtpVerified(false);
      navigate("/");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert("Signup failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create an Account
        </h2>

        <div className="space-y-6">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          {/* Email + Send OTP */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!email}
              className="bg-blue-500 hover:bg-blue-900 text-white px-3 py-2 rounded-xl transition-all"
            >
              Send OTP
            </button>
          </div>

          {/* OTP Input - show only if OTP sent */}
          {otpSent && (
            <div className="flex gap-2">
              <input
                {...register("otp")}
                type="text"
                placeholder="Enter OTP"
                required
                className="w-full px-4 py-4 border border-purple-300 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={handleSubmit(handleVerifyOTP)}
                className="bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition-all"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          {/* Role */}
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Sign Up
          </button>
        </div>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
