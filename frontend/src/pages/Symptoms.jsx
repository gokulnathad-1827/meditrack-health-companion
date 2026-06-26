import React, { useState } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaHeart, FaPlus, FaCalendarAlt, FaMeh, FaNotesMedical } from "react-icons/fa";

function Symptoms() {
  const { symptoms, addSymptom } = useHealth();

  // Form states
  const [form, setForm] = useState({
    name: "",
    severity: 3,
    notes: "",
    mood: "😐"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      alert("Please enter a symptom name");
      return;
    }

    const now = new Date();
    addSymptom({
      name: form.name,
      severity: parseInt(form.severity),
      notes: form.notes || "None",
      mood: form.mood,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    setForm({ name: "", severity: 3, notes: "", mood: "😐" });
  };

  const getSeverityBadge = (level) => {
    if (level <= 3) return "bg-emerald-50 text-emerald-650 border-emerald-100";
    if (level <= 7) return "bg-amber-50 text-amber-650 border-amber-100";
    return "bg-red-50 text-red-650 border-red-150 animate-pulse";
  };

  const getSeverityColor = (level) => {
    if (level <= 3) return "bg-emerald-500";
    if (level <= 7) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Symptom Journal</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Monitor physiological conditions, discomfort severity and mood indicators.</p>
      </div>

      {/* Grid Layout: Log Form + History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Log Symptom Form Column */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs h-fit">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <FaPlus className="text-emerald-500" /> Log Current Symptom
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Symptom Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Symptom Name</label>
              <input
                type="text"
                placeholder="e.g. Shortness of breath, Headache"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Severity Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Severity Level</span>
                <span className="text-emerald-600 font-black">{form.severity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Mood Emoji Picker */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">How are you feeling?</label>
              <div className="flex gap-2 justify-between">
                {["😀", "😐", "🥱", "😟", "😫"].map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setForm({ ...form, mood: emoji })}
                    className={`text-2xl p-2.5 rounded-xl border transition ${
                      form.mood === emoji ? "bg-emerald-50 border-emerald-500 scale-110" : "bg-slate-50 border-slate-100 hover:bg-slate-105"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1 font-sans">Notes & Observations</label>
              <textarea
                rows="3"
                placeholder="Details of trigger, duration, relief method..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition duration-200"
            >
              Add Symptom Log
            </button>
          </form>
        </div>

        {/* History Vertical Timeline Column */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <FaNotesMedical className="text-emerald-500 w-4 h-4" /> Symptom Logs History
          </h3>

          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-150">
            {symptoms.map((sym) => (
              <div key={sym.id} className="flex gap-5 relative pl-2">
                
                {/* Timeline node */}
                <div className={`w-8 h-8 rounded-full border-4 border-white ${getSeverityColor(sym.severity)} shadow-xs z-10 flex shrink-0 items-center justify-center text-white text-xs font-bold`}>
                  {sym.severity}
                </div>

                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4.5 hover:border-emerald-500/10 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-205/50">
                    <div>
                      <h4 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">
                        {sym.name}
                        <span className="text-xl">{sym.mood}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-1">
                        <FaCalendarAlt />
                        <span>{sym.date} &bull; {sym.time}</span>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full self-start sm:self-center ${getSeverityBadge(sym.severity)}`}>
                      Severity: {sym.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Notes:</span>
                    {sym.notes}
                  </p>
                </div>

              </div>
            ))}

            {symptoms.length === 0 && (
              <div className="text-center py-8 text-slate-405 font-bold">
                No symptoms logged yet. Complete the form to start tracking.
              </div>
            )}
          </div>
        </div>

      </div>

    </MainLayout>
  );
}

export default Symptoms;
