
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/middlewares/jwtAuth";

// GET: Fetch requests belonging to the logged-in citizen
export async function GET(request) {
    try {
        const user = getUser(request);

        if (!user || user.role !== "Citizen") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const requests = await prisma.rescueRequest.findMany({
            where: {
                citizenId: user.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                rescuer: {
                    select: {
                        id: true,
                        name: true,
                        contactNumber: true,
                        latitude: true,
                        longitude: true,
                        status: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                message: "Requests fetched successfully",
                requests,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("CITIZEN REQUEST FETCH ERROR:", error);

        return NextResponse.json(
            { error: "Unable to fetch requests" },
            { status: 500 }
        );
    }
}


// PATCH: Cancel a pending request
export async function PATCH(request) {
    try {
        const user = getUser(request);

        if (!user || user.role !== "Citizen") {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const requestId = Number(body.requestId);

        if (!Number.isSafeInteger(requestId) || requestId <= 0) {
            return NextResponse.json(
                { error: "Invalid request ID" },
                { status: 400 }
            );
        }

        // Only the owner can cancel their own PENDING request.
        const result = await prisma.rescueRequest.updateMany({
            where: {
                id: requestId,
                citizenId: user.userId,
                status: "PENDING",
            },
            data: {
                status: "CANCELLED",
            },
        });

        if (result.count === 0) {
            const existingRequest = await prisma.rescueRequest.findFirst({
                where: {
                    id: requestId,
                    citizenId: user.userId,
                },
                select: {
                    status: true,
                },
            });

            if (!existingRequest) {
                return NextResponse.json(
                    { error: "Request not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    error: `This request cannot be cancelled because its current status is ${existingRequest.status}.`,
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Request cancelled successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("CITIZEN REQUEST CANCEL ERROR:", error);

        return NextResponse.json(
            { error: "Unable to cancel request" },
            { status: 500 }
        );
    }
}
