import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHealth } from "../context/HealthContext";
import { FaHeartbeat, FaEnvelope, FaLock, FaCheck, FaExclamationCircle } from "react-icons/fa";

function Login() {
  const { loginUser } = useHealth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("gokul@meditrack.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials");
      return;
    }
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans">
      
      {/* Left Column: Login Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-6 sm:p-12 md:p-20 bg-white">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/20">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            Medi<span className="text-emerald-500">Track</span>
          </span>
        </div>

        {/* Center Panel: Login Form */}
        <div className="my-auto py-10 max-w-sm w-full mx-auto">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Please enter your details to access your health portal.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-red-600 animate-shake">
              <FaExclamationCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Extra Settings */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4.5 h-4.5 border-slate-300 rounded-sm text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-bold text-emerald-600 hover:text-emerald-700 transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Registration Redirect */}
          <p className="text-center text-xs text-slate-500 mt-8">
            New to MediTrack?{" "}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 transition">
              Create a free account
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center text-[10px] text-slate-400">
          &copy; {new Date().getFullYear()} MediTrack Portal. All rights reserved.
        </div>
      </div>

      {/* Right Column: Dynamic Healthcare Illustration panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 items-center justify-center p-12 xl:p-20 relative overflow-hidden">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />

        {/* Dynamic Display Interface Mock */}
        <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl animate-fade-in duration-300">
          <div className="flex justify-between items-center pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FaHeartbeat className="text-emerald-400 w-8 h-8 animate-pulse" />
              <div>
                <p className="text-white font-bold text-sm">Gokul's Health Score</p>
                <p className="text-emerald-300 text-xs font-semibold">Synced 2m ago</p>
              </div>
            </div>
            <span className="bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-full">
              92% Excellent
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/60 text-xs">Heart Rate</p>
              <h3 className="text-white font-black text-2xl mt-1">72 <span className="text-xs font-normal">bpm</span></h3>
              <p className="text-emerald-400 text-[10px] font-semibold mt-1">▲ 2% Normal</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/60 text-xs">Blood Pressure</p>
              <h3 className="text-white font-black text-2xl mt-1">120/80 <span className="text-xs font-normal">mmHg</span></h3>
              <p className="text-emerald-400 text-[10px] font-semibold mt-1">● Optimal Range</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/60 text-xs">Blood Sugar</p>
              <h3 className="text-white font-black text-2xl mt-1">99 <span className="text-xs font-normal">mg/dL</span></h3>
              <p className="text-emerald-400 text-[10px] font-semibold mt-1">● Fasting Normal</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/60 text-xs">Sleep Quality</p>
              <h3 className="text-white font-black text-2xl mt-1">8.2 <span className="text-xs font-normal">hrs</span></h3>
              <p className="text-emerald-400 text-[10px] font-semibold mt-1">▲ 8% Deep Sleep</p>
            </div>
          </div>

          <div className="mt-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-400 flex items-center justify-center text-emerald-950 text-xl font-bold">
              💊
            </div>
            <div>
              <p className="text-white text-xs font-bold">Medication Reminder</p>
              <p className="text-emerald-200 text-[11px] mt-0.5">Lisinopril 10mg is due in 30 minutes.</p>
            </div>
          </div>

          <div className="mt-8 text-center text-white/50 text-xs leading-relaxed">
            "Your body is a temple, keep it healthy. MediTrack provides smart charts, medication alerts, symptom logs and fast PDF health reports."
          </div>
        </div>
      </div>

      {/* Forgot Password Mock Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your email below and we'll send instructions to recover your health records.
            </p>
            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-600 font-semibold animate-pulse">
                Reset link sent! Redirecting...
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10"
                />
                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 transition"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;