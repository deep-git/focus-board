import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { boardId: string } }) {
    // Authenticate the user
    const session = await auth();

    // Check if the user is authenticated
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Attempt to delete the board with the given boardId for the authenticated user
        const board = await db.boards.delete({
            where: {
                id: params.boardId,
                userId: session.user.id, // Directly access user id since session is validated
            },
        });

        // Return the deleted board details if successful
        return NextResponse.json(board);
    } catch (error) {
        console.error("[BOARD_DELETE]", error);

        // Fallback for unexpected errors
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}