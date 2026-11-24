// "use client";
// import { useRouter } from "next/navigation";
// import Header from "@/components/Header";
// import SlideBar from "@/components/Slidebar";
// export default function Page(){
//     const router = useRouter();
//     function logOut(){
//         fetch("/api/auth/logout", {
//             method: "GET"
//         }).then((res) => {
//             if (res.ok) {
//                 alert("Logout successful");                                     
//                 router.push("auth/login");
//             }
//             else {
//                 alert("Logout failed");
//             }
//         });
//     }
    
//     return (
//         <>
//             <Header>
//                 <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => logOut()}>Log Out</button>
//             </Header>
//             <main className="p-4 flex flex-col h-full sm:flex-row gap-4 ">
//                 <SlideBar array={[
//                     { url: "/citizen", text: "Dashboard", state: {} },
//                     { url: "/citizen/request", text: "Create Request", state: {} },
//                     { url: "/citizen/myRequests", text: "My Requests", state: {} },
//                 ]} />
//                 <div>
//                     <h1> Hi User, don't be afraid, we are here to help you! </h1>
//                     <h2> Create a emergency rescue request </h2>
//                     <button onClick={() => router.push("/citizen/request")} className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded'>Create Request</button>
//                     <button onClick={() => router.push("/citizen/myRequests")} className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded'> My Requests </button>
//                 </div>
//             </main>
//         </>
//     )
// }










"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";

export default function Page() {
    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const sidebarItems = [
        { url: "/citizen", text: "Dashboard" },
        { url: "/citizen/request", text: "Create Request" },
        { url: "/citizen/myRequests", text: "My Requests" },
    ];

    async function logOut() {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            const res = await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "same-origin",
            });

            if (!res.ok) {
                throw new Error("Logout failed");
            }

            alert("Logout successful");
            router.replace("/auth/login");
            router.refresh();

        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to logout. Please try again.");
            setLoggingOut(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <Header
                showMenu={true}
                onMenuClick={() =>
                    setSidebarOpen((previous) => !previous)
                }
            >
                <button
                    type="button"
                    onClick={logOut}
                    disabled={loggingOut}
                    className="rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loggingOut ? "Logging out..." : "Log Out"}
                </button>
            </Header>

            <div className="flex min-h-[calc(100vh-80px)]">

                {/* Sidebar */}
                <SlideBar
                    array={sidebarItems}
                    isOpen={sidebarOpen}
                    onNavigate={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    {/* Welcome Banner */}
                    <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-700 p-6 text-white shadow-lg sm:p-10">

                        <div className="relative z-10 max-w-2xl">

                            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-200">
                                Citizen Dashboard
                            </p>

                            <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                                Don't Fear the Flood.
                                <br />
                                We Are Here to Help!
                            </h1>

                            <p className="mb-6 text-base leading-relaxed text-blue-100 sm:text-lg">
                                Your safety matters to us. If you or someone
                                around you is in danger due to flooding,
                                request emergency assistance. Our rescue
                                coordination system is here to connect you
                                with help.
                            </p>

                            <Link
                                href="/citizen/request"
                                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-bold text-white shadow-md transition hover:scale-105 hover:bg-red-600"
                            >
                                <span>Emergency Help</span>
                                <span>→</span>
                            </Link>

                        </div>

                        <div className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-xl" />

                    </section>

                    {/* Quick Actions */}
                    <section className="mb-8">

                        <div className="mb-5">
                            <h2 className="text-2xl font-bold text-slate-800">
                                How Can We Help You?
                            </h2>

                            <p className="mt-1 text-slate-500">
                                Choose an action to continue.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Create Request */}
                            <div className="group rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-3xl">
                                    🚨
                                </div>

                                <h3 className="mb-2 text-xl font-bold text-slate-800">
                                    Emergency Rescue Request
                                </h3>

                                <p className="mb-6 leading-relaxed text-slate-500">
                                    Are you trapped, drowning, or in need of
                                    urgent rescue assistance? Submit your
                                    emergency details so rescue teams can
                                    respond.
                                </p>

                                <Link
                                    href="/citizen/request"
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                                >
                                    Create Emergency Request
                                    <span>→</span>
                                </Link>

                            </div>

                            {/* My Requests */}
                            <div className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl">
                                    📋
                                </div>

                                <h3 className="mb-2 text-xl font-bold text-slate-800">
                                    Track My Requests
                                </h3>

                                <p className="mb-6 leading-relaxed text-slate-500">
                                    Check the status of your submitted rescue
                                    requests and see whether assistance has
                                    been assigned.
                                </p>

                                <Link
                                    href="/citizen/myRequests"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                                >
                                    View My Requests
                                    <span>→</span>
                                </Link>

                            </div>

                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

                        <h2 className="mb-2 text-2xl font-bold text-slate-800">
                            How Our Rescue System Works
                        </h2>

                        <p className="mb-7 text-slate-500">
                            Follow these simple steps to request emergency
                            assistance.
                        </p>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            {[
                                {
                                    number: "01",
                                    icon: "📝",
                                    title: "Submit Request",
                                    description: "Provide your location and emergency details.",
                                },
                                {
                                    number: "02",
                                    icon: "📍",
                                    title: "Location Detection",
                                    description: "Your location helps identify nearby rescue teams.",
                                },
                                {
                                    number: "03",
                                    icon: "🚤",
                                    title: "Team Assignment",
                                    description: "Rescue operations are coordinated for assistance.",
                                },
                                {
                                    number: "04",
                                    icon: "🛟",
                                    title: "Rescue Assistance",
                                    description: "The assigned team works to reach people in need.",
                                },
                            ].map((step) => (
                                <div
                                    key={step.number}
                                    className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-3xl">
                                            {step.icon}
                                        </span>

                                        <span className="font-bold text-blue-300">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 font-bold text-slate-800">
                                        {step.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-500">
                                        {step.description}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </section>

                    {/* Safety Message */}
                    <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6 sm:p-8">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                            <div className="text-4xl">
                                💙
                            </div>

                            <div>
                                <h2 className="mb-2 text-xl font-bold text-slate-800">
                                    Your Life Is Precious. Stay Safe!
                                </h2>

                                <p className="leading-relaxed text-slate-600">
                                    Avoid walking or driving through floodwater.
                                    Move to higher ground when possible and
                                    follow instructions from local emergency
                                    authorities. In immediate danger, contact
                                    your local emergency services as well as
                                    submitting a request through FRS.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-6 text-center text-sm text-slate-400">
                        Flood Rescue System © {new Date().getFullYear()}.
                        Every Life Matters.
                    </footer>

                </main>
            </div>
        </div>
    );
}
