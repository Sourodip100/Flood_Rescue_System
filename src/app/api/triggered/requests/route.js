
// import { NextResponse } from "next/server";
// import { timingSafeEqual } from "crypto";
// import prisma from "@/lib/db";

// export const runtime = "nodejs";

// // Verify that the request came from our Lambda
// function verifySecret(request) {
//     const receivedSecret = request.headers
//         .get("authorization")
//         ?.replace(/^Bearer\s+/i, "");

//     const expectedSecret = process.env.DISPATCH_SECRET;

//     if (!receivedSecret || !expectedSecret) {
//         return false;
//     }

//     const receivedBuffer = Buffer.from(receivedSecret);
//     const expectedBuffer = Buffer.from(expectedSecret);

//     if (receivedBuffer.length !== expectedBuffer.length) {
//         return false;
//     }

//     return timingSafeEqual(receivedBuffer, expectedBuffer);
// }


// // Calculate distance between two GPS coordinates (kilometres)
// function calculateDistance(lat1, lon1, lat2, lon2) {
//     const EARTH_RADIUS = 6371;

//     const toRadians = (degrees) => degrees * (Math.PI / 180);

//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return EARTH_RADIUS * c;
// }


// // Group nearby requests using a 5 km radius
// function clusterRequests(requests, radiusKm = 5) {
//     const remainingRequests = [...requests];
//     const clusters = [];

//     while (remainingRequests.length > 0) {
//         const anchor = remainingRequests.shift();
//         const cluster = [anchor];

//         for (let i = remainingRequests.length - 1; i >= 0; i--) {
//             const request = remainingRequests[i];

//             const distance = calculateDistance(
//                 anchor.latitude,
//                 anchor.longitude,
//                 request.latitude,
//                 request.longitude
//             );

//             if (distance <= radiusKm) {
//                 cluster.push(request);
//                 remainingRequests.splice(i, 1);
//             }
//         }

//         clusters.push(cluster);
//     }

//     return clusters.map((cluster, index) => ({
//         clusterId: index + 1,
//         requestIds: cluster.map(request => request.id),
//         requestCount: cluster.length,

//         centerLatitude:
//             cluster.reduce((sum, request) => sum + request.latitude, 0) /
//             cluster.length,

//         centerLongitude:
//             cluster.reduce((sum, request) => sum + request.longitude, 0) /
//             cluster.length
//     }));
// }


// // Receive eligible requests from AWS Lambda
// export async function POST(request) {
//     try {
//         // 1. Authenticate Lambda
//         if (!verifySecret(request)) {
//             return NextResponse.json(
//                 { success: false, message: "Unauthorized request." },
//                 { status: 401 }
//             );
//         }

//         // 2. Read incoming payload
//         const body = await request.json();

//         const triggerRequestId = Number(body.triggerRequestId);

//         if (
//             !Number.isInteger(triggerRequestId) ||
//             triggerRequestId <= 0 ||
//             !Array.isArray(body.requests) ||
//             body.requests.length === 0
//         ) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid request payload." },
//                 { status: 400 }
//             );
//         }

//         // 3. Extract unique request IDs
//         const requestIds = [
//             ...new Set(
//                 body.requests.map(item => Number(item.id))
//             )
//         ];

//         if (
//             requestIds.some(id => !Number.isInteger(id) || id <= 0) ||
//             !requestIds.includes(triggerRequestId)
//         ) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid request IDs." },
//                 { status: 400 }
//             );
//         }

//         // 4. Verify that the triggering request is still pending
//         const triggerRequest = await prisma.rescueRequest.findFirst({
//             where: {
//                 id: triggerRequestId,
//                 status: "PENDING"
//             }
//         });

//         if (!triggerRequest) {
//             return NextResponse.json({
//                 success: true,
//                 message: "Trigger request is no longer pending.",
//                 clusters: []
//             });
//         }

//         // 5. Fetch the actual pending records from Neon
//         // Do not trust request details sent in the POST body.
//         const eligibleRequests = await prisma.rescueRequest.findMany({
//             where: {
//                 id: { in: requestIds },
//                 status: "PENDING"
//             },
//             orderBy: {
//                 createdAt: "asc"
//             }
//         });

//         // 6. Perform geographical clustering
//         const clusters = clusterRequests(eligibleRequests, 5);

//         console.log("Dispatch cycle received:", triggerRequestId);
//         console.log(
//             "Eligible request IDs:",
//             eligibleRequests.map(item => item.id)
//         );
//         console.log("Generated clusters:", JSON.stringify(clusters, null, 2));

//         // 7. Return clustering result
//         return NextResponse.json({
//             success: true,
//             message: "Requests received and clustered successfully.",

//             triggerRequestId,

//             eligibleRequestIds: eligibleRequests.map(item => item.id),
//             eligibleCount: eligibleRequests.length,

//             clusters
//         });

//     } catch (error) {
//         console.error("Triggered requests API error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Failed to process triggered requests."
//             },
//             { status: 500 }
//         );
//     }
// }







import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// Authenticate AWS Lambda
function verifySecret(request) {
    const authorization = request.headers.get("authorization");
    const expectedSecret = process.env.DISPATCH_SECRET;

    if (!authorization?.startsWith("Bearer ") || !expectedSecret) {
        return false;
    }

    const receivedSecret = authorization.slice(7);

    const receivedBuffer = Buffer.from(receivedSecret);
    const expectedBuffer = Buffer.from(expectedSecret);

    if (receivedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(receivedBuffer, expectedBuffer);
}


// Calculate distance between two GPS coordinates (kilometres)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const EARTH_RADIUS = 6371;

    const toRadians = degrees => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return EARTH_RADIUS * 2 *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// Cluster requests within a 5 km radius
function clusterRequests(requests, radiusKm = 5) {
    const remainingRequests = [...requests];
    const clusters = [];

    while (remainingRequests.length > 0) {
        const anchor = remainingRequests.shift();
        const cluster = [anchor];

        for (let i = remainingRequests.length - 1; i >= 0; i--) {
            const request = remainingRequests[i];

            const distance = calculateDistance(
                anchor.latitude,
                anchor.longitude,
                request.latitude,
                request.longitude
            );

            if (distance <= radiusKm) {
                cluster.push(request);
                remainingRequests.splice(i, 1);
            }
        }

        clusters.push(cluster);
    }

    return clusters.map((cluster, index) => ({
        clusterId: index + 1,
        requestIds: cluster.map(request => request.id),
        requestCount: cluster.length,

        centerLatitude:
            cluster.reduce((sum, r) => sum + r.latitude, 0) /
            cluster.length,

        centerLongitude:
            cluster.reduce((sum, r) => sum + r.longitude, 0) /
            cluster.length
    }));
}


// Receive eligible requests from AWS Lambda
export async function POST(request) {
    try {
        // 1. Authenticate Lambda
        if (!verifySecret(request)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized." },
                { status: 401 }
            );
        }

        // 2. Validate payload
        const body = await request.json();

        const triggerRequestId = Number(body.triggerRequestId);

        if (
            !Number.isInteger(triggerRequestId) ||
            triggerRequestId <= 0 ||
            !Array.isArray(body.requests) ||
            body.requests.length === 0
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid payload." },
                { status: 400 }
            );
        }

        const requestIds = [
            ...new Set(body.requests.map(item => Number(item.id)))
        ];

        if (
            requestIds.some(id => !Number.isInteger(id) || id <= 0) ||
            !requestIds.includes(triggerRequestId)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid request IDs." },
                { status: 400 }
            );
        }

        // 3. Atomically claim requests and cluster them
        const result = await prisma.$transaction(async (tx) => {

            const claimedRequests =
                await tx.rescueRequest.updateManyAndReturn({
                    where: {
                        id: { in: requestIds },
                        status: "PENDING"
                    },
                    data: {
                        status: "PROCESSING"
                    }
                });

            // The triggering request must be claimed by this cycle.
            // Otherwise, rollback all changes made by this transaction.
            if (!claimedRequests.some(
                item => item.id === triggerRequestId
            )) {
                const error = new Error("Trigger request was not claimable.");
                error.code = "TRIGGER_NOT_CLAIMED";
                throw error;
            }

            // Cluster only requests successfully claimed by this cycle
            const clusters = clusterRequests(claimedRequests, 5);

            return {
                claimedRequests,
                clusters
            };
        });

        const { claimedRequests, clusters } = result;

        console.log("Trigger request:", triggerRequestId);
        console.log(
            "Claimed request IDs:",
            claimedRequests.map(item => item.id)
        );
        console.log("Clusters:", JSON.stringify(clusters, null, 2));

        return NextResponse.json({
            success: true,
            message: "Requests claimed and clustered successfully.",
            triggerRequestId,
            claimedRequestIds: claimedRequests.map(item => item.id),
            claimedCount: claimedRequests.length,
            clusters
        });

    } catch (error) {

        if (error.code === "TRIGGER_NOT_CLAIMED") {
            return NextResponse.json({
                success: true,
                message: "Trigger request was already claimed or is no longer pending.",
                claimedCount: 0,
                clusters: []
            });
        }

        console.error("Triggered requests API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to process triggered requests."
            },
            { status: 500 }
        );
    }
}
