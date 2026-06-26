import React, { useState } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaUserMd, FaPlus, FaHospital, FaCalendarCheck, FaStethoscope } from "react-icons/fa";

function DoctorVisit() {
  const { visits, addDoctorVisit } = useHealth();

  // Form states
  const [form, setForm] = useState({
    doctor: "",
    hospital: "",
    date: "",
    time: "",
    reason: "",
    prescription: "",
    followUp: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.doctor || !form.hospital || !form.date) {
      alert("Doctor name, hospital name, and appointment date are required.");
      return;
    }

    addDoctorVisit({
      doctorName: form.doctor,
      hospital: form.hospital,
      visitDate: form.date,
      time: form.time || "10:00 AM",
      reason: form.reason || "General Checkup",
      prescription: form.prescription || "None logged.",
      followUpDate: form.followUp || "None set."
    });

    setForm({
      doctor: "",
      hospital: "",
      date: "",
      time: "",
      reason: "",
      prescription: "",
      followUp: ""
    });
  };

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Doctor Visits</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Store clinical consultations summaries, diagnostic reports, and medical recommendations.</p>
      </div>

      {/* Grid: Logger Form + History Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Logger Form Column */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs h-fit">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <FaPlus className="text-emerald-500" /> Log Clinical Visit
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Doctor Name</label>
              <div className="relative">
                <FaUserMd className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Dr. Sarah Jenkins"
                  required
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Hospital / Clinic</label>
              <div className="relative">
                <FaHospital className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="City General Hospital"
                  required
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Visit Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Visit Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Reason for Visit</label>
              <input
                type="text"
                placeholder="e.g. Routine hypertension assessment"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Prescription / Medical Advice</label>
              <textarea
                rows="3"
                placeholder="Diagnostic findings, medication changes, dose details..."
                value={form.prescription}
                onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Follow-up Date</label>
              <input
                type="date"
                value={form.followUp}
                onChange={(e) => setForm({ ...form, followUp: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition duration-200"
            >
              Add Consultation Log
            </button>
          </form>
        </div>

        {/* History Table Column */}
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <FaStethoscope className="text-emerald-500 w-4 h-4" /> Consultation Records
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full border-collapse text-left text-sm text-slate-650">
              <thead>
                <tr className="bg-slate-50 text-slate-450 uppercase text-[10px] font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Doctor & Facility</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Prescription / Remarks</th>
                  <th className="px-6 py-4">Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {visits.map((vt) => (
                  <tr key={vt.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-black text-slate-800">{vt.doctorName}</div>
                      <span className="text-[10px] text-slate-400 font-bold block">{vt.hospital}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{vt.visitDate}</div>
                      <span className="text-[10px] text-slate-400 font-bold block">{vt.time || "10:00 AM"}</span>
                    </td>
                    <td className="px-6 py-4">{vt.reason}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{vt.prescription}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vt.followUpDate !== "None set." ? (
                        <span className="text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-md text-xs font-bold border border-emerald-100 flex items-center gap-1.5 w-fit">
                          <FaCalendarCheck />
                          <span>{vt.followUpDate}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visits.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-405 font-bold">
                      No medical appointments logged.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </MainLayout>
  );
}

export default DoctorVisit;
