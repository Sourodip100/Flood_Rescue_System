import { handler } from "./index.mjs";
import prisma from "./db.mjs";

try {
    // Find an existing pending request
    const request = await prisma.rescueRequest.findFirst({
        where: {
            status: "PENDING"
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    if (!request) {
        console.log("No pending requests found.");
    } else {
        const result = await handler({
            requestId: request.id,
            source: "local-test"
        });

        console.log("Lambda result:", result);
    }

} catch (error) {
    console.error("Test failed:", error);

} finally {
    await prisma.$disconnect();
}