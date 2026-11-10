"use client";

import { useState } from "react";

export default function AskLocation({ callBack }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };

                callBack(coordinates);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return (
        <div>
            <button type="button" onClick={getLocation} disabled={loading}>
                {loading ? "Detecting Location..." : "Get My Location"}
            </button>

            {error && <p>{error}</p>}
        </div>
    );
}