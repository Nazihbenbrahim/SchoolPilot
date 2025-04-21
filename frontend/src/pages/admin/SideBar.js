import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineUsers, HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineBell, HiOutlineExclamationCircle, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';

const SideBar = ({ open }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' || path === '/Admin/dashboard') {
      return location.pathname === '/' || location.pathname === '/Admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100/80 backdrop-blur-lg border-r border-gray-300/50 text-gray-900">
      {/* Main Navigation Links */}
      <div>
        <Link
          to="/"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineHome className="h-5 w-5 mr-4" />
          <span className="font-poppins">Home</span>
        </Link>
        <Link
          to="/Admin/classes"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/classes')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineBookOpen className="h-5 w-5 mr-4" />
          <span className="font-poppins">Classes</span>
        </Link>
        <Link
          to="/Admin/subjects"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/subjects')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineBookOpen className="h-5 w-5 mr-4" />
          <span className="font-poppins">Subjects</span>
        </Link>
        <Link
          to="/Admin/teachers"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/teachers')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineAcademicCap className="h-5 w-5 mr-4" />
          <span className="font-poppins">Teachers</span>
        </Link>
        <Link
          to="/Admin/students"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/students')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineUsers className="h-5 w-5 mr-4" />
          <span className="font-poppins">Students</span>
        </Link>
        <Link
          to="/Admin/notices"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/notices')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineBell className="h-5 w-5 mr-4" />
          <span className="font-poppins">Notices</span>
        </Link>
        <Link
          to="/Admin/complains"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/complains')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineExclamationCircle className="h-5 w-5 mr-4" />
          <span className="font-poppins">Complains</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="my-2 border-t border-gray-300/50"></div>

      {/* User Section */}
      <div>
        <div className="px-4 py-2 text-gray-500 font-poppins text-sm">
          User
        </div>
        <Link
          to="/Admin/profile"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/Admin/profile')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineUserCircle className="h-5 w-5 mr-4" />
          <span className="font-poppins">Profile</span>
        </Link>
        <Link
          to="/logout"
          className={`flex items-center px-4 py-3 transition-all duration-300 ${
            isActive('/logout')
              ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
              : 'hover:bg-blue-gray-200 hover:text-accent-blue hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          }`}
        >
          <HiOutlineLogout className="h-5 w-5 mr-4" />
          <span className="font-poppins">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;