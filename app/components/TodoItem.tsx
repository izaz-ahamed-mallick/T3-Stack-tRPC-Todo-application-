import { useTaskStatus } from "@/hooks/useTaskHooks";
import { ITodoTask } from "@/types/todoItem";
import { trpc } from "@/utils/trpcClient";
import { motion } from "framer-motion";
import { FaCheck, FaClock, FaEdit, FaTrash, FaBell } from "react-icons/fa";

interface TodoItemProps {
    todo: ITodoTask;
    refetch: () => void;
    startEditing: (todo: ITodoTask) => void;
}

const TodoItem = ({ todo, refetch, startEditing }: TodoItemProps) => {
    const {
        isReminderToday,
        isDeadlineToday,
        isDeadlineOverdue,
        isDeadlineSoon,
    } = useTaskStatus({
        deadline: todo.deadline,
        reminder: todo.reminder_time,
    });

    const toggleCompleteMutation = trpc.todo.toggleComplete.useMutation();
    const deleteTodoMutation = trpc.todo.delete.useMutation();
    const toggleComplete = async (id: string) => {
        await toggleCompleteMutation.mutateAsync({ id });
        refetch();
    };

    const deleteTodo = async (id: string) => {
        await deleteTodoMutation.mutateAsync({ id });
        refetch();
    };

    return (
        <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative p-6 mb-6 rounded-3xl shadow-xl border backdrop-blur-lg transition-all duration-300 
          ${
              todo.completed
                  ? "bg-gradient-to-br from-gray-700/60 to-gray-500/40 border-gray-400/50 shadow-purple-500/40 scale-105 dark:border-white/20 dark:shadow-[0_0_20px_#c5a3ff]"
                  : "bg-gradient-to-r from-gray-900/70 to-gray-700/50 border-gray-500/50 dark:border-gray-300/30"
          }`}
        >
            {/* ✅ Completed Badge */}
            {todo.completed && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-4 py-1 rounded-bl-3xl font-semibold shadow-lg uppercase tracking-widest">
                    ✅ Completed
                </div>
            )}

            {/* 🔹 Task Title */}
            <h3
                className={`text-2xl font-bold tracking-wide drop-shadow-md ${
                    todo.completed
                        ? "text-gray-300 dark:text-gray-200/80"
                        : "text-white dark:text-white"
                }`}
            >
                {todo.title}
            </h3>

            {/* 🔹 Task Description */}
            <p
                className={`mt-2 text-sm leading-relaxed ${
                    todo.completed
                        ? "text-gray-400 italic drop-shadow-md dark:text-gray-300/80"
                        : "text-gray-200 dark:text-gray-400"
                }`}
            >
                {todo.description}
            </p>

            {/* 🔥 Deadline */}
            {todo.deadline && (
                <div
                    className={`mt-3 flex items-center gap-3 text-sm font-semibold px-4 py-2 rounded-2xl 
              ${
                  isDeadlineToday
                      ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(192,132,252,0.6)]"
                      : isDeadlineOverdue
                      ? "bg-red-600 text-white shadow-[0_0_15px_rgba(255,69,58,0.7)]"
                      : isDeadlineSoon
                      ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(255,165,0,0.6)]"
                      : "bg-gray-800 text-gray-300 shadow-lg"
              } transition-all duration-300`}
                >
                    <FaClock className="text-lg animate-pulse" />
                    <span className="tracking-wide">
                        {isDeadlineToday && "🚀 Deadline: Today!"}
                        {isDeadlineOverdue && "⚠️ Deadline Overdue!"}
                        {isDeadlineSoon && (
                            <>
                                <span className="animate-spin transition-all ">
                                    ⏳
                                </span>
                                Deadline Approaching: $
                                {new Date(todo.deadline).toLocaleString()}
                            </>
                        )}
                        {!isDeadlineToday &&
                            !isDeadlineOverdue &&
                            !isDeadlineSoon &&
                            `📆 Deadline: ${new Date(
                                todo.deadline
                            ).toLocaleString()}`}
                    </span>
                </div>
            )}

            {/* 🔔 Reminder (Only shows on the reminder date) */}
            {isReminderToday && todo.reminder_time && (
                <div className="mt-2 flex items-center gap-3 text-white text-sm bg-green-500/90 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-glow">
                    <FaBell className="text-lg animate-ping" />
                    <span className="font-semibold">Reminder Today:</span>
                    <span className="tracking-wide">
                        {new Date(todo.reminder_time).toLocaleString()}
                    </span>
                </div>
            )}

            {/* 🔥 Action Buttons */}
            <div className="flex gap-5 mt-5">
                {/* ✅ Toggle Complete */}
                <button
                    onClick={() => toggleComplete(todo.id)}
                    className="transition-all duration-300 transform hover:scale-110 text-green-400 hover:text-green-500 dark:hover:text-green-300"
                >
                    <FaCheck size={20} />
                </button>

                {/* ✏️ Edit (Only if not completed) */}
                {!todo.completed && (
                    <button
                        onClick={() => startEditing(todo)}
                        className="text-yellow-400 hover:text-yellow-500 transition-all duration-300 transform hover:scale-110 dark:hover:text-yellow-300"
                    >
                        <FaEdit size={20} />
                    </button>
                )}

                {/* 🗑️ Delete */}
                <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110 dark:hover:text-red-300"
                >
                    <FaTrash size={20} />
                </button>
            </div>
        </motion.div>
    );
};

export default TodoItem;
