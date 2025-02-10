"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    FiHome,
    FiCheckCircle,
    FiSettings,
    FiList,
    FiMenu,
    FiLogOut,
} from "react-icons/fi";

import type { IconType } from "react-icons";
import { useState } from "react";
import { signOut } from "next-auth/react";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <aside
            className={`h-screen flex flex-col justify-between transition-all duration-300 
            ${
                isCollapsed ? "w-28" : "w-56"
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xl p-5`}
        >
            {/* Top Section */}
            <div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-2xl mb-6 focus:outline-none transition-all hover:text-green-500"
                >
                    <FiMenu />
                </button>

                <ul className="space-y-4">
                    <SidebarItem
                        Icon={FiHome}
                        text="Home"
                        href="/todo/todohome"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        Icon={FiList}
                        text="My Tasks"
                        href="/todo/tasks"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        Icon={FiCheckCircle}
                        text="Completed"
                        href="/todo/completed"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        Icon={FiSettings}
                        text="Settings"
                        href="/settings"
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                    />
                </ul>
            </div>
            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 rounded-lg transition-all w-full 
                        hover:bg-red-500 text-white bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                >
                    <FiLogOut className="text-xl" />
                    {!isCollapsed && (
                        <span className="ml-3 text-md">Logout</span>
                    )}
                </button>
            </div>
        </aside>
    );
};

const SidebarItem = ({
    Icon,
    text,
    href,
    pathname,
    isCollapsed,
}: {
    Icon: IconType;
    text: string;
    href: string;
    pathname: string;
    isCollapsed: boolean;
}) => {
    const router = useRouter();
    const isActive = pathname === href;

    return (
        <li
            onClick={() => router.push(href)}
            className={`flex items-center px-4 py-3 rounded-lg transition-all cursor-pointer
              ${
                  isActive
                      ? "bg-green-500 text-white border-l-4 border-green-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }
              ${isCollapsed ? "justify-center" : "space-x-3"}
          `}
        >
            <Icon className="text-xl dark:text-white text-gray-900" />
            {!isCollapsed && <span className="text-md">{text}</span>}
        </li>
    );
};

export default Sidebar;
