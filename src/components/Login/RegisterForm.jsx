import React, { useState, useEffect } from "react";
import axios from "axios";

const RegisterForm = ({ role }) => {
    const baseUrl = "https://appointment-manager-node.onrender.com/api/v1";
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        photo_url: "",
    });
    const [specializations, setSpecializations] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        specialChar: false,
        upperLowerCase: false,
        numeric: false,
    });
    const [emailValid, setEmailValid] = useState(false);


    useEffect(() => {
        if (role === "DOCTOR") { axios.get(`${baseUrl}/specializations`)
                .then((res) => { if (Array.isArray(res.data)) setSpecializations(res.data);
                    else if (Array.isArray(res.data.data)) setSpecializations(res.data.data);
                    else setSpecializations([]);
                }).catch(() => setSpecializations([]));
        }
    }, [role]);


    const handleChange = (e) => {
        const { name, value } = e.target;


        // live password validation
        if (name === "password") {
            setPasswordValidation({
                length: value.length >= 8, specialChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


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
            const payload = {name: form.name,email: form.email,password: form.password, };


            if (role === "DOCTOR") payload.specialization = form.specialization;
            if (form.photo_url) payload.photo_url = form.photo_url;


            const url =
                role === "PATIENT"
                    ? `${baseUrl}/auth/register/patient`
                    : `${baseUrl}/auth/register/doctor`;


            const res = await axios.post(url, payload);


            setLoading(false);
            alert(res.data.message || "Registration successful!");
            window.location.href = "/login";
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Registration failed");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text" name="photo_url" placeholder="Photo URL (optional)" value={form.photo_url} onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />


            {
                role === "DOCTOR" && Array.isArray(specializations) && (
                    <select
                        name="specialization" value={form.specialization} onChange={handleChange} required

                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select specialization</option>
                        {specializations.map((s, idx) => (
                            <option key={idx} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                )

            }
            {error && <p className="text-red-500 text-sm">{error}</p>}


            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loading}
            >
                {loading ? "Registering..." : `Register as ${role}`}
            </button>


            {/* Simple Real Time Form Validation */}
            <div className="password-validity mt-2 text-sm">
                <p style={{ color: passwordValidation.length ? "green" : "red" }}>
                    At least 8 characters
                </p>
                <p style={{ color: passwordValidation.upperLowerCase ? "green" : "red" }}>
                    Uppercase & lowercase letters
                </p>
                <p style={{ color: passwordValidation.numeric ? "green" : "red" }}>
                    At least one number
                </p>
                <p style={{ color: passwordValidation.specialChar ? "green" : "red" }}>
                    At least one special character
                </p>
                <p style={{ color: emailValid ? "green" : "red" }}>Valid email</p>
            </div>
        </form>
    );
};


export default RegisterForm;
