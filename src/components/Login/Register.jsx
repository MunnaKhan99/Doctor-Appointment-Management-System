import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import RegisterForm from "./RegisterForm"; // Assuming RegisterForm is the shared component

const Register = () => {
  const [toggle, setToggle] = useState("PATIENT");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();

  // Handle success message from navigation
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
        {/* Curved SVG Shape (Right side curve, hidden on mobile) */}
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

        {/* Image inside rounded format */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 mb-6 transform hover:scale-105 transition duration-500">
          <img
            src="/doctor-login.jpg"
            alt="Doctor Appointment"
            className="w-52 md:w-64 rounded-2xl"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-center drop-shadow-lg">
          CREATE YOUR ACCOUNT
        </h1>
        <p className="mt-4 text-sm md:text-base opacity-90 text-center max-w-md">
          Register now to book, manage, and track appointments securely.
        </p>
      </div>

      {/* Right Side - Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-white p-6 sm:p-10">
        <div
          className="bg-slate-50 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-md"
          role="form"
          aria-label="Registration form"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            Create Account
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm mb-4">
              ✅ {successMessage}
            </div>
          )}

          {/* Role Toggle Buttons */}
          <div className="flex justify-center mb-4 sm:mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setToggle("PATIENT")}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-md transition duration-200 font-medium text-xs sm:text-sm ${
                toggle === "PATIENT"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
              aria-selected={toggle === "PATIENT"}
              aria-label="Register as Patient"
            >
              👤 Patient
            </button>
            <button
              onClick={() => setToggle("DOCTOR")}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-md transition duration-200 font-medium text-xs sm:text-sm ${
                toggle === "DOCTOR"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
              aria-selected={toggle === "DOCTOR"}
              aria-label="Register as Doctor"
            >
              🩺 Doctor
            </button>
          </div>

          {/* Registration Form */}
          <RegisterForm role={toggle} />

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By registering, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;