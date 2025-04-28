import React, { useEffect, useState } from 'react';
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiPlus, HiChartBar, HiTable } from 'react-icons/hi';

const ViewSubject = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

    const { classID, subjectID } = params;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('attendance');

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (newSection) => {
        setSelectedSection(newSection);
    };

    const studentColumns = [
        { id: 'rollNum', label: 'ROLL NO.' },
        { id: 'name', label: 'NAME' },
    ];

    const studentRows = sclassStudents.map((student) => {
        return {
            rollNum: student.rollNum,
            name: student.name,
            id: student._id,
        };
    });

    const StudentsAttendanceButtonHaver = ({ row }) => {
        return (
            <div className="flex space-x-2">
                <button
                    onClick={() => navigate(`/Admin/students/student/${row.id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn font-poppins"
                >
                    View
                </button>
                <button
                    onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 animate-slideIn font-poppins"
                >
                    Take Attendance
                </button>
            </div>
        );
    };

    const StudentsMarksButtonHaver = ({ row }) => {
        return (
            <div className="flex space-x-2">
                <button
                    onClick={() => navigate(`/Admin/students/student/${row.id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn font-poppins"
                >
                    View
                </button>
                <button
                    onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 animate-slideIn font-poppins"
                >
                    Provide Marks
                </button>
            </div>
        );
    };

    const SubjectStudentsSection = () => {
        const numberOfStudents = sclassStudents.length;

        return (
            <>
                {getresponse ? (
                    <div className="flex justify-end mt-4 animate-fadeIn">
                        <button
                            onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn font-poppins"
                        >
                            Add Students
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                            Students List ({numberOfStudents})
                        </h3>
                        <div className="relative">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-200/50">
                                        {studentColumns.map((column) => (
                                            <th
                                                key={column.id}
                                                className="px-4 py-3 text-gray-900 font-semibold font-poppins"
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentRows.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${
                                                index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-gray-900">{row.rollNum}</td>
                                            <td className="px-4 py-3 text-gray-900">{row.name}</td>
                                            <td className="px-4 py-3">
                                                {selectedSection === 'attendance' ? (
                                                    <StudentsAttendanceButtonHaver row={row} />
                                                ) : (
                                                    <StudentsMarksButtonHaver row={row} />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="fixed bottom-6 left-0 right-0 flex justify-center space-x-4 bg-gray-100/80 backdrop-blur-md border-t border-gray-300/50 py-2">
                            <button
                                onClick={() => handleSectionChange('attendance')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins flex items-center space-x-2 ${
                                    selectedSection === 'attendance'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                <HiTable className="h-5 w-5" />
                                <span>Attendance</span>
                            </button>
                            <button
                                onClick={() => handleSectionChange('marks')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins flex items-center space-x-2 ${
                                    selectedSection === 'marks'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                <HiChartBar className="h-5 w-5" />
                                <span>Marks</span>
                            </button>
                        </div>
                    </>
                )}
            </>
        );
    };

    const SubjectDetailsSection = () => {
        const numberOfStudents = sclassStudents.length;

        return (
            <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 font-poppins">
                    Subject Details
                </h2>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Subject Name: {subjectDetails?.subName || 'N/A'}
                </p>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Subject Code: {subjectDetails?.subCode || 'N/A'}
                </p>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Subject Sessions: {subjectDetails?.sessions || 'N/A'}
                </p>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Number of Students: {numberOfStudents}
                </p>
                <p className="text-lg text-gray-700 mb-4 font-poppins">
                    Class Name: {subjectDetails?.sclassName?.sclassName || 'N/A'}
                </p>
                {subjectDetails?.teacher ? (
                    <p className="text-lg text-gray-700 mb-4 font-poppins">
                        Teacher Name: {subjectDetails.teacher.name}
                    </p>
                ) : (
                    <button
                        onClick={() => navigate(`/Admin/teachers/addteacher/${subjectDetails?._id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn font-poppins"
                    >
                        Add Subject Teacher
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6">
            {subloading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 font-poppins text-lg">
                    Error: {error.message || "Failed to load subject details"}
                </div>
            ) : (
                <div>
                    <div className="fixed top-16 left-0 right-0 z-10 bg-gray-100/80 backdrop-blur-lg border-b border-gray-300/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <div className="flex space-x-4 p-4 overflow-x-auto">
                            <button
                                onClick={() => handleChange('1')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                                    value === '1'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => handleChange('2')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                                    value === '2'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                Students
                            </button>
                        </div>
                    </div>
                    <div className="mt-16">
                        {value === '1' && <SubjectDetailsSection />}
                        {value === '2' && <SubjectStudentsSection />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSubject;