"use client"
import {useState} from "react";
import { useRouter } from "next/navigation";

export default function Login(){
    const router = useRouter();
    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [role, setRole] = useState("Citizen");
    
    async function formAction(e){
        e.preventDefault();
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
            console.error(response.error);
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
    return (
        <>
            <div className="navbar">
                <button onClick={() => setRole("Rescuer")}>Rescuer Login</button>
                <button onClick={() => setRole("Operator")}>Operator Login</button>
                <button onClick={() => setRole("Citizen")}>Citizen Login</button>
            </div>
            <h1>{role} Login</h1>
            <form onSubmit={formAction}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required value={mail} onChange={(e) => setMail(e.target.value)}/>
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required value={pass} onChange={(e) => setPass(e.target.value)}/>
                <br />
                <button type="submit">Login</button>
            </form>

        </>
    )
}