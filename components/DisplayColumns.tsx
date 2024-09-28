"use client";

import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Pencil, Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ListTask from './ListTask';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { columnColours } from '@/constants';
import { Button } from './ui/button';

interface DisplayColumnsProps {
    column: {
        id: string;
        name: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        boardId: string;
    },
    tasks: {
        id: string;
        name: string;
        description: string;
        status: string;
        userId: string;
        boardId: string;
        columnId: string;
        createdAt: Date;
        updatedAt: Date;
    }[],
    subtasks: {
        id: string;
        name: string;
        completed: boolean;
        taskId: string;
        columnId: string;
    }[],
    columnNames: {
        id: string;
        name: string;
    }[]
}

const DisplayColumns = ({ column, tasks, subtasks, columnNames }: DisplayColumnsProps) => {
    const [hoverShow, setHoverShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [columnName, setColumnName] = useState(column.name);
    const [colorValue, setColorValue] = useState(column.color);
    const [error, setError] = useState<string | undefined>();
    const [closeDialog, setCloseDialog] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const boardId = pathname.split("/")[2];

    const handleDeleteColumn = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/board/${boardId}/column/${column.id}`, {
                method: "DELETE",
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to delete column: ${response.statusText}`);
            }

            // Refresh the router after successful deletion
            router.refresh();
        } catch (error) {
            console.error("Error deleting column:", error);
            // Optionally, you can show a user-friendly error message here
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateColumn = async () => {
        setIsLoading(true);

        if (!columnName || columnName.trim() === "" || columnName.length === 0) {
            setError("No column name entered.");
            return;
        }

        if (!colorValue || colorValue.trim() === "" || colorValue.length === 0) {
            setError("No color option selected.");
            return;
        }

        try {
            const response = await fetch(`/api/board/${boardId}/column/${column.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newName: columnName,
                    newColor: colorValue
                })
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to update column: ${response.statusText}`);
            }

            setCloseDialog(false);

            // Refresh the router after successful deletion
            router.refresh();
        } catch (error) {
            console.error("Error updating column:", error);
            // Optionally, you can show a user-friendly error message here
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            onMouseEnter={() => setHoverShow(true)}
            onMouseLeave={() => setHoverShow(false)}
            className={cn("flex w-[300px] flex-col gap-5 items-center")}
        >
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                    <div style={{ backgroundColor: column.color }} className="w-3 h-3 rounded-full" />
                    <span className="text-dark-gray_text font-semibold uppercase tracking-wide">{column.name}</span>
                </div>

                {hoverShow && (
                    <Popover>
                        <PopoverTrigger>
                            <BsThreeDots className="w-5 h-5 text-dark-gray_text hover:text-purple-1 transition" />
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col gap-3 bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background">
                            <Dialog open={closeDialog} onOpenChange={() => setCloseDialog(prev => !prev)}>
                                <DialogTrigger>
                                    <button
                                        className="flex gap-3 text-light-gray_text hover:bg-light-gray_text/10 px-2 py-2 rounded-lg cursor-pointer w-full"
                                    >
                                        <Pencil />
                                        Edit Column
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Column</DialogTitle>
                                    </DialogHeader>

                                    <div className="flex flex-col justify-center items-center gap-7 w-full">
                                        <div className="flex flex-col gap-2 w-full">
                                            <Label>Name</Label>
                                            <Input
                                                placeholder="Column name"
                                                className="bg-light-sidebar dark:bg-dark-sidebar border-light-board_background dark:border-dark-board-background text-black dark:text-white"
                                                value={columnName}
                                                onChange={(e) => setColumnName(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <Label>Colour</Label>
                                            <Select value={colorValue} onValueChange={setColorValue}>
                                                <SelectTrigger className="bg-light-board_background dark:bg-dark-board_background border-light-sidebar dark:border-dark-sidebar border-[2px]">
                                                    <SelectValue placeholder="Theme" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-light-board_background dark:bg-dark-board_background text-black dark:text-white border-none">
                                                    {columnColours.map((colour) => (
                                                        <SelectItem key={colour.label} value={colour.color}>
                                                            <div className="flex gap-3 justify-center items-center">
                                                                <div style={{ backgroundColor: colour.color }} className="w-3 h-3 rounded-full" />
                                                                {colour.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {error && <span className="text-red-600 font-normal text-sm">{error}</span>}
                                    </div>

                                    <DialogFooter className="mt-4">
                                        <DialogClose onClick={() => {
                                            setColumnName(column?.name);
                                            setColorValue(column?.color);
                                        }} asChild className="px-3 py-2 text-black hover:bg-slate-100 dark:text-white dark:hover:text-black cursor-pointer transition rounded-lg">
                                            <div>Close</div>
                                        </DialogClose>
                                        <Button disabled={columnName?.length === 0 || !columnName || columnName.trim() === ""} className="bg-purple-1 hover:bg-purple-1/90 text-white" onClick={handleUpdateColumn}>Update</Button>

                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <hr className="h-[2px] bg-light-gray_text dark:bg-light-gray_text" />

                            <button
                                disabled={isLoading}
                                onClick={handleDeleteColumn}
                                className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full"
                            >
                                <Trash />
                                <span>Delete Column</span>
                            </button>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            <div className="flex w-full flex-col gap-5">
                {tasks.map((task) => (
                    <ListTask
                        key={task.id}
                        task={task}
                        subtasks={subtasks}
                        columnNames={columnNames}
                        handleRefresh={router.refresh}
                    />
                ))}
            </div>
        </div>
    );
}

export default DisplayColumns;