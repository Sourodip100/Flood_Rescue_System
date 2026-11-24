
import Header from "@/components/Header";
import Link from "next/link";

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-slate-950 text-gray-300 px-6 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            FRS<span className="text-cyan-400">.</span>
                        </h2>
                        <p className="mt-3 text-sm leading-6">
                            Flood Rescue System is designed to connect
                            people in emergencies with rescue teams and
                            coordinate flood-relief operations.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-3">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-2 text-sm">
                            <Link href="/" className="hover:text-cyan-400">Home</Link>
                            <Link href="/services" className="hover:text-cyan-400">Services</Link>
                            <Link href="/products" className="hover:text-cyan-400">Products</Link>
                            <Link href="/about" className="hover:text-cyan-400">About Us</Link>
                            <Link href="/contact" className="hover:text-cyan-400">Contact Us</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-3">
                            Emergency Assistance
                        </h3>
                        <p className="text-sm leading-6">
                            Need help during a flood emergency?
                            Register on our platform to submit a rescue request.
                        </p>
                        <Link
                            href="/auth/register"
                            className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
                        >
                            Request Assistance
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-gray-700 mt-8 pt-5 text-center text-sm">
                    © {new Date().getFullYear()} Flood Rescue System. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
