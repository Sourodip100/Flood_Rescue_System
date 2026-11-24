// "use client"

// import Header from "@/components/Header";
// import SlideBar from "@/components/Slidebar";
// import { useRouter } from "next/navigation";
// export default function Home() {
//   const router = useRouter();
//   return (
//     <>
//       <Header>
//         <div className='flex gap-2 mx-10'>
//             <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/login")}>Login</button>
//             <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/register")}>Sign Up</button>
//         </div>
//       </Header>
//       <main className="p-4 flex flex-col sm:flex-row gap-4">
//         <SlideBar array={[
//           { url: "/dashboard", text: "Dashboard", state: {} },
//           { url: "/", text: "Rescuer Availavle", state: {} },
//           // { url: "/", text: "My Bookings", state: {} },
//         ]} />
//       </main>
//     </>
//   );
// }



import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import HomeCarousel from "@/components/HomeCarousel";

const features = [
    {
        icon: "fa-solid fa-water",
        title: "Flood Rescue",
        description: "Help coordinate rescue requests for people trapped in flood-affected areas.",
    },
    {
        icon: "fa-solid fa-people-group",
        title: "Rescue Teams",
        description: "Connect emergency requests with available rescue teams.",
    },
    {
        icon: "fa-solid fa-location-dot",
        title: "Live Location",
        description: "Use location information to support faster and more informed rescue coordination.",
    },
    {
        icon: "fa-solid fa-boxes-stacked",
        title: "Relief Supplies",
        description: "Coordinate essential food, water, medical kits and other emergency resources.",
    },
];

export default function Home() {
    return (
        <PublicLayout>
            <HomeCarousel />

            {/* Emergency message */}
            <section className="bg-red-600 text-white py-5 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            Are you trapped in a flood emergency?
                        </h2>
                        <p className="text-red-100 text-sm mt-1">
                            Don't wait. Register and submit your rescue request.
                        </p>
                    </div>

                    <Link
                        href="/auth/register"
                        className="bg-white text-red-600 hover:bg-red-100 px-6 py-3 rounded-lg font-bold"
                    >
                        Register for Help <i className="fa-solid fa-arrow-right ml-2"></i>
                    </Link>
                </div>
            </section>

            {/* Welcome */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <span className="text-cyan-600 font-bold uppercase tracking-widest text-sm">
                    Welcome to FRS
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
                    Together, We Stand Against Flood Disasters
                </h2>

                <p className="max-w-3xl mx-auto text-gray-600 mt-5 leading-8">
                    Flood Rescue System is a technology-driven platform
                    designed to support emergency rescue coordination.
                    It brings citizens, rescue teams and emergency
                    administrators together to help manage rescue requests,
                    track team locations and coordinate relief resources.
                </p>

                <p className="text-cyan-700 font-semibold text-xl mt-8 italic">
                    "Don't fear the rising water. Hope is here, and help is on the way."
                </p>
            </section>

            {/* Statistics */}
            <section className="bg-slate-900 py-14 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Every Second Counts
                    </h2>

                    <p className="text-gray-400 mt-3">
                        Example platform statistics for demonstration purposes
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {[
                            ["1,250+", "People Assisted"],
                            ["850+", "Rescue Requests"],
                            ["120+", "Rescue Team Members"],
                            ["24/7", "Emergency Coordination"],
                        ].map(([value, label]) => (
                            <div key={label} className="bg-slate-800 rounded-xl p-7">
                                <h3 className="text-4xl font-extrabold text-cyan-400">
                                    {value}
                                </h3>
                                <p className="text-gray-300 mt-3">{label}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-6">
                        Illustrative sample figures, not actual FRS operational records.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <span className="text-cyan-600 font-bold uppercase text-sm tracking-widest">
                        What We Do
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                        Our Key Capabilities
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white p-7 rounded-xl shadow hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <i className={`${feature.icon} text-4xl text-cyan-600`}></i>
                            <h3 className="text-xl font-bold mt-5 text-slate-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 mt-3 leading-7 text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Emergency CTA */}
            <section className="bg-cyan-600 py-16 px-6 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-extrabold">
                    Your Safety Is Our Priority
                </h2>

                <p className="mt-4 text-cyan-50 max-w-2xl mx-auto">
                    Need emergency assistance or want to become part of
                    our rescue network? Take the first step today.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Link
                        href="/auth/register"
                        className="bg-white text-cyan-700 px-7 py-3 rounded-lg font-bold hover:bg-gray-100"
                    >
                        Register as Citizen
                    </Link>

                    <Link
                        href="/auth/login"
                        className="border border-white px-7 py-3 rounded-lg font-bold hover:bg-cyan-700"
                    >
                        Login
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
