"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { trpc } from "@/utils/trpcClient";

const TodoHome: React.FC = () => {
    const [task, setTask] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [editingTodo, setEditingTodo] = useState<string | null>(null);

    const { data: allTodos, refetch } = trpc.todo.getAll.useQuery();
    const addTodoMutation = trpc.todo.create.useMutation();
    const toggleCompleteMutation = trpc.todo.toggleComplete.useMutation();
    const deleteTodoMutation = trpc.todo.delete.useMutation();
    const updateTodoMutation = trpc.todo.updateTodo.useMutation();

    const addTodo = async () => {
        if (task.trim() && description.trim()) {
            await addTodoMutation.mutateAsync({ title: task, description });
            setTask("");
            setDescription("");
            refetch();
        }
    };

    const toggleComplete = async (id: string) => {
        await toggleCompleteMutation.mutateAsync({ id });
        refetch();
    };

    const deleteTodo = async (id: string) => {
        await deleteTodoMutation.mutateAsync({ id });
        refetch();
    };

    const updateTodo = async (id: string) => {
        if (task.trim() && description.trim()) {
            await updateTodoMutation.mutateAsync({
                id,
                title: task,
                description,
            });
            setTask("");
            setDescription("");
            setEditingTodo(null);
            refetch();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-t from-gray-100 via-gray-200 to-white text-black dark:bg-gradient-to-t dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-white transition-all duration-300">
            {/* Header Section */}
            <div className="w-full max-w-4xl text-center p-12 bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-2xl dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900">
                <h1 className="text-6xl font-semibold text-gray-800 leading-tight tracking-tight dark:text-gray-100">
                    Todo List
                </h1>
                <p className="text-xl mt-4 text-gray-600 opacity-80 dark:text-gray-400">
                    Stay productive and organized with your tasks.
                </p>
            </div>

            {/* Input Section */}
            <div className="w-full max-w-2xl mt-8 p-8 bg-gradient-to-t from-white to-gray-100 rounded-2xl shadow-2xl dark:bg-gradient-to-t dark:from-gray-800 dark:to-gray-700 transition-all duration-300">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter a task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="flex-grow p-4 text-lg rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-600 transition-all duration-300"
                    />
                </div>
                <div className="mt-4">
                    <textarea
                        placeholder="Enter task description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 text-lg rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-600 transition-all duration-300"
                    />
                </div>
                <div className="mt-6 text-center">
                    {editingTodo ? (
                        <button
                            onClick={() => updateTodo(editingTodo)}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:bg-gradient-to-l hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Update Task
                        </button>
                    ) : (
                        <button
                            onClick={addTodo}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:bg-gradient-to-l hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Add Task
                        </button>
                    )}
                </div>
            </div>

            {/* Todo List */}
            <div className="w-full max-w-2xl mt-12">
                {allTodos?.map((todo) => (
                    <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex justify-between items-center p-6 my-6 rounded-2xl shadow-2xl ${
                            todo.completed || todo.status === "completed"
                                ? "bg-gradient-to-r from-green-500 to-green-600 dark:bg-gradient-to-r dark:from-green-700 dark:to-green-800"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700"
                        } transition-all duration-300`}
                    >
                        <div>
                            <span
                                className={`${
                                    todo.completed ||
                                    todo.status === "completed"
                                        ? "line-through text-gray-400 dark:text-gray-600"
                                        : "text-black dark:text-white"
                                } text-xl font-semibold`}
                            >
                                {todo.title}
                            </span>
                            <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                                {todo.description}
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <button
                                onClick={() => toggleComplete(todo.id)}
                                className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                            >
                                <FaCheck />
                            </button>
                            <button
                                onClick={() => {
                                    setTask(todo.title);
                                    setDescription(todo.description);
                                    setEditingTodo(todo.id);
                                }}
                                className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all duration-300 transform hover:scale-110"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
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
