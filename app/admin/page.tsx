"use client";

import { Users, ClipboardList, Activity, Trash2 } from "lucide-react";
import { trpc } from "@/utils/trpcClient";

const Admin = () => {
    const { data: users, refetch: refetchUsers } =
        trpc.admin.getUsers.useQuery();
    const { data: activityLogs, refetch: refetchActivityLogs } =
        trpc.admin.getActivityLogs.useQuery();

    const updateUserRole = trpc.admin.updateUserRole.useMutation({
        onSuccess: () => {
            refetchUsers();
            refetchActivityLogs();
        },
    });

    const deleteTask = trpc.admin.deleteTask.useMutation({
        onSuccess: () => {
            refetchUsers();
            refetchActivityLogs();
        },
    });

    const handleRoleChange = async (userId: string, role: "user" | "admin") => {
        await updateUserRole.mutateAsync({ userId, role });
    };

    const handleDeleteTask = async (taskId: string) => {
        await deleteTask.mutateAsync({ taskId });
    };

    return (
        <div className="min-h-screen pt-20 p-8 bg-background text-foreground md:pt-16 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                <div className="p-6 rounded-xl bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl border border-border transition hover:scale-[1.02]">
                    <div className="flex items-center gap-3 text-lg font-semibold">
                        <Users size={28} className="text-primary" />
                        <span>Total Users</span>
                    </div>
                    <p className="text-4xl font-bold mt-3">
                        {users?.length ?? 0}
                    </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl border border-border transition hover:scale-[1.02]">
                    <div className="flex items-center gap-3 text-lg font-semibold">
                        <ClipboardList size={28} className="text-primary" />
                        <span>Active Tasks</span>
                    </div>
                    <p className="text-4xl font-bold mt-3">
                        {users?.reduce(
                            (sum, user) => sum + user.todos.length,
                            0
                        ) ?? 0}
                    </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl border border-border transition hover:scale-[1.02]">
                    <div className="flex items-center gap-3 text-lg font-semibold">
                        <Activity size={28} className="text-primary" />
                        <span>Recent Activities</span>
                    </div>
                    <p className="text-4xl font-bold mt-3">
                        {activityLogs?.length ?? 0}
                    </p>
                </div>
            </div>

            <div className="bg-muted p-6 rounded-xl shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-5">
                    All Users & Tasks
                </h2>
                <div className="overflow-x-auto scrollbar">
                    <table className="w-full border-collapse min-w-[600px] sm:min-w-full">
                        <thead>
                            <tr className="border-b border-border bg-gray-100 dark:bg-gray-800">
                                <th className="p-2 text-left">User</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Role</th>
                                <th className="p-2 text-left">Tasks</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-border"
                                >
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    user.id,
                                                    e.target.value as
                                                        | "user"
                                                        | "admin"
                                                )
                                            }
                                            className=" border border-border px-2 py-1 rounded"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        {user.todos.length > 0 ? (
                                            <ul className="list-disc pl-4">
                                                {user.todos.map((task) => (
                                                    <li
                                                        key={task.id}
                                                        className="flex items-center justify-between"
                                                    >
                                                        {task.title}
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteTask(
                                                                    task.id
                                                                )
                                                            }
                                                            className="text-red-500 ml-3 hover:text-red-700"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-500">
                                                No tasks
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() =>
                                                handleRoleChange(
                                                    user.id,
                                                    user.role === "admin"
                                                        ? "user"
                                                        : "admin"
                                                )
                                            }
                                            className="bg-primary text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Toggle Role
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12 bg-muted p-6 rounded-xl shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-5">
                    Recent Activity Logs
                </h2>
                <div className="h-[400px] overflow-y-auto no-scroll-on-recent scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                    <ul className="space-y-4">
                        {activityLogs?.map((log) => (
                            <li
                                key={log.id}
                                className="flex justify-between text-sm md:text-lg"
                            >
                                <span>{log.action}</span>
                                <span className="text-gray-500 text-xs md:text-sm">
                                    {new Date(
                                        log.timestamp
                                    ).toLocaleTimeString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Admin;
