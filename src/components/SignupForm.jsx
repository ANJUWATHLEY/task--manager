import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Lock, Send, ShieldCheck, Sparkles } from "lucide-react";
import taskimg from "../assets/taskkk.png";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


/**
 * OTPInput: 6-digit OTP with auto-focus, backspace and paste support
 */
function OTPInput({ length = 6, onChange, disabled }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const valueString = useMemo(() => values.join(""), [values]);

  useEffect(() => {
    onChange?.(valueString);
  }, [valueString, onChange]);

  const handleChange = (index, val) => {
    const next = [...values];
    const char = val.replace(/\D/g, "").slice(-1); // only digit
    next[index] = char || "";
    setValues(next);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        setValues(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const next = [...values];
    for (let i = 0; i < length; i++) {
      next[i] = pasted[i] || "";
    }
    setValues(next);
    const lastFilled = Math.min(pasted.length, length) - 1;
    if (lastFilled >= 0) inputsRef.current[lastFilled]?.focus();
  };

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {values.map((v, i) => (
        <Input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-lg tracking-widest"
        />
      ))}
    </div>
  );
}

/**
 * InputWithIcon: floating label + icon field
 */
function InputWithIcon({ id, label, icon: Icon, type = "text", value, onChange, placeholder, required }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm text-gray-700">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="pl-9"
        />
      </div>
    </div>
  );
}

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpFromServer, setOtpFromServer] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  const handleSendOtp = async () => {
    if (!email) return;
    try {
      setLoadingOtp(true);
      const res = await axios.post("/user/otp", { email });
      console.log(res.data);
      
      if (res.data) {
        setOtpSent(true);
        setOtpFromServer(String(res.data));
      }
    } catch (err) {
      console.error("Send OTP Error:", err.response?.data || err.message);
      alert("Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const onVerifyOtp = () => {
    if (!otpFromServer) {
      alert("No OTP to verify. Please request a new one.");
      return;
    }
    if (otp && otp === String(otpFromServer)) {
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
      alert("Invalid OTP");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      alert("Please verify OTP first.");
      return;
    }
    try {
      setLoadingSignup(true);
      await axios.post("/user/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert("Signup failed! Try again.");
    } finally {
      setLoadingSignup(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-pink-50">
      {/* Animated orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4">
        <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
          {/* Left: hero copy */}
         <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="hidden md:block"
>
  <div className="relative space-y-6">
  {/* Background Image */}
  <img
    src={taskimg}
    alt="Task Manager Background"
    className="w-full h-full object-cover rounded-2xl shadow-lg"
  />

  {/* Overlay Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40 rounded-2xl">
    <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
      Manage Your Tasks Smarter
    </h2>
    <p className="mt-2 text-lg text-gray-200">
      Stay productive, organized, and in control.
    </p>
  </div>
</div>

</motion.div>


          {/* Right: form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border border-gray-200/80 bg-white/80 backdrop-blur-xl shadow-xl">
               <CardHeader className="flex justify-center items-center text-center ml-22">
  <CardTitle className="text-2xl font-semibold text-red-900">
    Create Account
  </CardTitle>
</CardHeader>



              <CardContent>
                <form onSubmit={handleSignup} className="space-y-5">
                  <InputWithIcon
                    id="name"
                    label="Full Name"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Sharma"
                    required
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                    <InputWithIcon
                      id="email"
                      label="Email Address"
                      icon={Mail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                    <div className="flex items-end">
                      <Button type="button" onClick={handleSendOtp} disabled={!email || loadingOtp} className="w-full sm:w-auto">
                        {loadingOtp ? "Sending..." : (
                          <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Send OTP</span>
                        )}
                      </Button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-700">Enter OTP</Label>
                      <div className="flex items-center gap-3">
                        <OTPInput length={6} onChange={setOtp} disabled={isOtpVerified} />
                        <Button type="button" variant="secondary" onClick={onVerifyOtp} disabled={!otp}>
                          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verify</span>
                        </Button>
                      </div>
                      {isOtpVerified && (
                        <p className="text-sm text-green-700">OTP verified ✓</p>
                      )}
                    </div>
                  )}

                  <InputWithIcon
                    id="password"
                    label="Password"
                    icon={Lock}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />

                  <Button type="submit" className="w-full" disabled={loadingSignup}>
                    {loadingSignup ? "Creating..." : "Sign Up"}
                  </Button>
                   <p className="text-center text-sm text-gray-600">
                  Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


