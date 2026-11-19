
import prisma from "./db.mjs";

// Waiting duration for each urgency level (milliseconds)
const WAIT_DURATION = {
    CRITICAL: 5 * 1000,
    HIGH: 2 * 60 * 1000,
    MEDIUM: 10 * 60 * 1000,
    LOW: 30 * 60 * 1000
};

// Higher number means higher urgency
const URGENCY_RANK = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4
};

// Your Next.js API endpoint
const SERVER_API_URL = process.env.SERVER_API_URL;

// Secret shared between Lambda and Next.js
const DISPATCH_SECRET = process.env.DISPATCH_SECRET;


// Calculate how long a request has been waiting
function getElapsedTime(createdAt, currentTime) {
    return currentTime - new Date(createdAt).getTime();
}


// Check whether a request has reached 85% of its waiting period
function hasReachedEarlyEligibility(request, currentTime) {
    const waitTime = WAIT_DURATION[request.urgency];

    const elapsedTime = getElapsedTime(
        request.createdAt,
        currentTime
    );

    return elapsedTime >= waitTime * 0.85;
}


// Check whether the triggering request has completed its full waiting period
function hasReachedDispatchTime(request, currentTime) {
    const waitTime = WAIT_DURATION[request.urgency];

    const elapsedTime = getElapsedTime(
        request.createdAt,
        currentTime
    );

    return elapsedTime >= waitTime;
}


// Fetch requests eligible to join this dispatch cycle
async function getEligibleRequests(triggerRequest, currentTime) {

    const pendingRequests = await prisma.rescueRequest.findMany({
        where: {
            status: "PENDING"
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    const triggerRank = URGENCY_RANK[triggerRequest.urgency];

    return pendingRequests.filter((request) => {

        const requestRank = URGENCY_RANK[request.urgency];

        // Equal or higher urgency can join regardless of waiting progress
        if (requestRank >= triggerRank) {
            return true;
        }

        // Lower urgency can join only after reaching 85%
        return hasReachedEarlyEligibility(request, currentTime);
    });
}


// Send eligible requests to the Next.js server
async function sendRequestsToServer(triggerRequest, eligibleRequests) {

    if (!SERVER_API_URL) {
        throw new Error("SERVER_API_URL environment variable is missing.");
    }

    if (!DISPATCH_SECRET) {
        throw new Error("DISPATCH_SECRET environment variable is missing.");
    }

    const payload = {
        triggerRequestId: triggerRequest.id,
        triggerUrgency: triggerRequest.urgency,
        triggeredAt: new Date().toISOString(),

        requests: eligibleRequests
    };

    const response = await fetch(
        `${SERVER_API_URL.replace(/\/$/, "")}/api/triggered/requests`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DISPATCH_SECRET}`
            },

            body: JSON.stringify(payload)
        }
    );

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            `Next.js server returned ${response.status}: ${JSON.stringify(responseData)}`
        );
    }

    console.log("Next.js server response:", responseData);

    return responseData;
}


// Main Lambda handler
export const handler = async (event) => {

    console.log("Dispatch Lambda triggered");
    console.log("Received event:", JSON.stringify(event));

    try {

        // 1. Validate request ID
        const requestId = Number(event.requestId);

        if (!Number.isInteger(requestId) || requestId <= 0) {
            throw new Error("A valid requestId is required.");
        }

        const currentTime = Date.now();

        // 2. Fetch the triggering request
        const triggerRequest = await prisma.rescueRequest.findUnique({
            where: {
                id: requestId
            }
        });

        // 3. Check whether the request is still pending
        if (!triggerRequest || triggerRequest.status !== "PENDING") {

            return {
                success: true,
                message: "Trigger request is no longer pending. No dispatch needed."
            };
        }

        // 4. Verify that the triggering request reached 100% of its wait
        if (!hasReachedDispatchTime(triggerRequest, currentTime)) {

            return {
                success: true,
                message: "Trigger request has not reached its dispatch time yet."
            };
        }

        // 5. Fetch eligible pending requests
        const eligibleRequests = await getEligibleRequests(
            triggerRequest,
            currentTime
        );

        console.log(
            "Eligible request IDs:",
            eligibleRequests.map(request => request.id)
        );

        // 6. Send requests to the Next.js backend
        const serverResponse = await sendRequestsToServer(
            triggerRequest,
            eligibleRequests
        );

        // 7. Return execution result
        return {
            success: true,
            triggerRequestId: triggerRequest.id,
            eligibleRequestIds: eligibleRequests.map(request => request.id),
            eligibleCount: eligibleRequests.length,
            serverResponse
        };

    } catch (error) {

        console.error("Dispatch Lambda error:", error);

        throw error;
    }
};
