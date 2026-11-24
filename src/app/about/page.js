
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";

export default function About() {
    return (
        <PublicLayout>
            <section className="bg-slate-900 text-white text-center py-20 px-6">
                <p className="text-cyan-400 uppercase font-bold tracking-widest text-sm">
                    About FRS
                </p>

                <h1 className="text-4xl md:text-5xl font-extrabold mt-4">
                    Technology With a Purpose
                </h1>

                <p className="max-w-2xl mx-auto text-gray-300 mt-5 leading-7">
                    Building a connected system to support people,
                    rescue teams and emergency response coordination
                    during flood disasters.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-cyan-600 font-bold uppercase text-sm tracking-widest">
                        Who We Are
                    </span>

                    <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                        About Flood Rescue System
                    </h2>

                    <p className="text-gray-600 mt-5 leading-8">
                        Flood Rescue System (FRS) is a technology-based
                        emergency management platform designed to improve
                        coordination during flood situations.
                    </p>

                    <p className="text-gray-600 mt-4 leading-8">
                        The platform provides a common system where
                        citizens can submit rescue requests, rescue teams
                        can manage their assignments and administrators
                        can monitor rescue operations and resources.
                    </p>

                    <p className="text-gray-600 mt-4 leading-8">
                        Our aim is to make emergency information easier
                        to manage and help rescue resources reach people
                        who need assistance.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-600 to-blue-900 rounded-2xl p-10 text-white">
                    <i className="fa-solid fa-hand-holding-heart text-6xl"></i>
                    <h2 className="text-3xl font-bold mt-6">
                        Every Life Is Precious
                    </h2>
                    <p className="mt-4 leading-8 text-blue-100">
                        Behind every rescue request is a person,
                        a family and a hope for safety. We believe
                        technology can help bring people and rescue
                        resources closer together.
                    </p>
                </div>
            </section>

            <section className="bg-blue-50 py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <i className="fa-solid fa-bullseye text-4xl text-cyan-600"></i>
                        <h2 className="text-2xl font-bold mt-5 text-slate-900">
                            Our Mission
                        </h2>
                        <p className="text-gray-600 mt-3 leading-7">
                            To support timely flood emergency response
                            through organized rescue requests, location
                            tracking, team coordination and relief
                            resource management.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <i className="fa-solid fa-eye text-4xl text-cyan-600"></i>
                        <h2 className="text-2xl font-bold mt-5 text-slate-900">
                            Our Vision
                        </h2>
                        <p className="text-gray-600 mt-3 leading-7">
                            To contribute towards safer and more
                            disaster-resilient communities through
                            accessible technology and coordinated
                            emergency response.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-extrabold text-center text-slate-900">
                    How FRS Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                    {[
                        ["01", "Citizen Registration", "Citizens register and submit their emergency information."],
                        ["02", "Request Coordination", "The system organizes incoming rescue requests."],
                        ["03", "Team Assignment", "Suitable rescue teams are assigned to operations."],
                        ["04", "Rescue Operations", "Teams manage their assignments and update rescue progress."],
                    ].map(([number, title, description]) => (
                        <div key={number} className="text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-cyan-600 text-white text-xl font-bold flex items-center justify-center mx-auto">
                                {number}
                            </div>
                            <h3 className="font-bold text-lg mt-5 text-slate-900">
                                {title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-3 leading-6">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-900 text-white text-center py-16 px-6">
                <h2 className="text-3xl font-bold">
                    Together, We Can Make a Difference
                </h2>
                <p className="text-gray-300 mt-4">
                    Be part of a connected emergency response network.
                </p>
                <Link
                    href="/auth/register"
                    className="inline-block bg-cyan-500 hover:bg-cyan-600 px-7 py-3 rounded-lg font-bold mt-7"
                >
                    Join FRS
                </Link>
            </section>
        </PublicLayout>
    );
}
