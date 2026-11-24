// import {NextResponse} from "next/server";
// import prisma from "@/lib/db";
// import {getUser} from "@/middlewares/jwtAuth";

// export async function GET(request) {
//     try {
//         const user = getUser(request);
//         if (!user) {
//             return NextResponse.json(
//                 { error: "Unauthorized" },
//                 { status: 401 }
//             );
//         }
//         if (user.role !== "Rescuer") {
//             return NextResponse.json(
//                 { error: "Only rescuers can view pending tasks" },
//                 { status: 403 }
//             );
//         }
//         const id = user.userId;
//         const tasks = await prisma.RescueRequest.findMany({
//             where : {
//                 rescuerId: id,
//                 status: "ASSIGNED"
//             },
//         })
//         const ongoing = await prisma.RescueRequest.findMany({
//             where : {
//                 rescuerId: id,
//                 status: "IN_PROGRESS"
//             },
//         });
//         return NextResponse.json({
//             success: true,
//             tasks:tasks,
//             ongoing:ongoing
//         },
//         {
//             status: 200
//         })
//     }
//     catch (error){
//         return NextResponse.json({
//             success: false,
//             message: "Error fetching pending tasks"
//         },
//         {
//             status: 500
//         })
//     }
// }

// export async function PATCH(request) {
//     try {
//         const user = getUser(request);
//         if (!user) {
//             return NextResponse.json(
//                 { error: "Unauthorized" },
//                 { status: 401 }
//             );
//         }
//         if (user.role !== "Rescuer") {
//             return NextResponse.json(
//                 { error: "Only rescuers can view pending tasks" },
//                 { status: 403 }
//             );
//         }
//         const {id,status} = await request.json();
//         const update = await prisma.RescueRequest.update({
//             where: {
//                 id: Number(id)
//             },
//             data: {
//                 status: status
//             }
//         })
//         return NextResponse.json({
//             success: true,
//             message: "Task status updated successfully"
//         },
//         {
//             status: 200
//         })
//     }
//     catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: "Error updating task status"
//         },
//         {
//             status: 500
//         })
//     }
// }







import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/middlewares/jwtAuth";

// GET: Fetch assigned and ongoing rescue operations
export async function GET(request) {
    try {
        const user = getUser(request);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (user.role !== "Rescuer") {
            return NextResponse.json(
                { success: false, message: "Only rescuers can view tasks" },
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

        const [tasks, ongoing] = await Promise.all([
            prisma.rescueRequest.findMany({
                where: {
                    rescuerId,
                    status: "ASSIGNED"
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),

            prisma.rescueRequest.findMany({
                where: {
                    rescuerId,
                    status: "IN_PROGRESS"
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            tasks,
            ongoing
        });
    } catch (error) {
        console.error("FETCH RESCUER TASKS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error fetching rescue tasks"
            },
            { status: 500 }
        );
    }
}


// PATCH: Update rescue operation status
export async function PATCH(request) {
    try {
        const user = getUser(request);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (user.role !== "Rescuer") {
            return NextResponse.json(
                { success: false, message: "Only rescuers can update tasks" },
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

        const body = await request.json();
        const requestId = Number(body.id);
        const newStatus = body.status;

        if (!Number.isInteger(requestId) || requestId <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid rescue request ID" },
                { status: 400 }
            );
        }

        const validTransitions = {
            ASSIGNED: "IN_PROGRESS",
            IN_PROGRESS: "RESCUED"
        };

        if (!["IN_PROGRESS", "RESCUED"].includes(newStatus)) {
            return NextResponse.json(
                { success: false, message: "Invalid status" },
                { status: 400 }
            );
        }

        // Find a request assigned to this rescuer
        const rescueRequest = await prisma.rescueRequest.findFirst({
            where: {
                id: requestId,
                rescuerId
            },
            select: {
                id: true,
                status: true
            }
        });

        if (!rescueRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Rescue request not found or not assigned to you"
                },
                { status: 404 }
            );
        }

        // Check the allowed status transition
        if (validTransitions[rescueRequest.status] !== newStatus) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Cannot change status from ${rescueRequest.status} to ${newStatus}`
                },
                { status: 400 }
            );
        }

        // Conditional update prevents overwriting a concurrent status change
        const update = await prisma.rescueRequest.updateMany({
            where: {
                id: requestId,
                rescuerId,
                status: rescueRequest.status
            },
            data: {
                status: newStatus
            }
        });

        if (update.count === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task status changed already. Please refresh."
                },
                { status: 409 }
            );
        }

        return NextResponse.json({
            success: true,
            message: newStatus === "IN_PROGRESS"
                ? "Rescue operation started successfully"
                : "Rescue operation completed successfully"
        });

    } catch (error) {
        console.error("UPDATE RESCUE TASK ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error updating rescue task"
            },
            { status: 500 }
        );
    }
}
