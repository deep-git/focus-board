import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { columnId }: { columnId: string } = await req.json();

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Update the task's columnId
        const updatedTask = await db.tasks.update({
            where: {
                id: params.taskId,
            },
            data: {
                columnId,
            },
        });

        // Update all subtasks associated with the task
        await db.subtasks.updateMany({
            where: {
                taskId: params.taskId,
            },
            data: {
                columnId, // Set the new columnId for each subtask
            },
        });

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error("[TASK_STATUS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}