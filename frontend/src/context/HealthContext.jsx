import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const HealthContext = createContext();

const initialProfile = {
  name: "Gokul",
  email: "gokul@meditrack.com",
  age: 28,
  gender: "Male",
  bloodGroup: "O+",
  conditions: "Mild Hypertension, Seasonal Asthma",
  allergies: "Penicillin, Peanuts, Pollen",
  emergencyContact: "Aishwarya (Wife) - +1 (555) 019-2834"
};

const initialVitals = [
  { date: "2026-06-20", time: "08:00 AM", heartRate: 72, bloodPressure: "120/80", bloodSugar: 98, temperature: 98.6, weight: 68.2, height: 175, bmi: 22.3, spo2: 98 },
  { date: "2026-06-21", time: "08:30 AM", heartRate: 74, bloodPressure: "122/82", bloodSugar: 102, temperature: 98.4, weight: 68.1, height: 175, bmi: 22.2, spo2: 99 },
  { date: "2026-06-22", time: "08:15 AM", heartRate: 71, bloodPressure: "118/79", bloodSugar: 96, temperature: 98.6, weight: 68.0, height: 175, bmi: 22.2, spo2: 98 },
  { date: "2026-06-23", time: "09:00 AM", heartRate: 75, bloodPressure: "124/83", bloodSugar: 110, temperature: 98.9, weight: 68.3, height: 175, bmi: 22.3, spo2: 97 },
  { date: "2026-06-24", time: "08:00 AM", heartRate: 73, bloodPressure: "120/81", bloodSugar: 105, temperature: 98.5, weight: 68.2, height: 175, bmi: 22.3, spo2: 98 },
  { date: "2026-06-25", time: "08:30 AM", heartRate: 70, bloodPressure: "119/78", bloodSugar: 95, temperature: 98.2, weight: 68.0, height: 175, bmi: 22.2, spo2: 99 },
  { date: "2026-06-26", time: "08:00 AM", heartRate: 72, bloodPressure: "120/80", bloodSugar: 99, temperature: 98.6, weight: 67.9, height: 175, bmi: 22.2, spo2: 98 }
];

const initialMedicines = [
  { id: "med-1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "08:00 AM", remainingTablets: 24, totalTablets: 30, status: "Taken" },
  { id: "med-2", name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "08:00 PM", remainingTablets: 48, totalTablets: 60, status: "Pending" },
  { id: "med-3", name: "Albuterol Inhaler", dosage: "2 puffs", frequency: "As needed", time: "12:00 PM", remainingTablets: 180, totalTablets: 200, status: "Taken" },
  { id: "med-4", name: "Multivitamin", dosage: "1 tablet", frequency: "Once daily", time: "09:00 AM", remainingTablets: 12, totalTablets: 30, status: "Taken" }
];

const initialSymptoms = [
  { id: "sym-1", date: "2026-06-22", time: "02:00 PM", name: "Mild Headache", severity: 3, notes: "Dehydration suspected, cleared after drinking water.", mood: "😐" },
  { id: "sym-2", date: "2026-06-24", time: "07:30 AM", name: "Asthma Wheezing", severity: 5, notes: "Triggered by early morning dust. Used inhaler.", mood: "😟" },
  { id: "sym-3", date: "2026-06-26", time: "11:00 AM", name: "Fatigue", severity: 2, notes: "Felt sluggish in the morning, better after lunch.", mood: "🥱" }
];

const initialVisits = [
  { id: "vis-1", doctorName: "Dr. Sarah Jenkins", hospital: "City General Hospital", visitDate: "2026-05-12", reason: "Annual Cardiovascular Checkup", prescription: "Lisinopril 10mg refills updated.", followUpDate: "2026-11-12" },
  { id: "vis-2", doctorName: "Dr. Alan Mercer", hospital: "Asthma & Allergy Clinic", visitDate: "2026-06-15", reason: "Seasonal Allergy Consultation", prescription: "Albuterol Inhaler and Cetirizine.", followUpDate: "2026-09-15" }
];

const initialPrescriptions = [
  { id: "pres-1", name: "lisinopril_prescription.pdf", date: "2026-05-12", size: "142 KB", type: "pdf", url: "#" },
  { id: "pres-2", name: "allergy_meds_receipt.jpg", date: "2026-06-15", size: "1.2 MB", type: "image", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60" }
];

const initialSettings = {
  darkMode: false,
  notifications: true,
  reminders: true,
  language: "English",
  privacy: "Standard"
};

export const HealthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("mt_auth") === "true";
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mt_user");
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [vitals, setVitals] = useState(() => {
    const saved = localStorage.getItem("mt_vitals");
    return saved ? JSON.parse(saved) : initialVitals;
  });

  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem("mt_medicines");
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [symptoms, setSymptoms] = useState(() => {
    const saved = localStorage.getItem("mt_symptoms");
    return saved ? JSON.parse(saved) : initialSymptoms;
  });

  const [visits, setVisits] = useState(() => {
    const saved = localStorage.getItem("mt_visits");
    return saved ? JSON.parse(saved) : initialVisits;
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem("mt_prescriptions");
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("mt_settings");
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("mt_auth", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("mt_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("mt_vitals", JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem("mt_medicines", JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem("mt_symptoms", JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem("mt_visits", JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem("mt_prescriptions", JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem("mt_settings", JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  // Auth Operations
  const loginUser = async (email, password) => {
    try {
      // Try backend first
      const response = await axios.post("http://localhost:8080/api/users/login", { email, password });
      const savedUser = response.data;
      const mappedUser = {
        name: savedUser.fullName,
        email: savedUser.email,
        age: savedUser.age,
        gender: savedUser.gender,
        bloodGroup: savedUser.bloodGroup,
        allergies: savedUser.allergies,
        conditions: savedUser.medicalCondition,
        emergencyContact: savedUser.emergencyContact
      };
      setUser(mappedUser);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      // If backend is unreachable (network error), use local auth fallback
      const isNetworkError = !err.response;
      if (isNetworkError) {
        // Check against the current stored user profile or the default demo account
        const storedUser = (() => {
          try { return JSON.parse(localStorage.getItem("mt_user")); } catch { return null; }
        })();
        const storedPassword = localStorage.getItem("mt_password");
        const demoEmail = "gokul@meditrack.com";
        const demoPassword = "password123";

        const emailMatch =
          (storedUser && storedUser.email === email) ||
          email === demoEmail;
        const passwordMatch =
          (storedPassword && storedPassword === password) ||
          password === demoPassword;

        if (emailMatch && passwordMatch) {
          setIsAuthenticated(true);
          return true;
        } else {
          throw new Error("Invalid email or password");
        }
      }
      // Re-throw backend validation errors (e.g. wrong credentials returned by server)
      throw err;
    }
  };

  const registerUser = async (profileData) => {
    const payload = {
      fullName: profileData.name,
      email: profileData.email,
      password: profileData.password,
      age: profileData.age,
      gender: profileData.gender,
      bloodGroup: profileData.bloodGroup,
      allergies: profileData.allergies,
      medicalCondition: profileData.conditions,
      emergencyContact: profileData.emergencyContact
    };
    try {
      const response = await axios.post("http://localhost:8080/api/users/register", payload);
      const savedUser = response.data;
      const mappedUser = {
        name: savedUser.fullName,
        email: savedUser.email,
        age: savedUser.age,
        gender: savedUser.gender,
        bloodGroup: savedUser.bloodGroup,
        allergies: savedUser.allergies,
        conditions: savedUser.medicalCondition,
        emergencyContact: savedUser.emergencyContact
      };
      setUser(mappedUser);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      // If backend is unreachable, register locally
      const isNetworkError = !err.response;
      if (isNetworkError) {
        const mappedUser = {
          name: profileData.name,
          email: profileData.email,
          age: profileData.age,
          gender: profileData.gender,
          bloodGroup: profileData.bloodGroup,
          allergies: profileData.allergies,
          conditions: profileData.conditions,
          emergencyContact: profileData.emergencyContact
        };
        // Persist password separately for local login fallback
        localStorage.setItem("mt_password", profileData.password);
        setUser(mappedUser);
        setIsAuthenticated(true);
        return true;
      }
      throw err;
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  // Vitals Operations
  const addVitalRecord = (record) => {
    setVitals((prev) => [record, ...prev]);
  };

  // Medicine Operations
  const addMedicine = (med) => {
    setMedicines((prev) => [...prev, { ...med, id: `med-${Date.now()}` }]);
  };

  const editMedicine = (updatedMed) => {
    setMedicines((prev) => prev.map((m) => (m.id === updatedMed.id ? updatedMed : m)));
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const markMedicineAsTaken = (id) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const taken = m.status === "Taken";
          return {
            ...m,
            status: taken ? "Pending" : "Taken",
            remainingTablets: taken ? Math.min(m.totalTablets, m.remainingTablets + 1) : Math.max(0, m.remainingTablets - 1)
          };
        }
        return m;
      })
    );
  };

  // Symptoms Operations
  const addSymptom = (symptom) => {
    setSymptoms((prev) => [{ ...symptom, id: `sym-${Date.now()}` }, ...prev]);
  };

  // Doctor Visits Operations
  const addDoctorVisit = (visit) => {
    setVisits((prev) => [{ ...visit, id: `vis-${Date.now()}` }, ...prev]);
  };

  // Prescriptions Operations
  const uploadPrescription = (pres) => {
    setPrescriptions((prev) => [{ ...pres, id: `pres-${Date.now()}` }, ...prev]);
  };

  const deletePrescription = (id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  // Settings Updates
  const updateSettings = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateProfile = (profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }));
  };

  return (
    <HealthContext.Provider
      value={{
        isAuthenticated,
        user,
        vitals,
        medicines,
        symptoms,
        visits,
        prescriptions,
        settings,
        loginUser,
        registerUser,
        logoutUser,
        addVitalRecord,
        addMedicine,
        editMedicine,
        deleteMedicine,
        markMedicineAsTaken,
        addSymptom,
        addDoctorVisit,
        uploadPrescription,
        deletePrescription,
        updateSettings,
        updateProfile
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
