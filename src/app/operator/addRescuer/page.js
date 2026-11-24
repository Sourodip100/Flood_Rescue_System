
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

const resourceOptions = [
    "BOAT",
    "AMBULANCE",
    "RESCUE_KIT",
    "FOOD_SUPPLY",
    "MEDICAL_KIT",
    "WATER_SUPPLY",
    "LIFE_JACKET",
    "BLANKET",
    "CLOTHING",
    "RESCUE_ROPE",
    "OXYGEN_CYLINDER",
    "BABY_SUPPLIES",
    "SANITARY_KIT",
    "FLASHLIGHT",
    "BATTERY",
    "FUEL",
];

export default function RegisterRescuer() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        membersCount: "",
        boatCapacity: "",
        resources: [],
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleResourceChange = (resource) => {
        setForm((prev) => ({
            ...prev,
            resources: prev.resources.includes(resource)
                ? prev.resources.filter((item) => item !== resource)
                : [...prev.resources, resource],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/operator/addRescuer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    membersCount: Number(form.membersCount),
                    boatCapacity: Number(form.boatCapacity || 0),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setMessage("Rescue team registered successfully!");

            setForm({
                name: "",
                email: "",
                password: "",
                contactNumber: "",
                membersCount: "",
                boatCapacity: "",
                resources: [],
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
                            Register New Rescuer
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Register a rescue team and configure its initial capacity and authorized resources.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white max-w-4xl mx-auto p-6 md:p-8 rounded-xl shadow-sm border space-y-6"
                    >

                        {/* Team Information */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Team Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter rescue team name"
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="team@example.com"
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter contact number"
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                                    />
                                </div>
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
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                                />
                            </div>
                        </section>

                        <hr />

                        {/* Team Capacity */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Team Capacity
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Number of Members
                                    </label>
                                    <input
                                        type="number"
                                        name="membersCount"
                                        value={form.membersCount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="e.g. 8"
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Boat Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="boatCapacity"
                                        value={form.boatCapacity}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="Number of people"
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                                    />
                                </div>
                            </div>
                        </section>

                        <hr />

                        {/* Resources */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Authorized Resources
                            </h2>

                            <p className="text-sm text-gray-500">
                                Select the resources this team is authorized to use.
                                Initial quantities will be set to zero. The team can
                                update its stock from the rescuer dashboard.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {resourceOptions.map((resource) => (
                                    <label
                                        key={resource}
                                        className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-blue-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.resources.includes(resource)}
                                            onChange={() => handleResourceChange(resource)}
                                            className="accent-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {resource.replaceAll("_", " ")}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

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
                            {loading ? "Registering..." : "Register Rescuer"}
                        </button>

                    </form>
                </main>
            </div>
        </>
    );
}
