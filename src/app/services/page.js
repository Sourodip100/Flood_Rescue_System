
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";

const services = [
    {
        icon: "fa-solid fa-life-ring",
        title: "Emergency Rescue Requests",
        description: "Citizens can submit emergency requests with their location, number of affected people and details about their situation.",
    },
    {
        icon: "fa-solid fa-ship",
        title: "Flood Evacuation",
        description: "Support rescue teams in coordinating boat-based evacuations and assisting people stranded in flood-affected areas.",
    },
    {
        icon: "fa-solid fa-location-crosshairs",
        title: "GPS-Based Team Tracking",
        description: "Track registered rescue team locations to help administrators coordinate emergency deployments.",
    },
    {
        icon: "fa-solid fa-truck-medical",
        title: "Medical Assistance",
        description: "Coordinate medical kits, ambulance resources and medical assistance for people affected by flooding.",
    },
    {
        icon: "fa-solid fa-box-open",
        title: "Emergency Relief Supplies",
        description: "Coordinate essential supplies such as drinking water, food, blankets, life jackets and other relief materials.",
    },
    {
        icon: "fa-solid fa-sitemap",
        title: "Rescue Team Management",
        description: "Manage rescue teams, their availability, capacity, assigned requests and deployment information.",
    },
];

export default function Services() {
    return (
        <PublicLayout>
            <section className="bg-slate-900 text-white py-20 px-6 text-center">
                <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm">
                    Our Services
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-4">
                    Help When It Matters Most
                </h1>
                <p className="max-w-2xl mx-auto text-gray-300 mt-5 leading-7">
                    Discover how the Flood Rescue System supports
                    emergency coordination, rescue operations and
                    flood-relief management.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-8 border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-cyan-100 text-cyan-700 rounded-xl flex items-center justify-center">
                                <i className={`${service.icon} text-3xl`}></i>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mt-6">
                                {service.title}
                            </h2>

                            <p className="text-gray-600 mt-3 leading-7">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-cyan-600 text-white text-center py-16 px-6">
                <h2 className="text-3xl font-bold">
                    Need Emergency Assistance?
                </h2>
                <p className="mt-3">
                    Register on the platform to submit a rescue request.
                </p>
                <Link
                    href="/auth/register"
                    className="inline-block mt-7 bg-white text-cyan-700 px-7 py-3 rounded-lg font-bold hover:bg-gray-100"
                >
                    Register Now
                </Link>
            </section>
        </PublicLayout>
    );
}
