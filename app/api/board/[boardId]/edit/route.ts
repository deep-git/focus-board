import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { boardId: string } }) {
    try {
        const { newName }: { newName?: string } = await req.json();

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!newName || newName.trim() === "" || newName.length === 0) {
            return new NextResponse("No board title provided", { status: 400 });
        }

        // Update the task in a single query
        const updateBoardTitle = await db.boards.update({
            where: { id: params.boardId },
            data: {
                name: newName
            }
        });

        return NextResponse.json(updateBoardTitle);

    } catch (error) {
        console.error("[BOARD_TITLE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}