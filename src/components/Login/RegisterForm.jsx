import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import

const RegisterForm = ({ role }) => {
    const baseUrl = "https://appointment-manager-node.onrender.com/api/v1";
    const navigate = useNavigate(); // Initialize navigate hook

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        photo_url: "",
    });
    const [specializations, setSpecializations] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Add success state
    const [loading, setLoading] = useState(false);

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        specialChar: false,
        upperLowerCase: false,
        numeric: false,
    });
    const [emailValid, setEmailValid] = useState(false);

    useEffect(() => {
        if (role === "DOCTOR") {
            axios.get(`${baseUrl}/specializations`)
                .then((res) => {
                    if (Array.isArray(res.data)) setSpecializations(res.data);
                    else if (Array.isArray(res.data.data)) setSpecializations(res.data.data);
                    else setSpecializations([]);
                }).catch(() => setSpecializations([]));
        }
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear messages when user starts typing
        if (error) setError("");
        if (success) setSuccess("");

        // live password validation
        if (name === "password") {
            setPasswordValidation({
                length: value.length >= 8,
                specialChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
                upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
                numeric: /^(?=.*\d)/.test(value),
            });
        }

        // live email validation
        if (name === "email") {
            setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        }

        setForm({ ...form, [name]: value });
    };

    // Enhanced success handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!emailValid) return setError("Invalid email");
        if (
            !passwordValidation.length ||
            !passwordValidation.numeric ||
            !passwordValidation.upperLowerCase ||
            !passwordValidation.specialChar
        )
            return setError("Password does not meet requirements");

        if (role === "DOCTOR" && !form.specialization) {
            return setError("Please select specialization");
        }

        setLoading(true);

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
            };

            if (role === "DOCTOR") payload.specialization = form.specialization;
            if (form.photo_url) payload.photo_url = form.photo_url;

            const url =
                role === "PATIENT"
                    ? `${baseUrl}/auth/register/patient`
                    : `${baseUrl}/auth/register/doctor`;

            const res = await axios.post(url, payload);

            setLoading(false);

            // Better success feedback
            const successMessage = res.data.message || "Registration successful! Redirecting to login...";
            setSuccess(successMessage);

            // Clear form on success
            setForm({
                name: "",
                email: "",
                password: "",
                specialization: "",
                photo_url: "",
            });

            // Reset validation states
            setPasswordValidation({
                length: false,
                specialChar: false,
                upperLowerCase: false,
                numeric: false,
            });
            setEmailValid(false);

            // Navigate after a short delay to show success message
            setTimeout(() => {
                navigate("/login", {
                    state: {
                        message: "Registration successful! Please login with your credentials."
                    }
                });
            }, 2000);

        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);

            // Optional: Log error for debugging
            console.error("Registration error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={loading}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={loading}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={loading}
            />
            <input
                type="text"
                name="photo_url"
                placeholder="Photo URL (optional)"
                value={form.photo_url}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={loading}
            />

            {role === "DOCTOR" && Array.isArray(specializations) && (
                <select
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                >
                    <option value="">Select specialization</option>
                    {specializations.map((s, idx) => (
                        <option key={idx} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            )}

            {/* Enhanced error and success messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm mt-2">
                    ❌ {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm mt-2">
                    ✅ {success}
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                    </span>
                ) : (
                    `Register as ${role}`
                )}
            </button>

            {/* Enhanced Real Time Form Validation */}
            <div className="password-validity mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${passwordValidation.length ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={passwordValidation.length ? "text-green-700" : "text-red-700"}>
                            At least 8 characters
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${passwordValidation.upperLowerCase ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={passwordValidation.upperLowerCase ? "text-green-700" : "text-red-700"}>
                            Uppercase & lowercase letters
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${passwordValidation.numeric ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={passwordValidation.numeric ? "text-green-700" : "text-red-700"}>
                            At least one number
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${passwordValidation.specialChar ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={passwordValidation.specialChar ? "text-green-700" : "text-red-700"}>
                            At least one special character
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${emailValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={emailValid ? "text-green-700" : "text-red-700"}>
                            Valid email address
                        </span>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RegisterForm;