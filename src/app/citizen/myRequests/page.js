
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";

const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
    ASSIGNED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    IN_PROGRESS: "bg-cyan-100 text-cyan-800 border-cyan-200",
    RESCUED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusDescriptions = {
    PENDING: "Your request is waiting for review.",
    PROCESSING: "Your request is being processed.",
    ASSIGNED: "A rescue team has been assigned.",
    IN_PROGRESS: "The rescue team is carrying out the operation.",
    RESCUED: "The rescue operation has been completed.",
    CANCELLED: "This request has been cancelled.",
};

const ongoingStatuses = [
    "PENDING",
    "PROCESSING",
    "ASSIGNED",
    "IN_PROGRESS",
];

// Calculate distance between two GPS coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const earthRadius = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

function formatDistance(distance) {
    if (distance < 1) {
        return `${Math.round(distance * 1000)} m`;
    }

    return `${distance.toFixed(1)} km`;
}

function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}
        >
            {status?.replaceAll("_", " ") || "UNKNOWN"}
        </span>
    );
}

function RequestCard({ item, onCancel, cancellingId }) {
    const rescuer = item.rescuer;

    const hasRescuerLocation =
        rescuer?.latitude != null &&
        rescuer?.longitude != null &&
        Number.isFinite(Number(rescuer.latitude)) &&
        Number.isFinite(Number(rescuer.longitude));

    const distance = hasRescuerLocation
        ? calculateDistance(
            item.latitude,
            item.longitude,
            rescuer.latitude,
            rescuer.longitude
        )
        : null;

    const canCancel = item.status === "PENDING";
    const isOngoing = ongoingStatuses.includes(item.status);

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

            {/* Card Header */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Request ID
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-800">
                        #{item.id}
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />

                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.urgency === "CRITICAL"
                            ? "bg-red-100 text-red-700"
                            : item.urgency === "HIGH"
                            ? "bg-orange-100 text-orange-700"
                            : item.urgency === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }`}>
                        {item.urgency} PRIORITY
                    </span>
                </div>

            </div>

            {/* Card Content */}
            <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">

                {/* Request Details */}
                <div>
                    <h4 className="mb-4 font-bold text-slate-800">
                        Request Details
                    </h4>

                    <div className="space-y-3 text-sm">

                        <div>
                            <p className="text-slate-400">Location / PIN</p>
                            <p className="font-semibold text-slate-700">
                                {item.name} - {item.pin}
                            </p>
                        </div>

                        <div>
                            <p className="text-slate-400">Emergency Type</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {item.emergencyType?.map((type) => (
                                    <span
                                        key={type}
                                        className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
                                    >
                                        {type.replaceAll("_", " ")}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-400">People Affected</p>
                            <p className="font-semibold text-slate-700">
                                {item.peopleAffected} people
                            </p>
                        </div>

                        <div>
                            <p className="text-slate-400">Description</p>
                            <p className="leading-relaxed text-slate-700">
                                {item.description || "No description provided."}
                            </p>
                        </div>

                        <div>
                            <p className="text-slate-400">Submitted On</p>
                            <p className="font-semibold text-slate-700">
                                {formatDate(item.createdAt)}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Rescuer Details */}
                <div className="rounded-xl bg-slate-50 p-5">

                    <h4 className="mb-4 font-bold text-slate-800">
                        <span className="mr-2">🛟</span>
                        Rescue Team Information
                    </h4>

                    {rescuer ? (
                        <div className="space-y-3 text-sm">

                            <div>
                                <p className="text-slate-400">Assigned Rescuer</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {rescuer.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400">Contact Number</p>
                                <p className="font-semibold text-slate-700">
                                    {rescuer.contactNumber || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400">Team Status</p>
                                <p className="font-semibold text-slate-700">
                                    {rescuer.status?.replaceAll("_", " ") || "Unknown"}
                                </p>
                            </div>

                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                                <p className="text-xs font-semibold uppercase text-blue-600">
                                    Approximate Distance
                                </p>

                                {distance !== null ? (
                                    <p className="mt-1 text-2xl font-extrabold text-blue-800">
                                        {formatDistance(distance)}
                                    </p>
                                ) : (
                                    <p className="mt-1 font-semibold text-slate-600">
                                        Location not available
                                    </p>
                                )}

                                <p className="mt-1 text-xs text-slate-500">
                                    Straight-line distance between your rescue
                                    location and the rescuer's latest GPS position.
                                    Actual travel distance may differ.
                                </p>
                            </div>

                        </div>
                    ) : (
                        <div className="flex min-h-44 flex-col items-center justify-center text-center">

                            <span className="mb-3 text-4xl">
                                {isOngoing ? "⏳" : item.status === "RESCUED" ? "✅" : "—"}
                            </span>

                            <p className="font-semibold text-slate-700">
                                {isOngoing
                                    ? "No rescuer assigned yet"
                                    : "No rescuer information"}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                {isOngoing
                                    ? "Your request is waiting for rescue team assignment."
                                    : "Rescuer details are not available for this request."}
                            </p>

                        </div>
                    )}

                </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center">

                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        {statusDescriptions[item.status] || "Status information unavailable."}
                    </p>
                </div>

                {canCancel && (
                    <button
                        type="button"
                        onClick={() => onCancel(item.id)}
                        disabled={cancellingId === item.id}
                        className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancellingId === item.id
                            ? "Cancelling..."
                            : "Cancel Request"}
                    </button>
                )}

            </div>

        </article>
    );
}

export default function MyRequests() {

    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarItems = [
        { url: "/citizen", text: "Dashboard" },
        { url: "/citizen/request", text: "Create Request" },
        { url: "/citizen/myRequests", text: "My Requests" },
    ];

    const fetchRequests = useCallback(async (showLoader = false) => {
        try {
            if (showLoader) setLoading(true);

            const res = await fetch("/api/citizen/myRequests", {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Unable to fetch requests");
            }

            setRequests(data.requests || []);
            setError("");

        } catch (err) {
            console.error("Fetch requests error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests(true);

        const interval = setInterval(() => {
            fetchRequests(false);
        }, 20000);

        return () => clearInterval(interval);
    }, [fetchRequests]);

    async function handleCancel(requestId) {
        const confirmed = window.confirm(
            `Are you sure you want to cancel request #${requestId}?`
        );

        if (!confirmed) return;

        setCancellingId(requestId);

        try {
            const res = await fetch("/api/citizen/myRequests", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Cancellation failed");
            }

            alert("Request cancelled successfully.");

            await fetchRequests(false);

        } catch (err) {
            console.error("Cancel request error:", err);
            alert(err.message || "Unable to cancel request.");
        } finally {
            setCancellingId(null);
        }
    }

    const ongoingRequests = requests.filter((request) =>
        ongoingStatuses.includes(request.status)
    );

    const completedRequests = requests.filter((request) =>
        ["RESCUED", "CANCELLED"].includes(request.status)
    );

    const filteredRequests =
        filter === "ONGOING"
            ? ongoingRequests
            : filter === "HISTORY"
            ? completedRequests
            : requests;

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <Header
                showMenu={true}
                onMenuClick={() =>
                    setSidebarOpen((previous) => !previous)
                }
            />

            <div className="flex min-h-[calc(100vh-80px)]">

                {/* Sidebar */}
                <SlideBar
                    array={sidebarItems}
                    isOpen={sidebarOpen}
                    onNavigate={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    {/* Page Heading */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Citizen Portal
                            </p>

                            <h1 className="text-3xl font-extrabold text-slate-800">
                                My Rescue Requests
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Track your current and previous emergency requests.
                            </p>
                        </div>

                        <Link
                            href="/citizen/request"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-red-700"
                        >
                            <span>+</span>
                            New Emergency Request
                        </Link>

                    </div>

                    {/* Statistics */}
                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">
                                Total Requests
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-800">
                                {requests.length}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                All submitted requests
                            </p>
                        </div>

                        <div className="rounded-xl border border-yellow-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">
                                Ongoing Requests
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-yellow-600">
                                {ongoingRequests.length}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Awaiting or receiving assistance
                            </p>
                        </div>

                        <div className="rounded-xl border border-green-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">
                                Request History
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-green-600">
                                {completedRequests.length}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Rescued or cancelled requests
                            </p>
                        </div>

                    </section>

                    {/* Request Filters */}
                    <section className="mb-6">

                        <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">

                            {[
                                { id: "ALL", label: "All Requests" },
                                { id: "ONGOING", label: "Ongoing" },
                                { id: "HISTORY", label: "History" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilter(tab.id)}
                                    className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                                        filter === tab.id
                                            ? "bg-blue-600 text-white shadow"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 opacity-75">
                                        {tab.id === "ALL"
                                            ? requests.length
                                            : tab.id === "ONGOING"
                                            ? ongoingRequests.length
                                            : completedRequests.length}
                                    </span>
                                </button>
                            ))}

                        </div>

                    </section>

                    {/* Request List */}
                    <section className="space-y-5">

                        {loading ? (
                            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                                <p className="font-semibold text-slate-600">
                                    Loading your requests...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                                <p className="font-semibold text-red-700">
                                    {error}
                                </p>

                                <button
                                    onClick={() => fetchRequests(true)}
                                    className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mb-4 text-5xl">
                                    {filter === "HISTORY" ? "📁" : "🛟"}
                                </div>

                                <h3 className="text-xl font-bold text-slate-800">
                                    {filter === "ALL"
                                        ? "No Requests Yet"
                                        : filter === "ONGOING"
                                        ? "No Ongoing Requests"
                                        : "No Request History"}
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                    {filter === "ALL"
                                        ? "You haven't submitted any emergency rescue requests yet."
                                        : filter === "ONGOING"
                                        ? "You currently have no pending or active rescue requests."
                                        : "Your completed and cancelled requests will appear here."}
                                </p>

                                {filter !== "HISTORY" && (
                                    <Link
                                        href="/citizen/request"
                                        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-800"
                                    >
                                        Create Rescue Request
                                    </Link>
                                )}

                            </div>
                        ) : (
                            filteredRequests.map((item) => (
                                <RequestCard
                                    key={item.id}
                                    item={item}
                                    onCancel={handleCancel}
                                    cancellingId={cancellingId}
                                />
                            ))
                        )}

                    </section>

                    {/* Information */}
                    <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
                        <p className="text-sm leading-relaxed text-blue-900">
                            <strong>Note:</strong> Request information refreshes
                            automatically every 20 seconds. Rescuer distance is
                            calculated using the latest available GPS coordinates
                            and represents straight-line distance, not actual
                            road or water travel distance.
                        </p>
                    </div>

                    <footer className="py-8 text-center text-sm text-slate-400">
                        Flood Rescue System © {new Date().getFullYear()}.
                        Every Life Matters.
                    </footer>

                </main>
            </div>
        </div>
    );
}
