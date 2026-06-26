import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useHealth } from "../context/HealthContext";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Vitals from "../pages/Vitals";
import Medicines from "../pages/Medicines";
import Symptoms from "../pages/Symptoms";
import DoctorVisit from "../pages/DoctorVisit";
import Prescriptions from "../pages/Prescriptions";
import Reports from "../pages/Reports";
import Analytics from "../pages/Analytics";
import Emergency from "../pages/Emergency";
import Settings from "../pages/Settings";

// A route guard for authenticated views
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useHealth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// A route guard to prevent logged-in users from seeing login/register
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useHealth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vitals"
        element={
          <ProtectedRoute>
            <Vitals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medicines"
        element={
          <ProtectedRoute>
            <Medicines />
          </ProtectedRoute>
        }
      />
      <Route
        path="/symptoms"
        element={
          <ProtectedRoute>
            <Symptoms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-visit"
        element={
          <ProtectedRoute>
            <DoctorVisit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <Prescriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <Emergency />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;