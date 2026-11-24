// "use client"
// import {useState} from "react";
// import { useRouter } from "next/navigation";
// import Header from "@/components/Header";
// import SlideBar from "@/components/Slidebar";
// import flood2 from "../../../../public/flood2.jpeg";

// export default function Login(){
//     const router = useRouter();
//     const [mail, setMail] = useState("");
//     const [pass, setPass] = useState("");
//     const [role, setRole] = useState("Citizen");
    
//     async function formAction(e){
//         e.preventDefault();
//         try {
//             const request = await fetch("/api/auth/login", {
//                 method: "POST",
//                 headers: {
//                     "content-type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     email:mail,
//                     password:pass,
//                     role:role
//                 })
//             });
//             const response = await request.json();
//             if (response.error) {
//                 console.log(response.error);
//                 alert("Error: " + response.error);
//             } else {
//                 console.log(response.message);
//                 alert("Success: " + response.message);
//                 if (role === "Rescuer") {
//                     router.push("/rescuer");
//                 }
//                 else if (role === "Operator") {
//                     router.push("/operator");
//                 }
//                 else {
//                     router.push("/citizen");
//                 }
//             }
//                 }
//         catch (error) {
//             console.log("Login error:", error);
//             alert("Something went wrong. Please try again.");
//         }
//     }
//     return (
//         <>
//             <Header>
//                 <div className='flex gap-2 mx-10'>
//                     {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/login")}>Log Out</button> */}
//                 </div>
//             </Header>
//             <div className="flex flex-row gap-4 p-4 w-full h-175"> {/* Should be Fit on the screen */}
//                 <SlideBar />
//                 <img src={flood2.src} alt="Flood" className="w-1/2" />
//                 <div className="flex flex-col w-1/2 gap-4">
//                     <div className="navbar flex fles-row justify-center gap-4 bg-blue-300 p-2 rounded-lg">
//                         <button onClick={() => setRole("Rescuer")} className="bg-blue-500 border-blue-600 rounded-2xl w-1/5 h-10 hover:bg-blue-700">Rescuer Login</button>
//                         <button onClick={() => setRole("Operator")} className="bg-blue-500 border-blue-600 rounded-2xl w-1/5 h-10 hover:bg-blue-700">Operator Login</button>
//                         <button onClick={() => setRole("Citizen")} className="bg-blue-500 border-blue-600 rounded-2xl w-1/5 h-10 hover:bg-blue-700">Citizen Login</button>
//                     </div>
//                     <form onSubmit={formAction} className=" flex flex-col gap-4 bg-blue-300 p-10 border rounded-lg shadow-md h-full">
//                         <h1 className="text-center text-3xl ">{role} Login</h1>
//                         <br></br>
//                         <label htmlFor="email" className="text-2xl">Email:
//                         <input type="email" id="email" name="email" required value={mail} onChange={(e) => setMail(e.target.value)} className="bg-white border-b-blue-800 text-2xl text-black m-4 rounded" placeholder="Enter Your Email"/>
//                         </label>
//                         <label htmlFor="password" className="text-2xl">Password:
//                         <input type="password" id="password" name="password" required value={pass} onChange={(e) => setPass(e.target.value)} className="bg-white border-b-blue-800 text-2xl text-black m-4 rounded" placeholder="Enter Your Password"/>
//                         </label>
//                         <button type="submit" className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
//                             Login
//                         </button>
//                         <br></br>
//                         <p className="text-2xl">Don't have any account ? Click here <a href= "/auth/register" className="text-blue-800">Register</a></p>
//                         {/* <p>Forget Account Details ? <a href="/auth/forgot-password" className="text-blue-800">Click here</a></p> */}
//                     </form>
//                 </div>
//             </div>

//         </>
//     )
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import Header from "@/components/Header";

// Zod validation schema
const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required"),

    role: z.enum(["Citizen", "Rescuer", "Operator"], {
        error: "Please select a valid login role"
    })
});

const roles = [
    { name: "Citizen", icon: "fa-solid fa-user", description: "Request emergency help" },
    { name: "Rescuer", icon: "fa-solid fa-life-ring", description: "Manage rescue operations" },
    { name: "Operator", icon: "fa-solid fa-headset", description: "Coordinate rescue teams" }
];

export default function Login() {
    const router = useRouter();

    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [role, setRole] = useState("Citizen");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // Validate individual fields
    function validateField(field, value) {
        const fieldSchema = loginSchema.shape[field];
        const result = fieldSchema.safeParse(value);

        setErrors((previous) => ({
            ...previous,
            [field]: result.success ? "" : result.error.issues[0].message
        }));
    }

    async function formAction(e) {
        e.preventDefault();

        setMessage("");

        // Validate complete form
        const validation = loginSchema.safeParse({
            email: mail,
            password: pass,
            role: role
        });

        if (!validation.success) {
            const newErrors = {};

            validation.error.issues.forEach((issue) => {
                const field = issue.path[0];
                newErrors[field] = issue.message;
            });

            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const request = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(validation.data)
            });

            const response = await request.json();

            if (!request.ok || response.error) {
                setMessage(response.error || "Login failed. Please try again.");
                return;
            }

            setMessage(response.message || "Login successful!");

            // Redirect according to selected role
            if (role === "Rescuer") {
                router.push("/rescuer");
            } else if (role === "Operator") {
                router.push("/operator");
            } else {
                router.push("/citizen");
            }

        } catch (error) {
            console.error("Login error:", error);
            setMessage("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Left section - Flood image */}
                    <section className="relative min-h-[300px] lg:min-h-[650px] rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src="/flood2.jpeg"
                            alt="Flood rescue operation"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-7 md:p-10 text-white">
                            <span className="inline-block bg-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-5">
                                FLOOD RESCUE SYSTEM
                            </span>

                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                                Together, We Can Save Lives.
                            </h1>

                            <p className="text-slate-200 text-base md:text-lg max-w-lg">
                                Don't fear the rising water. Hope is here,
                                and help is on the way. Our rescue network
                                works to connect people with help when
                                every second matters.
                            </p>
                        </div>
                    </section>

                    {/* Right section - Login form */}
                    <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

                        <div className="mb-7">
                            <p className="text-cyan-600 font-bold uppercase tracking-widest text-sm mb-2">
                                Welcome Back
                            </p>

                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                                Sign In
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Select your account type and enter your credentials.
                            </p>
                        </div>

                        {/* Role selection */}
                        <div className="mb-7">
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                Login As
                            </label>

                            <div className="grid grid-cols-3 gap-2">
                                {roles.map((item) => (
                                    <button
                                        key={item.name}
                                        type="button"
                                        disabled={loading}
                                        onClick={() => {
                                            setRole(item.name);
                                            setErrors((previous) => ({
                                                ...previous,
                                                role: ""
                                            }));
                                            setMessage("");
                                        }}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                                            ${
                                                role === item.name
                                                    ? "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm"
                                                    : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <i className={`${item.icon} text-xl`} />

                                        <span className="font-bold text-sm">
                                            {item.name}
                                        </span>

                                        <span className="hidden sm:block text-xs text-center">
                                            {item.description}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {errors.role && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Login form */}
                        <form onSubmit={formAction} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-slate-700 mb-2"
                                >
                                    Email Address
                                </label>

                                <div className={`flex items-center border rounded-xl px-4 transition-all
                                    ${errors.email ? "border-red-400" : "border-slate-300 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100"}`}
                                >
                                    <i className="fa-solid fa-envelope text-slate-400" />

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Enter your email"
                                        value={mail}
                                        disabled={loading}
                                        onChange={(e) => {
                                            setMail(e.target.value);
                                            if (errors.email) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    email: ""
                                                }));
                                            }
                                        }}
                                        onBlur={() => validateField("email", mail)}
                                        className="w-full p-3 outline-none bg-transparent text-slate-800"
                                    />
                                </div>

                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-bold text-slate-700 mb-2"
                                >
                                    Password
                                </label>

                                <div className={`flex items-center border rounded-xl px-4 transition-all
                                    ${errors.password ? "border-red-400" : "border-slate-300 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100"}`}
                                >
                                    <i className="fa-solid fa-lock text-slate-400" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={pass}
                                        disabled={loading}
                                        onChange={(e) => {
                                            setPass(e.target.value);
                                            if (errors.password) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    password: ""
                                                }));
                                            }
                                        }}
                                        onBlur={() => validateField("password", pass)}
                                        className="w-full p-3 outline-none bg-transparent text-slate-800"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((previous) => !previous)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="text-slate-400 hover:text-cyan-600"
                                    >
                                        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* API message */}
                            {message && (
                                <div
                                    role="alert"
                                    className={`p-3 rounded-xl text-sm font-medium ${
                                        message.toLowerCase().includes("successful")
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                                >
                                    {message}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/20 transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <i className="fa-solid fa-spinner animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <i className="fa-solid fa-arrow-right" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Registration link */}
                        <div className="mt-7 pt-6 border-t border-slate-200 text-center">
                            <p className="text-slate-600">
                                Don't have an account?
                                <a
                                    href="/auth/register"
                                    className="ml-2 font-bold text-cyan-700 hover:text-cyan-900 hover:underline"
                                >
                                    Register Here
                                </a>
                            </p>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6">
                            Flood Rescue System | Your Safety Matters
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
