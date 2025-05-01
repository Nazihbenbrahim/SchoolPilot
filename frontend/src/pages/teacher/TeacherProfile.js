import React from 'react';
import { useSelector } from 'react-redux';
import { HiUserCircle } from 'react-icons/hi';

const TeacherProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    // Handle both teachSclass (old structure) and teachClasses (new structure)
    const teachClasses = currentUser?.teachClasses || (currentUser?.teachSclass ? [currentUser.teachSclass] : []);

    return (
        <div className="p-4 md:p-6">
            <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn max-w-md mx-auto">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 font-poppins flex items-center justify-center">
                    <HiUserCircle className="h-8 w-8 mr-2 text-accent-blue" />
                    Teacher Profile
                </h2>
                <div className="space-y-3 text-gray-700 font-poppins">
                    <p className="text-lg">
                        <span className="font-semibold">Name:</span> {currentUser?.name || 'N/A'}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Email:</span> {currentUser?.email || 'N/A'}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Role:</span> {currentUser?.role || 'Teacher'}
                    </p>
                    <div className="text-lg">
                        <span className="font-semibold">Class(es):</span>
                        {teachClasses.length > 0 ? (
                            <ul className="list-disc list-inside mt-2">
                                {teachClasses.map((cls, index) => (
                                    <li key={index}>
                                        {cls.className || cls.sclassName || 'N/A'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span className="ml-2">No Class Assigned</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;