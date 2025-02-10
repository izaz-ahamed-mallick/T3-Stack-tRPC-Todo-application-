"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FiLock } from "react-icons/fi";
import { trpc } from "@/utils/trpcClient";

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetPasswordMutation = trpc.auth.resetpassword.useMutation({
        onSuccess: () => {
            setSuccess("Password reset successfully! Redirecting...");
            setTimeout(() => router.push("/auth/login"), 3000);
        },
        onError: (err) => setError(err.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return setError("Invalid token.");
        resetPasswordMutation.mutate({ token, newPassword: password });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                <h2 className="text-2xl font-bold text-center">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg bg-gray-200 dark:bg-[#152422]"
                            placeholder="New password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
                    >
                        Reset Password
                    </button>
                </form>

                {error && (
                    <p className="text-red-400 mt-2 text-center">{error}</p>
                )}
                {success && (
                    <p className="text-green-400 mt-2 text-center">{success}</p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
