import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AUTH_ROLES, getPostLoginRedirect } from "../../lib/auth";
import api from "../../lib/api";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
  role: z
    .nativeEnum(AUTH_ROLES, {
      errorMap: () => ({ message: "Role is required" }),
    })
    .refine((val) => !!val, { message: "Role is required" }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: AUTH_ROLES.PATIENT },
  });

  // Real-time validation feedback
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const roleValue = watch("role");

  const onSubmit = async (values) => {
    setFormError("");
    setSuccessMessage("");

    try {
      const payload = {
        email: values.email.trim(),
        password: values.password,
        role: String(values.role || "").toUpperCase(),
      };
      const res = await api.post("/auth/login", payload);
      const token = res?.data?.token || res?.data?.data?.token;
      const user = res?.data?.user || res?.data?.data?.user;

      if (!token) {
        setFormError("Login succeeded but no token returned");
        return;
      }

      login({ token, user, role: values.role });
      setSuccessMessage("Logged in successfully! Redirecting...");
      
      // Navigate after 2 seconds to show success message
      setTimeout(() => {
        navigate(getPostLoginRedirect(values.role), { replace: true });
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setFormError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
            errors.email || !emailValue ? "border-red-400" : "border-gray-300"
          }`}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isSubmitting}
        />
        {(errors.email || !emailValue) && (
          <div
            id="email-error"
            className="text-red-700 text-sm mt-1"
          >
            ❌ {errors.email?.message || "Email is required"}
          </div>
        )}
      </div>

      {/* Password Field */}
      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
            errors.password || !passwordValue ? "border-red-400" : "border-gray-300"
          }`}
          aria-describedby={errors.password ? "password-error" : undefined}
          disabled={isSubmitting}
        />
        {(errors.password || !passwordValue) && (
          <div
            id="password-error"
            className="text-red-700 text-sm mt-1"
          >
            ❌ {errors.password?.message || "Password is required"}
          </div>
        )}
      </div>

      {/* Role Select */}
      <div>
        <Select
          label="Login as"
          {...register("role")}
          options={[
            { value: AUTH_ROLES.PATIENT, label: "Patient" },
            { value: AUTH_ROLES.DOCTOR, label: "Doctor" },
          ]}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          error={errors.role?.message || (!roleValue ? "Role is required" : "")}
          disabled={isSubmitting}
        />
      </div>

      {/* Form Error/Success Messages */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          ❌ {formError}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
          ✅ {successMessage}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              {/* <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle> */}
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;