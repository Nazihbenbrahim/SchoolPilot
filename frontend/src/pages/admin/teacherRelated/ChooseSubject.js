import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false);

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            setClassID(params.id);
            dispatch(getTeacherFreeClassSubjects(params.id));
        } else if (situation === "Teacher") {
            const { classID, teacherID } = params;
            setClassID(classID);
            setTeacherID(teacherID);
            dispatch(getTeacherFreeClassSubjects(classID));
        }
    }, [situation, params, dispatch]);

    const updateSubjectHandler = (teacherId, teachSubject) => {
        setLoader(true);
        dispatch(updateTeachSubject(teacherId, teachSubject));
        navigate("/Admin/teachers");
    };

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 font-poppins text-lg">
                    Error: {error.message || "Failed to load subjects"}
                </div>
            ) : response ? (
                <div className="animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Sorry, all subjects have teachers assigned already
                    </h3>
                    <div className="flex justify-end">
                        <button
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 font-poppins"
                        >
                            Add Subjects
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Choose a Subject
                    </h3>
                    <div className="relative">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-200/50">
                                    <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">#</th>
                                    <th className="px-4 py-3 text-gray-900 font-semibold font-poppins text-center">Subject Name</th>
                                    <th className="px-4 py-3 text-gray-900 font-semibold font-poppins text-center">Subject Code</th>
                                    <th className="px-4 py-3 text-gray-900 font-semibold font-poppins text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(subjectsList) && subjectsList.length > 0 && subjectsList.map((subject, index) => (
                                    <tr
                                        key={subject._id}
                                        className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${
                                            index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                                        }`}
                                    >
                                        <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                                        <td className="px-4 py-3 text-gray-900 text-center">{subject.subName}</td>
                                        <td className="px-4 py-3 text-gray-900 text-center">{subject.subCode}</td>
                                        <td className="px-4 py-3 text-center">
                                            {situation === "Norm" ? (
                                                <button
                                                    onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 font-poppins"
                                                >
                                                    Choose
                                                </button>
                                            ) : (
                                                <button
                                                    disabled={loader}
                                                    onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 font-poppins flex items-center space-x-2 mx-auto"
                                                >
                                                    {loader ? (
                                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                                    ) : (
                                                        'Choose Subject'
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChooseSubject;