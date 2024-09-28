import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { boardId: string } }) {
    try {
        const { title, description, subtasks, status }: {
            title: string;
            description: string;
            subtasks: {
                id: string;
                taskName: string;
                completed: boolean;
            }[];
            status: string;
        } = await req.json();

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id; // Extract the userId

        // Ensure userId is defined
        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Create the task
        const task = await db.tasks.create({
            data: {
                name: title,
                description,
                status,
                userId,
                boardId: params.boardId,
                columnId: status, // Assuming status maps to columnId
            },
        });

        // Prepare subtask creation in bulk
        const subtasksData = subtasks.map((subtask) => ({
            name: subtask.taskName,
            completed: subtask.completed,
            taskId: task.id,
            columnId: status,
        }));

        // Create subtasks in parallel
        await Promise.all(
            subtasksData.map((subtaskData) =>
                db.subtasks.create({ data: subtaskData })
            )
        );

        return NextResponse.json(task);
    } catch (error) {
        console.error("[TASK_CREATE_POST]", error); // Use console.error for error logging
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}