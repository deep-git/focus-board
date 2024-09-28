import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Protect API routes with auth function from auth file
// Wrapping function with auth(), fetch data of the user or anything else based on if the user is logged in or not
export const GET = auth(function GET(req) {
    if (req.auth) return NextResponse.json(req.auth);
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
});