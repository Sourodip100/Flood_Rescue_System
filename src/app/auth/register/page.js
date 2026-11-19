"use client"
import {useState} from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

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
            console.log(response.error);
            alert("Error: " + response.error);
        } else {
            console.log(response.message);
            alert("Success: " + response.message);
            router.push("/citizen");
        }
    }
    return (
        <>
            <Header>
                <div className='flex gap-2 mx-10'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/login")}>Log Out</button>
                </div>
            </Header>
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