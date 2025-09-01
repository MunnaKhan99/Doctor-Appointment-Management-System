import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Login = () => {
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
    {
        // console.log(e.target);
    }

    // live validation
    if (name === "email") setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    if (name === "password") setPasswordValid(value.length >= 8);
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


      localStorage.setItem("token", res.data.token);
      setLoading(false);
      alert("Login successful!");
      window.location.href = "/dashboard"; 
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg  focus:ring-blue-400"
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg  focus:ring-blue-400"
          />


          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg  focus:ring-blue-400"
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>


          {error && <p className="text-red-500 text-sm">{error}</p>}


          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>


        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};


export default Login;


