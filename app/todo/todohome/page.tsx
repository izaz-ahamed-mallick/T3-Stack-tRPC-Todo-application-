"use client";

import React, { useState, useMemo } from "react";

import { trpc } from "@/utils/trpcClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { ITodoTask } from "@/types/todoItem";
import TodoItem from "@/app/components/TodoItem";

interface TodoFormData {
    title: string;
    description: string;
    tags: string;
    deadline: string;
    reminder_time: string;
}

const TodoHome: React.FC = () => {
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string>("All");

    const { data: allTodos, refetch } = trpc.todo.getAll.useQuery();
    const addTodoMutation = trpc.todo.create.useMutation();

    const updateTodoMutation = trpc.todo.updateTodo.useMutation();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<TodoFormData>();

    const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
        const formattedDeadline = new Date(data.deadline).toISOString(); // ✅ Always a string
        const formattedReminderTime = new Date(
            data.reminder_time
        ).toISOString();

        if (editingTodo) {
            await updateTodoMutation.mutateAsync({
                id: editingTodo,
                title: data.title,
                description: data.description,
                tags: data.tags,
                deadline: formattedDeadline,
                reminder_time: formattedReminderTime,
                completed: false,
            });
            setEditingTodo(null);
        } else {
            await addTodoMutation.mutateAsync({
                title: data.title,
                description: data.description,
                tags: data.tags,
                deadline: formattedDeadline,
                reminder_time: formattedReminderTime,
            });
        }

        reset();
        refetch();
    };

    const startEditing = (todo: ITodoTask) => {
        setEditingTodo(todo.id);
        setValue("title", todo.title || "");
        setValue("description", todo.description || "");
        setValue("tags", todo.tags || "");
        setValue(
            "deadline",
            todo.deadline
                ? new Date(todo.deadline).toISOString().slice(0, 16)
                : ""
        );
        setValue(
            "reminder_time",
            todo.reminder_time
                ? new Date(todo.reminder_time).toISOString().slice(0, 16)
                : ""
        );
    };

    const uniqueTags = useMemo(() => {
        const tagsSet = new Set<string>();
        allTodos?.forEach((todo) => {
            if (todo.tags) {
                todo.tags.split(",").forEach((tag) => tagsSet.add(tag.trim()));
            }
        });
        return ["All", ...Array.from(tagsSet)];
    }, [allTodos]);

    const filteredTodos = useMemo(() => {
        if (selectedTag === "All") return allTodos;
        return allTodos?.filter((todo) =>
            todo.tags
                .split(",")
                .map((tag) => tag.trim())
                .includes(selectedTag)
        );
    }, [selectedTag, allTodos]);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 md:p-8 pt-16 bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white">
            <div className="w-full max-w-4xl text-center p-6 md:p-12 rounded-3xl shadow-2xl border border-gray-700">
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">
                    TaskFlow
                </h1>
                <p className="text-sm md:text-lg mt-2 md:mt-4 text-gray-400">
                    Stay productive and organized with your tasks.
                </p>
            </div>

            {/* Input Section */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-2xl mt-10 p-6 sm:p-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0px_12px_40px_rgba(255,255,255,0.2)] border border-white/30 transition-all duration-300 dark:bg-white/5 dark:border-white/20 dark:shadow-black/50"
            >
                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                    Task Title
                </label>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    {...register("title", {
                        required: "Task title is required",
                    })}
                    className="w-full p-4 mb-6 rounded-xl bg-gradient-to-r from-white/30 to-white/20 border border-white/50 text-gray-900 placeholder-gray-600 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300 dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600 dark:border-white/30"
                />
                {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                )}

                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                    Description
                </label>
                <textarea
                    placeholder="Enter task description..."
                    {...register("description", {
                        required: "Description is required",
                    })}
                    className="w-full p-4 mb-6 rounded-xl bg-gradient-to-r from-white/30 to-white/20 border border-white/50 text-gray-900 placeholder-gray-600 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300 dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600 dark:border-white/30"
                />
                {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                )}

                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                    Tags
                </label>
                <input
                    type="text"
                    placeholder="Categories..."
                    {...register("tags")}
                    className="w-full p-4 mb-6 rounded-xl bg-gradient-to-r from-white/30 to-white/20 border border-white/50 text-gray-900 placeholder-gray-600 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300 dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600 dark:border-white/30"
                />

                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                    Deadline
                </label>
                <input
                    type="datetime-local"
                    {...register("deadline")}
                    placeholder="Select deadline date & time"
                    className="w-full p-4 mb-6 rounded-xl bg-gradient-to-r from-white/30 to-white/20 border border-white/50 text-gray-900 placeholder-gray-600 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300 dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600 dark:border-white/30"
                />

                <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                    Reminder
                </label>
                <input
                    type="datetime-local"
                    {...register("reminder_time")}
                    placeholder="Set a reminder"
                    className="w-full p-4 mb-6 rounded-xl bg-gradient-to-r from-white/30 to-white/20 border border-white/50 text-gray-900 placeholder-gray-600 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300 dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600 dark:border-white/30"
                />

                <div className="text-center">
                    <button
                        type="submit"
                        className={`relative px-8 py-4 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-2 overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-300 before:hover:opacity-20 ${
                            editingTodo
                                ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
                                : "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
                        } dark:shadow-blue-500/50 dark:hover:shadow-blue-600/60`}
                    >
                        {editingTodo ? "Update Task" : "Add Task"}
                    </button>
                </div>
            </form>

            <div className="w-full max-w-2xl mt-4 flex gap-4 justify-center">
                {allTodos &&
                    allTodos.length > 0 &&
                    uniqueTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                                selectedTag === tag
                                    ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-400/50"
                                    : "bg-gray-300 text-gray-900 hover:bg-gray-400 dark:bg-gray-500/20 dark:text-white dark:hover:bg-gray-500/30"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
            </div>

            {/* Todo List */}
            <div className="w-full max-w-2xl mt-8">
                {filteredTodos?.map((todo) => (
                    <div key={todo.id}>
                        <TodoItem
                            todo={todo}
                            refetch={refetch}
                            startEditing={startEditing}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoHome;
