import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { boardId: string; columnId: string } }) {
    try {
        const session = await auth();

        // Check if the user is authenticated
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Delete the column if it exists and belongs to the current user
        const column = await db.columns.deleteMany({
            where: {
                id: params.columnId,
                boardId: params.boardId,
                userId: session?.user?.id,
            },
        });

        // Check if a column was deleted
        if (!column.count) {
            return new NextResponse("Column not found or you do not have permission to delete it", { status: 404 });
        }

        return NextResponse.json({ message: "Column deleted successfully" });

    } catch (error) {
        console.error("[COLUMN_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { boardId: string, columnId: string } }) {
    try {
        const { newName, newColor }: { newName?: string; newColor?: string } = await req.json();

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!newName || newName.trim() === "" || newName.length === 0) {
            return new NextResponse("No board title provided", { status: 400 });
        }

        if (!newColor || newColor.trim() === "" || newColor.length === 0) {
            return new NextResponse("No board title provided", { status: 400 });
        }

        // Update the task in a single query
        const updateColumnContent = await db.columns.update({
            where: {
                id: params.columnId,
                boardId: params.boardId
            },
            data: {
                name: newName,
                color: newColor
            }
        });

        return NextResponse.json(updateColumnContent);

    } catch (error) {
        console.error("[COLUMN_UPDATE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}