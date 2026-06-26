import React, { useState } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaUser, FaEnvelope, FaHeartbeat, FaCalendarAlt, FaVenusMars, FaExclamationTriangle, FaEdit, FaTimes } from "react-icons/fa";

function Profile() {
  const { user, updateProfile } = useHealth();
  const [showEditModal, setShowEditModal] = useState(false);

  // Form edit states
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    bloodGroup: user.bloodGroup,
    conditions: user.conditions,
    allergies: user.allergies,
    emergencyContact: user.emergencyContact
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...editForm,
      age: parseInt(editForm.age)
    });
    setShowEditModal(false);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Personal Health Profile</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Manage your medical data and emergency contact information.</p>
        </div>

        {/* Profile Card Info */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-650 flex justify-end items-start p-6">
            <button
              onClick={() => {
                setEditForm({ ...user });
                setShowEditModal(true);
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            
            {/* Avatar positioning */}
            <div className="absolute -top-14 left-6 sm:left-10 w-28 h-28 rounded-3xl bg-slate-900 border-4 border-white text-white flex items-center justify-center font-black text-4xl shadow-md">
              {user.name.charAt(0)}
            </div>

            {/* Profile Header Details */}
            <div className="pt-18">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
              <p className="text-slate-400 text-sm font-semibold flex items-center gap-2 mt-1">
                <FaEnvelope className="text-emerald-500 w-3.5 h-3.5" />
                <span>{user.email}</span>
              </p>
            </div>

            {/* Demographics details grids */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4.5 mt-8 border-y border-slate-100 py-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <FaCalendarAlt className="text-emerald-500 mx-auto w-5 h-5 mb-2" />
                <span className="text-[10px] text-slate-450 uppercase font-bold block">Age</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{user.age} yrs</span>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <FaVenusMars className="text-blue-500 mx-auto w-5 h-5 mb-2" />
                <span className="text-[10px] text-slate-450 uppercase font-bold block">Gender</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{user.gender}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <FaHeartbeat className="text-red-500 mx-auto w-5 h-5 mb-2" />
                <span className="text-[10px] text-slate-450 uppercase font-bold block">Blood Group</span>
                <span className="text-lg font-black text-slate-855 mt-1 block">{user.bloodGroup}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <div className="text-amber-500 text-xl font-bold mb-2">🛡️</div>
                <span className="text-[10px] text-slate-450 uppercase font-bold block">Health Rank</span>
                <span className="text-lg font-black text-emerald-650 mt-1 block">A+ Optimal</span>
              </div>
            </div>

            {/* Specific Medical Summary fields */}
            <div className="mt-8 space-y-6">
              
              {/* Medical Conditions */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Medical Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {user.conditions.split(",").map((cond, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
                      {cond.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {user.allergies.split(",").map((allergy, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-red-50 border border-red-150 text-red-700 text-xs font-semibold rounded-xl">
                      {allergy.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="bg-red-50/50 border border-red-100/70 rounded-2xl p-5 mt-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-lg">
                  <FaExclamationTriangle className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-red-950 text-sm">Emergency SOS Contact</h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Immediate notify contact inside panic flows:</p>
                  <p className="text-slate-800 font-black text-base mt-2.5">{user.emergencyContact}</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-100 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">📝 Edit Health Profile</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  />
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-2.5 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Blood Group</label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="w-full px-2.5 py-2.5 text-sm bg-slate-50 border rounded-xl"
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
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    required
                    value={editForm.emergencyContact}
                    onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  />
                </div>

                {/* Medical Conditions */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Medical Conditions</label>
                  <input
                    type="text"
                    value={editForm.conditions}
                    onChange={(e) => setEditForm({ ...editForm, conditions: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  />
                </div>

                {/* Allergies */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Allergies</label>
                  <input
                    type="text"
                    value={editForm.allergies}
                    onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </MainLayout>
  );
}

export default Profile;
