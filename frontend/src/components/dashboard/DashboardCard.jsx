import React from "react";

function DashboardCard({ title, value, status, updated, icon, colorClass, borderClass }) {
  // Define badges classes based on health status
  const getStatusBadge = (statusVal) => {
    if (!statusVal) return null;
    const lower = statusVal.toLowerCase();
    if (lower.includes("high") || lower.includes("warning") || lower.includes("fever")) {
      return "bg-red-50 text-red-650 border-red-100";
    }
    if (lower.includes("low")) {
      return "bg-blue-50 text-blue-605 border-blue-100";
    }
    return "bg-emerald-50 text-emerald-650 border-emerald-100";
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all duration-300 group`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1.5 group-hover:text-slate-900">
            {value}
          </h3>
        </div>
        
        {/* Dynamic color-coated rounded icon container */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-xs transition duration-300 group-hover:scale-105 ${colorClass}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50">
        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getStatusBadge(status)}`}>
          {status}
        </span>
        <span className="text-[10px] font-semibold text-slate-400">
          {updated}
        </span>
      </div>
    </div>
  );
}

export default DashboardCard;