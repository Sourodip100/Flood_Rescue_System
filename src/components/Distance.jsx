export default function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (degree) => degree * (Math.PI / 180);

    lat1 = toRad(lat1);
    lon1 = toRad(lon1);

    lat2 = toRad(lat2);
    lon2 = toRad(lon2);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}