
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const body = await request.json();

        const { name, email, password, phone } = body;

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

        const existingCitizen = await prisma.user.findUnique({
            where: { email },
        });

        if (existingCitizen) {
            return NextResponse.json(
                { success: false, message: "A citizen with this email already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const citizen = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                phone: phone || null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Citizen registered successfully",
            citizen,
        }, { status: 201 });

    } catch (error) {
        console.error("Citizen registration error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
