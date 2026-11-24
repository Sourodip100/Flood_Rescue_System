
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/middlewares/jwtAuth";

export async function PATCH(request) {
    try {
        // Verify logged-in user
        const user = getUser(request);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (user.role !== "Rescuer") {
            return NextResponse.json(
                { success: false, message: "Only rescuers can update their location" },
                { status: 403 }
            );
        }

        const rescuerId = Number(user.userId);

        if (!Number.isInteger(rescuerId) || rescuerId <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid rescuer account" },
                { status: 401 }
            );
        }

        // Get coordinates from browser
        const { latitude, longitude } = await request.json();

        // Validate coordinates
        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid GPS coordinates" },
                { status: 400 }
            );
        }

        // Update only the logged-in rescuer
        const result = await prisma.rescuer.updateMany({
            where: {
                id: rescuerId
            },
            data: {
                latitude,
                longitude
            }
        });

        if (result.count === 0) {
            return NextResponse.json(
                { success: false, message: "Rescuer account not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Location updated successfully"
        });

    } catch (error) {
        console.error("GPS LOCATION UPDATE ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update location"
            },
            { status: 500 }
        );
    }
}
