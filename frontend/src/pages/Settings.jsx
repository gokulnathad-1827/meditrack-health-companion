import React from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaMoon, FaSun, FaBell, FaLanguage, FaLock, FaInfoCircle, FaCog } from "react-icons/fa";

function Settings() {
  const { settings, updateSettings } = useHealth();

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Configure interface layouts, push alarm scopes, translations and security boundaries.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 text-left">
        
        {/* Appearance Settings */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            {settings.darkMode ? <FaMoon className="text-violet-500" /> : <FaSun className="text-amber-500" />}
            <span>Visual Theme</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-700">Dark Mode Interface</p>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Convert colors to dark charcoal themes for lower eye strain.</p>
            </div>
            
            <button
              onClick={() => updateSettings("darkMode", !settings.darkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-hidden ${
                settings.darkMode ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications & Reminders Settings */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <FaBell className="text-emerald-500" />
            <span>Alarms & Notifications</span>
          </h3>

          <div className="space-y-5">
            {/* Enable Push Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">Push Notifications</p>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Receive warnings for high sugar, high BP or urgent alerts.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSettings("notifications", e.target.checked)}
                className="w-4.5 h-4.5 text-emerald-500 border-slate-300 rounded-sm focus:ring-emerald-500"
              />
            </div>

            {/* Pill Reminders */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-sm font-bold text-slate-700">Medication Reminders</p>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Remind me {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} for due pills checklist.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reminders}
                onChange={(e) => updateSettings("reminders", e.target.checked)}
                className="w-4.5 h-4.5 text-emerald-500 border-slate-300 rounded-sm focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* International & Language Settings */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <FaLanguage className="text-emerald-500" />
            <span>Language Preferences</span>
          </h3>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Default Locale Language</p>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Primary language layout translations.</p>
            </div>
            
            <select
              value={settings.language}
              onChange={(e) => updateSettings("language", e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer text-slate-750 font-semibold"
            >
              <option value="English">English (US)</option>
              <option value="Spanish">Español (ES)</option>
              <option value="French">Français (FR)</option>
              <option value="German">Deutsch (DE)</option>
            </select>
          </div>
        </div>

        {/* Security & Access Scope */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <FaLock className="text-emerald-500" />
            <span>Privacy Boundaries</span>
          </h3>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Telemetry Data Sharing</p>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Select access scopes of logs for consulting specialists.</p>
            </div>

            <select
              value={settings.privacy}
              onChange={(e) => updateSettings("privacy", e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border rounded-xl cursor-pointer text-slate-755 font-semibold"
            >
              <option value="Standard">Standard Shared (Recommended)</option>
              <option value="High Privacy">High Privacy (No cloud telemetry)</option>
              <option value="Open Access">Open Access (Specialist synced)</option>
            </select>
          </div>
        </div>

        {/* About App Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-350 shadow-xs flex gap-4.5 items-start">
          <FaInfoCircle className="text-emerald-450 w-6 h-6 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-black text-white text-sm uppercase tracking-wide">MediTrack Application Info</h4>
            <p className="text-xs text-slate-400 leading-normal">
              MediTrack is a premium client-side HealthTech tracking platform. Monitor vital statistics, schedule medications, record discomfort severity, compile PDF printable summaries and dispatch SOS alerts.
            </p>
            <div className="pt-2 flex gap-4 text-[10px] font-bold text-slate-500 border-t border-slate-800">
              <p>VERSION: <span className="text-emerald-400">1.0.0-release</span></p>
              <p>SYNC ENGINE: <span className="text-emerald-400">LocalStorage v2</span></p>
              <p>DEVELOPER: <span className="text-slate-300">DeepMind Antigravity Partner</span></p>
            </div>
          </div>
        </div>

      </div>

    </MainLayout>
  );
}

export default Settings;
