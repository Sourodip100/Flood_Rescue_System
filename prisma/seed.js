const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("Starting database seeding...");

    // Hash demo account passwords
    const citizenPassword = await bcrypt.hash("Citizen@123", 10);
    const rescuerPassword = await bcrypt.hash("Rescuer@123", 10);
    const operatorPassword = await bcrypt.hash("Operator@123", 10);

    // 1. Create Citizen
    const citizen = await prisma.user.upsert({
        where: { email: "citizen@gmail.com" },
        update: {},
        create: {
            name: "Rahul Sharma",
            email: "citizen@gmail.com",
            passwordHash: citizenPassword,
            phone: "9876543210",
        },
    });

    // 2. Create Operator
    const operator = await prisma.operator.upsert({
        where: { email: "operator@gmail.com" },
        update: {},
        create: {
            name: "Admin Operator",
            email: "operator@gmail.com",
            passwordHash: operatorPassword,
            contactNumber: "9876543211",
        },
    });

    // 3. Create Rescuer
    const rescuer = await prisma.rescuer.upsert({
        where: { email: "rescuer@gmail.com" },
        update: {},
        create: {
            name: "Rescue Team Alpha",
            email: "rescuer@gmail.com",
            passwordHash: rescuerPassword,
            contactNumber: "9876543212",
            membersCount: 5,
            latitude: 31.2520,
            longitude: 75.7050,
            status: "AVAILABLE",
        },
    });

    // 4. Create Resources
    const resourceCount = await prisma.resource.count();

    if (resourceCount === 0) {
        await prisma.resource.createMany({
            data: [
                {
                    name: "Rescue Boat Alpha",
                    type: "BOAT",
                    quantity: 5,
                    available: 5,
                    status: "AVAILABLE",
                },
                {
                    name: "Emergency Ambulance",
                    type: "AMBULANCE",
                    quantity: 3,
                    available: 3,
                    status: "AVAILABLE",
                },
                {
                    name: "Rescue Kits",
                    type: "RESCUE_KIT",
                    quantity: 50,
                    available: 50,
                    status: "AVAILABLE",
                },
                {
                    name: "Food Supply Packages",
                    type: "FOOD_SUPPLY",
                    quantity: 100,
                    available: 100,
                    status: "AVAILABLE",
                },
                {
                    name: "Medical Kits",
                    type: "MEDICAL_KIT",
                    quantity: 30,
                    available: 30,
                    status: "AVAILABLE",
                },
            ],
        });
    }

    // 5. Create sample Rescue Requests
    const request1 = await prisma.rescueRequest.findFirst({
        where: {
            citizenId: citizen.id,
            description: "Water has entered our house. We need immediate rescue.",
        },
    });

    if (!request1) {
        await prisma.rescueRequest.create({
            data: {
                name: "Rahul Sharma",
                pin: "144001",
                latitude: 31.3260,
                longitude: 75.5762,
                emergencyType: ["FLOOD", "MEDICAL"],
                peopleAffected: 4,
                description: "Water has entered our house. We need immediate rescue.",
                status: "PENDING",
                urgency: "CRITICAL",
                citizenId: citizen.id,
            },
        });
    }

    const request2 = await prisma.rescueRequest.findFirst({
        where: {
            citizenId: citizen.id,
            description: "Our family is stranded on the first floor.",
        },
    });

    if (!request2) {
        await prisma.rescueRequest.create({
            data: {
                name: "Rahul Sharma",
                pin: "144002",
                latitude: 31.3300,
                longitude: 75.5800,
                emergencyType: ["FLOOD"],
                peopleAffected: 3,
                description: "Our family is stranded on the first floor.",
                status: "PENDING",
                urgency: "HIGH",
                citizenId: citizen.id,
            },
        });
    }

    console.log("Database seeding completed successfully!");
    console.log("Created/verified:");
    console.log("- Citizen:", citizen.email);
    console.log("- Operator:", operator.email);
    console.log("- Rescuer:", rescuer.email);
    console.log("- Resources and sample rescue requests");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
