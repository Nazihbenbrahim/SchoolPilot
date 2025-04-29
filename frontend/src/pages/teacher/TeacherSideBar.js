import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiHome, HiLogout, HiUserCircle, HiChatAlt, HiBookOpen, HiAcademicCap } from 'react-icons/hi';

const TeacherSideBar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser?.teachSclasses?.[0]; // Use teachSclasses array and select the first class

    const location = useLocation();

    return (
        <div className="bg-gray-100/80 backdrop-blur-lg border-r border-gray-300/50 h-full p-4 font-poppins">
            <div className="space-y-2">
                <Link
                    to="/"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-200/50 ${
                        location.pathname === "/" || location.pathname === "/Teacher/dashboard"
                            ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'text-gray-900'
                    }`}
                >
                    <HiHome className="h-6 w-6 mr-3" />
                    <span>Home</span>
                </Link>
                <Link
                    to="/Teacher/class"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-200/50 ${
                        location.pathname.startsWith("/Teacher/class")
                            ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'text-gray-900'
                    }`}
                >
                    <HiBookOpen className="h-6 w-6 mr-3" />
                    <span>
                        {sclassName?.sclassName ? `Class ${sclassName.sclassName}` : 'No Class Assigned'}
                    </span>
                </Link>
                <Link
                    to="/Teacher/class/marks"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-200/50 ${
                        location.pathname.startsWith("/Teacher/class/marks")
                            ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'text-gray-900'
                    }`}
                >
                    <HiAcademicCap className="h-6 w-6 mr-3" />
                    <span>Marks</span>
                </Link>
                <Link
                    to="/Teacher/complain"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-200/50 ${
                        location.pathname.startsWith("/Teacher/complain")
                            ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'text-gray-900'
                    }`}
                >
                    <HiChatAlt className="h-6 w-6 mr-3" />
                    <span>Complain</span>
                </Link>
            </div>

            <div className="my-4 border-t border-gray-300/50"></div>

            <div className="space-y-2">
                <div className="text-gray-600 text-sm font-semibold px-3">User</div>
                <Link
                    to="/Teacher/profile"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-200/50 ${
                        location.pathname.startsWith("/Teacher/profile")
                            ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'text-gray-900'
                    }`}
                >
                    <HiUserCircle className="h-6 w-6 mr-3" />
                    <span>Profile</span>
                </Link>
                <Link
                    to="/logout"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-200/50 ${
                        location.pathname.startsWith("/logout")
                            ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'text-gray-900'
                    }`}
                >
                    <HiLogout className="h-6 w-6 mr-3" />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default TeacherSideBar;