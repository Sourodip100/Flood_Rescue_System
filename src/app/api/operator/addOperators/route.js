
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const body = await request.json();

        const { name, email, password, contactNumber } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Name, email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: "Password must contain at least 8 characters" },
                { status: 400 }
            );
        }

        const existingOperator = await prisma.operator.findUnique({
            where: { email },
        });

        if (existingOperator) {
            return NextResponse.json(
                { success: false, message: "An operator with this email already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const operator = await prisma.operator.create({
            data: {
                name,
                email,
                passwordHash,
                contactNumber: contactNumber || null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Operator registered successfully",
            operator,
        }, { status: 201 });

    } catch (error) {
        console.error("Operator registration error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
