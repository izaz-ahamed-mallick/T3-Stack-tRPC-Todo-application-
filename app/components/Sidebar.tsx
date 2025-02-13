"use client";

import { usePathname } from "next/navigation";
import { FiHome, FiList, FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { HiOutlineUserCircle } from "react-icons/hi"; // Profile Icon
import type { IconType } from "react-icons";
import Link from "next/link";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role;
    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "example@email.com";

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    const toggleSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Hamburger Menu for Mobile */}
            <button
                className="absolute top-4 left-4 z-50 md:hidden text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 shadow-lg"
                onClick={toggleSidebar}
            >
                <FiMenu size={28} />
            </button>

            {/* Overlay for Mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <aside
                className={`h-screen flex flex-col justify-between transition-all duration-300 
                ${isCollapsed ? "w-24" : "w-64"} 
                bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl p-5
                fixed z-50 md:static top-0 left-0 transform ${
                    isMobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }`}
            >
                <div className="mb-6">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-2xl mb-6 focus:outline-none transition-all hover:text-green-500"
                    >
                        <FiMenu />
                    </button>

                    {/* Profile Container */}
                    <div
                        className={`flex items-center gap-2 p-2 rounded-2xl transition-all 
                        ${isCollapsed ? "justify-center" : "justify-start"} 
                        bg-gradient-to-r from-green-600/80 to-green-800/80 shadow-lg backdrop-blur-md`}
                    >
                        <HiOutlineUserCircle className="text-xl text-white opacity-90" />

                        {!isCollapsed && (
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    {userName.toLocaleUpperCase()}
                                </p>
                                <p className="text-xs text-gray-200">
                                    {userEmail}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <div>
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

                        {/* ✅ Show Admin Panel for Admins */}
                        {userRole === "admin" && (
                            <SidebarItem
                                Icon={FiUser}
                                text="Admin Panel"
                                href="/admin"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                            />
                        )}
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 rounded-xl transition-all w-full 
                            hover:bg-red-500 text-white bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 shadow-lg"
                    >
                        <FiLogOut className="text-xl" />
                        {!isCollapsed && (
                            <span className="ml-3 text-md">Logout</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
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
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer
              ${
                  isActive
                      ? "bg-green-500 text-white border-l-4 border-green-700 shadow-md"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }
              ${isCollapsed ? "justify-center" : "space-x-3"}
          `}
        >
            <Icon className="text-xl dark:text-white text-gray-900" />
            {!isCollapsed && <span className="text-md">{text}</span>}
        </Link>
    );
};

export default Sidebar;
