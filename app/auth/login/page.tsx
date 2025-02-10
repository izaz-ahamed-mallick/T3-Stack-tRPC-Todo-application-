"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FiClipboard, FiLock, FiMail } from "react-icons/fi";

type LoginFormValues = {
    email: string;
    password: string;
};

const Login = () => {
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        setError("");

        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen transition-colors bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 dark:from-green-300 dark:to-green-500 text-3xl font-extrabold mb-6 text-center animate-pulse">
                    <FiClipboard className="text-green-500 dark:text-green-400 text-4xl" />
                    Access Your Tasks
                </h2>

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
                                className="w-full p-3 pl-10 bg-gray-200 dark:bg-[#152422] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                type="password"
                                className="w-full p-3 pl-10 bg-gray-200 dark:bg-[#152422] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-400 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-lg relative 
                        before:absolute before:inset-0 before:rounded-lg before:bg-green-400 before:opacity-0 before:transition before:duration-300 before:hover:opacity-100"
                    >
                        {isSubmitting ? "Logging in..." : "Let’s Go 🚀"}
                    </button>

                    {error && (
                        <p className="text-red-400 text-center mt-2">{error}</p>
                    )}
                </form>

                <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
                    <Link
                        href="/auth/forgot-password"
                        className="text-green-500 hover:text-green-600 font-semibold transition"
                    >
                        Forgot Password?
                    </Link>
                </p>

                <p className="mt-5 text-center text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?
                    <Link
                        href="/auth/signup"
                        className="text-green-500 hover:text-green-600 font-semibold transition"
                    >
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
