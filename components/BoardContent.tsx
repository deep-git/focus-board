import React from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { auth } from '@/auth';
import { db } from '@/db';
import DisplayColumns from './DisplayColumns';
import NewColumn from './NewColumn';

interface BoardContentProps {
    board: {
        id: string;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    };
    columns: {
        id: string;
        name: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        boardId: string;
    }[];
}

const BoardContent = async ({ board, columns }: BoardContentProps) => {
    const session = await auth();

    if (!session?.user || !board) {
        return null;
    }

    // Fetch all tasks for the board and profile in one go
    const tasks = await db.tasks.findMany({
        where: {
            userId: session?.user?.id,
            boardId: board.id,
        },
    });

    // Fetch subtasks based on tasks' column IDs
    const subtasks = await db.subtasks.findMany({
        where: {
            columnId: { in: columns.map(col => col.id) },
        },
    });

    // Prepare column names
    const columnNames = columns.map(({ id, name }) => ({ id, name }));

    // Map tasks and subtasks to columns
    const columnData = columns.map(column => {
        const columnTasks = tasks.filter(task => task.columnId === column.id);
        const columnSubtasks = subtasks.filter(subtask => subtask.columnId === column.id);

        // Ensure all dates are strings
        return {
            column: {
                ...column,
            },
            tasks: columnTasks.map(task => ({
                ...task,
                //createdAt: task.createdAt.toISOString(),
                //updatedAt: task.updatedAt.toISOString(),
            })),
            subtasks: columnSubtasks.map(subtask => ({
                ...subtask,
                // Add any necessary conversions here if needed
            })),
        };
    });

    return (
        <ScrollArea className="w-full">
            <div className="flex gap-10 p-5 bg-light-board_background dark:bg-dark-board_background text-card min-h-[calc(100vh-100px)]">
                {columnData.map(({ column, tasks, subtasks }) => (
                    <DisplayColumns key={column.id} column={column} tasks={tasks} subtasks={subtasks} columnNames={columnNames} />
                ))}
                <NewColumn board={board} />
            </div>
            <ScrollBar orientation="horizontal" className="mb-5" />
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    );
};

export default BoardContent;