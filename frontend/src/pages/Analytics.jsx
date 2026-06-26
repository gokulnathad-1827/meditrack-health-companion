import React from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { FaChartLine, FaChartPie, FaPercentage, FaRunning } from "react-icons/fa";

function Analytics() {
  const { vitals, medicines, symptoms } = useHealth();

  // 1. Mock Monthly Health Score
  const monthlyScoreData = [
    { month: "Jan", score: 85 },
    { month: "Feb", score: 87 },
    { month: "Mar", score: 89 },
    { month: "Apr", score: 88 },
    { month: "May", score: 91 },
    { month: "Jun", score: 92 }
  ];

  // 2. Extract BP & Sugar data from vitals
  const vitalsChronological = [...vitals].slice(0, 10).reverse();
  const vitalsTrendData = vitalsChronological.map((v) => {
    const bpParts = v.bloodPressure ? v.bloodPressure.split("/") : [120, 80];
    return {
      date: v.date.substring(5), // MM-DD
      systolic: parseInt(bpParts[0]) || 120,
      diastolic: parseInt(bpParts[1]) || 80,
      sugar: v.bloodSugar || 99,
      bmi: v.bmi || 22.0
    };
  });

  // 3. Medication Adherence Rate calculation based on status (Taken vs Pending)
  const takenCount = medicines.filter((m) => m.status === "Taken").length;
  const pendingCount = medicines.filter((m) => m.status === "Pending").length;
  const adherencePercent = medicines.length > 0 ? ((takenCount / medicines.length) * 105).toFixed(0) : 0; // scale mock
  
  const adherenceData = [
    { name: "Taken (Completed)", value: takenCount || 3 },
    { name: "Pending / Missed", value: pendingCount || 1 }
  ];
  const COLORS = ["#10b981", "#ef4444"];

  // 4. Symptoms Frequency calculation
  const symptomCounts = symptoms.reduce((acc, current) => {
    acc[current.name] = (acc[current.name] || 0) + 1;
    return acc;
  }, {});

  const symptomFrequencyData = Object.keys(symptomCounts).map((key) => ({
    name: key,
    frequency: symptomCounts[key]
  }));

  // Default if symptoms are empty
  const defaultSymptomData = [
    { name: "Headache", frequency: 4 },
    { name: "Fatigue", frequency: 2 },
    { name: "Asthma Wheeze", frequency: 3 },
    { name: "Dizziness", frequency: 1 }
  ];
  const finalSymptomData = symptomFrequencyData.length > 0 ? symptomFrequencyData : defaultSymptomData;

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Interactive Health Analytics</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Examine longitudinal charts, pill compliance rates and diagnostic trends.</p>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Compliance Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
            <FaPercentage />
          </div>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider block">Medication Adherence</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight mt-1 block">
              {adherencePercent > 100 ? 100 : adherencePercent}% Compliance
            </span>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl shrink-0">
            <FaChartLine />
          </div>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider block">Monthly Health Score</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight mt-1 block">92 / 100 Average</span>
          </div>
        </div>

        {/* Symptoms Index Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl shrink-0">
            <FaRunning />
          </div>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider block">Logged Symptoms</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight mt-1 block">
              {symptoms.length} logs recorded
            </span>
          </div>
        </div>

      </div>

      {/* Grid of Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Monthly Health Score Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Monthly Health Index Score
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyScoreData}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={10} />
              <Tooltip />
              <Area type="monotone" dataKey="score" name="Health Score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Blood Pressure Trend (Composed systolic/diastolic) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" /> Systolic vs Diastolic BP Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={vitalsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip />
              <Legend />
              <Bar dataKey="systolic" name="Systolic (High)" fill="#3b82f6" opacity={0.85} barSize={16} radius={[3, 3, 0, 0]} />
              <Line type="monotone" dataKey="diastolic" name="Diastolic (Low)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Glucose & BMI Trends */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" /> Blood Glucose & BMI correlation
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={vitalsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
              <YAxis yAxisId="left" label={{ value: 'Sugar (mg/dL)', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#94a3b8'} }} stroke="#10b981" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'BMI Index', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#94a3b8'} }} stroke="#8b5cf6" fontSize={10} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sugar" name="Glucose" stroke="#10b981" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="bmi" name="BMI" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Medicine Adherence Pie Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <h3 className="font-extrabold text-slate-800 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-500" /> Medication Adherence Breakdown
          </h3>
          <span className="text-[10px] text-slate-400 font-bold block mb-4">COMPLIANCE RATIO FOR ACTIVE PRESCRIPTIONS</span>
          
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="w-full max-w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adherenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {adherenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-700">Taken (completed checklist)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-700">Pending (requires review)</span>
              </div>
              <div className="bg-slate-50 border p-3 rounded-xl text-[10px] text-slate-400 mt-2 font-bold uppercase leading-normal">
                Updating your checklist on the Medicines page dynamically updates this adherence ratio.
              </div>
            </div>
          </div>
        </div>

        {/* 5. Symptoms Frequency Frequency Bar chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" /> Symptom Frequency Logs
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={finalSymptomData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip />
              <Bar dataKey="frequency" name="Occurrences logged" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </MainLayout>
  );
}

export default Analytics;