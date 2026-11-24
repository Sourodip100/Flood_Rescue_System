
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [
      resources,
      totalRequests,
      activeRequests,
      successfulRescues,
      totalOperators,
      totalRescuers,
      totalCitizens,
      recentRescues,
    ] = await Promise.all([
      prisma.resource.findMany({
        orderBy: {
          name: "asc",
        },
      }),

      prisma.rescueRequest.count(),

      prisma.rescueRequest.count({
        where: {
          status: {
            in: ["PENDING", "PROCESSING", "ASSIGNED", "IN_PROGRESS"],
          },
        },
      }),

      prisma.rescueRequest.count({
        where: {
          status: "RESCUED",
        },
      }),

      prisma.operator.count(),

      prisma.rescuer.count(),

      prisma.user.count(),

      prisma.rescueRequest.findMany({
        where: {
          status: "RESCUED",
        },
        include: {
          citizen: {
            select: {
              name: true,
            },
          },
          rescuer: {
            select: {
              name: true,
            },
          },
          deployments: {
            select: {
              deployedAt: true,
              completedAt: true,
            },
            orderBy: {
              deployedAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      }),
    ]);

    const totalResourceQuantity = resources.reduce(
      (sum, resource) => sum + resource.quantity,
      0
    );

    const availableResourceQuantity = resources.reduce(
      (sum, resource) => sum + resource.available,
      0
    );

    const remainingPercentage =
      totalResourceQuantity > 0
        ? Math.round(
            (availableResourceQuantity / totalResourceQuantity) * 100
          )
        : 0;

    const resourceData = resources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      total: resource.quantity,
      available: resource.available,
      remainingPercentage:
        resource.quantity > 0
          ? Math.round((resource.available / resource.quantity) * 100)
          : 0,
      status: resource.status,
    }));

    return NextResponse.json({
      success: true,

      overview: {
        totalResources: totalResourceQuantity,
        availableResources: availableResourceQuantity,
        remainingPercentage,
        totalRequests,
        activeRequests,
        successfulRescues,
        totalOperators,
        totalRescuers,
        totalCitizens,
      },

      resources: resourceData,

      recentRescues: recentRescues.map((request) => ({
        id: request.id,
        citizen: request.citizen.name,
        rescuer: request.rescuer?.name || "Not assigned",
        emergencyType: request.emergencyType,
        peopleAffected: request.peopleAffected,
        completedAt:
          request.deployments[0]?.completedAt || request.updatedAt,
        status: request.status,
      })),
    });
  } catch (error) {
    console.error("Operator dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch operator dashboard data",
      },
      { status: 500 }
    );
  }
}
