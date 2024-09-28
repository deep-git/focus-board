import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { newTitle, newDescription }: { newTitle?: string; newDescription?: string } = await req.json();

        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Prepare data for the update, excluding empty fields
        const dataToUpdate: { name?: string; description?: string } = {};
        if (newTitle !== undefined && newTitle !== "") {
            dataToUpdate.name = newTitle;
        }
        if (newDescription !== undefined && newDescription !== "") {
            dataToUpdate.description = newDescription;
        }

        // Proceed only if there is something to update
        if (Object.keys(dataToUpdate).length === 0) {
            return new NextResponse("No fields to update", { status: 400 });
        }

        // Update the task in a single query
        const taskContentChange = await db.tasks.update({
            where: { id: params.taskId },
            data: dataToUpdate
        });

        return NextResponse.json(taskContentChange);

    } catch (error) {
        console.error("[TASK_CONTENT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}