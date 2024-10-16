"use client";

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from 'next/link';
import { AtSign, ChevronDown, User } from 'lucide-react';
import Image from 'next/image';
import BoardList from './BoardList';
import { ScrollArea } from './ui/scroll-area';
import NewBoard from './NewBoard';
import ModeToggle from './ModeToggle';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import UserAvatar from './UserAvatar';
import Logout from './Logout';

interface Board {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface MobileSidebarProps {
    boards: Board[];
    sessionName: string | null | undefined;
    sessionEmail: string | null | undefined;
    sessionImage: string | null | undefined;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ sessionName, sessionEmail, sessionImage, boards = [] }) => {
    return (
        <Sheet>
            <SheetTrigger>
                <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 text-purple-1 lg:hidden" />
            </SheetTrigger>
            <SheetContent className="bg-light-sidebar dark:bg-dark-sidebar flex flex-col lg:hidden">
                <Link href="/dashboard" className="flex gap-3 mb-4">
                    <Image src="/logo-mobile.svg" alt="Logo" width={30} height={30} className="object-contain" />
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-black dark:text-white font-bold">FocusBoard</h1>
                </Link>

                <div className="mt-10">
                    <p className="uppercase text-dark-gray_text font-semibold px-4">
                        All boards <span>({boards?.length})</span>
                    </p>

                    <ScrollArea className="flex flex-col mt-5 gap-1 max-h-[400px] overflow-y-scroll">
                        {boards?.map(board => (
                            <Link key={board.id} href={`/dashboard/${board.id}`}>
                                <BoardList board={board} />
                            </Link>
                        ))}
                    </ScrollArea>

                    <div className="mt-3 px-4">
                        <NewBoard />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-auto px-4 h-max gap-5">
                    <div className="flex justify-between items-center w-full bg-light-board_background dark:bg-dark-board_background px-5 py-4 rounded-lg flex-wrap gap-2">
                        <div>
                            <Popover>
                                <PopoverTrigger>
                                    <UserAvatar sessionImage={sessionImage} />
                                </PopoverTrigger>

                                <PopoverContent side="top" className="flex flex-col ml-2 gap-3 w-max max-w-72">
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
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;