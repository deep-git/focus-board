import { auth } from '@/auth'
import BoardContent from '@/components/BoardContent';
import Navbar from '@/components/Navbar';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import React from 'react'

const BoardIdPage = async ({ params }: { params: { boardId: string } }) => {

    const session = await auth();

    if (!session?.user) {
        redirect("/");
        return null;
    }

    // Fetch boards, the specific board, and its columns in a single query
    const [boards, board, columns] = await Promise.all([
        db.boards.findMany({ where: { userId: session?.user?.id } }),
        db.boards.findUnique({
            where: {
                id: params.boardId,
                userId: session?.user?.id,
            },
        }),
        db.columns.findMany({
            where: {
                boardId: params.boardId,
                userId: session?.user?.id,
            },
        }),
    ]);

    if (!board || !columns) {
        return null; // Handle the case where board or columns are not found
    }

    const columnNames = columns.map(({ id, name }) => ({ id, name }));

    return (
        <div className="relative flex flex-col w-full min-h-screen">
            <Navbar sessionName={session?.user?.name} sessionEmail={session?.user?.email} sessionImage={session?.user?.image} board={board} boards={boards} columnNames={columnNames} columns={columns} />

            <div className="absolute bottom-0 left-0 right-0 w-full">
                <BoardContent board={board} columns={columns} />
            </div>
        </div>
    )
}

export default BoardIdPage