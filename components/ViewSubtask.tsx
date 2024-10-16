import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Spinner from './Spinner/Spinner';

interface ViewSubtaskProps {
    task: {
        id: string;
        name: string;
        description: string;
        status: string;
        userId: string;
        boardId: string;
        columnId: string;
        createdAt: Date;
        updatedAt: Date;
    },
    subtask: {
        id: string;
        name: string;
        completed: boolean;
        taskId: string;
    },
    handleUpdateSubtasks: (subtaskId: string, completed: boolean) => void,
    handleRemoveSubtask: (subtaskId: string) => void,
}

const ViewSubtask = ({ task, subtask, handleUpdateSubtasks, handleRemoveSubtask }: ViewSubtaskProps) => {
    const [changeStatus, setChangeStatus] = useState(subtask.completed);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateComplete = async () => {
        setIsLoading(true);
        const updatedStatus = !changeStatus; // Toggle the current status
        setChangeStatus(updatedStatus); // Optimistically update UI

        try {
            const response = await fetch(`/api/task/${task.id}/subtask/${subtask.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: updatedStatus }) // Send the updated status directly
            });

            if (!response.ok) {
                throw new Error('Failed to update subtask');
            }

            // Call the handler function to update the parent state
            handleUpdateSubtasks(subtask.id, updatedStatus);
        } catch (error) {
            console.error("[SUBTASK_UPDATE_ERROR]", error);
            // Roll back optimistic UI update if needed
            setChangeStatus(!updatedStatus); // Reset to previous state if error occurs
            alert("An error occurred while updating the subtask.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteSubtask = async (subtaskId: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/task/${task.id}/subtask/${subtaskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error('Failed to delete subtask');
            }

            // Call the handler function to update the parent state
            handleRemoveSubtask(subtaskId);
        } catch (error) {
            console.error("[SUBTASK_DELETE_ERROR]", error);
            alert("An error occurred while deleting the subtask. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-light-board_background dark:bg-dark-board_background rounded-lg">
            <Checkbox
                checked={changeStatus}
                onCheckedChange={handleUpdateComplete} // Call the function directly
                className="bg-light-sidebar dark:bg-dark-sidebar checked:bg-purple-1"
                disabled={isLoading} // Disable while loading
            />
            <span className={cn("", {
                "line-through text-dark-gray_text": changeStatus,
            })}>{subtask.name}</span>
            {isLoading ? (
                <div className="ml-auto p-1 rounded-full">
                    <Spinner size={20} color="rgb(100,95,198)" />
                </div>
            ) : (
                <div onClick={() => handleDeleteSubtask(subtask.id)} className="ml-auto p-1 rounded-full hover:bg-light-gray_text/20 dark:hover:bg-dark-gray_text/20 transition duration-75">
                    <X className="w-4 h-4 text-light-gray_text dark:text-dark-gray_text" />
                </div>
            )}
        </div>
    )
}

export default ViewSubtask;