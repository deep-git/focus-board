"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CgDisplayGrid } from 'react-icons/cg';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const NewBoard = () => {
    const [boardName, setBoardName] = useState("");
    const [error, setError] = useState<string | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateBoard = async () => {
        setIsLoading(true);
        setError(undefined);

        if (!boardName.trim()) {
            setError("Board name cannot be left empty.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/board", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Fix the header key
                },
                body: JSON.stringify({ boardName }) // Wrap boardName in an object
            });

            // Check if the response is OK (status 200-299)
            if (!response.ok) {
                const errorMessage = await response.text(); // Get error message from response
                throw new Error(errorMessage);
            }

            setBoardName("");
            setIsDialogOpen(false);
            router.refresh(); // Optionally refetch the boards
        } catch (error) {
            console.error("Error creating board:", error);
            setError("Failed to create board. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <div className="flex gap-3 items-center cursor-pointer">
                    <CgDisplayGrid className="w-[25px] h-[25px] text-purple-1 object-contain" />
                    <span className="text-purple-1 font-semibold">+ Create New Board</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Board</DialogTitle>
                    <DialogDescription>
                        Enter a name for your board
                    </DialogDescription>
                    <div className="pt-3">
                        <Input
                            placeholder="Board name"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                        />
                        {error && (
                            <span className="text-red-600 font-normal text-sm">{error}</span>
                        )}
                    </div>
                    <DialogFooter className="mt-5 pt-5">
                        <DialogClose asChild>
                            <Button variant="ghost">Close</Button>
                        </DialogClose>
                        <Button disabled={isLoading} onClick={handleCreateBoard}>
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default NewBoard;