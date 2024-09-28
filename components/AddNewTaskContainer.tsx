"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { v4 as uuidv4 } from "uuid";
import { ScrollArea } from './ui/scroll-area';
import { usePathname, useRouter } from 'next/navigation';

interface AddNewTaskContainerProps {
    columnNames: { id: string; name: string; }[];
    handleCloseDialog: () => void;
}

const AddNewTaskContainer = ({ columnNames, handleCloseDialog }: AddNewTaskContainerProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const boardId = pathname.split("/")[2];

    const [addSubtask, setAddSubtask] = useState<{ id: string; taskName: string; completed: boolean; }[]>([{ id: uuidv4(), taskName: "", completed: false }]);
    const [addToColumn, setAddToColumn] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const endRef = useRef<HTMLDivElement | null>(null);

    const formSchema = z.object({
        title: z.string().min(1, { message: "Title must not be empty." }),
        description: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", description: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (addToColumn) {
            try {
                await fetch(`/api/board/${boardId}/task`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: values.title,
                        description: values.description,
                        subtasks: addSubtask,
                        status: addToColumn
                    })
                });
                form.reset(); // Clear the form fields
                setAddSubtask([{ id: uuidv4(), taskName: "", completed: false }]); // Reset subtasks
                setAddToColumn(undefined); // Reset status
                setError(undefined);
                handleCloseDialog();
                router.refresh();
            } catch (error) {
                console.error("Error creating task:", error);
                setError("Failed to create task. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setError("All fields must be filled in");
            setIsLoading(false);
        }
    }

    const removeItem = (taskId: string) => {
        setAddSubtask(prev => prev.filter(task => task.id !== taskId));
    };

    const addItem = () => {
        setAddSubtask(prev => [...prev, { id: uuidv4(), taskName: "", completed: false }]);
    };

    const editItem = (e: React.ChangeEvent<HTMLInputElement>, subtaskId: string) => {
        const { value } = e.target;
        setAddSubtask(prev => prev.map(task => task.id === subtaskId ? { ...task, taskName: value } : task));
    };

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [addSubtask]);

    return (
        <DialogContent className="bg-light-sidebar dark:bg-dark-sidebar border-light-sidebar dark:border-dark-sidebar text-black dark:text-white p-7">
            <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Take coffee break" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g. It's always good to take a break." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Label>Subtasks</Label>
                        <ScrollArea className="max-h-44 overflow-y-scroll">
                            <div className="flex flex-col gap-3 mt-3 mb-3">
                                {addSubtask.map(subtask => (
                                    <div key={subtask.id} className="flex gap-3 px-4 justify-center items-center">
                                        <Input placeholder="e.g. Make coffee" value={subtask.taskName} onChange={e => editItem(e, subtask.id)} required />
                                        <X onClick={() => removeItem(subtask.id)} className="w-6 h-6 text-dark-gray_text" />
                                    </div>
                                ))}
                                <div ref={endRef} />
                            </div>
                        </ScrollArea>
                        <Button type="button" onClick={addItem} className="mt-3">+ Add New Subtask</Button>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select onValueChange={setAddToColumn}>
                            <SelectTrigger>
                                <SelectValue placeholder="Add to Column" />
                            </SelectTrigger>
                            <SelectContent>
                                {columnNames.map(column => (
                                    <SelectItem key={column.id} value={column.id}>
                                        {column.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4">
                        {error && <span className="text-sm text-red-600">{error}</span>}
                        <Button type="submit" disabled={isLoading}>Create Task</Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    );
};

export default AddNewTaskContainer;