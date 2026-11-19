import { NextResponse } from "next/server";
import { getUser } from "@/middlewares/jwtAuth";
export function GET(request) {
    const res = NextResponse.json({message: "Logout successful"});
    res.cookies.delete("token");
    return res;
}