"use client";

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';
import { CgDisplayGrid } from 'react-icons/cg';

interface BoardListProps {
    board: {
        id: string;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

const BoardList = ({ board }: BoardListProps) => {
    const pathname = usePathname();
    const boardId = pathname.split("/")[2];

    return (
        <div className={cn("flex gap-3 py-3 items-center cursor-pointer px-4 lg:px-7 mr-9 rounded-br-[25px] rounded-tr-[25px] transition", {
            "bg-purple-1 text-white hover:text-white": board.id === boardId,
            "text-dark-gray_text hover:text-purple-1": board.id !== boardId
        })}>
            <CgDisplayGrid className="w-[25px] h-[25px] object-contain" />
            <span className="font-semibold w-32 truncate">{board.name}</span>
        </div>
    );
}

export default BoardList;