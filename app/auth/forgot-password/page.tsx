"use client";

import { trpc } from "@/utils/trpcClient";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FiMail } from "react-icons/fi";

type ForgotPasswordFormValues = {
    email: string;
};

const ForgotPassword = () => {
    const [message, setMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>();

    const forgotPasswordMutation = trpc.auth.forgotpassword.useMutation();

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setMessage(null);
        try {
            await forgotPasswordMutation.mutateAsync({ email: data.email });
            setMessage(" Reset link has been sent to your email.");
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border bg-white dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
                    Forgot Password?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                    Enter your email to receive a reset link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                })}
                                type="email"
                                className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-lg"
                    >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>

                    {message && (
                        <p className="text-center mt-2 text-sm">{message}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
