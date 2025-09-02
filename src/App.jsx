import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// import PatientDashboard from "./pages/patient/Dashboard";
// import PatientAppointments from "./pages/patient/Appointments";
// import DoctorDashboard from "./pages/doctor/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/patient/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["PATIENT"]}>
        {/* <PatientDashboard /> */}
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient/appointments",
    element: (
      <ProtectedRoute allowedRoles={["PATIENT"]}>
        {/* <PatientAppointments /> */}
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctor/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["DOCTOR"]}>
        {/* <DoctorDashboard /> */}
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  const { initializeAuth } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, []);
  
  return <RouterProvider router={router} />;
};

export default App;