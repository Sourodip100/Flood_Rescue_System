"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Slidebar from "@/components/Slidebar";
import Head from "next/head";

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          {value ?? 0}
        </h2>
        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
      </div>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, description, href, icon }) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition"
  >
    <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
      {icon}
    </div>

    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>

    <span className="ml-auto text-gray-400 text-xl">→</span>
  </Link>
);

export default function OperatorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/operator/dashboard");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Something went wrong");
        }

        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBarColor = (percentage) => {
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">
          Loading operator dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const overview = data.overview;

  return (
    <>
    <Header>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/login")}>Log Out</button>
    </Header>
    <div className="p-2 flex flex-row">
        <Slidebar array={[
            { url: "/operator", text: "Dashboard", state: {} },
            { url: "/operator/addOperators", text: "Add Operator", state: {} },
            { url: "/operator/register-rescuer", text: "Register Rescuer", state: {} },
            { url: "/operator/register-citizen", text: "Register Citizen", state: {} },
        ]} />
        <main className="min-h-screen w-full bg-gray-50 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
            <p className="text-sm text-blue-600 font-semibold">
                FLOOD RESCUE SYSTEM
            </p>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">
                Operator Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
                Monitor resources, rescue operations and system activity.
            </p>
            </div>

            <div className="bg-white border rounded-lg px-4 py-3 text-sm text-gray-600">
            <span className="text-green-600">●</span> System Overview
            </div>
        </div>

        {/* Overview Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            <StatCard
            title="Total Resources"
            value={overview.totalResources}
            subtitle="Total inventory quantity"
            icon="📦"
            color="bg-blue-100"
            />

            <StatCard
            title="Available Resources"
            value={overview.availableResources}
            subtitle={`${overview.remainingPercentage}% inventory remaining`}
            icon="✅"
            color="bg-green-100"
            />

            <StatCard
            title="Active Requests"
            value={overview.activeRequests}
            subtitle="Requests awaiting completion"
            icon="🚨"
            color="bg-orange-100"
            />

            <StatCard
            title="Successful Rescues"
            value={overview.successfulRescues}
            subtitle="Successfully rescued requests"
            icon="🛟"
            color="bg-purple-100"
            />

        </section>

        {/* Quick Actions */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
            <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800">
                Quick Actions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Manage system users and rescue personnel.
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <QuickAction
                title="Register New Operator"
                description="Create an operator account"
                href="/operator/addOperators"
                icon="👨‍💼"
            />

            <QuickAction
                title="Register New Rescuer"
                description="Add a rescue team"
                href="/operator/addRescuer"
                icon="🚑"
            />

            <QuickAction
                title="Register New Citizen"
                description="Create a citizen account"
                href="/operator/addCitizen"
                icon="👤"
            />

            </div>
        </section>

        {/* Resource Monitoring */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                Resource Monitoring
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                Monitor inventory levels and resource availability.
                </p>
            </div>

            <div className="text-sm font-semibold text-gray-600">
                {overview.remainingPercentage}% Overall Available
            </div>
            </div>

            <div className="space-y-6">

            {data.resources.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                No resources have been added yet.
                </p>
            ) : (
                data.resources.map((resource) => (
                <div key={resource.id}>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">

                    <div>
                        <h3 className="font-semibold text-gray-800">
                        {resource.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                        {resource.type.replaceAll("_", " ")}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold text-gray-700">
                        {resource.available} / {resource.total}
                        </span>

                        <span className={`font-semibold ${
                        resource.remainingPercentage <= 25
                            ? "text-red-600"
                            : resource.remainingPercentage <= 50
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}>
                        {resource.remainingPercentage}%
                        </span>
                    </div>

                    </div>

                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${getBarColor(resource.remainingPercentage)}`}
                        style={{
                        width: `${resource.remainingPercentage}%`,
                        }}
                    />
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>
                        {resource.status.replaceAll("_", " ")}
                    </span>
                    <span>
                        {resource.total - resource.available} unavailable
                    </span>
                    </div>

                </div>
                ))
            )}

            </div>
        </section>

        {/* Recent Successful Rescues */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-8">

            <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800">
                Recent Successful Rescues
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Latest completed rescue requests.
            </p>
            </div>

            {data.recentRescues.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
                No successful rescues recorded yet.
            </p>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">

                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Citizen</th>
                    <th className="p-3">Rescue Team</th>
                    <th className="p-3">Emergency Type</th>
                    <th className="p-3">People</th>
                    <th className="p-3">Completed At</th>
                    <th className="p-3">Status</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {data.recentRescues.map((rescue) => (
                    <tr key={rescue.id} className="hover:bg-gray-50">

                        <td className="p-3 font-semibold text-blue-600">
                        #{rescue.id}
                        </td>

                        <td className="p-3 text-gray-700">
                        {rescue.citizen}
                        </td>

                        <td className="p-3 text-gray-700">
                        {rescue.rescuer}
                        </td>

                        <td className="p-3 text-gray-700">
                        {rescue.emergencyType.join(", ")}
                        </td>

                        <td className="p-3 text-gray-700">
                        {rescue.peopleAffected}
                        </td>

                        <td className="p-3 text-gray-500 whitespace-nowrap">
                        {formatDate(rescue.completedAt)}
                        </td>

                        <td className="p-3">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            RESCUED
                        </span>
                        </td>

                    </tr>
                    ))}
                </tbody>

                </table>
            </div>
            )}

        </section>

        {/* System Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-white border rounded-xl p-5">
            <p className="text-gray-500 text-sm">Registered Operators</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
                {overview.totalOperators}
            </h2>
            </div>

            <div className="bg-white border rounded-xl p-5">
            <p className="text-gray-500 text-sm">Registered Rescue Teams</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
                {overview.totalRescuers}
            </h2>
            </div>

            <div className="bg-white border rounded-xl p-5">
            <p className="text-gray-500 text-sm">Registered Citizens</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
                {overview.totalCitizens}
            </h2>
            </div>

        </section>

        <footer className="text-center text-xs text-gray-400 mt-10">
            Flood Rescue System • Operator Management Panel
        </footer>

        </main>
    </div>
    </>
  );
}
