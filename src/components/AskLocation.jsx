"use client";
export default function AskLocation({ callBack }) {
    function getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                callBack(coordinates);
            },
            (err) => {
                callBack(null);
            }
        );
    }
    return (
        <div>
            <button type="button" onClick={getLocation} className="bg-cyan-300">
                Get Location
            </button>
        </div>
    );
}