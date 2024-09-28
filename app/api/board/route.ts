import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { boardName } = await req.json();

        const session = await auth();

        // Validate request data
        if (!boardName || typeof boardName !== 'string') {
            return new NextResponse("Invalid board name", { status: 400 });
        }

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const board = await db.boards.create({
            data: {
                name: boardName,
                userId: session?.user?.id as string
            }
        });

        return NextResponse.json(board);

    } catch (error) {
        console.error("[BOARD_CREATE_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}