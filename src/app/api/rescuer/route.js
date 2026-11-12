import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET (){
    try {
        const id = 1;
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