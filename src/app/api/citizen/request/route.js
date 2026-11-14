import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {setUser, getUser} from "@/middlewares/jwtAuth";

export async function POST(request) {
    try {
        const body = await request.json();
        const user = getUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        if (user.role !== "Citizen") {
            return NextResponse.json(
                { error: "Only citizens can create rescue requests" },
                { status: 403 }
            );
        }
        const newRequest = await prisma.rescueRequest.create({
            data: {
                name: body.name,
                pin: body.pin,
                latitude: Number(body.latitude),
                longitude: Number(body.longitude),
                emergencyType: body.emergencyType,
                peopleAffected: Number(body.peopleAffected),
                description: body.description,
                citizenId: user.userId
            }
        });
        return NextResponse.json({
            success: true,
            message: "Request created successfully",
        },{
            status: 201
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Failed to create request"
        }, {
            status: 500
        });
    }
}