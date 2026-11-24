
"use client";

import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";

export default function Contact() {
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setMessage(
            "Your form is ready, but message delivery has not been connected yet."
        );
    }

    return (
        <PublicLayout>
            <section className="bg-slate-900 text-white text-center py-20 px-6">
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm">
                    Get In Touch
                </p>

                <h1 className="text-4xl md:text-5xl font-extrabold mt-4">
                    Contact Us
                </h1>

                <p className="max-w-2xl mx-auto text-gray-300 mt-5 leading-7">
                    Have a question, suggestion or need assistance
                    regarding the Flood Rescue System? Reach out to us.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Let's Connect
                    </h2>

                    <p className="text-gray-600 mt-4 leading-7">
                        We welcome questions and feedback about the
                        platform and its emergency coordination features.
                    </p>

                    <div className="space-y-6 mt-10">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                                <i className="fa-solid fa-envelope text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Email Support
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Contact information can be configured here.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                                <i className="fa-solid fa-location-dot text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Location
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Flood Rescue System
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                                <i className="fa-solid fa-clock text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Emergency Platform
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Online platform access
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 mt-10">
                        <h3 className="font-bold text-red-700">
                            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                            Flood Emergency?
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Do not use the general contact form for urgent
                            rescue requests. Use the emergency registration
                            process or contact your local emergency services.
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-7 md:p-9">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Send Us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-7">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter your name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter subject"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Message
                            </label>
                            <textarea
                                required
                                rows="5"
                                placeholder="Write your message..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-cyan-500 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-bold"
                        >
                            Send Message <i className="fa-solid fa-paper-plane ml-2"></i>
                        </button>

                        {message && (
                            <p className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
