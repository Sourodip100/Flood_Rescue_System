// "use client";

// import { useState, useEffect } from "react";
// import Distance from "@/components/Distance";

// export default function RescuerPage() {
//     const [rescuer, setRescuer] = useState(null);
//     const [tasks, setTasks] = useState([]);
//     const [ongoingTasks, setOngoingTasks] = useState([]);
//     const [position, setPosition] = useState({ latitude: null, longitude: null });

//     // Fetch rescuer details and assigned tasks
//     async function fetchData() {
//         try {
//             const rescuerRequest = await fetch("/api/rescuer");
//             const response = await rescuerRequest.json();
            
//             const taskRequest = await fetch("/api/rescuer/pending");
//             const taskResponse = await taskRequest.json();
            
//             setRescuer(response.rescuer);
//             setTasks(taskResponse.tasks || []);
//             setOngoingTasks(taskResponse.ongoing || []);
//         }
//         catch (error) {
//             console.error("Error fetching rescuer data:", error);
//         }
//     }
//     useEffect(() => {
//         fetchData();
//         const interval = setInterval(fetchData, 10000);

//         return () => clearInterval(interval);
//     }, []);

//     // Automatically track location changes
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             console.log("Geolocation is not supported");
//             return;
//         }

//         const watchId = navigator.geolocation.watchPosition(
//             (pos) => {
//                 setPosition({
//                     latitude: pos.coords.latitude,
//                     longitude: pos.coords.longitude
//                 });
//             },
//             (error) => {
//                 console.error("Location error:", error.message);
//             },
//             { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
//         );

//         return () => navigator.geolocation.clearWatch(watchId);
//     }, []);
//     async function attendRescue(taskId) {
//         const attendReq = await fetch(`/api/rescuer/pending`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 id:taskId,
//                 status: "IN_PROGRESS"
//             })
//         });
//         const attendRes = await attendReq.json();
//         if (attendRes.success) {
//             alert("You have successfully attended the rescue operation.");
//             fetchData();
//         }
//         else {
//             alert(attendRes.message);
//         }
//     }

//     async function rescueDone(taskId) {
//         const doneReq = await fetch(`/api/rescuer/pending`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 id:taskId,
//                 status: "RESCUED"
//                 })
//         });
//         const doneRes = await doneReq.json();
//         if (doneRes.success) {
//             alert("You have successfully marked the rescue operation as done.");
//             fetchData();
//         }
//     }

//     return (
//         <>
//         <div className="flex flex-col p-5">
//             <div className="">
//                 <h1 className="text-2xl font-bold">Rescuer Page</h1>
//                 <p className="text-lg">Welcome {rescuer?.name || "Rescuer"}</p>
//                 <p className="text-md">Your current location:</p>

//                 {position.latitude !== null ? (
//                     <div className="text-sm">
//                         <p>Latitude: {position.latitude}</p>
//                         <p>Longitude: {position.longitude}</p>
//                         <p className="text-green-600">Live location tracking active</p>
//                     </div>
//                 ) : (
//                     <p className="text-sm text-gray-500">Waiting for location permission...</p>
//                 )}

//                 {tasks.length > 0 ? (
//                     <div className="w-full flex flex-col">
//                         <div className="mt-4">
//                             <h1 className="operations">Assigned Rescue Operation</h1>
//                             <p className="text-md">You have been assigned to the following rescue operation:</p>
//                         </div>
//                         <div className="flex flex-row gap-4 items-center mt-4">
//                             {tasks.map((i) => {
//                                 const dist = position.latitude !== null && position.longitude !== null
//                                     ? Distance(position.latitude, position.longitude, i.latitude, i.longitude)
//                                     : null;

//                                 return (
//                                     <div key={i.id} className="bg-amber-300 shadow-md rounded p-4 mb-4">
//                                         <h2 className="text-lg font-semibold">{i.name}</h2>
//                                         <p>Location: {i.pin}</p>
//                                         <p className="text-sm">{i.description}</p>
//                                         <p>Affected people: {i.peopleAffected}</p>
//                                         <p>Status: {i.status}</p>
//                                         {dist !== null && <p className="font-semibold">Distance to operation: {dist.toFixed(4)} km</p>}
//                                         <button className="bg-blue-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded" onClick={() => attendRescue(i.id)}>Attend Rescue</button>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-md">You have no assigned rescue operations.</p>
//                 )}
//             </div>
//             <div className="">
//                 {ongoingTasks.length > 0 ? (
//                     <div className="w-full flex flex-col">
//                         <div className="mt-4">
//                             <p className="text-sm">Ongoing operations</p>
//                             <p className="text-md text-white">You are currently attending to the above operations.</p>
//                         </div>
//                         <div className="flex flex-row gap-4 items-center mt-4">
//                             {ongoingTasks.map((i) => {
//                                 const dist = position.latitude !== null && position.longitude !== null
//                                     ? Distance(position.latitude, position.longitude, i.latitude, i.longitude)
//                                     : null;

//                                 return (
//                                     <div key={i.id} className="bg-green-500 shadow-md rounded p-4 mb-4">
//                                         <h2 className="text-lg font-semibold">{i.name}</h2>
//                                         <p className="text-sm">{i.description}</p>
//                                         <p>Affected people: {i.peopleAffected}</p>
//                                         <p>Status: {i.status}</p>
//                                         {dist !== null && <p className="font-semibold">Distance to operation: {dist.toFixed(4)} km</p>}
//                                         <button className="bg-blue-700 hover:bg-green-600 text-white font-bold py-2 px-3 rounded" onClick={() => rescueDone(i.id)}>Mark as Done</button>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-lg text-gray-500">No ongoing operations.</p>
//                 )}
//             </div>
//         </div>
//         </>
//     );
// }























"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Slidebar from "@/components/Slidebar";
import Distance from "@/components/Distance";

const sidebarItems = [
    { text: "Dashboard", url: "/rescuer" },
    { text: "Assigned Requests", url: "/rescuer#assigned" },
    { text: "Ongoing Requests", url: "/rescuer#ongoing" },
    { text: "Resource Inventory", url: "/rescuer#inventory" },
];

const DEFAULT_UNITS = {
    FOOD_SUPPLY: "packets",
    MEDICAL_KIT: "kits",
    LIFE_JACKET: "pieces",
    WATER_SUPPLY: "bottles",
    BOAT: "boats",
    AMBULANCE: "vehicles",
    RESCUE_KIT: "kits",
    BLANKET: "pieces",
    CLOTHING: "sets",
    RESCUE_ROPE: "pieces",
    OXYGEN_CYLINDER: "cylinders",
    BABY_SUPPLIES: "packs",
    SANITARY_KIT: "kits",
    FLASHLIGHT: "pieces",
    BATTERY: "pieces",
    FUEL: "litres",
};

function formatResourceName(name = "") {
    return name
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeResources(resources) {
    if (typeof resources === "string") {
        try {
            resources = JSON.parse(resources);
        } catch {
            return [];
        }
    }

    if (!Array.isArray(resources)) return [];

    return resources.map((resource) => {
        if (typeof resource === "string") {
            return {
                name: resource,
                unit: DEFAULT_UNITS[resource] || "units",
                quantity: 0,
            };
        }

        return {
            ...resource,
            name: resource.name,
            unit: resource.unit || DEFAULT_UNITS[resource.name] || "units",
            quantity: Number(resource.quantity) || 0,
        };
    });
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${color}`}>
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        ASSIGNED: "bg-blue-100 text-blue-700",
        IN_PROGRESS: "bg-yellow-100 text-yellow-700",
        RESCUED: "bg-green-100 text-green-700",
        PENDING: "bg-gray-100 text-gray-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
            {(status || "UNKNOWN").replaceAll("_", " ")}
        </span>
    );
}

function TaskCard({ task, onUpdate, updating }) {
    const isAssigned = task.status === "ASSIGNED";
    const isOngoing = task.status === "IN_PROGRESS";

    return (
        <div className="bg-white rounded-xl shadow p-5 space-y-3">
            <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        {task.name || `Rescue Request #${task.id}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Request ID: #{task.id}
                    </p>
                </div>
                <StatusBadge status={task.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <p>
                    <i className="fa-solid fa-location-dot mr-2 text-red-500"></i>
                    {task.pin || "Location not available"}
                </p>
                <p>
                    <i className="fa-solid fa-users mr-2 text-blue-500"></i>
                    {task.peopleAffected} people affected
                </p>
                <p>
                    <i className="fa-solid fa-triangle-exclamation mr-2 text-orange-500"></i>
                    Urgency: {task.urgency || "MEDIUM"}
                </p>
                {task.createdAt && (
                    <p>
                        <i className="fa-regular fa-clock mr-2"></i>
                        {new Date(task.createdAt).toLocaleString()}
                    </p>
                )}
            </div>

            {task.emergencyType?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {task.emergencyType.map((type) => (
                        <span key={type} className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs">
                            {type}
                        </span>
                    ))}
                </div>
            )}

            {task.description && (
                <p className="text-sm text-gray-600 border-t pt-3">
                    {task.description}
                </p>
            )}

            <div className="flex flex-wrap justify-between items-center gap-3 border-t pt-3">
                <div className="text-sm text-gray-500">
                    {task.latitude != null && task.longitude != null ? (
                        <span>
                            Coordinates: {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}
                        </span>
                    ) : (
                        "Coordinates unavailable"
                    )}
                </div>

                {isAssigned && (
                    <button
                        onClick={() => onUpdate(task.id, "IN_PROGRESS")}
                        disabled={updating}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        {updating ? "Updating..." : "Start Rescue"}
                    </button>
                )}

                {isOngoing && (
                    <button
                        onClick={() => onUpdate(task.id, "RESCUED")}
                        disabled={updating}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        {updating ? "Updating..." : "Mark Rescued"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function RescuerDashboard() {
    const [rescuer, setRescuer] = useState(null);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [ongoingTasks, setOngoingTasks] = useState([]);

    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [taskLoading, setTaskLoading] = useState(null);

    const [position, setPosition] = useState(null);
    const [locationStatus, setLocationStatus] = useState("Waiting for GPS...");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [resourceAmounts, setResourceAmounts] = useState({});
    const [resourceLoading, setResourceLoading] = useState(null);

    const lastSavedPosition = useRef(null);
    const locationUpdateInProgress = useRef(false);
    const noticeTimer = useRef(null);

    const showNotice = (message) => {
        setNotice(message);

        if (noticeTimer.current) {
            clearTimeout(noticeTimer.current);
        }

        noticeTimer.current = setTimeout(() => {
            setNotice("");
        }, 4000);
    };

    const fetchData = useCallback(async (showLoader = false) => {
        if (showLoader) setRefreshing(true);

        try {
            const [profileResponse, tasksResponse] = await Promise.all([
                fetch("/api/rescuer", { cache: "no-store" }),
                fetch("/api/rescuer/pending", { cache: "no-store" }),
            ]);

            const profileData = await profileResponse.json();
            const tasksData = await tasksResponse.json();

            if (!profileResponse.ok) {
                throw new Error(profileData.message || profileData.error || "Unable to fetch rescuer profile");
            }

            if (!tasksResponse.ok) {
                throw new Error(tasksData.message || tasksData.error || "Unable to fetch rescue requests");
            }

            setRescuer(profileData.rescuer);

            const assigned =
                tasksData.assignedRequests ||
                tasksData.assigned ||
                [];

            const ongoing =
                tasksData.ongoingRequests ||
                tasksData.ongoing ||
                [];

            setAssignedTasks(assigned);
            setOngoingTasks(ongoing);

            if (profileData.rescuer?.latitude != null && profileData.rescuer?.longitude != null) {
                setPosition({
                    latitude: profileData.rescuer.latitude,
                    longitude: profileData.rescuer.longitude,
                });

                if (!lastSavedPosition.current) {
                    lastSavedPosition.current = {
                        latitude: profileData.rescuer.latitude,
                        longitude: profileData.rescuer.longitude,
                    };
                }
            }

            setError("");
        } catch (err) {
            console.error("DASHBOARD FETCH ERROR:", err);
            setError(err.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial data fetch and automatic refresh.
    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchData]);

    // Sidebar navigation and dashboard tab synchronization.
    useEffect(() => {
        const syncTab = () => {
            const tab = window.location.hash.replace("#", "");

            if (["assigned", "ongoing", "inventory"].includes(tab)) {
                setActiveTab(tab);
            } else {
                setActiveTab("overview");
            }
        };

        syncTab();

        window.addEventListener("hashchange", syncTab);

        return () => {
            window.removeEventListener("hashchange", syncTab);
        };
    }, []);


    // GPS tracking and database location updates.
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus("GPS is not supported by this browser");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (location) => {
                const currentPosition = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };

                setPosition(currentPosition);
                setLocationStatus("GPS tracking active");

                const previous = lastSavedPosition.current;

                if (previous) {
                    const distance = Math.sqrt(
                        Math.pow(currentPosition.latitude - previous.latitude, 2) +
                        Math.pow(currentPosition.longitude - previous.longitude, 2)
                    );

                    // Save only after a meaningful movement.
                    // Approximate threshold: 20 metres.
                    if (distance < 0.0002) return;
                }

                if (locationUpdateInProgress.current) return;

                locationUpdateInProgress.current = true;

                try {
                    const response = await fetch("/api/rescuer/location", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(currentPosition),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Location update failed");
                    }

                    lastSavedPosition.current = currentPosition;
                    setLocationStatus("Location synced");
                } catch (err) {
                    console.error("GPS UPDATE ERROR:", err);
                    setLocationStatus("Location sync failed");
                } finally {
                    locationUpdateInProgress.current = false;
                }
            },
            (err) => {
                console.error("GPS ERROR:", err);
                setLocationStatus(err.code === 1 ? "Location permission denied" : "Unable to get GPS location");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 15000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        return () => {
            if (noticeTimer.current) {
                clearTimeout(noticeTimer.current);
            }
        };
    }, []);

    const updateTaskStatus = async (id, status) => {
        setTaskLoading(id);

        try {
            const response = await fetch("/api/rescuer/pending", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Unable to update request");
            }

            showNotice(data.message || "Request status updated successfully");
            await fetchData();
        } catch (err) {
            showNotice(err.message);
        } finally {
            setTaskLoading(null);
        }
    };

    const updateResource = async (name, action) => {
        const quantity = Number(resourceAmounts[name]);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            showNotice("Please enter a valid quantity");
            return;
        }

        setResourceLoading(name);

        try {
            const response = await fetch("/api/rescuer/resources", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, action, quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update inventory");
            }

            setResourceAmounts((previous) => ({
                ...previous,
                [name]: "",
            }));

            showNotice(data.message || "Inventory updated successfully");
            await fetchData();
        } catch (err) {
            showNotice(err.message);
        } finally {
            setResourceLoading(null);
        }
    };

    const resources = normalizeResources(rescuer?.resources);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-600">Loading rescuer dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header showMenu={true} onMenuClick={() => setSidebarOpen((previous) => !previous)} />

            <div className="flex flex-col md:flex-row gap-4 p-4">
                <Slidebar array={sidebarItems} isOpen={sidebarOpen} />

                <main className="flex-1 min-w-0 space-y-5">
                    {notice && (
                        <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg">
                            {notice}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Dashboard heading */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Rescuer Dashboard
                            </h1>
                            <p className="text-gray-500">
                                Welcome, {rescuer?.name || "Rescuer"}
                            </p>
                        </div>

                        <button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                        >
                            <i className="fa-solid fa-rotate mr-2"></i>
                            {refreshing ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {/* Dashboard tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-gray-300 pb-3">
                        {[
                            ["overview", "Overview"],
                            ["assigned", "Assigned Requests"],
                            ["ongoing", "Ongoing Requests"],
                            ["inventory", "Inventory"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => setActiveTab(value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    activeTab === value
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Overview */}
                    {activeTab === "overview" && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                <StatCard
                                    title="Assigned Requests"
                                    value={assignedTasks.length}
                                    icon="fa-solid fa-clipboard-list"
                                    color="bg-blue-600"
                                />
                                <StatCard
                                    title="Ongoing Rescues"
                                    value={ongoingTasks.length}
                                    icon="fa-solid fa-truck-medical"
                                    color="bg-yellow-500"
                                />
                                <StatCard
                                    title="Available Resources"
                                    value={resources.reduce((total, item) => total + item.quantity, 0)}
                                    icon="fa-solid fa-boxes-stacked"
                                    color="bg-green-600"
                                />
                                <StatCard
                                    title="Team Members"
                                    value={rescuer?.membersCount ?? 0}
                                    icon="fa-solid fa-people-group"
                                    color="bg-purple-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {/* Rescuer profile */}
                                <section className="bg-white rounded-xl shadow p-5">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                                        Rescuer Information
                                    </h2>

                                    <div className="space-y-3 text-sm text-gray-900">
                                        <p><strong>Name:</strong> {rescuer?.name || "—"}</p>
                                        <p><strong>Email:</strong> {rescuer?.email || "—"}</p>
                                        <p><strong>Contact:</strong> {rescuer?.contactNumber || "—"}</p>
                                        <p><strong>Team Members:</strong> {rescuer?.membersCount ?? 0}</p>
                                        <p><strong>Boat Capacity:</strong> {rescuer?.boatCapacity ?? 0}</p>
                                        <p>
                                            <strong>Team Status:</strong>{" "}
                                            <StatusBadge status={rescuer?.status} />
                                        </p>
                                    </div>
                                </section>

                                {/* GPS information */}
                                <section className="bg-white rounded-xl shadow p-5">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                                        Live GPS Location
                                    </h2>

                                    <p className="text-sm mb-3 text-gray-600">
                                        <strong>Status:</strong>{" "}
                                        <span className="text-green-700">{locationStatus}</span>
                                    </p>

                                    {position ? (
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p>
                                                <strong>Latitude:</strong>{" "}
                                                {position.latitude.toFixed(6)}
                                            </p>
                                            <p>
                                                <strong>Longitude:</strong>{" "}
                                                {position.longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Waiting for GPS coordinates...
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-400 mt-4">
                                        Keep this dashboard open to continue GPS tracking.
                                    </p>
                                </section>
                            </div>

                            <section className="bg-white rounded-xl shadow p-5">
                                <h2 className="text-lg font-bold text-gray-800 mb-3">
                                    Recent Assigned Requests
                                </h2>

                                {assignedTasks.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        No assigned requests at the moment.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {assignedTasks.slice(0, 3).map((task) => (
                                            <div key={task.id} className="border-b last:border-0 pb-3 last:pb-0">
                                                <div className="flex justify-between gap-3">
                                                    <p className="font-medium text-gray-800">
                                                        {task.name} (#{task.id})
                                                    </p>
                                                    <StatusBadge status={task.status} />
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {task.pin}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {/* Assigned requests */}
                    {activeTab === "assigned" && (
                        <section id="assigned" className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Assigned Rescue Requests
                            </h2>

                            {assignedTasks.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                                    No assigned rescue requests.
                                </div>
                            ) : (
                                assignedTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onUpdate={updateTaskStatus}
                                        updating={taskLoading === task.id}
                                    />
                                ))
                            )}
                        </section>
                    )}

                    {/* Ongoing requests */}
                    {activeTab === "ongoing" && (
                        <section id="ongoing" className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Ongoing Rescue Operations
                            </h2>

                            {ongoingTasks.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                                    No ongoing rescue operations.
                                </div>
                            ) : (
                                ongoingTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onUpdate={updateTaskStatus}
                                        updating={taskLoading === task.id}
                                    />
                                ))
                            )}
                        </section>
                    )}

                    {/* Resource inventory */}
                    {activeTab === "inventory" && (
                        <section id="inventory" className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Resource Inventory
                            </h2>

                            <p className="text-sm text-gray-500">
                                Manage the resources assigned to your rescue team.
                            </p>

                            {resources.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                                    No resources have been assigned to your team.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {resources.map((resource) => (
                                        <div
                                            key={resource.name}
                                            className="bg-white rounded-xl shadow p-5 space-y-4"
                                        >
                                            <div className="flex justify-between items-center gap-3">
                                                <h3 className="font-bold text-gray-800">
                                                    {formatResourceName(resource.name)}
                                                </h3>
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                    {resource.quantity} {resource.unit}
                                                </span>
                                            </div>

                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Enter quantity"
                                                value={resourceAmounts[resource.name] || ""}
                                                onChange={(event) =>
                                                    setResourceAmounts((previous) => ({
                                                        ...previous,
                                                        [resource.name]: event.target.value,
                                                    }))
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                                            />

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => updateResource(resource.name, "ADD")}
                                                    disabled={resourceLoading === resource.name}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm"
                                                >
                                                    Add Stock
                                                </button>

                                                <button
                                                    onClick={() => updateResource(resource.name, "USE")}
                                                    disabled={resourceLoading === resource.name}
                                                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2 rounded-lg text-sm"
                                                >
                                                    Use Stock
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
