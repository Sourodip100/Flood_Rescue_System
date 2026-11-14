"use client"
import {useState} from "react";
import { useRouter } from "next/navigation";
export default function Register(){
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function formAction(e){
        e.preventDefault();
        const request = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name:name,
                phone:phone,
                email:email,
                password:password
            })
        });
        const response = await request.json();
        if (response.error) {
            console.error(response.error);
            alert("Error: " + response.error);
        } else {
            console.log(response.message);
            alert("Success: " + response.message);
            router.push("/citizen");
        }
    }
    return (
        <>
            <h1>Register</h1>
            <form onSubmit={formAction}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={name} required onChange={(e)=>{setName(e.target.value);}} />
                <br />
                <label htmlFor="phone">Phone:</label>
                <input type="text" id="phone" name="phone" value={phone} required onChange={(e)=>{setPhone(e.target.value);}} />
                <br />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} required onChange={(e)=>{setEmail(e.target.value);}} />
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} required onChange={(e)=>{setPassword(e.target.value);}} />
                <br />
                <button type="submit">Register</button>
            </form>
        </>
    )
}