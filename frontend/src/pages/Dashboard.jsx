import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/dashboard/DashboardCard";
import QuickAction from "../components/dashboard/QuickAction";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaHeartbeat, FaClock, FaCheck, FaTimes, FaCalendarAlt, FaCalendarCheck, FaExclamationTriangle, FaPlusCircle, FaPlus, FaCloudUploadAlt } from "react-icons/fa";

function Dashboard() {
  const {
    user,
    vitals,
    medicines,
    visits,
    symptoms,
    addVitalRecord,
    addMedicine,
    markMedicineAsTaken,
    addSymptom,
    addDoctorVisit,
    uploadPrescription
  } = useHealth();

  const navigate = useNavigate();

  // Modal active states
  const [activeModal, setActiveModal] = useState(null); // 'vital', 'medicine', 'symptom', 'visit', 'prescription'
  
  // Modals form states
  const [vitalForm, setVitalForm] = useState({ hr: 72, bpSystolic: 120, bpDiastolic: 80, sugar: 99, temp: 98.6, weight: 68, height: 175, spo2: 98 });
  const [medForm, setMedForm] = useState({ name: "", dosage: "", frequency: "Once daily", time: "08:00 AM", totalTablets: 30 });
  const [symForm, setSymForm] = useState({ name: "", severity: 3, notes: "", mood: "😐" });
  const [visitForm, setVisitForm] = useState({ doctor: "", hospital: "", date: "", time: "", reason: "", prescription: "", followUp: "" });
  const [presForm, setPresForm] = useState({ name: "", type: "pdf", file: null });

  // Doctor visit detail popup
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Grab the latest vitals log entry
  const latestVital = vitals.reduce((latest, current) => {
    if (!latest) return current;
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  }, vitals[0] || null);

  // Format Greeting based on local time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Build chart-ready data for Blood Pressure (systolic/diastolic) & Sugar trends from vitals list (last 7 logs, chronologically)
  const chartData = [...vitals]
    .slice(0, 7)
    .reverse()
    .map((v) => {
      const bpParts = v.bloodPressure ? v.bloodPressure.split("/") : [120, 80];
      return {
        date: v.date.substring(5), // YYYY-MM-DD to MM-DD
        systolic: parseInt(bpParts[0]) || 120,
        diastolic: parseInt(bpParts[1]) || 80,
        sugar: v.bloodSugar || 90,
        weight: v.weight || 68,
        bmi: v.bmi || 22
      };
    });

  // Compose Recent Activities from symptoms, vitals updates, doctor visits
  const activities = [
    ...vitals.map(v => ({ type: "vital", text: `Logged Vitals: HR ${v.heartRate} bpm, BP ${v.bloodPressure}`, time: `${v.date} ${v.time}` })),
    ...symptoms.map(s => ({ type: "symptom", text: `Logged Symptom: ${s.name} (Severity: ${s.severity}/10, Mood: ${s.mood})`, time: `${s.date} ${s.time}` })),
    ...visits.map(vt => ({ type: "visit", text: `Visited ${vt.doctorName} at ${vt.hospital}`, time: `${vt.visitDate} ${vt.time || ''}` }))
  ]
    .sort((a, b) => new Date(b.time.replace(" AM", "").replace(" PM", "")) - new Date(a.time.replace(" AM", "").replace(" PM", "")))
    .slice(0, 5);

  // Form handlers
  const handleVitalSubmit = (e) => {
    e.preventDefault();
    const hM = vitalForm.height / 100;
    const computedBmi = parseFloat((vitalForm.weight / (hM * hM)).toFixed(1));
    const now = new Date();
    
    addVitalRecord({
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      heartRate: parseInt(vitalForm.hr),
      bloodPressure: `${vitalForm.bpSystolic}/${vitalForm.bpDiastolic}`,
      bloodSugar: parseInt(vitalForm.sugar),
      temperature: parseFloat(vitalForm.temp),
      weight: parseFloat(vitalForm.weight),
      height: parseInt(vitalForm.height),
      bmi: computedBmi,
      spo2: parseInt(vitalForm.spo2)
    });
    
    setActiveModal(null);
  };

  const handleMedSubmit = (e) => {
    e.preventDefault();
    if (!medForm.name || !medForm.dosage) return;
    addMedicine({
      name: medForm.name,
      dosage: medForm.dosage,
      frequency: medForm.frequency,
      time: medForm.time,
      remainingTablets: parseInt(medForm.totalTablets),
      totalTablets: parseInt(medForm.totalTablets),
      status: "Pending"
    });
    setMedForm({ name: "", dosage: "", frequency: "Once daily", time: "08:00 AM", totalTablets: 30 });
    setActiveModal(null);
  };

  const handleSymptomSubmit = (e) => {
    e.preventDefault();
    if (!symForm.name) return;
    const now = new Date();
    addSymptom({
      name: symForm.name,
      severity: parseInt(symForm.severity),
      notes: symForm.notes || "None",
      mood: symForm.mood,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    setSymForm({ name: "", severity: 3, notes: "", mood: "😐" });
    setActiveModal(null);
  };

  const handleVisitSubmit = (e) => {
    e.preventDefault();
    if (!visitForm.doctor || !visitForm.hospital || !visitForm.date) return;
    addDoctorVisit({
      doctorName: visitForm.doctor,
      hospital: visitForm.hospital,
      visitDate: visitForm.date,
      time: visitForm.time || "10:00 AM",
      reason: visitForm.reason,
      prescription: visitForm.prescription || "None logged.",
      followUpDate: visitForm.followUp || "None set."
    });
    setVisitForm({ doctor: "", hospital: "", date: "", time: "", reason: "", prescription: "", followUp: "" });
    setActiveModal(null);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!presForm.name) return;
    const now = new Date();
    uploadPrescription({
      name: presForm.name + (presForm.type === "pdf" ? ".pdf" : ".jpg"),
      date: now.toISOString().split("T")[0],
      size: "240 KB",
      type: presForm.type,
      url: presForm.type === "pdf" ? "#" : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"
    });
    setPresForm({ name: "", type: "pdf", file: null });
    setActiveModal(null);
  };

  // Find next doctor visit in the future
  const upcomingVisit = visits
    .filter(v => new Date(v.visitDate) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a,b) => new Date(a.visitDate) - new Date(b.visitDate))[0] || null;

  return (
    <MainLayout>
      
      {/* Hero Welcome Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/15 rounded-3xl p-6 lg:p-8 mb-8 shadow-xs gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {getGreeting()}, <span className="text-emerald-600">{user.name}</span> 👋
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1.5 flex items-center gap-2">
            <FaCalendarAlt className="text-emerald-500" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-xs flex items-center gap-4">
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Health Score</p>
            <p className="text-2xl font-black text-slate-800 tracking-tight">92<span className="text-sm font-semibold text-slate-400">/100</span></p>
          </div>
          <div className="w-11 h-11 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-600 bg-emerald-50">
            A+
          </div>
        </div>
      </section>

      {/* Health Vitals Summary Cards */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Current Health Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4.5">
          {latestVital && (
            <>
              <DashboardCard
                title="Heart Rate"
                value={`${latestVital.heartRate} bpm`}
                status={latestVital.heartRate < 60 ? "Low" : latestVital.heartRate > 100 ? "High" : "Normal"}
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="❤️"
                colorClass="bg-red-50 text-red-500"
              />
              <DashboardCard
                title="Blood Pressure"
                value={`${latestVital.bloodPressure} mmHg`}
                status={latestVital.bloodPressure.split("/")[0] > 130 ? "High Stage 1" : "Optimal"}
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="🩸"
                colorClass="bg-blue-50 text-blue-500"
              />
              <DashboardCard
                title="Blood Sugar"
                value={`${latestVital.bloodSugar} mg/dL`}
                status={latestVital.bloodSugar > 125 ? "Diabetic Alert" : latestVital.bloodSugar > 100 ? "Pre-diabetic" : "Normal"}
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="🍩"
                colorClass="bg-amber-50 text-amber-500"
              />
              <DashboardCard
                title="Weight"
                value={`${latestVital.weight} kg`}
                status="Normal Trend"
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="⚖️"
                colorClass="bg-emerald-50 text-emerald-500"
              />
              <DashboardCard
                title="BMI"
                value={latestVital.bmi}
                status={latestVital.bmi < 18.5 ? "Underweight" : latestVital.bmi > 25 ? "Overweight" : "Normal Weight"}
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="📊"
                colorClass="bg-violet-50 text-violet-500"
              />
              <DashboardCard
                title="Oxygen Saturation"
                value={`${latestVital.spo2}%`}
                status={latestVital.spo2 < 95 ? "Warning (Low)" : "Optimal"}
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="🫁"
                colorClass="bg-teal-50 text-teal-500"
              />
              <DashboardCard
                title="Temperature"
                value={`${latestVital.temperature} °F`}
                status={latestVital.temperature > 99.5 ? "High Fever" : "Normal"}
                updated={`${latestVital.date} ${latestVital.time}`}
                icon="🤒"
                colorClass="bg-orange-50 text-orange-500"
              />
            </>
          )}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Quick Health Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickAction
            title="Add Vitals"
            icon="❤️"
            description="Log BP, heart rate, blood sugar."
            onClick={() => {
              setVitalForm({ hr: 72, bpSystolic: 120, bpDiastolic: 80, sugar: 99, temp: 98.6, weight: 68, height: 175, spo2: 98 });
              setActiveModal("vital");
            }}
            colorClass="bg-red-50 text-red-500 group-hover:bg-red-100"
          />
          <QuickAction
            title="Add Medicine"
            icon="💊"
            description="Schedule daily pills, reminders."
            onClick={() => setActiveModal("medicine")}
            colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
          />
          <QuickAction
            title="Log Symptoms"
            icon="🤒"
            description="Record pain, severity, moods."
            onClick={() => setActiveModal("symptom")}
            colorClass="bg-amber-50 text-amber-500 group-hover:bg-amber-100"
          />
          <QuickAction
            title="Book Visit"
            icon="🩺"
            description="Schedule consultations."
            onClick={() => setActiveModal("visit")}
            colorClass="bg-blue-50 text-blue-500 group-hover:bg-blue-100"
          />
          <QuickAction
            title="Upload RX"
            icon="📄"
            description="Store prescriptions & scans."
            onClick={() => setActiveModal("prescription")}
            colorClass="bg-purple-50 text-purple-500 group-hover:bg-purple-100"
          />
          <QuickAction
            title="Generate PDF"
            icon="📥"
            description="Download health summary."
            onClick={() => navigate("/reports")}
            colorClass="bg-orange-50 text-orange-500 group-hover:bg-orange-100"
          />
        </div>
      </section>

      {/* Split Body Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column: Medicines and Upcoming Doctor Visit */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Medicines list */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  💊
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800">Today's Medicines</h3>
                  <p className="text-xs text-slate-400 font-semibold">Active prescriptions & schedule</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/medicines")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold underline"
              >
                Go to Calendar
              </button>
            </div>

            <div className="space-y-3.5">
              {medicines.map((med) => (
                <div key={med.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-500/10 transition gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${med.status === "Taken" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-650"}`}>
                      {med.status === "Taken" ? <FaCheck className="w-4 h-4" /> : "•"}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm sm:text-base ${med.status === "Taken" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {med.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        {med.dosage} &bull; {med.frequency} &bull; <span className="text-slate-500 font-bold">{med.time}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-150">
                    <span className="text-xs text-slate-400 font-semibold">
                      {med.remainingTablets} pills left
                    </span>
                    <button
                      onClick={() => markMedicineAsTaken(med.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                        med.status === "Taken"
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-600"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/15"
                      }`}
                    >
                      {med.status === "Taken" ? "Mark Pending" : "Mark as Taken"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Doctor Visit Alert Panel */}
          {upcomingVisit ? (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-3xl p-6 shadow-lg border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-white/5 translate-x-12 -translate-y-12 group-hover:scale-110 transition duration-500" />
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
                  🩺
                </div>
                <div>
                  <span className="text-[10px] bg-white/20 uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full inline-block">
                    UPCOMING CONSULTATION
                  </span>
                  <h3 className="text-lg font-black tracking-tight mt-1.5">{upcomingVisit.doctorName}</h3>
                  <p className="text-xs text-blue-200 mt-1 font-medium">
                    {upcomingVisit.hospital} &bull; <span className="font-bold text-white">{upcomingVisit.visitDate}</span> at <span className="font-bold text-white">{upcomingVisit.time}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVisit(upcomingVisit)}
                className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-md transition whitespace-nowrap shrink-0 self-start sm:self-center"
              >
                View Details
              </button>
            </div>
          ) : (
            <div className="p-6 bg-slate-100 rounded-3xl text-center text-sm text-slate-500 font-semibold">
              No doctor visits scheduled. Click "Book Visit" to log one.
            </div>
          )}

          {/* Mini charts trend comparisons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BP Chart */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Weekly Blood Pressure Trend
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Blood Sugar Chart */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Weekly Blood Sugar Trend
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="sugar" name="Sugar (mg/dL)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activities timeline & Emergency Action */}
        <div className="space-y-8">
          
          {/* Emergency Block */}
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center shadow-xs">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-650 mx-auto text-xl animate-pulse">
              <FaExclamationTriangle />
            </div>
            <h3 className="font-black text-red-650 text-lg mt-3">Emergency Response</h3>
            <p className="text-xs text-red-600 mt-1.5 leading-relaxed font-semibold">
              Instantly trigger medical dispatch alerts & notify your emergency contact.
            </p>
            <button
              onClick={() => navigate("/emergency")}
              className="mt-5 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg shadow-red-500/20 active:scale-[0.99] transition duration-200"
            >
              TRIGGER PANIC SOS
            </button>
          </div>

          {/* Activity Logs Timeline */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-800 mb-5">Recent Health Activities</h3>
            
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-150">
              {activities.map((act, index) => {
                let badgeColor = "bg-slate-400";
                if (act.type === "vital") badgeColor = "bg-red-400";
                if (act.type === "symptom") badgeColor = "bg-amber-400";
                if (act.type === "visit") badgeColor = "bg-blue-400";

                return (
                  <div key={index} className="flex gap-4 relative">
                    <div className={`w-6 h-6 rounded-full border-4 border-white ${badgeColor} shadow-xs z-10 flex shrink-0 items-center justify-center`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-700 leading-snug font-semibold">{act.text}</p>
                      <span className="text-[10px] text-slate-450 mt-1 block">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* --- QUICK ACTION MODALS --- */}
      
      {/* 1. Add Vitals Modal */}
      {activeModal === "vital" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">❤️ Add Health Vitals</h3>
            
            <form onSubmit={handleVitalSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Heart Rate (bpm)</label>
                  <input type="number" required value={vitalForm.hr} onChange={(e) => setVitalForm({...vitalForm, hr: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">SpO₂ (%)</label>
                  <input type="number" required max="100" value={vitalForm.spo2} onChange={(e) => setVitalForm({...vitalForm, spo2: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Systolic BP (mmHg)</label>
                  <input type="number" required value={vitalForm.bpSystolic} onChange={(e) => setVitalForm({...vitalForm, bpSystolic: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Diastolic BP (mmHg)</label>
                  <input type="number" required value={vitalForm.bpDiastolic} onChange={(e) => setVitalForm({...vitalForm, bpDiastolic: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Sugar (mg/dL)</label>
                  <input type="number" required value={vitalForm.sugar} onChange={(e) => setVitalForm({...vitalForm, sugar: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Temp (°F)</label>
                  <input type="number" step="0.1" required value={vitalForm.temp} onChange={(e) => setVitalForm({...vitalForm, temp: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Weight (kg)</label>
                  <input type="number" step="0.1" required value={vitalForm.weight} onChange={(e) => setVitalForm({...vitalForm, weight: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Height (cm)</label>
                  <input type="number" required value={vitalForm.height} onChange={(e) => setVitalForm({...vitalForm, height: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Save Vitals</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Medicine Modal */}
      {activeModal === "medicine" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">💊 Add Medication</h3>
            
            <form onSubmit={handleMedSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Medicine Name</label>
                <input type="text" placeholder="e.g. Paracetamol" required value={medForm.name} onChange={(e) => setMedForm({...medForm, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl outline-hidden focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Dosage (mg/tablet)</label>
                <input type="text" placeholder="e.g. 500mg" required value={medForm.dosage} onChange={(e) => setMedForm({...medForm, dosage: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Frequency</label>
                  <select value={medForm.frequency} onChange={(e) => setMedForm({...medForm, frequency: e.target.value})} className="w-full px-2 py-2 text-sm bg-slate-50 border rounded-xl">
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Time</label>
                  <input type="text" placeholder="e.g. 09:00 AM" required value={medForm.time} onChange={(e) => setMedForm({...medForm, time: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Total Pills Allocated</label>
                <input type="number" required value={medForm.totalTablets} onChange={(e) => setMedForm({...medForm, totalTablets: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Add Medicine</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Log Symptoms Modal */}
      {activeModal === "symptom" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">🤒 Log Symptoms</h3>
            
            <form onSubmit={handleSymptomSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Symptom Name</label>
                <input type="text" placeholder="e.g. Dizziness" required value={symForm.name} onChange={(e) => setSymForm({...symForm, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Severity Level</span>
                  <span className="text-emerald-500 font-black">{symForm.severity}/10</span>
                </label>
                <input type="range" min="1" max="10" value={symForm.severity} onChange={(e) => setSymForm({...symForm, severity: e.target.value})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Mood Selector</label>
                <div className="flex gap-2 justify-between mt-1.5">
                  {["😀", "😐", "🥱", "😟", "😫"].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setSymForm({ ...symForm, mood: emoji })}
                      className={`text-2xl p-2.5 rounded-xl border transition ${
                        symForm.mood === emoji ? "bg-emerald-50 border-emerald-500 scale-110" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Notes / Description</label>
                <textarea rows="2" placeholder="Describe symptoms..." value={symForm.notes} onChange={(e) => setSymForm({...symForm, notes: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Log Symptom</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Book Doctor Visit Modal */}
      {activeModal === "visit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">🩺 Book Doctor Visit</h3>
            
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Doctor Name</label>
                <input type="text" placeholder="Dr. Sarah Jenkins" required value={visitForm.doctor} onChange={(e) => setVisitForm({...visitForm, doctor: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Hospital / Clinic</label>
                <input type="text" placeholder="City General Hospital" required value={visitForm.hospital} onChange={(e) => setVisitForm({...visitForm, hospital: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Visit Date</label>
                  <input type="date" required value={visitForm.date} onChange={(e) => setVisitForm({...visitForm, date: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Visit Time</label>
                  <input type="text" placeholder="e.g. 11:30 AM" value={visitForm.time} onChange={(e) => setVisitForm({...visitForm, time: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Reason for Visit</label>
                <input type="text" placeholder="e.g. Seasonal allergy follow-up" value={visitForm.reason} onChange={(e) => setVisitForm({...visitForm, reason: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Diagnosis Notes</label>
                  <input type="text" placeholder="Notes..." value={visitForm.prescription} onChange={(e) => setVisitForm({...visitForm, prescription: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Follow-up Date</label>
                  <input type="date" value={visitForm.followUp} onChange={(e) => setVisitForm({...visitForm, followUp: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Add Doctor Visit</button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Upload Prescription Modal */}
      {activeModal === "prescription" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">📄 Upload Prescription</h3>
            
            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Document Name</label>
                <input type="text" placeholder="e.g. Asthma_Inhaler_Refill" required value={presForm.name} onChange={(e) => setPresForm({...presForm, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Document Format</label>
                <select value={presForm.type} onChange={(e) => setPresForm({...presForm, type: e.target.value})} className="w-full px-2 py-2 text-sm bg-slate-50 border rounded-xl">
                  <option value="pdf">PDF File (.pdf)</option>
                  <option value="image">Image Receipt (.jpg/.png)</option>
                </select>
              </div>
              
              {/* Fake Drag and Drop Upload Area */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition cursor-pointer">
                <FaCloudUploadAlt className="mx-auto text-slate-300 w-8 h-8 mb-2" />
                <span className="text-xs text-slate-500 block font-semibold">Select or drag files here</span>
                <span className="text-[10px] text-slate-400 block mt-1">Mock upload process</span>
              </div>
              
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Submit Document</button>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Visit Detail Popup Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setSelectedVisit(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-2">Visit Summary</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full inline-block border border-blue-100 mb-4">
              Consultation Log
            </span>
            <div className="space-y-3.5 text-sm text-slate-700">
              <div>
                <p className="text-[10px] text-slate-450 uppercase font-bold">Doctor</p>
                <p className="font-extrabold text-slate-800 mt-0.5">{selectedVisit.doctorName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-450 uppercase font-bold">Hospital/Clinic</p>
                <p className="font-semibold text-slate-600 mt-0.5">{selectedVisit.hospital}</p>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-bold">Date</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedVisit.visitDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-bold">Time</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedVisit.time || '10:00 AM'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-450 uppercase font-bold">Reason</p>
                <p className="font-medium text-slate-650 mt-0.5">{selectedVisit.reason}</p>
              </div>
              <div className="bg-slate-50 border rounded-2xl p-3.5 mt-2">
                <p className="text-[10px] text-emerald-600 uppercase font-extrabold">Prescriptions & Advice</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedVisit.prescription}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-450 uppercase font-bold">Follow-up Date</p>
                <p className="font-bold text-slate-850 mt-0.5">{selectedVisit.followUpDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}

export default Dashboard;
