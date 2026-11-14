import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET (request) {
    try {
        const user = getUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        if (user.role !== "Rescuer") {
            return NextResponse.json(
                { error: "Only rescuers can view their information" },
                { status: 403 }
            );
        }
        const id = user.userId;
        const rescuer = await prisma.rescuer.findUnique({
            where: {
                id: id
            }
        })
        return NextResponse.json({
            success: true,
            rescuer: rescuer
        }, {
            status: 200
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch rescuer"
        }, {
            status: 500
        })
    }
}