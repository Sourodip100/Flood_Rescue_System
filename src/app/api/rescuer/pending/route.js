import {NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const id = 1;
        const tasks = await prisma.RescueRequest.findMany({
            where : {
                rescuerId: id,
                status: "ASSIGNED"
            },
        })
        const ongoing = await prisma.RescueRequest.findMany({
            where : {
                rescuerId: id,
                status: "IN_PROGRESS"
            },
        });
        return NextResponse.json({
            success: true,
            tasks:tasks,
            ongoing:ongoing
        },
        {
            status: 200
        })
    }
    catch (error){
        return NextResponse.json({
            success: false,
            message: "Error fetching pending tasks"
        },
        {
            status: 500
        })
    }
}

export async function PATCH(request) {
    try {
        const {id,status} = await request.json();
        const update = await prisma.RescueRequest.update({
            where: {
                id: Number(id)
            },
            data: {
                status: status
            }
        })
        return NextResponse.json({
            success: true,
            message: "Task status updated successfully"
        },
        {
            status: 200
        })
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error updating task status"
        },
        {
            status: 500
        })
    }
}

