"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaClock, FaEdit, FaTrash } from "react-icons/fa";
import { trpc } from "@/utils/trpcClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { ITodoTask } from "@/types/todoItem";

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
    const toggleCompleteMutation = trpc.todo.toggleComplete.useMutation();
    const deleteTodoMutation = trpc.todo.delete.useMutation();
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

    const toggleComplete = async (id: string) => {
        await toggleCompleteMutation.mutateAsync({ id });
        refetch();
    };

    const deleteTodo = async (id: string) => {
        await deleteTodoMutation.mutateAsync({ id });
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
        <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white">
            {/* Header Section */}
            <div className="w-full max-w-4xl text-center p-12 bg-gradient-to-b from-white to-gray-100 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-300 dark:bg-gradient-to-b dark:from-white/20 dark:to-gray-200/10 dark:shadow-black/50 dark:border-white/20">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 tracking-tight dark:from-blue-500 dark:to-teal-400">
                    TaskFlow
                </h1>
                <p className="text-xl mt-4 text-gray-700 opacity-80 dark:text-gray-300">
                    Stay productive and organized with your tasks.
                </p>
            </div>

            {/* Input Section */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-2xl mt-10 p-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0px_12px_40px_rgba(255,255,255,0.2)] border border-white/30 transition-all duration-300 dark:bg-white/5 dark:border-white/20 dark:shadow-black/50"
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
                        className={`relative px-8 py-4 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-300 before:hover:opacity-20 ${
                            editingTodo
                                ? "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
                                : "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600"
                        } dark:shadow-blue-500/50 dark:hover:shadow-blue-600/60`}
                    >
                        {editingTodo ? "Update Task" : "Add Task"}
                    </button>
                </div>
            </form>

            {/* Tags Section */}
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
                    <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`relative p-6 mb-4 rounded-3xl shadow-2xl border transition-all duration-300 ${
                            todo.completed
                                ? "bg-gradient-to-br from-gray-400 to-gray-200 opacity-80 border-gray-300 shadow-lg shadow-purple-300/50 scale-105 dark:from-[#4a4a4a] dark:to-[#1e1e1e] dark:border-white/20 dark:shadow-[0_0_20px_#c5a3ff]"
                                : "bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                        }`}
                    >
                        {todo.completed && (
                            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-3xl font-semibold shadow-lg">
                                ✅ Completed
                            </div>
                        )}

                        {/* 🔹 Task Title */}
                        <h3
                            className={`text-3xl font-semibold ${
                                todo.completed
                                    ? "text-gray-700 drop-shadow-lg dark:text-white/70"
                                    : "text-gray-900 dark:text-white"
                            }`}
                        >
                            {todo.title}
                        </h3>

                        {/* 🔹 Task Description */}
                        <p
                            className={`mt-2 ${
                                todo.completed
                                    ? "text-gray-600 italic drop-shadow-md dark:text-gray-300/80"
                                    : "text-gray-700 dark:text-gray-400"
                            }`}
                        >
                            {todo.description}
                        </p>

                        {/* 🔹 Task Deadline */}
                        {todo.deadline && (
                            <div className="mt-3 flex items-center gap-2 text-gray-800 dark:text-gray-300 text-sm">
                                <FaClock className="text-blue-500" />
                                <span className="font-semibold">Deadline:</span>
                                <span>
                                    {new Date(todo.deadline).toLocaleString()}
                                </span>
                            </div>
                        )}

                        {/* 🔹 Task Actions */}
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => toggleComplete(todo.id)}
                                className="transition-all duration-300 transform hover:scale-110 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500"
                            >
                                <FaCheck />
                            </button>
                            {!todo.completed && (
                                <button
                                    onClick={() => startEditing(todo)}
                                    className="text-yellow-500 hover:text-yellow-600 transition-all duration-300 transform hover:scale-110"
                                >
                                    <FaEdit />
                                </button>
                            )}
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-110"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TodoHome;
