import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

interface SubtaskUpdate {
    id: string;
    completed: boolean;
}

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { newStatus, updatedSubtasks }: { newStatus: string; updatedSubtasks: SubtaskUpdate[] } = await req.json();

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Update the task status and column in a single query
        const taskStatusChange = await db.tasks.update({
            where: { id: params.taskId },
            data: { columnId: newStatus, status: newStatus },
        });

        // Use Promise.all for concurrent updates of subtasks
        const updatedSubtaskPromises = updatedSubtasks.map((subtask: SubtaskUpdate) => {
            return db.subtasks.update({
                where: { id: subtask.id },
                data: {
                    completed: subtask.completed,
                    columnId: newStatus,
                },
            });
        });

        await Promise.all(updatedSubtaskPromises);

        return NextResponse.json(taskStatusChange);
    } catch (error) {
        console.error("[TASK_STATUS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Use a transaction for batch deletion
        const deletedTask = await db.$transaction(async (tx) => {
            // Delete associated subtasks first
            await tx.subtasks.deleteMany({
                where: {
                    taskId: params.taskId,
                },
            });

            // Then delete the task
            return await tx.tasks.delete({
                where: {
                    id: params.taskId,
                },
            });
        });

        return NextResponse.json(deletedTask);
    } catch (error) {
        console.error("[TASK_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}