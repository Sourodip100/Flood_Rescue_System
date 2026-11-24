
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            name,
            email,
            password,
            contactNumber,
            membersCount,
            boatCapacity = 0,
            resources = [],
        } = body;

        if (!name || !email || !password || !contactNumber) {
            return NextResponse.json(
                { success: false, message: "Please provide all required team information" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: "Password must contain at least 8 characters" },
                { status: 400 }
            );
        }

        if (!Number.isInteger(membersCount) || membersCount < 1) {
            return NextResponse.json(
                { success: false, message: "Members count must be at least 1" },
                { status: 400 }
            );
        }

        if (!Number.isInteger(boatCapacity) || boatCapacity < 0) {
            return NextResponse.json(
                { success: false, message: "Invalid boat capacity" },
                { status: 400 }
            );
        }

        // Resource name and measurement unit mapping
        const resourceUnits = {
            BOAT: "boats",
            AMBULANCE: "vehicles",
            RESCUE_KIT: "kits",
            FOOD_SUPPLY: "packets",
            MEDICAL_KIT: "kits",
            WATER_SUPPLY: "bottles",
            LIFE_JACKET: "pieces",
            BLANKET: "pieces",
            CLOTHING: "sets",
            RESCUE_ROPE: "ropes",
            OXYGEN_CYLINDER: "cylinders",
            BABY_SUPPLIES: "kits",
            SANITARY_KIT: "kits",
            FLASHLIGHT: "pieces",
            BATTERY: "pieces",
            FUEL: "litres",
        };

        const validResources = Object.keys(resourceUnits);

        if (
            !Array.isArray(resources) ||
            !resources.every((item) => validResources.includes(item)) ||
            new Set(resources).size !== resources.length
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid resource selection" },
                { status: 400 }
            );
        }

        // Convert selected resources into structured JSON objects.
        // Initial quantity of every resource is zero.
        const structuredResources = resources.map((resource) => ({
            name: resource,
            unit: resourceUnits[resource],
            quantity: 0,
        }));

        const existingRescuer = await prisma.rescuer.findUnique({
            where: { email },
        });

        if (existingRescuer) {
            return NextResponse.json(
                { success: false, message: "A rescue team with this email already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const rescuer = await prisma.rescuer.create({
            data: {
                name,
                email,
                passwordHash,
                contactNumber,
                membersCount,
                boatCapacity,
                resources: structuredResources,
                status: "AVAILABLE",
            },
            select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
                membersCount: true,
                boatCapacity: true,
                resources: true,
                status: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Rescue team registered successfully",
            rescuer,
        }, { status: 201 });

    } catch (error) {
        console.error("Rescuer registration error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
