import Link from "next/link";
import React from "react";
import withAuth from "@/lib/withAuth";
import { useRouter } from 'next/navigation';

const DispatcherNavbar = () => {
    const router = useRouter();
  const handleLogout = () => {
    if (!router) return; 
    // Remove token from storage (localStorage, sessionStorage, or cookies)
    localStorage.removeItem('token'); // Example for localStorage
    localStorage.removeItem('username'); // Example for localStorage
    localStorage.removeItem('role'); // Example for localStorage
    // If using cookies:
    document.cookie = 'authToken=; Max-Age=0; path=/';

    router.push('/Login');
  };
    return (
        <nav className="bg-red-700 shadow-md sticky top-0 z-10">
            <div className="max-w-screen-xl mx-auto px-8 py-4 flex justify-between items-center">
                {/* Brand Name */}
                {/* <div className="text-white font-bold text-xl">
                    Dispatcher Dashboard
                </div> */}

                {/* Navigation Links */}
                <div className="flex space-x-8">
                    <Link href="/DispatcherDashboard" className="text-white hover:text-gray-300">
                        Home
                    </Link>
                    <Link href="/DispatcherAdminContact" className="text-white hover:text-gray-300">
                        Contact Admin
                    </Link>
                </div>

                <div className="ml-6">
                <button
                    onClick={handleLogout}
                    className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
                >
                    Logout
                </button>
                </div>
            </div>
        </nav>
    );
};

export default withAuth(DispatcherNavbar);
