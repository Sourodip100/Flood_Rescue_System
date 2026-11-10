"use client";
import { useState } from "react";
import AskLocation from "@/components/AskLocation";
import { useRouter } from "next/navigation";

export default function Request() {
    const router = useRouter();
    // const [position, setPosition] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        pin: "",
        latitude: "",
        longitude: "",
        emergencyType: [],
        peopleAffected: "",
        description: ""
    });
    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                emergencyType: checked
                    ? [...prev.emergencyType, value]
                    : prev.emergencyType.filter(item => item !== value)
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const req = await fetch("/api/citizen/request", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const res = await req.json();
            if (res.success) {
                alert("Request submitted successfully!");
                router.push("/citizen");
            }
            else {
                alert("Failed to submit request: " + res.message);
            }
        }
        catch(error){
            console.error("Error submitting request:", error);
        }
    }
    return (
        <>
            <h1>Request for Help</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required onChange={handleChange} />
                <br />
                <label htmlFor="pin">PIN code:</label>
                <input type="text" id="pin" name="pin" onChange={handleChange} />
                <br />

                <label htmlFor="location">Location:</label>
                <AskLocation callBack={(coordinates) => {
                    if (coordinates) {
                        setFormData(prev => ({
                            ...prev,
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                        }));
                    }
                }}/>
                <input type="text" id="location" name="location" value={formData.latitude + ", " + formData.longitude} onChange={handleChange}/>
                <br />
                <label> <input type="checkbox" name="emergencyType" value="Flood Rescue" onChange={handleChange}/>Flood Rescue</label>
                <label><input type="checkbox" name="emergencyType" value="Flooding" onChange={handleChange}/> Flooding</label>
                <label><input type="checkbox" name="emergencyType" value="Medical Emergency" onChange={handleChange}/> Medical Emergency</label>
                <label><input type="checkbox" name="emergencyType" value="Food" onChange={handleChange} /> Food</label>
                <label> <input type="checkbox" name="emergencyType" value="Shelter" onChange={handleChange} /> Shelter</label>
                <br />
                <label>People Affected:</label>
                <input type="number" id="peopleAffected" name="peopleAffected" onChange={handleChange} />
                <br />
                <label>Description:</label>
                <input type="text" id="description" name="description" onChange={handleChange} />
                <br />
                <input type="submit" value="Submit Request" />
            </form>
            <button onClick={() => router.push("/citizen")}>Back</button>
        </>
    )
}