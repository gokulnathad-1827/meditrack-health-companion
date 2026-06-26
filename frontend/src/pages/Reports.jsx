import React, { useState } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaFilePdf, FaCheck, FaCalendarAlt, FaDownload, FaPrint, FaClipboardList, FaFileMedical } from "react-icons/fa";

function Reports() {
  const { user, vitals, medicines, symptoms, visits } = useHealth();

  // Generator configurations
  const [startDate, setStartDate] = useState("2026-06-20");
  const [endDate, setEndDate] = useState("2026-06-26");
  
  const [sections, setSections] = useState({
    vitals: true,
    medicines: true,
    symptoms: true,
    visits: true
  });

  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true); // default show preview

  // Filter logs by date range
  const filterByDate = (items, dateKey) => {
    return items.filter((item) => {
      const date = item[dateKey];
      if (startDate && new Date(date) < new Date(startDate)) return false;
      if (endDate && new Date(date) > new Date(endDate)) return false;
      return true;
    });
  };

  const reportVitals = filterByDate(vitals, "date");
  const reportSymptoms = filterByDate(symptoms, "date");
  const reportVisits = filterByDate(visits, "visitDate");
  const reportMedicines = medicines; // medicines are scheduler templates, not logs

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsGenerated(true);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    alert("Exporting Report to PDF... (PDF download simulated successfully)");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Clinical Report Generator</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Consolidate health data, symptom journals and active medications into exportable clinical summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Report Parameters Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs h-fit text-left">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <FaClipboardList className="text-emerald-500 w-4 h-4" /> Report Configuration
          </h3>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Date Range Inputs */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl cursor-pointer"
                required
              />
            </div>

            {/* Choose Sections */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-3.5">Included Sections</label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-xs text-slate-650 cursor-pointer font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={sections.vitals}
                    onChange={(e) => setSections({ ...sections, vitals: e.target.checked })}
                    className="w-4.5 h-4.5 border-slate-350 rounded-sm text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Vitals Logs History</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-650 cursor-pointer font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={sections.medicines}
                    onChange={(e) => setSections({ ...sections, medicines: e.target.checked })}
                    className="w-4.5 h-4.5 border-slate-350 rounded-sm text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Daily Medication Schedule</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-650 cursor-pointer font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={sections.symptoms}
                    onChange={(e) => setSections({ ...sections, symptoms: e.target.checked })}
                    className="w-4.5 h-4.5 border-slate-350 rounded-sm text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Symptom Tracker Logs</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-650 cursor-pointer font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={sections.visits}
                    onChange={(e) => setSections({ ...sections, visits: e.target.checked })}
                    className="w-4.5 h-4.5 border-slate-350 rounded-sm text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Doctor Visit Consultations</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-450 text-white font-bold text-xs rounded-xl shadow-md transition duration-200"
            >
              {loading ? "Generating Report Summary..." : "Re-compile Report"}
            </button>
          </form>
        </div>

        {/* Report Preview Display */}
        <div className="lg:col-span-2 space-y-6">
          {isGenerated ? (
            <>
              {/* Preview Action Toolbar */}
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Print-ready preview rendering below
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-2 transition"
                  >
                    <FaPrint />
                    <span>Print Report</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md shadow-emerald-500/10"
                  >
                    <FaDownload />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable Medical Sheet preview page */}
              <div id="printable-report" className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-md text-left font-sans max-w-4xl mx-auto space-y-8">
                
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-slate-900 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">M</span>
                      MediTrack Health Report
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Generated Clinical History Record Summary</p>
                  </div>
                  
                  <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
                    <p><span className="text-slate-400 font-bold uppercase">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p className="mt-1"><span className="text-slate-400 font-bold uppercase">Date Range:</span> {startDate} &bull; {endDate}</p>
                  </div>
                </div>

                {/* Patient Information Panel */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <h3 className="font-extrabold text-slate-900 text-sm mb-3">I. Patient Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Patient Name</span>
                      <span className="mt-0.5 block text-slate-900 font-black">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Age / Gender</span>
                      <span className="mt-0.5 block">{user.age} yrs / {user.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Blood Group</span>
                      <span className="mt-0.5 block text-red-650">{user.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] font-bold block">Emergency SOS contact</span>
                      <span className="mt-0.5 block truncate" title={user.emergencyContact}>{user.emergencyContact.split("-")[0]}</span>
                    </div>
                  </div>
                </div>

                {/* 1. Vitals Section */}
                {sections.vitals && (
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 border-b pb-1.5 uppercase tracking-wider text-emerald-650">II. Medical Vitals History</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-xs border-collapse font-semibold">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 border-b">
                            <th className="p-3">Date</th>
                            <th className="p-3">Heart Rate</th>
                            <th className="p-3">BP</th>
                            <th className="p-3">Sugar</th>
                            <th className="p-3">Temp</th>
                            <th className="p-3">Weight</th>
                            <th className="p-3">BMI</th>
                            <th className="p-3">SpO₂</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                          {reportVitals.map((v, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 whitespace-nowrap">{v.date}</td>
                              <td className="p-3">{v.heartRate} bpm</td>
                              <td className="p-3">{v.bloodPressure} mmHg</td>
                              <td className="p-3">{v.bloodSugar} mg/dL</td>
                              <td className="p-3">{v.temperature} °F</td>
                              <td className="p-3">{v.weight} kg</td>
                              <td className="p-3">{v.bmi}</td>
                              <td className="p-3">{v.spo2}%</td>
                            </tr>
                          ))}
                          {reportVitals.length === 0 && (
                            <tr><td colSpan="8" className="p-4 text-center text-slate-400">No vitals entries in date range.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Medicines Section */}
                {sections.medicines && (
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 border-b pb-1.5 uppercase tracking-wider text-emerald-650">III. Active Medication Schedule</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-xs border-collapse font-semibold">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 border-b">
                            <th className="p-3">Medication Name</th>
                            <th className="p-3">Dosage</th>
                            <th className="p-3">Frequency</th>
                            <th className="p-3">Time</th>
                            <th className="p-3">Pills Left</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                          {reportMedicines.map((m) => (
                            <tr key={m.id}>
                              <td className="p-3 font-black text-slate-800">{m.name}</td>
                              <td className="p-3">{m.dosage}</td>
                              <td className="p-3">{m.frequency}</td>
                              <td className="p-3 text-emerald-650">{m.time}</td>
                              <td className="p-3">{m.remainingTablets} of {m.totalTablets} left</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. Symptoms Section */}
                {sections.symptoms && (
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 border-b pb-1.5 uppercase tracking-wider text-emerald-650">IV. Symptoms Journal Logs</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-xs border-collapse font-semibold">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 border-b">
                            <th className="p-3">Date / Time</th>
                            <th className="p-3">Symptom</th>
                            <th className="p-3">Severity (1-10)</th>
                            <th className="p-3">Mood</th>
                            <th className="p-3">Physiological Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                          {reportSymptoms.map((s) => (
                            <tr key={s.id}>
                              <td className="p-3 whitespace-nowrap">{s.date} <span className="text-[10px] text-slate-400 block">{s.time}</span></td>
                              <td className="p-3 font-black text-slate-800">{s.name}</td>
                              <td className="p-3">{s.severity}/10</td>
                              <td className="p-3 text-lg">{s.mood}</td>
                              <td className="p-3 text-slate-500 leading-normal max-w-xs">{s.notes}</td>
                            </tr>
                          ))}
                          {reportSymptoms.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-400">No symptom logs found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Doctor Visits Section */}
                {sections.visits && (
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 border-b pb-1.5 uppercase tracking-wider text-emerald-650">V. Doctor Consultation Summary</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-xs border-collapse font-semibold">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 border-b">
                            <th className="p-3">Doctor / Facility</th>
                            <th className="p-3">Appointment Date</th>
                            <th className="p-3">Consultation Reason</th>
                            <th className="p-3">Diagnosis Details</th>
                            <th className="p-3">Follow-up</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                          {reportVisits.map((v) => (
                            <tr key={v.id}>
                              <td className="p-3 font-black text-slate-800">{v.doctorName} <span className="text-[10px] text-slate-400 block">{v.hospital}</span></td>
                              <td className="p-3 whitespace-nowrap">{v.visitDate}</td>
                              <td className="p-3">{v.reason}</td>
                              <td className="p-3 text-slate-500 leading-normal max-w-xs">{v.prescription}</td>
                              <td className="p-3 text-emerald-650 font-bold">{v.followUpDate}</td>
                            </tr>
                          ))}
                          {reportVisits.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-400">No doctor visits logged in date range.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Footer disclaimer */}
                <div className="pt-8 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed text-center font-semibold">
                  Disclaimer: This is a generated client-side patient summaries file produced by the MediTrack Healthcare Application. It does not replace qualified expert diagnostics. If you experience medical difficulties, contact the Emergency department or trigger SOS instantly.
                </div>
              </div>
            </>
          ) : (
            <div className="h-96 bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 shadow-xs">
              <FaFilePdf className="w-12 h-12 text-slate-305 mb-4 animate-bounce" />
              <p className="font-bold">No report compiled.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs text-center leading-normal">
                Adjust configurations in the left sidebar and click "Compile Report Summary" to render.
              </p>
            </div>
          )}
        </div>

      </div>

    </MainLayout>
  );
}

export default Reports;
