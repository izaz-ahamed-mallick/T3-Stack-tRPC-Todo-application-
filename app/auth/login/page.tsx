"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

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
            redirect: false, // Prevents full-page reload
        });

        if (result?.error) {
            setError(result.error);
        } else {
            // window.location.href = "/dashboard"; // Redirect after login
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-white text-2xl font-semibold mb-6 text-center">
                    Login
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-400 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            type="email"
                            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-400 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-400 mb-1">
                            Password
                        </label>
                        <input
                            {...register("password", {
                                required: "Password is required",
                            })}
                            type="password"
                            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-400 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-400 text-center mt-2">{error}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
