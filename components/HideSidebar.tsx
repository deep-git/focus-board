"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiShow } from 'react-icons/bi';
import { ScrollArea } from './ui/scroll-area';
import ModeToggle from './ModeToggle';
import BoardList from './BoardList';
import NewBoard from './NewBoard';
import Logout from './Logout';
import UserAvatar from './UserAvatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AtSign, User } from 'lucide-react';

interface Board {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface HideSidebarProps {
    boards: Board[];
    sessionName: string | null | undefined;
    sessionEmail: string | null | undefined;
    sessionImage: string | null | undefined;
}

const HideSidebar: React.FC<HideSidebarProps> = ({ sessionName, sessionEmail, sessionImage, boards = [] }) => {
    const [hideSidebar, setHideSidebar] = useState(false);

    return (
        <>
            <div className={cn("sticky hidden lg:flex left-0 top-0 w-[300px] h-screen bg-light-sidebar dark:bg-dark-sidebar py-7 flex-col z-10", { "lg:hidden": hideSidebar })}>
                <Link href="/dashboard" className="flex gap-3 px-7">
                    <Image src="/logo-mobile.svg" alt="Logo" width={30} height={30} className="object-contain" />
                    <h1 className="text-3xl text-black dark:text-white font-bold">FocusBoard</h1>
                </Link>

                <div className="mt-10">
                    <p className="uppercase text-dark-gray_text font-semibold px-7">All boards <span>({boards.length})</span></p>
                    <ScrollArea className="board_list max-h-[400px] overflow-y-scroll mt-5">
                        {boards.map(board => (
                            <Link key={board.id} href={`/dashboard/${board.id}`}>
                                <BoardList board={board} />
                            </Link>
                        ))}
                    </ScrollArea>
                    <div className="mt-3 px-7">
                        <NewBoard />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-auto px-7 h-max gap-5">
                    <div className="flex justify-between items-center w-full bg-light-board_background dark:bg-dark-board_background px-5 py-4 rounded-lg">
                        <div>
                            <Popover>
                                <PopoverTrigger>
                                    <UserAvatar sessionImage={sessionImage} />
                                </PopoverTrigger>

                                <PopoverContent side="right" className="flex flex-col ml-2 gap-3 w-max max-w-72">
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5" />
                                        <span className="truncate">{sessionName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-light-gray_text dark:text-dark-gray_text">
                                        <AtSign className="w-5 h-5" />
                                        <span className="truncate">{sessionEmail}</span>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Logout />
                    </div>

                    <ModeToggle />

                    <div className="flex gap-3 cursor-pointer" onClick={() => setHideSidebar(true)}>
                        <Image src="/icon-hide-sidebar.svg" alt="Hide" width={20} height={20} className="object-contain" />
                        <span className="text-dark-gray_text">Hide Sidebar</span>
                    </div>
                </div>
            </div>

            <div className={cn("fixed hidden lg:flex bottom-[20px] left-[20px] w-10 h-10 z-50", { "lg:hidden": !hideSidebar })}>
                <div className="flex justify-center items-center bg-light-sidebar dark:bg-dark-sidebar w-10 h-10 rounded-full shadow-md" onClick={() => setHideSidebar(false)}>
                    <BiShow className="w-5 h-5 object-contain cursor-pointer text-dark-gray_text hover:text-purple-1 transition" />
                </div>
            </div>
        </>
    );
}

export default HideSidebar
