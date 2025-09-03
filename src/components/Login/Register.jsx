import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PatientRegistrationForm from "../forms/PatientRegistrationForm";
import DoctorRegistrationForm from "../forms/DoctorRegistrationForm";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [toggle, setToggle] = useState("PATIENT");
    const navigate = useNavigate();
    const location = useLocation();

    // Show success message if coming from registration success
    useEffect(() => {
        if (location.state?.message) {
            // You can show a toast or notification here
            console.log(location.state.message);
        }
    }, [location.state]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Create Account
                </h2>

                {/* Role Toggle Buttons */}
                <div className="flex justify-center mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setToggle("PATIENT")}
                        className={`flex-1 px-4 py-2 rounded-md transition duration-200 font-medium text-sm ${toggle === "PATIENT"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-transparent text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        👤 Patient
                    </button>
                    <button
                        onClick={() => setToggle("DOCTOR")}
                        className={`flex-1 px-4 py-2 rounded-md transition duration-200 font-medium text-sm ${toggle === "DOCTOR"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-transparent text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        🩺 Doctor
                    </button>
                </div>

                {/* Role Description */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                        {toggle === "PATIENT"
                            ? "Register as a patient to book appointments and manage your health records."
                            : "Register as a doctor to manage appointments and connect with patients."
                        }
                    </p>
                </div>

                {/* Registration Form */}
                {toggle === "PATIENT" ? (
                    <PatientRegistrationForm onSuccess={() => navigate('/login', { state: { message: 'Registration successful! Please login.' } })} />
                ) : (
                    <DoctorRegistrationForm onSuccess={() => navigate('/login', { state: { message: 'Registration successful! Please login.' } })} />
                )}

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
                        </Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;