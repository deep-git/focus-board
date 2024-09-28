import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { taskId: string, subtaskId: string } }) {
    try {
        const { completed }: { completed: boolean } = await req.json(); // Expect a boolean for completion status

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Update the subtask with the new completion status
        const updatedSubtask = await db.subtasks.update({
            where: {
                id: params.subtaskId,
                taskId: params.taskId // Ensure that we only update if the subtask belongs to the task
            },
            data: {
                completed: completed
            }
        });

        return NextResponse.json(updatedSubtask);

    } catch (error) {
        console.error("[SUBTASK_STATUS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { taskId: string, subtaskId: string } }) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const deletedSubtask = await db.subtasks.delete({
            where: {
                id: params.subtaskId,
                taskId: params.taskId
            }
        });

        // Check if any subtask was deleted
        if (!deletedSubtask) {
            return NextResponse.json({ message: "Subtask not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Subtask deleted successfully", subtask: deletedSubtask });
    } catch (error) {
        console.error("[SUBTASK_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}