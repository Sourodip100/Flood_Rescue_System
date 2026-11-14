import {NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
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
                { error: "Only rescuers can view pending tasks" },
                { status: 403 }
            );
        }
        const id = user.userId;
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
        const user = getUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        if (user.role !== "Rescuer") {
            return NextResponse.json(
                { error: "Only rescuers can view pending tasks" },
                { status: 403 }
            );
        }
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

