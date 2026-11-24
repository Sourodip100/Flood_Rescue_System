
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { getUser } from "@/middlewares/jwtAuth";

function normalizeResources(resources) {
    if (typeof resources === "string") {
        try {
            resources = JSON.parse(resources);
        } catch {
            return [];
        }
    }

    if (!Array.isArray(resources)) return [];

    return resources.map((resource) => {
        if (typeof resource === "string") {
            return {
                name: resource,
                unit: "units",
                quantity: 0,
            };
        }

        return {
            ...resource,
            quantity: Number(resource.quantity) || 0,
        };
    });
}

export async function PATCH(request) {
    try {
        // 1. Authenticate user
        const user = getUser(request);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Verify rescuer role
        if (user.role !== "Rescuer") {
            return NextResponse.json(
                { success: false, message: "Only rescuers can update inventory" },
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

        // 3. Read request body
        const { name, action, quantity } = await request.json();

        if (
            typeof name !== "string" ||
            !name.trim() ||
            !["ADD", "USE"].includes(action) ||
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid resource name, action or quantity",
                },
                { status: 400 }
            );
        }

        const resourceName = name.trim().toUpperCase();

        // 4. Update inventory using a serializable transaction.
        // Retry if another transaction modifies the same record concurrently.
        let updatedResources;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                updatedResources = await prisma.$transaction(
                    async (tx) => {
                        const rescuer = await tx.rescuer.findUnique({
                            where: { id: rescuerId },
                            select: { resources: true },
                        });

                        if (!rescuer) {
                            throw new Error("RESCUER_NOT_FOUND");
                        }

                        const resources = normalizeResources(rescuer.resources);

                        // Find only a resource authorized for this rescuer.
                        const resourceIndex = resources.findIndex(
                            (resource) =>
                                resource.name?.toUpperCase() === resourceName
                        );

                        if (resourceIndex === -1) {
                            throw new Error("RESOURCE_NOT_ASSIGNED");
                        }

                        const currentQuantity =
                            Number(resources[resourceIndex].quantity) || 0;

                        // Prevent stock from becoming negative.
                        if (action === "USE" && quantity > currentQuantity) {
                            throw new Error("INSUFFICIENT_STOCK");
                        }

                        const newQuantity =
                            action === "ADD"
                                ? currentQuantity + quantity
                                : currentQuantity - quantity;

                        resources[resourceIndex] = {
                            ...resources[resourceIndex],
                            quantity: newQuantity,
                        };

                        await tx.rescuer.update({
                            where: { id: rescuerId },
                            data: {
                                resources: resources,
                            },
                        });

                        return resources;
                    },
                    {
                        isolationLevel:
                            Prisma.TransactionIsolationLevel.Serializable,
                    }
                );

                break;
            } catch (error) {
                // Retry serialization conflicts.
                if (error.code === "P2034" && attempt < 3) {
                    continue;
                }

                throw error;
            }
        }

        // 5. Return updated inventory
        return NextResponse.json(
            {
                success: true,
                message:
                    action === "ADD"
                        ? "Resource stock added successfully"
                        : "Resource stock deducted successfully",
                resources: updatedResources,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("RESCUER RESOURCE UPDATE ERROR:", error);

        if (error.message === "RESCUER_NOT_FOUND") {
            return NextResponse.json(
                { success: false, message: "Rescuer account not found" },
                { status: 404 }
            );
        }

        if (error.message === "RESOURCE_NOT_ASSIGNED") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This resource is not assigned to your team",
                },
                { status: 403 }
            );
        }

        if (error.message === "INSUFFICIENT_STOCK") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Insufficient stock available",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update resource inventory",
            },
            { status: 500 }
        );
    }
}
