"use client";
import { useState } from "react";
import AskLocation from "@/components/AskLocation";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";

export default function Request() {
    const router = useRouter();
    // const [position, setPosition] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        pin: "",
        latitude: "",
        longitude: "",
        emergencyType: [],
        peopleAffected: "",
        description: ""
    });
    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                emergencyType: checked
                    ? [...prev.emergencyType, value]
                    : prev.emergencyType.filter(item => item !== value)
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const req = await fetch("/api/citizen/request", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const res = await req.json();
            if (res.success) {
                alert("Request submitted successfully!");
                router.push("/citizen");
            }
            else {
                alert("Failed to submit request: " + res.message);
            }
        }
        catch(error){
            console.error("Error submitting request:", error);
        }
    }
    function handleLogout() {
        fetch("/api/auth/logout", {
            method: "GET"
        }).then((res) => {
            if (res.ok) {
                alert("Logout successful");
                router.push("/auth/login");
            }
            else {
                alert("Logout failed");
            }
        });
    }
    return (
        
<>
    <Header>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition" onClick={() => handleLogout()}> Log Out </button>
    </Header>

    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 flex flex-row gap-4">
        <SlideBar array={[
            { url: "/citizen", text: "Dashboard", state: {} },
            { url: "/citizen/request", text: "Create Request", state: {} },
            { url: "/citizen/myRequests", text: "My Requests", state: {} },
        ]} />
        <div className="flex-1 min-w-0">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Request for Help
                </h1>
                <p className="text-slate-500 mt-2">
                    Submit your emergency details so our rescue team can assist you.
                </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                <h2 className="font-semibold text-blue-800">
                    Emergency Assistance
                </h2>
                <p className="text-sm text-blue-700 mt-1">
                    Please provide accurate information about your location
                    and emergency situation to help us respond quickly.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 sm:p-8">

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>

                            <div>
                                <label htmlFor="pin" className="block text-sm font-semibold text-slate-700 mb-2">
                                    PIN Code
                                </label>
                                <input
                                    type="text"
                                    id="pin"
                                    name="pin"
                                    onChange={handleChange}
                                    placeholder="Enter your PIN code"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                />
                            </div>

                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                            Your Location
                        </h2>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-600 mb-3">
                                Share your current location so rescuers can find you.
                            </p>

                            <AskLocation callBack={(coordinates) => {
                                if (coordinates) {
                                    setFormData(prev => ({
                                        ...prev,
                                        latitude: coordinates.latitude,
                                        longitude: coordinates.longitude,
                                    }));
                                }
                            }} />

                            <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mt-4 mb-2">Latitude, Longitude</label>
                            <input type="text" id="location" name="location" value={formData.latitude + "   " + formData.longitude} readOnly className="w-full border border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-600" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">Emergency Type *</h2>
                        <p className="text-sm text-slate-500 mb-4">Select all the types of assistance you require.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                "Flood Rescue",
                                "Emergency Evacuation",
                                "Medical Emergency",
                                "Food",
                                "Shelter Assistance",
                                "Drinking Water Assistance",
                                "Missing Person",
                                "Boat Rescue",
                                "Baby & Child Assistance",
                                "Sanitation & Hygiene Assistance",
                                "Clothing & Blanket Assistance",
                                "Oxygen Assistance",
                                "Electricity & Lighting Assistance",
                                "Fuel Assistance",
                                "Snake Or Poison",
                                "Other"
                            ].map((type) => (
                                <label
                                    key={type}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition">
                                    <input type="checkbox" name="emergencyType" value={type} onChange={handleChange} className="w-4 h-4 accent-blue-600 cursor-pointer"/>
                                    <span className="text-sm text-slate-700 font-medium">
                                        {type === "Food" ? "Food Assistance" : type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Additional Details</h2>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="peopleAffected" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Number of People Affected * </label>
                                <input type="number" id="peopleAffected" name="peopleAffected" min="1" required onChange={handleChange} placeholder="Enter number of affected people" className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Describe Your Emergency *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows="4"
                                    onChange={handleChange}
                                    placeholder="Explain your current situation and the help you need..."
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-900"
                                />
                            </div>
                        </div>
                    </section>
                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-between">
                        <button type="button" onClick={() => router.push("/citizen")} className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition">Back to Dashboard</button>
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition"
                        >
                            Submit Rescue Request
                        </button>

                    </div>

                </form>
            </div>

            <p className="text-center text-sm text-slate-500 mt-5">
                Flood Rescue System | Emergency Response and Assistance
            </p>

        </div>
    </main>
</>

    )
}