"use client"
import {useState} from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";
import flood2 from "../../../../public/flood2.jpeg";

export default function Login(){
    const router = useRouter();
    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [role, setRole] = useState("Citizen");
    
    async function formAction(e){
        e.preventDefault();
        try {
            const request = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email:mail,
                    password:pass,
                    role:role
                })
            });
            const response = await request.json();
            if (response.error) {
                console.log(response.error);
                alert("Error: " + response.error);
            } else {
                console.log(response.message);
                alert("Success: " + response.message);
                if (role === "Rescuer") {
                    router.push("/rescuer");
                }
                else if (role === "Operator") {
                    router.push("/operator");
                }
                else {
                    router.push("/citizen");
                }
            }
                }
        catch (error) {
            console.log("Login error:", error);
            alert("Something went wrong. Please try again.");
        }
    }
    return (
        <>
            <Header>
                <div className='flex gap-2 mx-10'>
                    {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/login")}>Log Out</button> */}
                </div>
            </Header>
            <div className="flex flex-row gap-4 p-4 w-full h-175"> {/* Should be Fit on the screen */}
                <SlideBar />
                <img src={flood2.src} alt="Flood" className="w-1/2" />
                <div className="flex flex-col w-1/2 gap-4">
                    <div className="navbar flex fles-row justify-center gap-4 bg-blue-300 p-2 rounded-lg">
                        <button onClick={() => setRole("Rescuer")} className="bg-blue-500 border-blue-600 rounded-2xl w-1/5 h-10 hover:bg-blue-700">Rescuer Login</button>
                        <button onClick={() => setRole("Operator")} className="bg-blue-500 border-blue-600 rounded-2xl w-1/5 h-10 hover:bg-blue-700">Operator Login</button>
                        <button onClick={() => setRole("Citizen")} className="bg-blue-500 border-blue-600 rounded-2xl w-1/5 h-10 hover:bg-blue-700">Citizen Login</button>
                    </div>
                    <form onSubmit={formAction} className=" flex flex-col gap-4 bg-blue-300 p-10 border rounded-lg shadow-md h-full">
                        <h1 className="text-center text-3xl ">{role} Login</h1>
                        <br></br>
                        <label htmlFor="email" className="text-2xl">Email:
                        <input type="email" id="email" name="email" required value={mail} onChange={(e) => setMail(e.target.value)} className="bg-white border-b-blue-800 text-2xl text-black m-4 rounded" placeholder="Enter Your Email"/>
                        </label>
                        <label htmlFor="password" className="text-2xl">Password:
                        <input type="password" id="password" name="password" required value={pass} onChange={(e) => setPass(e.target.value)} className="bg-white border-b-blue-800 text-2xl text-black m-4 rounded" placeholder="Enter Your Password"/>
                        </label>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                            Login
                        </button>
                        <br></br>
                        <p className="text-2xl">Don't have any account ? Click here <a href= "/auth/register" className="text-blue-800">Register</a></p>
                        {/* <p>Forget Account Details ? <a href="/auth/forgot-password" className="text-blue-800">Click here</a></p> */}
                    </form>
                </div>
            </div>

        </>
    )
}