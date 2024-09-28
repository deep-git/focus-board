import { auth } from '@/auth';
import MobileSidebar from '@/components/MobileSidebar';
import { db } from '@/db';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { BsChevronDoubleLeft } from 'react-icons/bs';

const Dashboard = async () => {

    const session = await auth();

    if (!session?.user) {
        redirect("/");
        return null;
    }

    const boards = await db.boards.findMany({
        where: {
            userId: session.user.id
        },
    });

    return (
        <div>
            <div className="flex lg:hidden items-center px-10 gap-3 w-full h-[100px] bg-light-sidebar dark:bg-dark-sidebar flex-wrap">
                <Image src="/logo-mobile.svg" alt="Logo" width={30} height={30} className="object-contain" />
                <h1 className="text-2xl md:text-3xl text-light-text dark:text-dark-text font-bold">FocusBoard</h1>

                <div className="ml-auto">
                    <MobileSidebar sessionName={session?.user?.name} sessionEmail={session?.user?.email} sessionImage={session?.user?.image} boards={boards || []} />
                </div>
            </div>
            <div className="relative flex flex-col gap-10 justify-center items-center h-[calc(100vh-100px)] md:h-screen bg-light-board_background dark:bg-dark-board_background">
                <div className="absolute flex -left-32 z-0">
                    <BsChevronDoubleLeft className="w-[600px] h-[600px] text-light-sidebar dark:text-dark-sidebar z-0" />
                </div>
                <Image src="/welcome.svg" alt="Welcome" width={500} height={500} className="z-10" />
                <h2 className="flex text-2xl md:text-3xl lg:text-5xl text-purple-1 gap-2 items-center z-10 text-center">
                    Create your own board!
                </h2>
            </div>
        </div>
    );
};

export default Dashboard;