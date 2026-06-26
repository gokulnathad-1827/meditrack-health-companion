import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHealth } from "../../context/HealthContext";
import { FaBars, FaBell, FaSearch, FaCog, FaUser, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Navbar({ onToggleSidebar }) {
  const { user } = useHealth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockNotifications = [
    { id: 1, text: "Asthma Wheezing logged: Used Albuterol Inhaler", time: "2 hours ago", type: "warning" },
    { id: 2, text: "Medicine Metformin (500mg) scheduled for 08:00 PM", time: "1 hour remaining", type: "info" },
    { id: 3, text: "Vitals log: BP 120/80 is in the optimal range", time: "Today, 08:00 AM", type: "success" },
    { id: 4, text: "Urgent: Complete your profile verification", time: "Yesterday", type: "error" }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock navigation or popup
      alert(`Search matches for: "${searchQuery}" (simulated search)`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-slate-100 shadow-xs">
      
      {/* Left: Mobile Toggle & Brand/Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 lg:hidden transition"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>

        {/* Mock Search Form */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center w-full max-w-sm relative">
          <FaSearch className="absolute left-3.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vitals, medicines, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/75 focus:bg-white border border-slate-100 focus:border-emerald-500/50 rounded-xl outline-hidden focus:ring-3 focus:ring-emerald-500/10 transition-all duration-200"
          />
        </form>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 lg:gap-4">
        
        {/* Notification Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition relative ${
              showNotifications ? "bg-slate-100 text-emerald-600" : ""
            }`}
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <>
              {/* Backscreen tap close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              
              <div className="absolute right-0 mt-3 w-80 lg:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-150">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <button 
                    onClick={() => setShowNotifications(false)} 
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div key={notif.id} className="flex gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-b-0 cursor-pointer">
                      <div className="mt-0.5">
                        {notif.type === "success" && <FaCheckCircle className="text-emerald-500 w-4.5 h-4.5" />}
                        {notif.type === "warning" && <FaExclamationTriangle className="text-amber-500 w-4.5 h-4.5" />}
                        {notif.type === "info" && <FaBell className="text-blue-500 w-4.5 h-4.5" />}
                        {notif.type === "error" && <FaExclamationTriangle className="text-red-500 w-4.5 h-4.5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-700 leading-normal">{notif.text}</p>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-2 px-4">
                  <Link 
                    to="/settings" 
                    onClick={() => setShowNotifications(false)} 
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium inline-block underline"
                  >
                    Configure notification intervals
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings Icon Link */}
        <Link
          to="/settings"
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
          aria-label="Settings"
        >
          <FaCog className="w-5 h-5" />
        </Link>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-100" />

        {/* User profile dropdown info */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1 pr-3 hover:bg-slate-50 rounded-xl transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center group-hover:scale-105 transition-all">
            {user.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              Score: <span className="text-emerald-500 font-bold">92%</span>
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;