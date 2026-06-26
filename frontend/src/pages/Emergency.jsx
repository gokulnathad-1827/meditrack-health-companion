import React, { useState, useEffect } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaExclamationTriangle, FaPhone, FaSms, FaMapMarkerAlt, FaHospitalUser, FaTimes, FaShieldAlt } from "react-icons/fa";

function Emergency() {
  const { user } = useHealth();

  // SOS states
  const [sosState, setSosState] = useState("idle"); // 'idle', 'counting', 'active'
  const [countdown, setCountdown] = useState(5);
  const [timerId, setTimerId] = useState(null);

  // Simulation logs
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (sosState === "counting") {
      if (countdown > 0) {
        const id = setTimeout(() => setCountdown(countdown - 1), 1000);
        setTimerId(id);
      } else {
        triggerActiveSOS();
      }
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [countdown, sosState]);

  const startSOS = () => {
    setCountdown(5);
    setSosState("counting");
    setLogs(["SOS Triggered. Starting countdown..."]);
  };

  const cancelSOS = () => {
    if (timerId) clearTimeout(timerId);
    setSosState("idle");
    setCountdown(5);
    setLogs([]);
  };

  const triggerActiveSOS = () => {
    setSosState("active");
    const timestamp = new Date().toLocaleTimeString();
    setLogs([
      `[${timestamp}] 🚨 PANIC STATE DECLARED.`,
      `[${timestamp}] 🛰️ GPS location verified (Lat: 37.7749, Long: -122.4194).`,
      `[${timestamp}] 💬 Emergency SMS sent to: ${user.emergencyContact}.`,
      `[${timestamp}] 📞 Calling Emergency Services (911/112)...`,
      `[${timestamp}] 🏥 Transmitting vital records secure telemetry.`
    ]);
  };

  const simulateCall = (contact) => {
    alert(`Initiating phone call to: ${contact}... (Simulation starting)`);
  };

  const simulateSms = (contact) => {
    alert(`Sending SMS alert to: ${contact}... (Simulation: "MediTrack Emergency SOS! Gokul needs help. Coordinates: 37.7749, -122.4194")`);
  };

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Emergency SOS Portal</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Immediate medical dispatch triggers and emergency profile access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Giant SOS Panic Button Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {sosState === "idle" && (
            <>
              {/* Outer pulsing ring */}
              <div className="w-56 h-56 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                <button
                  onClick={startSOS}
                  className="w-44 h-44 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-3xl tracking-wider shadow-xl shadow-red-500/30 hover:scale-105 active:scale-[0.97] transition-all duration-300 flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-sm uppercase font-bold text-red-200">TRIGGER</span>
                  <span>SOS</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-6 leading-relaxed max-w-xs font-semibold">
                Clicking the SOS button initiates a 5-second countdown to cancel if triggered by accident.
              </p>
            </>
          )}

          {sosState === "counting" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-40 h-40 rounded-full border-8 border-red-500 border-t-transparent flex items-center justify-center text-5xl font-black text-red-500 animate-spin-slow">
                <span className="animate-pulse">{countdown}</span>
              </div>
              <h3 className="font-black text-red-505 text-lg mt-6">Declaring SOS Alert</h3>
              <p className="text-xs text-slate-400 mt-1.5">Dispatch signals starting in {countdown}s...</p>
              
              <button
                onClick={cancelSOS}
                className="mt-6 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition"
              >
                <FaTimes />
                <span>Cancel SOS Request</span>
              </button>
            </div>
          )}

          {sosState === "active" && (
            <div className="flex flex-col items-center py-4 w-full">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-650 text-3xl animate-ping absolute top-12" />
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl z-10 shadow-lg shadow-red-500/20">
                🚨
              </div>
              
              <h3 className="font-black text-red-655 text-xl mt-6 tracking-tight">SOS Dispatch Active</h3>
              <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-100 px-3 py-1 rounded-full mt-2 animate-pulse">
                911 Responder & Telemetry Signals Active
              </p>

              {/* Simulation logs screen */}
              <div className="w-full bg-slate-900 text-slate-300 font-mono text-[10px] p-4 rounded-2xl border text-left mt-6 max-h-40 overflow-y-auto space-y-1.5 leading-normal">
                {logs.map((log, idx) => (
                  <p key={idx}>{log}</p>
                ))}
              </div>

              <button
                onClick={cancelSOS}
                className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition"
              >
                Reset Emergency State
              </button>
            </div>
          )}

        </div>

        {/* Location Preview & Emergency Contacts */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GPS Location Map Simulation */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs text-left">
              <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-500" /> Dispatch Coordinates
              </h3>

              {/* Simulated Map View Layout */}
              <div className="bg-slate-100 border rounded-2xl h-40 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-70" />
                <div className="w-10 h-10 bg-red-500/25 rounded-full flex items-center justify-center z-10 animate-ping absolute" />
                <FaMapMarkerAlt className="text-red-500 w-8 h-8 z-10 animate-bounce" />
                
                <span className="bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 z-10 absolute bottom-3">
                  Latitude: 37.7749, Longitude: -122.4194
                </span>
              </div>

              <div className="mt-4 text-xs font-semibold text-slate-700">
                <span className="text-slate-400 uppercase text-[9px] font-bold block">Physical Address</span>
                <p className="mt-1">102 Medical Pkwy, Suite 400, City Health Complex</p>
              </div>
            </div>

            {/* Medical Summary Placard for EMTs */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs text-left">
              <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <FaHospitalUser className="text-emerald-500" /> Clinical EMT Summary
              </h3>

              <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-bold block">Patient Name</span>
                  <p className="text-slate-900 font-extrabold mt-0.5">{user.name} &bull; O+</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-bold block">Medical Conditions</span>
                  <p className="text-slate-650 mt-0.5">{user.conditions}</p>
                </div>
                <div>
                  <span className="text-red-500 uppercase text-[9px] font-bold block">Allergies Warning</span>
                  <p className="text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-lg mt-0.5 w-fit">
                    {user.allergies}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts List */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-left">
            <h3 className="font-extrabold text-slate-850 mb-5 flex items-center gap-2">
              <FaShieldAlt className="text-emerald-500" /> Emergency SOS Contacts
            </h3>

            <div className="space-y-4">
              {/* Primary Contact (dynamically fetched from user.emergencyContact) */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                <div>
                  <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    PRIMARY DELEGATE
                  </span>
                  <h4 className="font-black text-slate-800 text-sm sm:text-base">
                    {user.emergencyContact.split("-")[0]}
                  </h4>
                  <p className="text-xs text-slate-450 mt-0.5 font-bold">
                    {user.emergencyContact.split("-")[1] || "Mobile contact synced"}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => simulateSms(user.emergencyContact)}
                    className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                    title="Send SMS"
                  >
                    <FaSms className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => simulateCall(user.emergencyContact)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
                  >
                    <FaPhone className="w-3.5 h-3.5" />
                    <span>Call SOS Contact</span>
                  </button>
                </div>
              </div>

              {/* Emergency Services */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-red-500/5 border border-red-100/50 rounded-2xl gap-4">
                <div>
                  <span className="text-[9px] bg-red-500 text-white font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    LOCAL SERVICES
                  </span>
                  <h4 className="font-black text-slate-800 text-sm sm:text-base">Medical Dispatch (Ambulance/EMT)</h4>
                  <p className="text-xs text-slate-450 mt-0.5 font-bold">National Service Line &bull; 911 / 112</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => simulateCall("911")}
                    className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
                  >
                    <FaPhone className="w-3.5 h-3.5 animate-bounce" />
                    <span>Call Ambulance</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Emergency;
