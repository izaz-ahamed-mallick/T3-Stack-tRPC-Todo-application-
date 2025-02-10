"use client";

import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpcClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    name: z.string().optional(),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupData>({
        resolver: zodResolver(signupSchema),
    });

    const signupMutation = trpc.auth.signup.useMutation({
        onSuccess: () => {
            router.push("/auth/login");
        },
    });

    const onSubmit = (data: SignupData) => {
        signupMutation.mutate(data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen transition-colors bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 dark:from-green-300 dark:to-green-500 text-3xl font-extrabold mb-6 text-center animate-pulse">
                    <FiUser className="text-green-500 text-4xl" />
                    Create an Account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium">
                            Name
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                {...register("name")}
                                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter your password"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 text-center text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg font-semibold transition duration-300 shadow-lg hover:scale-105"
                        disabled={signupMutation.isPending}
                    >
                        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
                    </button>

                    {signupMutation.error && (
                        <p className="text-red-500 text-center text-sm mt-2">
                            {signupMutation.error.message}
                        </p>
                    )}
                    {signupMutation.isSuccess && (
                        <p className="text-green-500 text-center text-sm mt-2">
                            Signup successful! 🎉
                        </p>
                    )}

                    <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-green-500 hover:underline"
                        >
                            Log in here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
