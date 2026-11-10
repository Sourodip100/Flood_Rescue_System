import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { signJWT } from "jose";
import bcrypt from "bcryptjs"; 

export default async function POST(request) {
    try {

        const {email, password} = await request.json();
        
        const user = await prisma.user.findUnique({
            where: {email:email}
        });
        if (!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid){
            return NextResponse.json({error: "Invalid password"}, {status: 401});
        }

        const token = await new signJWT({userId: user.id, role: user.role}).setProtectedHeader({alg: "HS256"}).setExpirationTime("1h").sign(new TextEncoder().encode(process.env.JWT_SECRET));

        const res = NextResponse.json({message: "Login successful"});
        res.cookies.set("token", token, {httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/"});
        return res;
    }
    catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

