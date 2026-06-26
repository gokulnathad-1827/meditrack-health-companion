import React, { useState, useEffect } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaHeartbeat, FaCalendarAlt, FaFilter, FaPlus, FaCalculator, FaTimes } from "react-icons/fa";

function Vitals() {
  const { vitals, addVitalRecord } = useHealth();
  const [activeTab, setActiveTab] = useState("bp"); // 'bp', 'sugar', 'hr', 'weight'

  // Form states
  const [form, setForm] = useState({
    hr: "",
    bpSystolic: "",
    bpDiastolic: "",
    sugar: "",
    temp: "",
    weight: "",
    height: "175", // default height
    spo2: ""
  });

  const [bmiCalculated, setBmiCalculated] = useState("");

  // Filters
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Auto calculate BMI when weight or height changes
  useEffect(() => {
    if (form.weight && form.height) {
      const hM = parseFloat(form.height) / 100;
      const bmiVal = (parseFloat(form.weight) / (hM * hM)).toFixed(1);
      setBmiCalculated(bmiVal);
    } else {
      setBmiCalculated("");
    }
  }, [form.weight, form.height]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hr || !form.bpSystolic || !form.bpDiastolic || !form.sugar || !form.temp || !form.weight || !form.spo2) {
      alert("Please fill in all vitals fields");
      return;
    }

    const now = new Date();
    addVitalRecord({
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      heartRate: parseInt(form.hr),
      bloodPressure: `${form.bpSystolic}/${form.bpDiastolic}`,
      bloodSugar: parseInt(form.sugar),
      temperature: parseFloat(form.temp),
      weight: parseFloat(form.weight),
      height: parseInt(form.height),
      bmi: parseFloat(bmiCalculated) || 22.0,
      spo2: parseInt(form.spo2)
    });

    // Reset fields except height
    setForm({
      hr: "",
      bpSystolic: "",
      bpDiastolic: "",
      sugar: "",
      temp: "",
      weight: "",
      height: "175",
      spo2: ""
    });
  };

  // Filter vitals list by date
  const filteredVitals = vitals.filter((item) => {
    if (filterStartDate && new Date(item.date) < new Date(filterStartDate)) return false;
    if (filterEndDate && new Date(item.date) > new Date(filterEndDate)) return false;
    return true;
  });

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...filteredVitals].reverse().map((v) => {
    const bpParts = v.bloodPressure ? v.bloodPressure.split("/") : [120, 80];
    return {
      date: v.date,
      systolic: parseInt(bpParts[0]) || 120,
      diastolic: parseInt(bpParts[1]) || 80,
      sugar: v.bloodSugar || 90,
      hr: v.heartRate || 72,
      weight: v.weight || 68,
      bmi: v.bmi || 22
    };
  });

  return (
    <MainLayout>
      
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vitals & Health Metrics</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Track, analyze and record daily metabolic indices.</p>
        </div>
      </div>

      {/* Grid Layout: Input Form + Chart Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Vitals Form Column */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs h-fit">
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <FaPlus className="text-emerald-500 w-4 h-4" /> Log Current Vitals
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3.5">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  placeholder="e.g. 72"
                  value={form.hr}
                  onChange={(e) => setForm({ ...form, hr: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">SpO₂ (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 98"
                  max="100"
                  value={form.spo2}
                  onChange={(e) => setForm({ ...form, spo2: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  placeholder="e.g. 120"
                  value={form.bpSystolic}
                  onChange={(e) => setForm({ ...form, bpSystolic: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={form.bpDiastolic}
                  onChange={(e) => setForm({ ...form, bpDiastolic: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Blood Sugar (mg/dL)</label>
                <input
                  type="number"
                  placeholder="e.g. 99"
                  value={form.sugar}
                  onChange={(e) => setForm({ ...form, sugar: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 98.6"
                  value={form.temp}
                  onChange={(e) => setForm({ ...form, temp: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 68.2"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Height (cm)</label>
                <input
                  type="number"
                  placeholder="e.g. 175"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
                  required
                />
              </div>

            </div>

            {/* Calculated BMI */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex justify-between items-center mt-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <FaCalculator className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold">Auto-calculated BMI</span>
              </div>
              <span className="text-lg font-black text-emerald-650">{bmiCalculated || "N/A"}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg transition duration-200"
            >
              Save Vitals Entry
            </button>
          </form>
        </div>

        {/* Interactive Charts Column */}
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h3 className="font-extrabold text-slate-800">Health History Visualizer</h3>
            
            {/* Tabs switcher */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 self-start sm:self-center">
              <button
                onClick={() => setActiveTab("bp")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "bp" ? "bg-white text-blue-600 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
              >
                BP
              </button>
              <button
                onClick={() => setActiveTab("sugar")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "sugar" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
              >
                Sugar
              </button>
              <button
                onClick={() => setActiveTab("hr")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "hr" ? "bg-white text-red-650 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
              >
                Heart Rate
              </button>
              <button
                onClick={() => setActiveTab("weight")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "weight" ? "bg-white text-violet-650 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
              >
                Weight/BMI
              </button>
            </div>
          </div>

          <div className="flex-1">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                {activeTab === "bp" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" name="Systolic BP" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                ) : activeTab === "sugar" ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="sugar" name="Blood Sugar (mg/dL)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
                  </AreaChart>
                ) : activeTab === "hr" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis yAxisId="left" stroke="#8b5cf6" fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={10} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#8b5cf6" strokeWidth={3} />
                    <Line yAxisId="right" type="monotone" dataKey="bmi" name="BMI" stroke="#ec4899" strokeWidth={2.5} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-slate-400 font-semibold bg-slate-50 rounded-2xl border border-dashed">
                No data available for charts inside this date range.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Vitals History Table & Date Filters */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
        
        {/* Table Toolbar / Filters */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
            <FaFilter className="text-emerald-500 w-4 h-4" /> Vitals History Log
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">Start:</span>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-hidden cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">End:</span>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-hidden cursor-pointer"
              />
            </div>
            {(filterStartDate || filterEndDate) && (
              <button
                onClick={() => {
                  setFilterStartDate("");
                  setFilterEndDate("");
                }}
                className="p-1.5 rounded-lg bg-red-50 text-red-505 font-bold hover:bg-red-100 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead>
              <tr className="bg-slate-50 text-slate-450 uppercase text-[10px] font-bold border-b border-slate-100">
                <th className="px-6 py-4">Date / Time</th>
                <th className="px-6 py-4">Heart Rate</th>
                <th className="px-6 py-4">Blood Pressure</th>
                <th className="px-6 py-4">Blood Sugar</th>
                <th className="px-6 py-4">Temperature</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">BMI</th>
                <th className="px-6 py-4">SpO₂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredVitals.map((v, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{v.date}</div>
                    <span className="text-[10px] text-slate-400 font-bold">{v.time}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${v.heartRate > 100 || v.heartRate < 60 ? "bg-red-50 text-red-650" : "bg-emerald-50 text-emerald-650"}`}>
                      {v.heartRate} bpm
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.bloodPressure} mmHg</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${v.bloodSugar > 125 ? "bg-red-50 text-red-650" : v.bloodSugar > 100 ? "bg-amber-50 text-amber-650" : "bg-emerald-50 text-emerald-650"}`}>
                      {v.bloodSugar} mg/dL
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.temperature} °F</td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.weight} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{v.bmi}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${v.spo2 < 95 ? "bg-red-50 text-red-650 animate-pulse" : "bg-emerald-50 text-emerald-650"}`}>
                      {v.spo2}%
                    </span>
                  </td>
                </tr>
              ))}
              {filteredVitals.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-405 font-bold">
                    No vital entries logged for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>

    </MainLayout>
  );
}

export default Vitals;
