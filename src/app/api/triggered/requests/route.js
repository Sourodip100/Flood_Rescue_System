
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







// import { NextResponse } from "next/server";
// import { timingSafeEqual } from "crypto";
// import prisma from "@/lib/db";

// export const runtime = "nodejs";

// function verifySecret(request) {
//     const authorization = request.headers.get("authorization");
//     const expectedSecret = process.env.DISPATCH_SECRET;

//     if (!authorization?.startsWith("Bearer ") || !expectedSecret) {
//         return false;
//     }

//     const receivedSecret = authorization.slice(7);

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

//     const toRadians = degrees => degrees * (Math.PI / 180);

//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) ** 2;

//     return EARTH_RADIUS * 2 *
//         Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }


// // Cluster requests within a 5 km radius
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
//             cluster.reduce((sum, r) => sum + r.latitude, 0) /
//             cluster.length,

//         centerLongitude:
//             cluster.reduce((sum, r) => sum + r.longitude, 0) /
//             cluster.length
//     }));
// }


// // Receive eligible requests from AWS Lambda
// export async function POST(request) {
//     try {
//         // 1. Authenticate Lambda
//         if (!verifySecret(request)) {
//             return NextResponse.json(
//                 { success: false, message: "Unauthorized." },
//                 { status: 401 }
//             );
//         }

//         // 2. Validate payload
//         const body = await request.json();

//         const triggerRequestId = Number(body.triggerRequestId);

//         if (
//             !Number.isInteger(triggerRequestId) ||
//             triggerRequestId <= 0 ||
//             !Array.isArray(body.requests) ||
//             body.requests.length === 0
//         ) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid payload." },
//                 { status: 400 }
//             );
//         }

//         const requestIds = [
//             ...new Set(body.requests.map(item => Number(item.id)))
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

//         // 3. Atomically claim requests and cluster them
//         const result = await prisma.$transaction(async (tx) => {

//             const claimedRequests =
//                 await tx.rescueRequest.updateManyAndReturn({
//                     where: {
//                         id: { in: requestIds },
//                         status: "PENDING"
//                     },
//                     data: {
//                         status: "PROCESSING"
//                     }
//                 });

//             // The triggering request must be claimed by this cycle.
//             // Otherwise, rollback all changes made by this transaction.
//             if (!claimedRequests.some(
//                 item => item.id === triggerRequestId
//             )) {
//                 const error = new Error("Trigger request was not claimable.");
//                 error.code = "TRIGGER_NOT_CLAIMED";
//                 throw error;
//             }

//             // Cluster only requests successfully claimed by this cycle
//             const clusters = clusterRequests(claimedRequests, 5);

//             return {
//                 claimedRequests,
//                 clusters
//             };
//         });

//         const { claimedRequests, clusters } = result;

//         console.log("Trigger request:", triggerRequestId);
//         console.log(
//             "Claimed request IDs:",
//             claimedRequests.map(item => item.id)
//         );
//         console.log("Clusters:", JSON.stringify(clusters, null, 2));

//         return NextResponse.json({
//             success: true,
//             message: "Requests claimed and clustered successfully.",
//             triggerRequestId,
//             claimedRequestIds: claimedRequests.map(item => item.id),
//             claimedCount: claimedRequests.length,
//             clusters
//         });

//     } catch (error) {

//         if (error.code === "TRIGGER_NOT_CLAIMED") {
//             return NextResponse.json({
//                 success: true,
//                 message: "Trigger request was already claimed or is no longer pending.",
//                 claimedCount: 0,
//                 clusters: []
//             });
//         }

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

// --------------------------------------------------
// 1. AUTHENTICATION
// --------------------------------------------------

function verifySecret(request) {
    const authorization = request.headers.get("authorization");
    const expectedSecret = process.env.DISPATCH_SECRET;

    if (!authorization?.startsWith("Bearer ") || !expectedSecret) {
        return false;
    }

    const receivedBuffer = Buffer.from(authorization.slice(7));
    const expectedBuffer = Buffer.from(expectedSecret);

    if (receivedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(receivedBuffer, expectedBuffer);
}


// --------------------------------------------------
// 2. DISTANCE CALCULATION
// --------------------------------------------------

function calculateDistance(lat1, lon1, lat2, lon2) {
    const EARTH_RADIUS = 6371;

    const toRadians = degrees => degrees * Math.PI / 180;

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


// --------------------------------------------------
// 3. CLUSTER REQUESTS WITHIN 5 KM
// --------------------------------------------------

function clusterRequests(requests, radiusKm = 5) {
    const remainingRequests = [...requests];
    const clusters = [];

    while (remainingRequests.length > 0) {
        const anchor = remainingRequests.shift();
        const cluster = [anchor];

        for (let i = remainingRequests.length - 1; i >= 0; i--) {
            const current = remainingRequests[i];

            const distance = calculateDistance(
                anchor.latitude,
                anchor.longitude,
                current.latitude,
                current.longitude
            );

            if (distance <= radiusKm) {
                cluster.push(current);
                remainingRequests.splice(i, 1);
            }
        }

        clusters.push(cluster);
    }

    return clusters.map((requests, index) => ({
        clusterId: index + 1,

        requests,

        requestIds: requests.map(request => request.id),

        requestCount: requests.length,

        centerLatitude:
            requests.reduce((sum, r) => sum + r.latitude, 0) /
            requests.length,

        centerLongitude:
            requests.reduce((sum, r) => sum + r.longitude, 0) /
            requests.length
    }));
}


// --------------------------------------------------
// 4. RESOURCE NAME NORMALIZATION
// --------------------------------------------------

function normalizeResourceName(name) {
    const normalized = String(name ?? "")
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

    const aliases = {
        FOOD: "FOOD_SUPPLY",
        WATER: "WATER_SUPPLY",
        DRINKING_WATER: "WATER_SUPPLY",
        FIRST_AID_KIT: "RESCUE_KIT"
    };

    return aliases[normalized] || normalized;
}


// --------------------------------------------------
// 5. CALCULATE REQUIREMENTS FOR A CLUSTER
// --------------------------------------------------

function calculateRequirements(requests) {
    const requirements = {
        boatCapacity: 0,
        resources: {}
    };

    function addResource(name, quantity) {
        requirements.resources[name] =
            (requirements.resources[name] || 0) + quantity;
    }

    for (const request of requests) {
        const types = request.emergencyType.map(type =>
            String(type).trim().toUpperCase().replace(/[\s-]+/g, "_")
        );

        const people = Math.max(0, request.peopleAffected);

        // Evacuation / water rescue
        if (types.includes("EVACUATION") || types.includes("RESCUE")) {
            requirements.boatCapacity += people;
            addResource("LIFE_JACKET", people);
        }

        // Food
        if (types.includes("FOOD")) {
            addResource("FOOD_SUPPLY", people);
        }

        // Drinking water
        if (
            types.includes("DRINKING_WATER") ||
            types.includes("WATER")
        ) {
            addResource("WATER_SUPPLY", people);
        }

        // Medical assistance
        if (
            types.includes("MEDICAL_ASSISTANCE") ||
            types.includes("MEDICAL")
        ) {
            addResource("MEDICAL_KIT", 1);
        }

        // First aid
        if (types.includes("FIRST_AID")) {
            addResource("RESCUE_KIT", 1);
        }

        // Shelter
        if (types.includes("SHELTER")) {
            addResource("BLANKET", people);
        }

        // Clothing
        if (types.includes("CLOTHING")) {
            addResource("CLOTHING", people);
        }

        // Baby supplies
        if (types.includes("BABY_SUPPLIES")) {
            addResource("BABY_SUPPLIES", 1);
        }

        // Hygiene
        if (types.includes("HYGIENE")) {
            addResource("SANITARY_KIT", people);
        }
    }

    return requirements;
}


// --------------------------------------------------
// 6. CHECK RESCUER CAPACITY AND INVENTORY
// --------------------------------------------------

function canHandleCluster(rescuer, requirements) {
    // Check boat capacity
    if (rescuer.boatCapacity < requirements.boatCapacity) {
        return false;
    }

    // Rescuer resources must be a JSON array
    const inventory = Array.isArray(rescuer.resources)
        ? rescuer.resources
        : [];

    const availableResources = {};

    for (const item of inventory) {
        const name = normalizeResourceName(item.name);
        const quantity = Number(item.quantity);

        if (!name || !Number.isFinite(quantity) || quantity < 0) {
            continue;
        }

        availableResources[name] =
            (availableResources[name] || 0) + quantity;
    }

    // Check every required resource
    for (const [name, requiredQuantity] of Object.entries(
        requirements.resources
    )) {
        if ((availableResources[name] || 0) < requiredQuantity) {
            return false;
        }
    }

    return true;
}


// --------------------------------------------------
// 7. SELECT NEAREST SUITABLE RESCUER
// --------------------------------------------------

function selectRescuer(rescuers, cluster, requirements, usedRescuerIds) {
    const candidates = rescuers
        .filter(rescuer =>
            !usedRescuerIds.has(rescuer.id) &&
            rescuer.latitude !== null &&
            rescuer.longitude !== null &&
            canHandleCluster(rescuer, requirements)
        )
        .map(rescuer => ({
            rescuer,

            distance: calculateDistance(
                rescuer.latitude,
                rescuer.longitude,
                cluster.centerLatitude,
                cluster.centerLongitude
            )
        }))
        .sort((a, b) => a.distance - b.distance);

    return candidates[0] || null;
}


// --------------------------------------------------
// 8. MAIN DISPATCH API
// --------------------------------------------------

export async function POST(request) {
    try {
        // Authenticate Lambda
        if (!verifySecret(request)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized." },
                { status: 401 }
            );
        }

        // Validate payload
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

        // --------------------------------------------------
        // ALL DATABASE OPERATIONS IN ONE TRANSACTION
        // --------------------------------------------------

        const result = await prisma.$transaction(async tx => {

            // STEP 1: Atomically claim pending requests

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

            // Trigger request must belong to this dispatch cycle

            if (!claimedRequests.some(
                item => item.id === triggerRequestId
            )) {
                const error = new Error("Trigger not claimable.");
                error.code = "TRIGGER_NOT_CLAIMED";
                throw error;
            }

            // STEP 2: Cluster claimed requests

            const clusters = clusterRequests(claimedRequests, 5);

            // STEP 3: Fetch available rescuers

            const availableRescuers = await tx.rescuer.findMany({
                where: {
                    status: "AVAILABLE"
                }
            });

            const usedRescuerIds = new Set();

            const deploymentResults = [];
            const unassignedClusters = [];

            // STEP 4: Process each cluster

            for (const cluster of clusters) {

                // Calculate combined requirements

                const requirements = calculateRequirements(
                    cluster.requests
                );

                // Find nearest team satisfying all requirements

                const selected = selectRescuer(
                    availableRescuers,
                    cluster,
                    requirements,
                    usedRescuerIds
                );

                // No suitable team available

                if (!selected) {
                    await tx.rescueRequest.updateMany({
                        where: {
                            id: { in: cluster.requestIds },
                            status: "PROCESSING"
                        },

                        data: {
                            status: "PENDING"
                        }
                    });

                    unassignedClusters.push({
                        clusterId: cluster.clusterId,
                        requestIds: cluster.requestIds,
                        reason: "No available rescuer has sufficient capacity and resources."
                    });

                    continue;
                }

                const rescuer = selected.rescuer;

                // STEP 5: Atomically reserve the rescuer

                const claimedTeam = await tx.rescuer.updateMany({
                    where: {
                        id: rescuer.id,
                        status: "AVAILABLE"
                    },

                    data: {
                        status: "DEPLOYED"
                    }
                });

                // Another concurrent dispatch may have claimed this team

                if (claimedTeam.count !== 1) {
                    unassignedClusters.push({
                        clusterId: cluster.clusterId,
                        requestIds: cluster.requestIds,
                        reason: "Selected rescuer is no longer available."
                    });

                    await tx.rescueRequest.updateMany({
                        where: {
                            id: { in: cluster.requestIds },
                            status: "PROCESSING"
                        },

                        data: {
                            status: "PENDING"
                        }
                    });

                    continue;
                }

                usedRescuerIds.add(rescuer.id);

                // STEP 6: Assign requests to the rescuer

                await tx.rescueRequest.updateMany({
                    where: {
                        id: { in: cluster.requestIds },
                        status: "PROCESSING"
                    },

                    data: {
                        status: "ASSIGNED",
                        rescuerId: rescuer.id
                    }
                });

                // STEP 7: Create one deployment per request

                await tx.deployment.createMany({
                    data: cluster.requestIds.map(requestId => ({
                        requestId,
                        rescuerId: rescuer.id,
                        resourcesUsed: [],
                        notes: `Automatically assigned to cluster ${cluster.clusterId}.`
                    }))
                });

                deploymentResults.push({
                    clusterId: cluster.clusterId,
                    requestIds: cluster.requestIds,
                    rescuerId: rescuer.id,
                    rescuerName: rescuer.name,
                    distanceKm: Number(selected.distance.toFixed(2)),
                    requirements
                });
            }

            return {
                claimedRequestIds: claimedRequests.map(item => item.id),
                clusters: clusters.map(cluster => ({
                    clusterId: cluster.clusterId,
                    requestIds: cluster.requestIds,
                    requestCount: cluster.requestCount,
                    centerLatitude: cluster.centerLatitude,
                    centerLongitude: cluster.centerLongitude
                })),
                deployments: deploymentResults,
                unassignedClusters
            };
        });

        // --------------------------------------------------
        // 9. RESPONSE
        // --------------------------------------------------

        console.log(
            "Dispatch result:",
            JSON.stringify(result, null, 2)
        );

        return NextResponse.json({
            success: true,
            message: "Dispatch processing completed.",
            triggerRequestId,

            claimedRequestIds: result.claimedRequestIds,
            claimedCount: result.claimedRequestIds.length,

            clusters: result.clusters,

            assignedClusters: result.deployments,
            unassignedClusters: result.unassignedClusters
        });

    } catch (error) {

        if (error.code === "TRIGGER_NOT_CLAIMED") {
            return NextResponse.json({
                success: true,
                message: "Trigger request was already claimed or is no longer pending.",
                claimedCount: 0,
                clusters: [],
                assignedClusters: [],
                unassignedClusters: []
            });
        }

        console.error("Dispatch API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to process dispatch requests."
            },
            { status: 500 }
        );
    }
}
