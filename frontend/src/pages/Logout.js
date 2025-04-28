import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-6">
            <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn max-w-md w-full shadow-[0_0_15px_rgba(59,130,246,0.2)] font-poppins">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                    {currentUser.name}
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Are you sure you want to log out?
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 font-poppins"
                    >
                        Log Out
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-gray-500/50 font-poppins"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logout;