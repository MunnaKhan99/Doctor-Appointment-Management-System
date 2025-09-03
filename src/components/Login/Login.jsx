//3. Updated Login Component - components/Login/Login.jsx
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "PATIENT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Live validation
    if (name === "email") 
      setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    if (name === "password") 
      setPasswordValid(value.length >= 8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailValid) return setError("Invalid email format");
    if (!passwordValid) return setError("Password must contain at least 8 characters");

    setLoading(true);
    try {
      const res = await axios.post(
        "https://appointment-manager-node.onrender.com/api/v1/auth/login",
        form
      );

      // Use Zustand store instead of direct localStorage
      login({
        token: res.data.token,
        user: res.data.user, // Assuming API returns user data
        role: form.role
      });

      setLoading(false);
      
      // Navigate based on role
      if (form.role === "PATIENT") {
        navigate("/patient/dashboard");
      } else {
        navigate("/doctor/dashboard");
      }
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                emailValid ? 'border-green-300 focus:ring-green-400' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {form.email && !emailValid && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                passwordValid ? 'border-green-300 focus:ring-green-400' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {form.password && !passwordValid && (
              <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
            )}
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="PATIENT">Login as Patient</option>
            <option value="DOCTOR">Login as Doctor</option>
          </select>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !emailValid || !passwordValid}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;