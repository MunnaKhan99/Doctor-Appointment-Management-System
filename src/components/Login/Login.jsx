//3. Updated Login Component - components/Login/Login.jsx
import { Link } from "react-router-dom";
import LoginForm from "../forms/LoginForm";
import Navbar from "../layout/Navbar";

const Login = () => {
  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <LoginForm />

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