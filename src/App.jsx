// 3. Update App.jsx to include React Query Provider
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from "./store/authStore";

import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
// import DoctorDashboard from "./pages/doctor/Dashboard";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

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
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patient/appointments",
    element: (
      <ProtectedRoute allowedRoles={["PATIENT"]}>
        <PatientAppointments />
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;