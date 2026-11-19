// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import {setUser, getUser} from "@/middlewares/jwtAuth";

// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const user = getUser(request);
//         if (!user) {
//             return NextResponse.json(
//                 { error: "Unauthorized" },
//                 { status: 401 }
//             );
//         }

//         function calculateUrgency(emergencyTypes) {
//             const highEmergencies = ["Medical Emergency","Oxygen Assistance","Snake Or Poison","Flood Rescue","Boat Rescue","Missing Person"];
//             const mediumEmergencies = ["Food","Shelter Assistance","Drinking Water Assistance","Baby & Child Assistance","Sanitation & Hygiene Assistance","Emergency Evacuation"];
//             const lowEmergencies = ["Clothing & Blanket Assistance","Electricity & Lighting Assistance","Fuel Assistance","Other"];

//             const criticalCount = emergencyTypes.filter(type => highEmergencies.includes(type)).length;

//             if (criticalCount >= 2) {
//                 return "CRITICAL";
//             }

//             if (criticalCount === 1) {
//                 return "HIGH";
//             }

//             if (emergencyTypes.some(type => mediumEmergencies.includes(type))) {
//                 return "MEDIUM";
//             }
//             if(emergencyTypes.length > 0 && emergencyTypes.every(type => lowEmergencies.includes(type))){
//                 return "LOW";
//             }
//             return "MEDIUM";
//         }

//         const newRequest = await prisma.rescueRequest.create({
//             data: {
//                 name: body.name,
//                 pin: body.pin,
//                 phone: user.phone,
//                 latitude: Number(body.latitude),
//                 longitude: Number(body.longitude),
//                 emergencyType: body.emergencyType,
//                 peopleAffected: Number(body.peopleAffected),
//                 description: body.description,
//                 urgency: calculateUrgency(body.emergencyType),
//                 citizenId: user.userId
//             }
//         });
//         return NextResponse.json({
//             success: true,
//             message: "Request created successfully",
//         },{
//             status: 201
//         })
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({
//             success: false,
//             message: "Failed to create request"
//         }, {
//             status: 500
//         });
//     }
// }












import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/middlewares/jwtAuth";
import {
    SFNClient,
    StartExecutionCommand
} from "@aws-sdk/client-sfn";

// AWS Step Functions client
const sfnClient = new SFNClient({
    region: process.env.AWS_REGION
});

// State machine ARN
const stateMachineArn = process.env.AWS_STATE_MACHINE_ARN;

// Waiting duration based on urgency
function getWaitSeconds(urgency) {
    const waitTimes = {
        CRITICAL: 5,
        HIGH: 120,
        MEDIUM: 600,
        LOW: 1800
    };

    return waitTimes[urgency];
}

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

        function calculateUrgency(emergencyTypes) {
            const highEmergencies = [
                "Medical Emergency",
                "Oxygen Assistance",
                "Snake Or Poison",
                "Flood Rescue",
                "Boat Rescue",
                "Missing Person"
            ];

            const mediumEmergencies = [
                "Food",
                "Shelter Assistance",
                "Drinking Water Assistance",
                "Baby & Child Assistance",
                "Sanitation & Hygiene Assistance",
                "Emergency Evacuation"
            ];

            const lowEmergencies = [
                "Clothing & Blanket Assistance",
                "Electricity & Lighting Assistance",
                "Fuel Assistance",
                "Other"
            ];

            const criticalCount = emergencyTypes.filter(
                type => highEmergencies.includes(type)
            ).length;

            if (criticalCount >= 2) return "CRITICAL";
            if (criticalCount === 1) return "HIGH";

            if (
                emergencyTypes.some(type =>
                    mediumEmergencies.includes(type)
                )
            ) {
                return "MEDIUM";
            }

            if (
                emergencyTypes.length > 0 &&
                emergencyTypes.every(type =>
                    lowEmergencies.includes(type)
                )
            ) {
                return "LOW";
            }

            return "MEDIUM";
        }

        // 1. Create rescue request in Neon
        const newRequest = await prisma.rescueRequest.create({
            data: {
                name: body.name,
                pin: body.pin,
                phone: user.phone,
                latitude: Number(body.latitude),
                longitude: Number(body.longitude),
                emergencyType: body.emergencyType,
                peopleAffected: Number(body.peopleAffected),
                description: body.description,
                urgency: calculateUrgency(body.emergencyType),
                citizenId: user.userId
            }
        });

        // 2. Calculate waiting time
        const waitSeconds = getWaitSeconds(newRequest.urgency);

        // 3. Start AWS Step Functions execution
        try {
            if (!stateMachineArn) {
                throw new Error("AWS_STATE_MACHINE_ARN is not configured");
            }

            const command = new StartExecutionCommand({
                stateMachineArn,
                input: JSON.stringify({
                    requestId: newRequest.id,
                    waitSeconds
                })
            });

            const execution = await sfnClient.send(command);

            console.log("Step Functions execution started:", {
                requestId: newRequest.id,
                urgency: newRequest.urgency,
                waitSeconds,
                executionArn: execution.executionArn
            });

            return NextResponse.json({
                success: true,
                message: "Request created and dispatch workflow started.",
                requestId: newRequest.id,
                urgency: newRequest.urgency,
                waitSeconds,
                dispatchScheduled: true
            }, {
                status: 201
            });

        } catch (awsError) {
            console.error(
                "Failed to start Step Functions:",
                awsError
            );

            // Request is already saved in the database.
            return NextResponse.json({
                success: true,
                message: "Request saved, but dispatch scheduling failed.",
                requestId: newRequest.id,
                dispatchScheduled: false
            }, {
                status: 201
            });
        }

    } catch (error) {
        console.error("Rescue request creation failed:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to create request"
        }, {
            status: 500
        });
    }
}
