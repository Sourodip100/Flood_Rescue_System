
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("Starting database seeding...");

    // 1. Create sample users
    const passwordHash = await bcrypt.hash("Rescue@123", 10);

    const citizen = await prisma.user.upsert({
        where: { email: "citizen@example.com" },
        update: {},
        create: {
            name: "Rahul Sharma",
            email: "citizen@example.com",
            passwordHash,
            phone: "9876543210",
            role: "CITIZEN"
        }
    });

    const operator = await prisma.user.upsert({
        where: { email: "operator@example.com" },
        update: {},
        create: {
            name: "Rescue Operator",
            email: "operator@example.com",
            passwordHash,
            phone: "9876543211",
            role: "OPERATOR"
        }
    });

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            name: "System Admin",
            email: "admin@example.com",
            passwordHash,
            phone: "9876543212",
            role: "ADMIN"
        }
    });

    // 2. Create a rescuer team
    let rescuer = await prisma.rescuer.findFirst({
        where: { contactNumber: "9876500001" }
    });

    if (!rescuer) {
        rescuer = await prisma.rescuer.create({
            data: {
                name: "Team Alpha",
                contactNumber: "9876500001",
                membersCount: 5,
                status: "AVAILABLE"
            }
        });
    }

    // 3. Create resources
    const resourceData = [
        {
            name: "Rescue Boat 01",
            type: "BOAT",
            quantity: 5,
            available: 5
        },
        {
            name: "Ambulance 01",
            type: "AMBULANCE",
            quantity: 3,
            available: 3
        },
        {
            name: "Medical Kit",
            type: "MEDICAL_KIT",
            quantity: 20,
            available: 20
        },
        {
            name: "Rescue Kit",
            type: "RESCUE_KIT",
            quantity: 15,
            available: 15
        }
    ];

    for (const item of resourceData) {
        const existing = await prisma.resource.findFirst({
            where: { name: item.name }
        });

        if (!existing) {
            await prisma.resource.create({
                data: item
            });
        }
    }

    // 4. Create a pending rescue request
    const pendingRequest = await prisma.rescueRequest.findFirst({
        where: {
            citizenId: citizen.id,
            description: "Flood water has entered our house."
        }
    });

    if (!pendingRequest) {
        await prisma.rescueRequest.create({
            data: {
                name: citizen.name,
                pin: "144001",
                latitude: 31.3260,
                longitude: 75.5762,
                emergencyType: ["FLOOD", "FOOD_SHORTAGE"],
                peopleAffected: 4,
                description: "Flood water has entered our house.",
                urgency: "HIGH",
                status: "PENDING",
                citizenId: citizen.id
            }
        });
    }

    // 5. Create an assigned rescue request
    let assignedRequest = await prisma.rescueRequest.findFirst({
        where: {
            citizenId: citizen.id,
            description: "Two people are stranded on the rooftop."
        }
    });

    if (!assignedRequest) {
        assignedRequest = await prisma.rescueRequest.create({
            data: {
                name: citizen.name,
                pin: "144001",
                latitude: 31.3280,
                longitude: 75.5780,
                emergencyType: ["FLOOD", "RESCUE"],
                peopleAffected: 2,
                description: "Two people are stranded on the rooftop.",
                urgency: "CRITICAL",
                status: "ASSIGNED",
                citizenId: citizen.id,
                rescuerId: rescuer.id
            }
        });
    }

    // 6. Create a deployment record
    const boat = await prisma.resource.findFirst({
        where: { name: "Rescue Boat 01" }
    });

    const existingDeployment = await prisma.deployment.findFirst({
        where: {
            requestId: assignedRequest.id,
            rescuerId: rescuer.id,
            resourceId: boat.id
        }
    });

    if (!existingDeployment && boat.available > 0) {
        await prisma.$transaction([
            prisma.deployment.create({
                data: {
                    requestId: assignedRequest.id,
                    rescuerId: rescuer.id,
                    resourceId: boat.id,
                    assignedById: operator.id,
                    quantityUsed: 1,
                    notes: "Boat assigned for rooftop rescue."
                }
            }),

            prisma.resource.update({
                where: { id: boat.id },
                data: {
                    available: { decrement: 1 },
                    status: "DEPLOYED"
                }
            })
        ]);
    }

    console.log("Database seeding completed successfully!");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
