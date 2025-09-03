import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ role }) => {
    const baseUrl = "https://appointment-manager-node.onrender.com/api/v1";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        photo_url: "",
    });
    const [specializations, setSpecializations] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        photo_url: "",
    });
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

    const validateName = (value) => {
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
        return "";
    };

    const validateEmail = (value) => {
        if (!value) return "Email is required";
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailValid(isValid);
        return isValid ? "" : "Please enter a valid email address";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        const validation = {
            length: value.length >= 8,
            specialChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
            upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
            numeric: /^(?=.*\d)/.test(value),
        };
        setPasswordValidation(validation);
        if (!validation.length) return "Password must be at least 8 characters";
        if (!validation.upperLowerCase) return "Password must contain uppercase and lowercase letters";
        if (!validation.numeric) return "Password must contain at least one number";
        if (!validation.specialChar) return "Password must contain at least one special character";
        return "";
    };

    const validateSpecialization = (value) => {
        if (role === "DOCTOR" && !value) return "Please select a specialization";
        return "";
    };

    const validatePhotoUrl = (value) => {
        if (!value) return "";
        try {
            new URL(value);
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(value) ? "" : "Please enter a valid image URL (jpg, jpeg, png, gif)";
        } catch {
            return "Please enter a valid URL";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear global error/success messages
        if (error) setError("");
        if (success) setSuccess("");

        // Update form state
        setForm({ ...form, [name]: value });

        // Real-time validation
        let errorMessage = "";
        if (name === "name") errorMessage = validateName(value);
        if (name === "email") errorMessage = validateEmail(value);
        if (name === "password") errorMessage = validatePassword(value);
        if (name === "specialization") errorMessage = validateSpecialization(value);
        if (name === "photo_url") errorMessage = validatePhotoUrl(value);

        setFormErrors({ ...formErrors, [name]: errorMessage });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate all fields before submission
        const nameError = validateName(form.name);
        const emailError = validateEmail(form.email);
        const passwordError = validatePassword(form.password);
        const specializationError = validateSpecialization(form.specialization);
        const photoUrlError = validatePhotoUrl(form.photo_url);

        setFormErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            specialization: specializationError,
            photo_url: photoUrlError,
        });

        if (nameError || emailError || passwordError || specializationError || photoUrlError) {
            setError("Please fix the errors in the form");
            return;
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
            setFormErrors({
                name: "",
                email: "",
                password: "",
                specialization: "",
                photo_url: "",
            });

            // Navigate after a short delay
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
            console.error("Registration error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
                {formErrors.name && (
                    <div className="text-red-700 text-sm mt-1">❌ {formErrors.name}</div>
                )}
            </div>
            <div>
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
                {formErrors.email && (
                    <div className="text-red-700 text-sm mt-1">❌ {formErrors.email}</div>
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
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                />
                {formErrors.password && (
                    <div className="text-red-700 text-sm mt-1">❌ {formErrors.password}</div>
                )}
            </div>
            <div>
                <input
                    type="text"
                    name="photo_url"
                    placeholder="Photo URL (optional)"
                    value={form.photo_url}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                />
                {formErrors.photo_url && (
                    <div className="text-red-700 text-sm mt-1">❌ {formErrors.photo_url}</div>
                )}
            </div>

            {role === "DOCTOR" && Array.isArray(specializations) && (
                <div>
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
                    {formErrors.specialization && (
                        <div className="text-red-700 text-sm mt-1">❌ {formErrors.specialization}</div>
                    )}
                </div>
            )}

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

           
        </form>
    );
};

export default RegisterForm;