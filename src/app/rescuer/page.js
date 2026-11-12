"use client";

import { useState, useEffect } from "react";
import Distance from "@/components/Distance";

export default function RescuerPage() {
    const [rescuer, setRescuer] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [ongoingTasks, setOngoingTasks] = useState([]);
    const [position, setPosition] = useState({ latitude: null, longitude: null });

    // Fetch rescuer details and assigned tasks
    async function fetchData() {
        try {
            const rescuerRequest = await fetch("/api/rescuer");
            const response = await rescuerRequest.json();
            
            const taskRequest = await fetch("/api/rescuer/pending");
            const taskResponse = await taskRequest.json();
            
            setRescuer(response.rescuer);
            setTasks(taskResponse.tasks || []);
            setOngoingTasks(taskResponse.ongoing || []);
        }
        catch (error) {
            console.error("Error fetching rescuer data:", error);
        }
    }
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);

        return () => clearInterval(interval);
    }, []);

    // Automatically track location changes
    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                });
            },
            (error) => {
                console.error("Location error:", error.message);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);
    async function attendRescue(taskId) {
        const attendReq = await fetch(`/api/rescuer/pending`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id:taskId,
                status: "IN_PROGRESS"
            })
        });
        const attendRes = await attendReq.json();
        if (attendRes.success) {
            alert("You have successfully attended the rescue operation.");
            fetchData();
        }
        else {
            alert(attendRes.message);
        }
    }

    async function rescueDone(taskId) {
        const doneReq = await fetch(`/api/rescuer/pending`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id:taskId,
                status: "RESCUED"
                })
        });
        const doneRes = await doneReq.json();
        if (doneRes.success) {
            alert("You have successfully marked the rescue operation as done.");
            fetchData();
        }
    }

    return (
        <>
        <div className="flex flex-col p-5">
            <div className="">
                <h1 className="text-2xl font-bold">Rescuer Page</h1>
                <p className="text-lg">Welcome {rescuer?.name || "Rescuer"}</p>
                <p className="text-md">Your current location:</p>

                {position.latitude !== null ? (
                    <div className="text-sm">
                        <p>Latitude: {position.latitude}</p>
                        <p>Longitude: {position.longitude}</p>
                        <p className="text-green-600">Live location tracking active</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Waiting for location permission...</p>
                )}

                {tasks.length > 0 ? (
                    <div className="w-full flex flex-col">
                        <div className="mt-4">
                            <h1 className="operations">Assigned Rescue Operation</h1>
                            <p className="text-md">You have been assigned to the following rescue operation:</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center mt-4">
                            {tasks.map((i) => {
                                const dist = position.latitude !== null && position.longitude !== null
                                    ? Distance(position.latitude, position.longitude, i.latitude, i.longitude)
                                    : null;

                                return (
                                    <div key={i.id} className="bg-amber-300 shadow-md rounded p-4 mb-4">
                                        <h2 className="text-lg font-semibold">{i.name}</h2>
                                        <p>Location: {i.pin}</p>
                                        <p className="text-sm">{i.description}</p>
                                        <p>Affected people: {i.peopleAffected}</p>
                                        <p>Status: {i.status}</p>
                                        {dist !== null && <p className="font-semibold">Distance to operation: {dist.toFixed(4)} km</p>}
                                        <button className="bg-blue-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded" onClick={() => attendRescue(i.id)}>Attend Rescue</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-md">You have no assigned rescue operations.</p>
                )}
            </div>
            <div className="">
                {ongoingTasks.length > 0 ? (
                    <div className="w-full flex flex-col">
                        <div className="mt-4">
                            <p className="text-sm">Ongoing operations</p>
                            <p className="text-md text-white">You are currently attending to the above operations.</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center mt-4">
                            {ongoingTasks.map((i) => {
                                const dist = position.latitude !== null && position.longitude !== null
                                    ? Distance(position.latitude, position.longitude, i.latitude, i.longitude)
                                    : null;

                                return (
                                    <div key={i.id} className="bg-green-500 shadow-md rounded p-4 mb-4">
                                        <h2 className="text-lg font-semibold">{i.name}</h2>
                                        <p className="text-sm">{i.description}</p>
                                        <p>Affected people: {i.peopleAffected}</p>
                                        <p>Status: {i.status}</p>
                                        {dist !== null && <p className="font-semibold">Distance to operation: {dist.toFixed(4)} km</p>}
                                        <button className="bg-blue-700 hover:bg-green-600 text-white font-bold py-2 px-3 rounded" onClick={() => rescueDone(i.id)}>Mark as Done</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-lg text-gray-500">No ongoing operations.</p>
                )}
            </div>
        </div>
        </>
    );
}
