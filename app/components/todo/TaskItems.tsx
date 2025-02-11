"use client";

import { FiTrash } from "react-icons/fi";
import { trpc } from "@/utils/trpcClient";
import { toast } from "react-hot-toast";
import { ITodoTask } from "@/types/todoItem";
import { ItaskGroups } from "@/app/todo/tasks/page";
import { Dispatch, SetStateAction } from "react";

const TaskItem = ({
    task,

    setTaskGroups,
}: {
    task: ITodoTask;

    setTaskGroups: Dispatch<SetStateAction<ItaskGroups>>;
}) => {
    const utils = trpc.useUtils();

    const { mutate: deleteTask } = trpc.todo.delete.useMutation({
        onSuccess: () => {
            utils.todo.getAll.invalidate();
            setTaskGroups((prev: ItaskGroups) => {
                const updatedGroups = {
                    ...prev,
                    [task.status]: prev[task.status].filter(
                        (t) => t.id !== task.id
                    ),
                };
                return updatedGroups;
            });
            toast.success("Task deleted!");
        },
        onError: () => {
            toast.error("Failed to delete task");
        },
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();

        deleteTask({ id: task.id });
    };

    return (
        <div
            className={`flex justify-between items-center p-4 rounded-lg shadow-lg transition-all cursor-pointer select-none
                ${
                    task.status === "todo"
                        ? "bg-gray-900 text-white dark:bg-gray-700"
                        : task.status === "inProgress"
                        ? "bg-blue-600 text-white  dark:text-black border-blue-400"
                        : "bg-green-700 text-white  dark:text-black border-green-400 opacity-90"
                }
                hover:bg-gray-700`}
        >
            {/* Task Title & Toggle Complete */}
            <div className="flex items-center gap-3">
                <span
                    className={`text-lg font-medium transition-all duration-200`}
                >
                    {task.title}
                </span>
            </div>

            {/* Edit & Delete Icons */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleDelete}
                    className="p-2 rounded-full hover:bg-gray-600 transition focus:outline-none"
                >
                    <FiTrash className="text-red-400" />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
