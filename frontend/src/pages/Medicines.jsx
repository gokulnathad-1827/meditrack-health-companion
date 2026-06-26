import React, { useState } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaPills, FaPlus, FaCheck, FaTrash, FaEdit, FaCalendarAlt, FaTimes } from "react-icons/fa";

function Medicines() {
  const { medicines, addMedicine, editMedicine, deleteMedicine, markMedicineAsTaken } = useHealth();

  // Active Modals
  const [activeModal, setActiveModal] = useState(null); // 'add' or 'edit'
  const [selectedMed, setSelectedMed] = useState(null);

  // Form states
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    time: "08:00 AM",
    remainingTablets: 30,
    totalTablets: 30
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.dosage || !form.time) return;
    
    addMedicine({
      name: form.name,
      dosage: form.dosage,
      frequency: form.frequency,
      time: form.time,
      remainingTablets: parseInt(form.remainingTablets),
      totalTablets: parseInt(form.totalTablets),
      status: "Pending"
    });

    setForm({ name: "", dosage: "", frequency: "Once daily", time: "08:00 AM", remainingTablets: 30, totalTablets: 30 });
    setActiveModal(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedMed.name || !selectedMed.dosage || !selectedMed.time) return;

    editMedicine({
      ...selectedMed,
      remainingTablets: parseInt(selectedMed.remainingTablets),
      totalTablets: parseInt(selectedMed.totalTablets)
    });

    setSelectedMed(null);
    setActiveModal(null);
  };

  // Mock days of the week for the calendar view
  const weekdays = [
    { name: "Mon", date: "22" },
    { name: "Tue", date: "23" },
    { name: "Wed", date: "24" },
    { name: "Thu", date: "25" },
    { name: "Fri", date: "26" },
    { name: "Sat", date: "27" },
    { name: "Sun", date: "28" }
  ];

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Medications Schedule</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Log prescriptions, pill inventory and daily reminders.</p>
        </div>
        <button
          onClick={() => {
            setForm({ name: "", dosage: "", frequency: "Once daily", time: "08:00 AM", remainingTablets: 30, totalTablets: 30 });
            setActiveModal("add");
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-500/10 transition"
        >
          <FaPlus />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Week Calendar Checklist Widget */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs mb-8">
        <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
          <FaCalendarAlt className="text-emerald-500 w-4 h-4" /> Weekly Medicine Tracker (June 2026)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekdays.map((day) => {
            // Highlight Friday June 26th as current date
            const isToday = day.date === "26";
            
            return (
              <div 
                key={day.name} 
                className={`rounded-2xl p-4 border transition ${
                  isToday 
                    ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/15" 
                    : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                }`}
              >
                <div className="text-center pb-2 border-b border-slate-200/50">
                  <span className={`text-[10px] font-bold block ${isToday ? "text-emerald-600" : "text-slate-400"}`}>
                    {day.name}
                  </span>
                  <span className={`text-lg font-black block mt-0.5 ${isToday ? "text-emerald-700" : "text-slate-800"}`}>
                    {day.date}
                  </span>
                </div>

                <div className="mt-3.5 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {medicines.map((med) => {
                    // Simulating different pills checklist per weekday.
                    // E.g., Albuterol is as needed, Lisinopril/Metformin/Multivitamin are daily.
                    const isTaken = isToday ? med.status === "Taken" : true; 
                    return (
                      <div 
                        key={med.id} 
                        className={`p-2 rounded-lg text-[10px] font-semibold border flex justify-between items-center gap-1.5 cursor-pointer ${
                          isTaken 
                            ? "bg-emerald-100/30 text-emerald-800 border-emerald-100" 
                            : "bg-slate-100 text-slate-700 border-slate-205"
                        }`}
                        onClick={() => isToday && markMedicineAsTaken(med.id)}
                      >
                        <div className="truncate">
                          <p className="font-extrabold truncate">{med.name}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{med.time}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 ${isTaken ? "bg-emerald-500 text-white" : "bg-white border"}`}>
                          {isTaken && <FaCheck className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Medication Inventory List */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <FaPills className="text-emerald-500 w-4 h-4" /> Active Prescriptions List
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicines.map((med) => {
            const pillStockPercent = (med.remainingTablets / med.totalTablets) * 100;
            const isLowStock = med.remainingTablets <= 5;
            
            return (
              <div 
                key={med.id} 
                className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-emerald-500/10 transition-all shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                        💊
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-base">{med.name}</h4>
                        <p className="text-xs text-slate-450 font-bold mt-0.5">{med.dosage} &bull; {med.frequency}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedMed(med);
                          setActiveModal("edit");
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition"
                        title="Edit Medicine"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${med.name} from logs?`)) {
                            deleteMedicine(med.id);
                          }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Delete Medicine"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4.5 mt-5 border-t border-slate-150 pt-4">
                    <div>
                      <span className="text-[10px] text-slate-450 uppercase font-bold block">Reminder Time</span>
                      <span className="text-xs font-black text-slate-700 mt-1 block">{med.time}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-450 uppercase font-bold block">Inventory Count</span>
                      <span className={`text-xs font-black mt-1 block ${isLowStock ? "text-red-550 animate-pulse" : "text-slate-700"}`}>
                        {med.remainingTablets} / {med.totalTablets} pills remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar pill inventory */}
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-450">Stock Level</span>
                    <span className={isLowStock ? "text-red-555" : "text-emerald-650"}>
                      {pillStockPercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isLowStock ? "bg-red-500" : "bg-emerald-500"}`} 
                      style={{ width: `${pillStockPercent}%` }}
                    />
                  </div>
                  {isLowStock && (
                    <span className="text-[9px] text-red-505 font-bold mt-1.5 block animate-bounce">
                      ⚠️ Refill Warning: Low tablets remaining!
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* --- ADD MEDICINE MODAL --- */}
      {activeModal === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">💊 Add Medication</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Medicine Name</label>
                <input type="text" placeholder="e.g. Lisinopril" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Dosage (mg/tablet)</label>
                <input type="text" placeholder="e.g. 10mg" required value={form.dosage} onChange={(e) => setForm({...form, dosage: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Frequency</label>
                  <select value={form.frequency} onChange={(e) => setForm({...form, frequency: e.target.value})} className="w-full px-2 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer">
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Reminder Time</label>
                  <input type="text" placeholder="e.g. 08:00 AM" required value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Current Stock</label>
                  <input type="number" required value={form.remainingTablets} onChange={(e) => setForm({...form, remainingTablets: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Pills Allocation</label>
                  <input type="number" required value={form.totalTablets} onChange={(e) => setForm({...form, totalTablets: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Add Medication</button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MEDICINE MODAL --- */}
      {activeModal === "edit" && selectedMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-2xl p-6 relative">
            <button onClick={() => { setSelectedMed(null); setActiveModal(null); }} className="absolute top-5 right-5 text-slate-400 hover:text-slate-655 transition"><FaTimes /></button>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">💊 Edit Medication</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Medicine Name</label>
                <input type="text" required value={selectedMed.name} onChange={(e) => setSelectedMed({...selectedMed, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Dosage</label>
                <input type="text" required value={selectedMed.dosage} onChange={(e) => setSelectedMed({...selectedMed, dosage: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Frequency</label>
                  <select value={selectedMed.frequency} onChange={(e) => setSelectedMed({...selectedMed, frequency: e.target.value})} className="w-full px-2 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer">
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Reminder Time</label>
                  <input type="text" required value={selectedMed.time} onChange={(e) => setSelectedMed({...selectedMed, time: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Current Stock</label>
                  <input type="number" required value={selectedMed.remainingTablets} onChange={(e) => setSelectedMed({...selectedMed, remainingTablets: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Total Stock</label>
                  <input type="number" required value={selectedMed.totalTablets} onChange={(e) => setSelectedMed({...selectedMed, totalTablets: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition">Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </MainLayout>
  );
}

export default Medicines;
