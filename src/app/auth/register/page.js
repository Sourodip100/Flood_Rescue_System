"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";
import flood2 from "../../../../public/flood2.jpeg";

// Zod validation schema
const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, "Name must contain at least 3 characters.")
            .max(50, "Name cannot exceed 50 characters."),

        email: z
            .string()
            .trim()
            .email("Please enter a valid email address."),

        phone: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => !value || /^\+?[0-9\s-]{10,15}$/.test(value),
                "Please enter a valid phone number."
            ),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters.")
            .regex(/[A-Z]/, "Password must contain an uppercase letter.")
            .regex(/[a-z]/, "Password must contain a lowercase letter.")
            .regex(/[0-9]/, "Password must contain a number."),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export default function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        // Clear the error for the field being edited
        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    }

    function validateForm() {
        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0];

                if (field && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });

            setErrors(fieldErrors);
            return false;
        }

        setErrors({});
        return true;
    }

    async function formAction(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const request = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                    role: "Citizen",
                }),
            });

            const response = await request.json();

            if (!request.ok || response.error) {
                alert("Registration failed: " + (response.error || response.message || "Please try again."));
                return;
            }

            alert("Registration successful! You can now log in.");

            router.push("/auth/login");
        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600";

    const labelClass = "block text-lg font-semibold text-gray-800 mb-1";

    const errorClass = "text-red-700 text-sm mt-1";

    return (
        <>
            <Header />

            <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row gap-5 p-4 bg-slate-100">

                <SlideBar />

                {/* Left side image */}
                <div className="hidden md:block md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
                    <img
                        src={flood2.src}
                        alt="Flood rescue operation"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <h1 className="text-white text-4xl font-bold mb-4">
                            Together, We Can Save Lives.
                        </h1>

                        <p className="text-white text-lg">
                            Join the Flood Rescue System. Register today and
                            connect with emergency assistance when you need it.
                        </p>
                    </div>
                </div>

                {/* Registration form */}
                <div className="w-full md:w-1/2 flex justify-center items-center">

                    <form
                        onSubmit={formAction}
                        noValidate
                        className="w-full max-w-xl flex flex-col gap-4 bg-blue-100 p-6 md:p-10 border border-blue-200 rounded-xl shadow-lg"
                    >
                        <div className="text-center mb-2">
                            <h1 className="text-3xl font-bold text-blue-950">
                                Citizen Registration
                            </h1>

                            <p className="text-gray-600 mt-2">
                                Create your account to access rescue assistance.
                            </p>
                        </div>

                        {/* Account type */}
                        <div className="bg-blue-200 border border-blue-300 rounded-lg p-3 text-center">
                            <p className="font-semibold text-blue-950">
                                Account Type: Citizen
                            </p>
                            <p className="text-sm text-gray-700">
                                Rescuer and Operator accounts are created by an Operator.
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className={labelClass}>
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={validateForm}
                                placeholder="Enter your full name"
                                className={inputClass}
                                autoComplete="name"
                                required
                            />

                            {errors.name && (
                                <p className={errorClass}>{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClass}>
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={validateForm}
                                placeholder="Enter your email"
                                className={inputClass}
                                autoComplete="email"
                                required
                            />

                            {errors.email && (
                                <p className={errorClass}>{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className={labelClass}>
                                Phone Number (Optional)
                            </label>

                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={validateForm}
                                placeholder="Enter your phone number"
                                className={inputClass}
                                autoComplete="tel"
                            />

                            {errors.phone && (
                                <p className={errorClass}>{errors.phone}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className={labelClass}>
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={validateForm}
                                    placeholder="Create a password"
                                    className={`${inputClass} pr-20`}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-blue-700 font-semibold text-sm"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {errors.password && (
                                <p className={errorClass}>{errors.password}</p>
                            )}

                            <p className="text-xs text-gray-600 mt-1">
                                Minimum 8 characters, including uppercase,
                                lowercase and a number.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className={labelClass}>
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={validateForm}
                                    placeholder="Re-enter your password"
                                    className={`${inputClass} pr-20`}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-blue-700 font-semibold text-sm"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <p className={errorClass}>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </button>

                        <p className="text-center text-gray-700">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/auth/login")}
                                className="text-blue-800 font-bold hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}