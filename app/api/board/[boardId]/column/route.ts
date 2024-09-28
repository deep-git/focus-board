import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { boardId: string } }) {
    try {
        // Parse the request body
        const { name, color } = await req.json();

        // Validate input
        if (!name || !color) {
            return new NextResponse("Name and color are required.", { status: 400 });
        }

        // Get the current user profile
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Create a new column in the database
        const column = await db.columns.create({
            data: {
                name,
                color,
                boardId: params.boardId,
                userId: session?.user?.id,
            },
        });

        return NextResponse.json(column);
    } catch (error) {
        console.error("[COLUMN_CREATE_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}