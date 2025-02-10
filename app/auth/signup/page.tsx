"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpcClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" }) // ✅ Check if empty
        .email({ message: "Invalid email" }), // ✅ Check format
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    name: z.string().optional(),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupData>({
        resolver: zodResolver(signupSchema),
    });

    const [success, setSuccess] = useState(false);
    const signupMutation = trpc.auth.signup.useMutation({
        onSuccess: () => {
            setSuccess(true);
        },
    });

    const onSubmit = (data: SignupData) => {
        signupMutation.mutate(data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                >
                    {" "}
                    <div>
                        <label className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 text-center text-white bg-green-600 rounded hover:bg-green-700"
                        disabled={signupMutation.isPending}
                    >
                        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
                    </button>
                    {signupMutation.error && (
                        <p className="text-red-400 text-sm">
                            {signupMutation.error.message}
                        </p>
                    )}
                    {success && (
                        <p className="text-green-400 text-sm">
                            Signup successful! 🎉
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
