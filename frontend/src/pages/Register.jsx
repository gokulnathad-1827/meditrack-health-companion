import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHealth } from "../context/HealthContext";
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaHeart, FaExclamationCircle } from "react-icons/fa";

function Register() {
  const { registerUser } = useHealth();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    conditions: "",
    allergies: "",
    emergencyContact: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, age, gender, bloodGroup, emergencyContact } = formData;

    // Validation checks
    if (!name || !email || !password || !confirmPassword || !age || !emergencyContact) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (isNaN(age) || parseInt(age) <= 0) {
      setError("Please enter a valid age");
      return;
    }

    // Register inside context
    const profile = {
      name,
      email,
      password,
      age: parseInt(age),
      gender,
      bloodGroup,
      conditions: formData.conditions || "None",
      allergies: formData.allergies || "None",
      emergencyContact
    };

    try {
      await registerUser(profile);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">M</span>
            <span className="text-xl font-bold tracking-tight text-slate-800">MediTrack</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Your Health Account</h1>
          <p className="text-xs text-slate-400 mt-1">Get started with personalized health metrics tracking.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-red-650 animate-shake">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="number"
                  name="age"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Gender Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition cursor-pointer"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Emergency Contact <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaHeart className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="Jane Doe (Mother) - +1 (555) 012-3456"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Medical Conditions
              </label>
              <input
                type="text"
                name="conditions"
                placeholder="e.g. Asthma, Hypertension (comma separated)"
                value={formData.conditions}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
              />
            </div>

            {/* Allergies */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                placeholder="e.g. Penicillin, Peanuts (comma separated)"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.99] transition duration-200"
          >
            Create Health Record
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="font-bold text-emerald-600 hover:text-emerald-700 transition">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;