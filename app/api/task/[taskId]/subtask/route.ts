import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { subtasks, status }: {
            subtasks: {
                taskName: string; // Only need taskName for creation
                completed: boolean;
            }[];
            status: string; // Assuming status is related to the column
        } = await req.json();

        // Validate input
        if (!Array.isArray(subtasks) || subtasks.length === 0) {
            return new NextResponse("Subtasks array is required", { status: 400 });
        }

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id; // Extract the userId

        // Ensure userId is defined
        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Create subtasks in parallel
        const subtaskPromises = subtasks.map(subtask => {
            return db.subtasks.create({
                data: {
                    name: subtask.taskName,
                    completed: subtask.completed,
                    taskId: params.taskId,
                    columnId: status,
                },
            });
        });

        // Await all subtask creations
        const createdSubtasks = await Promise.all(subtaskPromises);

        return NextResponse.json(createdSubtasks);
    } catch (error) {
        console.error("[SUBTASK_CREATE_POST]", error); // Log the error for debugging
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}