
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Slidebar from "@/components/Slidebar";

const sidebarItems = [
    { url: "/operator", text: "Dashboard", state: {} },
    { url: "/operator/register-operator", text: "Register Operator", state: {} },
    { url: "/operator/register-rescuer", text: "Register Rescuer", state: {} },
    { url: "/operator/register-citizen", text: "Register Citizen", state: {} },
];

export default function RegisterCitizen() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/operator/addCitizen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setMessage("Citizen registered successfully!");

            setForm({
                name: "",
                email: "",
                password: "",
                phone: "",
            });

        } catch (error) {
            setMessage(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                    onClick={() => router.push("/auth/login")}
                >
                    Log Out
                </button>
            </Header>

            <div className="p-2 flex flex-row">
                <Slidebar array={sidebarItems} />

                <main className="min-h-screen flex-1 min-w-0 bg-gray-50 p-4 md:p-8">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Register New Citizen
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Create a new citizen account in the Flood Rescue System.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white max-w-3xl mx-auto p-6 md:p-8 rounded-xl shadow-sm border space-y-5"
                    >

                        <h2 className="text-xl font-semibold text-gray-800">
                            Citizen Information
                        </h2>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter citizen name"
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="citizen@example.com"
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder="Minimum 8 characters"
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                            />
                        </div>

                        {message && (
                            <p className={`text-sm font-medium ${
                                message.includes("successfully")
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}>
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                        >
                            {loading ? "Registering..." : "Register Citizen"}
                        </button>

                    </form>
                </main>
            </div>
        </>
    );
}
