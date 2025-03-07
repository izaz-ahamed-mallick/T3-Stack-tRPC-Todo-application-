"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const Home = () => {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen transition-all duration-300">
            <div className="flex flex-col items-center justify-center py-20 px-6 space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight text-center text-black dark:text-white leading-tight md:text-6xl">
                    Welcome to Your Todo App
                </h1>
                <p className="text-xl text-center text-gray-700 dark:text-gray-300 md:text-2xl">
                    Organize your tasks with ease, stay productive.
                </p>

                {/* Conditionally show buttons based on user session */}
                {session ? (
                    <Link
                        href="/todo/todohome"
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl shadow-lg font-semibold transition duration-300 transform hover:scale-105"
                    >
                        Go to Todo Page
                    </Link>
                ) : (
                    <div className="flex space-x-4">
                        <Link
                            href="/auth/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl shadow-lg font-semibold transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl shadow-lg font-semibold transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
