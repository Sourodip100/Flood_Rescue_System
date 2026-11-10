import { NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function POST(request) {
    try {
        const body = await request.json();
        const newRequest = await prisma.rescueRequest.create({
            data: {
                name: body.name,
                pin: body.pin,
                latitude: Number(body.latitude),
                longitude: Number(body.longitude),
                emergencyType: body.emergencyType,
                peopleAffected: Number(body.peopleAffected),
                description: body.description,
                citizenId: 1
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