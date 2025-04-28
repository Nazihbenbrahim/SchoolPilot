import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    const handleAddSubjectAndClass = () => {
        navigate(`/Admin/teachers/edit/${teacherDetails?._id}`);
    };

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 font-poppins text-lg">
                    Error: {error.message || "Failed to load teacher details"}
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 font-poppins">
                        Teacher Details
                    </h2>
                    <p className="text-lg text-gray-700 mb-2 font-poppins">
                        Teacher Name: {teacherDetails?.name || 'N/A'}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-poppins">
                        Classes
                    </h3>
                    {teacherDetails?.teachSclasses?.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 font-poppins">
                            {teacherDetails.teachSclasses.map((sclass, index) => (
                                <li key={index} className="mb-1">{sclass.sclassName}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 font-poppins">No classes assigned</p>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4 font-poppins">
                        Subjects
                    </h3>
                    {teacherDetails?.teachSubjects?.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 font-poppins">
                            {teacherDetails.teachSubjects.map((subject, index) => (
                                <li key={index} className="mb-1">{`${subject.subName} (${subject.sessions} sessions)`}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 font-poppins">No subjects assigned</p>
                    )}
                    <div className="mt-6">
                        <button
                            onClick={handleAddSubjectAndClass}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                        >
                            Add Subjects and Classes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDetails;