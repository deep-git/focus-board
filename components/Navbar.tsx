"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, Trash } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from './ui/dialog';
import Image from 'next/image';
import { Button } from './ui/button';
import MobileSidebar from './MobileSidebar';
import AddNewTaskContainer from './AddNewTaskContainer';
import { Input } from './ui/input';

interface NavbarProps {
    board: {
        id: string;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null,
    boards: {
        id: string;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }[] | null | undefined
    columnNames: {
        id: string;
        name: string;
    }[],
    columns: {
        id: string;
        name: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        boardId: string;
    }[],
    sessionName: string | null | undefined;
    sessionEmail: string | null | undefined;
    sessionImage: string | null | undefined
}

const Navbar = ({ sessionName, sessionEmail, sessionImage, board, boards, columnNames }: NavbarProps) => {
    const router = useRouter();
    const [closeDialog, setCloseDialog] = useState(false);
    const [closePopover, setClosePopover] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editBoardTitle, setEditBoardTitle] = useState(board?.name);

    const handleDeleteBoard = async () => {
        // Early exit if no board ID is available
        if (!board?.id) {
            console.error("No board ID available for deletion.");
            return;
        }

        try {
            const response = await fetch(`/api/board/${board.id}/delete`, {
                method: "DELETE",
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete board: ${errorMessage}`);
            }

            // Close the dialog after successful deletion
            setCloseDialog(false);

            // Update routing based on remaining boards
            if (boards?.length) {
                const newBoardId = boards.length > 1 ? boards[0]?.id : null;
                router.push(newBoardId ? `/dashboard/${newBoardId}` : "/dashboard");
            }

            // Refresh the router to update state
            router.refresh();
        } catch (error) {
            console.error("Error deleting board:", error);
            // Optionally set an error state to inform the user
        }
    };

    const handleUpdateBoardTitle = async () => {
        // Early exit if no board ID is available
        if (!board?.id) {
            console.error("No board ID available for deletion.");
            return;
        }

        if (!editBoardTitle || editBoardTitle.trim() === "") {
            console.error("No board name provided.");
            return;
        }

        try {
            const response = await fetch(`/api/board/${board.id}/edit`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newName: editBoardTitle
                })
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update board title: ${errorMessage}`);
            }

            // Close the dialog after successful deletion
            setCloseDialog(false);
            setIsDialogOpen(false);

            // Refresh the router to update state
            router.refresh();
        } catch (error) {
            console.error("Error updating board title:", error);
            // Optionally set an error state to inform the user
        }
    }

    return (
        <div className="sticky top-0 right-0 flex w-full flex-wrap items-center h-[100px] px-4 md:px-7 bg-light-navbar dark:bg-dark-navbar text-card">
            <div className="flex gap-3 lg:gap-0 justify-center items-center">
                <Image src="/logo-mobile.svg" alt="Mobile logo" width={30} height={30} className="object-contain lg:hidden" />
                <div className="flex gap-3 justify-center items-center">
                    <h2 className="text-light-text dark:text-dark-text text-lg sm:text-xl lg:text-3xl truncate max-w-24 sm:max-w-72 md:max-w-[400px] lg:max-w-[400px] xl:max-w-[600px] 2xl:max-w-[800px] font-semibold">{board?.name}</h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger>
                            <Pencil className="w-5 h-5 text-light-gray_text dark:text-light-gray_text hover:text-purple-1 dark:hover:text-purple-1 transition duration-75" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit board name</DialogTitle>
                            </DialogHeader>

                            <div className="mt-4">
                                <Input value={editBoardTitle} onChange={(e) => setEditBoardTitle(e.target.value)} />
                            </div>

                            <DialogFooter className="mt-4">
                                <DialogClose onClick={() => setEditBoardTitle(board?.name)} asChild className="px-3 py-2 text-black hover:bg-slate-100 dark:text-white dark:hover:text-black cursor-pointer transition rounded-lg">
                                    <div>Close</div>
                                </DialogClose>
                                <Button disabled={editBoardTitle?.length === 0 || !editBoardTitle || editBoardTitle.trim() === ""} className="bg-purple-1 hover:bg-purple-1/90 text-white" onClick={handleUpdateBoardTitle}>Update</Button>

                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
                <MobileSidebar boards={boards || []} sessionName={sessionName} sessionEmail={sessionEmail} sessionImage={sessionImage} />
            </div>

            <div className="flex justify-center items-center gap-2 md:gap-5 w-max ml-auto">
                <Dialog open={closeDialog} onOpenChange={() => setCloseDialog(prev => !prev)}>
                    <DialogTrigger>
                        <div className="flex gap-1 bg-purple-1 hover:bg-purple-1/70 text-white rounded-[25px] md:rounded-lg px-5 py-2 md:px-3 md:py-3 font-bold md:font-normal shadow-md">
                            + <span className="hidden md:flex">Add New Task</span>
                        </div>
                    </DialogTrigger>
                    <AddNewTaskContainer
                        columnNames={columnNames}
                        handleCloseDialog={() => setCloseDialog(false)}
                    />
                </Dialog>

                <Popover>
                    <PopoverTrigger>
                        <BsThreeDotsVertical className="w-6 h-6 hover:text-purple-1 text-light-gray_text dark:text-white" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-light-board_background dark:bg-dark-board_background border-[1px] border-light-board_background dark:border-dark-board_background shadow-lg">
                        <Dialog open={closePopover} onOpenChange={() => setClosePopover(prev => !prev)}>
                            <DialogTrigger className="w-full">
                                <div className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full">
                                    <Trash />
                                    <span>Delete Board</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Board</DialogTitle>
                                    <DialogDescription>Are you sure you would like to delete this board? This action cannot be undone.</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild className="px-3 py-2 text-black hover:bg-slate-100 dark:text-white dark:hover:text-black cursor-pointer transition rounded-lg">
                                        <div>Close</div>
                                    </DialogClose>
                                    <Button className="bg-red-600 hover:bg-red-600/90 text-white" onClick={handleDeleteBoard}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

export default Navbar;
