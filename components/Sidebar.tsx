import React from 'react';
import { redirect } from 'next/navigation';
import HideSidebar from './HideSidebar';
import { auth } from '@/auth';
import { db } from '@/db';

const Sidebar = async () => {

    const session = await auth();

    if (!session?.user) {
        redirect("/");
        return null;
    }

    const boards = await db.boards.findMany({
        where: {
            userId: session?.user?.id
        },
    });

    // Fetch boards or whatever is needed here
    return <HideSidebar sessionName={session?.user?.name} sessionEmail={session?.user?.email} sessionImage={session?.user.image} boards={boards || []} />; // Placeholder for boards
};

export default Sidebar;