import React from "react";
import { NavLink } from "react-router-dom";
import { useHealth } from "../../context/HealthContext";
import {
  FaHeartbeat,
  FaPills,
  FaUserMd,
  FaFileMedical,
  FaChartLine,
  FaClipboardList,
  FaExclamationTriangle,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaStethoscope,
  FaTimes
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

function Sidebar({ isOpen, onClose }) {
  const { logoutUser, user } = useHealth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <FaUser className="w-5 h-5" /> },
    { name: "Vitals", path: "/vitals", icon: <FaHeartbeat className="w-5 h-5" /> },
    { name: "Medicines", path: "/medicines", icon: <FaPills className="w-5 h-5" /> },
    { name: "Symptoms", path: "/symptoms", icon: <FaStethoscope className="w-5 h-5" /> },
    { name: "Doctor Visits", path: "/doctor-visit", icon: <FaUserMd className="w-5 h-5" /> },
    { name: "Prescriptions", path: "/prescriptions", icon: <FaFileMedical className="w-5 h-5" /> },
    { name: "Reports", path: "/reports", icon: <FaClipboardList className="w-5 h-5" /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartLine className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <FaCog className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-emerald-500/20 shadow-md">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Medi<span className="text-emerald-500">Track</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white lg:hidden transition"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Quick SOS Trigger at top of menu */}
        <div className="px-4 py-3">
          <NavLink
            to="/emergency"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold border text-sm transition-all duration-300 shadow-xs ${
                isActive
                  ? "bg-red-500 text-white border-red-400 shadow-red-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500"
              }`
            }
          >
            <FaExclamationTriangle className="w-4 h-4 animate-pulse" />
            <span>EMERGENCY SOS</span>
          </NavLink>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border-l-4 border-emerald-500 pl-3 font-semibold"
                    : "hover:bg-slate-800 hover:text-white border-l-4 border-transparent"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Info / Logout */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logoutUser();
              onClose();
            }}
            className="flex items-center gap-3.5 w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition duration-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;