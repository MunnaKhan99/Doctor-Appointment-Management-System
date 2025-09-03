import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginForm from "../forms/LoginForm";

const Login = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();

  // Handle success message from navigation (e.g., from Register)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Left Side - Image & Title */}
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white p-8 relative overflow-hidden">
        {/* Curved SVG Shape */}
        <svg
          className="absolute hidden md:block right-0 top-0 h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: "80px" }}
        >
          <path
            d="M0,0 C50,50 50,50 100,100 L100,0 Z"
            fill="white"
            opacity="1"
          ></path>
        </svg>

        {/* Image inside rounded unique format */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 mb-6 transform hover:scale-105 transition duration-500">
          <img
            src="/doctor-login.jpg"
            alt="Doctor Appointment"
            className="w-52 md:w-64 rounded-2xl"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-center drop-shadow-lg">
          DOCTOR-APPOINTMENT <br /> MANAGEMENT SYSTEM
        </h1>
        <p className="mt-4 text-sm md:text-base opacity-90 text-center max-w-md">
          Book your doctor’s appointment with ease. Fast, reliable, and secure.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-white p-6 sm:p-10">
        <div
          className="bg-slate-50 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md"
          role="form"
          aria-label="Login form"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            Login
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm mb-4">
              ✅ {successMessage}
            </div>
          )}

          <LoginForm />

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;