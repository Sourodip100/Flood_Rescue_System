import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import {setUser, getUser} from "@/middlewares/jwtAuth";

export async function POST(request) {
    try {
        const {email, password, role} = await request.json();
        let user = null;
        if (role === "Citizen"){
            user = await prisma.user.findUnique({
                where: {email:email}
            });
        }
        else if (role === "Rescuer") {
            user = await prisma.rescuer.findUnique({
                where: {email:email}
            });
        } 
        else if (role === "Operator") {
            user = await prisma.operator.findUnique({
                where: {email:email}
            });
        }
        else {
            return NextResponse.json({error: "Unauthorized role"}, {status: 404});
        }
        if (!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid){
            return NextResponse.json({error: "Invalid password"}, {status: 401});
        }

        
        const res = NextResponse.json({message: "Login successful"});
        setUser(user.id, role, res);
        return res;
    }
    catch (error) {
        return NextResponse.json({error: error + "Internal server error"}, {status: 500});
    }
}

