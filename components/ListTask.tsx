"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import ViewSubtask from './ViewSubtask';
import { v4 as uuidv4 } from "uuid";
import { Input } from './ui/input';

interface ListTaskProps {
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
    subtasks: {
        id: string;
        name: string;
        completed: boolean;
        taskId: string;
    }[],
    columnNames: {
        id: string;
        name: string;
    }[],
    handleRefresh: () => void
}

interface Subtask {
    id: string;
    name: string;
    completed: boolean;
    taskId: string
}

const ListTask = ({ task, subtasks, columnNames, handleRefresh }: ListTaskProps) => {
    const [viewSubtasks, setViewSubtasks] = useState(subtasks);
    const [addSubtask, setAddSubtask] = useState<{ id: string; taskName: string; completed: boolean; }[]>([]);
    const [addToColumn, setAddToColumn] = useState<string | undefined>(task.status);
    const [closeDialog, setCloseDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const endRef = useRef<HTMLDivElement | null>(null);
    const [addSubtaskMode, setAddSubtaskMode] = useState(false);
    const [editTitle, setEditTitle] = useState(task.name);
    const [editTitleMode, setEditTitleMode] = useState(false);

    const [editDescription, setEditDescription] = useState(task.description);
    const [editDescriptionMode, setEditDescriptionMode] = useState(false);

    useEffect(() => {
        // Filter subtasks related to the current task
        setViewSubtasks(subtasks.filter(subtask => subtask.taskId === task.id));
    }, [subtasks, task.id]);

    const handleChangeStatus = (value: string) => {
        setAddToColumn(value);
    };

    const handleSaveTask = async () => {
        setIsLoading(true);
        setError(undefined); // Clear any previous errors

        try {
            const response = await fetch(`/api/task/${task.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newStatus: addToColumn,
                    updatedSubtasks: viewSubtasks,
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to save task: ${response.statusText}`);
            }

            // Optionally, you can await the refresh if it's an async function
            await handleRefresh(); // Refresh the task list
        } catch (error) {
            console.error("Error saving task:", error);
            // Optionally, you can set an error message to be displayed to the user
            setError("Failed to save task. Please try again.");
        } finally {
            setIsLoading(false);
            setCloseDialog(false);
        }
    };

    const handleUpdateSubtasks = (subtaskId: string, completed: boolean) => {
        setViewSubtasks(prevSubtasks =>
            prevSubtasks.map(subtask => subtask.id === subtaskId ? { ...subtask, completed } : subtask)
        );
    };

    const handleRemoveSubtask = (subtaskId: string) => {
        setViewSubtasks(prevSubtasks =>
            prevSubtasks.filter(subtask => subtask.id !== subtaskId)
        );
    }

    const handleAddSubtaskArray = (newSubtask: Subtask) => {
        setViewSubtasks((prevSubtasks) => [...prevSubtasks,
        {
            id: newSubtask.id,
            name: newSubtask.name,
            completed: newSubtask.completed,
            taskId: newSubtask.taskId
        }
        ]);
    };

    const handleDeleteTask = async () => {
        setIsLoading(true);
        setError(undefined); // Clear any previous errors

        try {
            const response = await fetch(`/api/task/${task.id}`, {
                method: "DELETE",
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to delete task: ${response.statusText}`);
            }

            await handleRefresh(); // Refresh the task list
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task. Please try again.");
        } finally {
            setIsLoading(false);
            setCloseDialog(false);
        }
    };

    const handleAddSubtask = async () => {
        setError(undefined); // Clear any previous errors
        setAddSubtaskMode(false);

        try {
            const response = await fetch(`/api/task/${task.id}/subtask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subtasks: addSubtask,
                    status: task.columnId,
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to add subtask: ${response.statusText}`);
            }

            // Handle the response data
            const newSubtask = await response.json();

            // Update the local state to reflect the new subtask
            handleAddSubtaskArray(newSubtask[0]); // Update the task subtasks state
            setAddSubtaskMode(false); // Close the add subtask mode
            setAddSubtask([]); // Clear the subtask input fields

        } catch (error) {
            console.error("Error adding subtask:", error);
            setError("Failed to add subtask. Please try again.");
        }
    };

    const addItem = () => {
        setAddSubtaskMode(true);
        setEditTitleMode(false);
        setEditTitle(task.name);
        setEditDescriptionMode(false);
        setEditDescription(task.description);
        setAddSubtask(prev => [...prev, { id: uuidv4(), taskName: "", completed: false }]);
    };

    const editItem = (e: React.ChangeEvent<HTMLInputElement>, subtaskId: string) => {
        const { value } = e.target;
        setAddSubtask(prev => prev.map(task => task.id === subtaskId ? { ...task, taskName: value } : task));
    };

    const handleCancelAddSubtask = () => {
        setAddSubtaskMode(false);
        setAddSubtask([]);
    }

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [addSubtask]);

    const handleCancelTitle = () => {
        setEditTitleMode(false);
        setEditTitle(task.name);
    }

    const handleUpdateContent = async () => {
        setEditTitleMode(false);
        setEditDescriptionMode(false);

        // Add fetch for updating title
        try {
            const response = await fetch(`/api/task/${task.id}/edit`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newTitle: editTitle,
                    newDescription: editDescription,
                    status: task.columnId,
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to edit content: ${response.statusText}`);
            }

            await handleRefresh(); // Refresh the task list

        } catch (error) {
            console.error("Error editing content:", error);
            setError("Failed to edit content. Please try again.");
        }
    }

    const handleCancelDescription = () => {
        setEditDescriptionMode(false);
        setEditDescription(task.description);
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", task.id);
    }

    return (
        <div className="flex w-full justify-start">
            <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
                <DialogTrigger className="flex w-full justify-start">
                    <div className="w-full px-3 py-4 bg-light-sidebar dark:bg-dark-sidebar shadow-md rounded-lg active:cursor-grabbing" draggable onDragStart={handleDragStart}>
                        <h4 className="text-lg text-black dark:text-white font-semibold truncate">{task.name}</h4>
                        <span className="text-sm font-semibold text-dark-gray_text">
                            {viewSubtasks.filter(subtask => subtask.completed).length} of {viewSubtasks.length} subtasks
                        </span>
                    </div>
                </DialogTrigger>

                <DialogContent className="bg-light-sidebar dark:bg-dark-sidebar border-light-sidebar dark:border-dark-sidebar text-black dark:text-white">
                    <DialogHeader className="flex flex-col mt-5 gap-3">
                        <div className="flex justify-between items-center gap-3">
                            <DialogTitle>
                                <div className="flex gap-4 justify-center items-center">
                                    <h4 className="max-w-96 truncate overflow-hidden whitespace-nowrap text-ellipsis">{task.name}</h4>
                                    {editTitleMode ? (
                                        <div className="flex gap-3 justify-center items-center">
                                            <X onClick={handleCancelTitle} className="text-red-600 w-5 h-5" />

                                            {editTitle !== "" && editTitle !== task.name && (
                                                <Check onClick={handleUpdateContent} className="text-green-600 w-5 h-5" />
                                            )}
                                        </div>
                                    ) : (
                                        <Pencil onClick={() => {
                                            setEditTitleMode(true);
                                            setEditDescriptionMode(false);
                                            setEditDescription(task.description);
                                            setAddSubtaskMode(false);
                                            setAddSubtask([]);
                                        }} className="w-5 h-5 text-light-gray_text dark:text-dark-gray_text" />
                                    )}

                                </div>
                            </DialogTitle>
                            <Popover>
                                <PopoverTrigger>
                                    <BsThreeDotsVertical className="w-5 h-5" />
                                </PopoverTrigger>
                                <PopoverContent className="bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background">
                                    <button
                                        disabled={isLoading}
                                        onClick={handleDeleteTask}
                                        className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full"
                                    >
                                        <Trash />
                                        <span>Delete Task</span>
                                    </button>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {editTitleMode && (
                            <div className="flex gap-3 px-4 justify-center items-center">
                                <Input placeholder="ke coffee" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                            </div>
                        )}

                        <div className="flex gap-4  items-center">
                            <h4 className="max-w-96 line-clamp-2">{task.description}</h4>
                            {editDescriptionMode ? (
                                <div className="flex gap-3 justify-center items-center">
                                    <X onClick={handleCancelDescription} className="text-red-600 w-5 h-5" />

                                    {editDescription !== "" && editDescription !== task.description && (
                                        <Check onClick={handleUpdateContent} className="text-green-600 w-5 h-5" />
                                    )}
                                </div>
                            ) : (
                                <Pencil onClick={() => {
                                    setEditDescriptionMode(true);
                                    setEditTitleMode(false);
                                    setEditTitle(task.name);
                                    setAddSubtaskMode(false);
                                    setAddSubtask([]);
                                }} className="w-5 h-5 text-light-gray_text dark:text-dark-gray_text" />
                            )}

                        </div>


                        {editDescriptionMode && (
                            <div className="flex gap-3 px-4 justify-center items-center">
                                <Input placeholder="e.g. It's always good to take a break." value={editDescription} onChange={e => setEditDescription(e.target.value)} required />
                            </div>
                        )}
                    </DialogHeader>

                    <div>
                        <div className="flex justify-between items-end mt-4">
                            <h5 className="text-sm">Subtasks ({viewSubtasks.filter(subtask => subtask.completed).length} of {viewSubtasks.length})</h5>
                            {!addSubtaskMode && (
                                <Button onClick={addItem}>Add new Subtasks</Button>
                            )}

                        </div>
                        <ScrollArea className="board_list flex flex-col gap-3 mt-2 max-h-[300px] overflow-y-scroll">
                            <div className="flex flex-col gap-3 mt-3">
                                {viewSubtasks.map(subtask => (
                                    <ViewSubtask
                                        key={subtask.id}
                                        task={task}
                                        subtask={subtask}
                                        handleUpdateSubtasks={handleUpdateSubtasks}
                                        handleRemoveSubtask={handleRemoveSubtask}
                                    />
                                ))}
                            </div>
                            <div ref={endRef} />
                        </ScrollArea>
                    </div>

                    {addSubtaskMode ? (
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex justify-between items-center">
                                <h5 className="text-sm">Add Subtask</h5>

                                <div className="flex justify-center items-center gap-4">
                                    {addSubtask[0].taskName !== "" && addSubtaskMode === true ? (
                                        <Check onClick={handleAddSubtask} className="text-green-600 w-5 h-5" />
                                    ) : (
                                        <></>
                                    )}

                                    <X onClick={handleCancelAddSubtask} className="text-red-600 w-5 h-5" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-3 mb-3">
                                {addSubtask.map(subtask => (
                                    <div key={subtask.id} className="flex gap-3 px-4 justify-center items-center">
                                        <Input placeholder="e.g. Make coffee" value={subtask.taskName} onChange={e => editItem(e, subtask.id)} required />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden"></div>
                    )}

                    <div className="flex flex-col gap-3">
                        <h5 className="text-sm">Status</h5>
                        <Select value={addToColumn} onValueChange={handleChangeStatus}>
                            <SelectTrigger className="border-dark-gray_text/30">
                                <SelectValue placeholder="Add to Column" />
                            </SelectTrigger>
                            <SelectContent className="bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background text-black dark:text-white">
                                {columnNames.map(column => (
                                    <SelectItem key={column.id} value={column.id}>
                                        {column.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <span className="text-sm text-red-600">{error}</span>}

                    <Button onClick={handleSaveTask} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default ListTask;