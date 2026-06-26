import React from "react";

function QuickAction({ title, icon, description, onClick, colorClass }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col text-left items-start p-5 bg-white border border-slate-100 rounded-2xl hover:border-emerald-500/20 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group w-full"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-xs group-hover:scale-110 transition duration-300 ${colorClass}`}>
        {icon}
      </div>
      
      <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition text-sm sm:text-base">
        {title}
      </h4>
      
      <p className="text-xs text-slate-400 font-medium mt-1 leading-normal">
        {description}
      </p>
    </button>
  );
}

export default QuickAction;