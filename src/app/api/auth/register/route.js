import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import {setUser, getUser} from "@/middlewares/jwtAuth";

export async function POST(request) {
    try {
        const {name, phone, email, password} = await request.json();
        const check = await prisma.user.findUnique({
            where: {email:email} || {phone:phone}
        })
        if (check) {
            return NextResponse.json({error: "User already exists. Please login to your account or use a different email or phone number to create a new account."}, {status: 409});
        }
        const user = await prisma.user.create({
            data: {
                name:name, phone:phone, email:email, passwordHash: await bcrypt.hash(password, 10)
            }
        });
        if (!user){
            return NextResponse.json({error: "Could not Register User"}, {status: 404});
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid){
            return NextResponse.json({error: "Password is invalid"}, {status: 401});
        }

        
        const res = NextResponse.json({message: "Register successful"});
        setUser(user.id, res);
        return res;
    }
    catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

