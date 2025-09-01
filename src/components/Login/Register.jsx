import { useState } from "react";
import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";


const Register = () => {
    const [toggle, setToggle] = useState("PATIENT");


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                <div className="flex justify-center mb-6 space-x-4">
                    <button onClick={() => setToggle("PATIENT")}
                        className={`px-4 py-2 rounded-lg cursor-pointer ${toggle === "PATIENT" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}>

                        Patient
                    </button>
                    <button onClick={() => setToggle("DOCTOR")}
                        className={`px-4 py-2 rounded-lg cursor-pointer ${toggle === "DOCTOR" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>

                        Doctor
                    </button>
                </div>
                {/* call Registration Form */}
                <RegisterForm role={toggle} />



                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};


export default Register;