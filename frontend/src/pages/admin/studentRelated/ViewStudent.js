import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import Popup from '../../../components/Popup';
import { HiTrash, HiChevronUp, HiChevronDown, HiTable, HiChartBar } from 'react-icons/hi';

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('table');

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (newSection) => {
        setSelectedSection(newSection);
    };

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const fields = password === "" ? { name, rollNum } : { name, rollNum, password };

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, studentID, address)).then(() => {
            dispatch(getUserDetails(studentID, address));
            setShowTab(false);
        });
    };

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress)).then(() => {
            dispatch(getUserDetails(studentID, address));
        });
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")).then(() => {
            dispatch(getUserDetails(studentID, address));
        });
    };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Attendance
                    </h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-200/50">
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Subject</th>
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Present</th>
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Total Sessions</th>
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Attendance %</th>
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                return (
                                    <React.Fragment key={index}>
                                        <tr className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'}`}>
                                            <td className="px-4 py-3 text-gray-900">{subName}</td>
                                            <td className="px-4 py-3 text-gray-900">{present}</td>
                                            <td className="px-4 py-3 text-gray-900">{sessions}</td>
                                            <td className="px-4 py-3 text-gray-900">{subjectAttendancePercentage}%</td>
                                            <td className="px-4 py-3 text-center space-x-2">
                                                <button
                                                    onClick={() => handleOpen(subId)}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center space-x-1 mx-auto"
                                                >
                                                    {openStates[subId] ? <HiChevronUp className="h-5 w-5" /> : <HiChevronDown className="h-5 w-5" />}
                                                    <span>Details</span>
                                                </button>
                                                <button
                                                    onClick={() => removeSubAttendance(subId)}
                                                    className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300"
                                                >
                                                    <HiTrash className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                                                >
                                                    Change
                                                </button>
                                            </td>
                                        </tr>
                                        {openStates[subId] && (
                                            <tr>
                                                <td colSpan="5" className="p-0">
                                                    <div className="p-4 bg-gray-200/50">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
                                                            Attendance Details
                                                        </h4>
                                                        <table className="w-full text-left">
                                                            <thead>
                                                                <tr className="bg-gray-300/50">
                                                                    <th className="px-4 py-2 text-gray-900 font-poppins">Date</th>
                                                                    <th className="px-4 py-2 text-gray-900 font-poppins text-right">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {allData.map((data, idx) => {
                                                                    const date = new Date(data.date);
                                                                    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                    return (
                                                                        <tr key={idx} className={`border-b border-gray-300/50 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'}`}>
                                                                            <td className="px-4 py-2 text-gray-900 font-poppins">{dateString}</td>
                                                                            <td className="px-4 py-2 text-gray-900 font-poppins text-right">{data.status}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="mt-4 font-poppins text-gray-900">
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </div>
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 font-poppins flex items-center space-x-2"
                        >
                            <HiTrash className="h-5 w-5" />
                            <span>Delete All</span>
                        </button>
                        <button
                            onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                        >
                            Add Attendance
                        </button>
                    </div>
                </>
            );
        };

        const renderChartSection = () => {
            return (
                <div className="mt-4">
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </div>
            );
        };

        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}
                        <div className="fixed bottom-6 left-0 right-0 flex justify-center space-x-4 bg-gray-100/80 backdrop-blur-md border-t border-gray-300/50 py-2">
                            <button
                                onClick={() => handleSectionChange('table')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins flex items-center space-x-2 ${
                                    selectedSection === 'table'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                <HiTable className="h-5 w-5" />
                                <span>Table</span>
                            </button>
                            <button
                                onClick={() => handleSectionChange('chart')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins flex items-center space-x-2 ${
                                    selectedSection === 'chart'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                <HiChartBar className="h-5 w-5" />
                                <span>Chart</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                    >
                        Add Attendance
                    </button>
                )}
            </>
        );
    };

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Subject Marks
                    </h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-200/50">
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Subject</th>
                                <th className="px-4 py-3 text-gray-900 font-semibold font-poppins">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <tr
                                        key={index}
                                        className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'}`}
                                    >
                                        <td className="px-4 py-3 text-gray-900">{result.subName.subName}</td>
                                        <td className="px-4 py-3 text-gray-900">{result.marksObtained}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <button
                        onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                    >
                        Add Marks
                    </button>
                </>
            );
        };

        const renderChartSection = () => {
            return (
                <div className="mt-4">
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </div>
            );
        };

        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}
                        <div className="fixed bottom-6 left-0 right-0 flex justify-center space-x-4 bg-gray-100/80 backdrop-blur-md border-t border-gray-300/50 py-2">
                            <button
                                onClick={() => handleSectionChange('table')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins flex items-center space-x-2 ${
                                    selectedSection === 'table'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                <HiTable className="h-5 w-5" />
                                <span>Table</span>
                            </button>
                            <button
                                onClick={() => handleSectionChange('chart')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins flex items-center space-x-2 ${
                                    selectedSection === 'chart'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                <HiChartBar className="h-5 w-5" />
                                <span>Chart</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                    >
                        Add Marks
                    </button>
                )}
            </>
        );
    };

    const StudentDetailsSection = () => {
        return (
            <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 font-poppins">
                    Student Details
                </h2>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Name: {userDetails.name || 'N/A'}
                </p>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Roll Number: {userDetails.rollNum || 'N/A'}
                </p>
                <p className="text-lg text-gray-700 mb-2 font-poppins">
                    Class: {sclassName?.sclassName || 'N/A'}
                </p>
                <p className="text-lg text-gray-700 mb-4 font-poppins">
                    School: {studentSchool?.schoolName || 'N/A'}
                </p>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                    <div className="mt-4">
                        <CustomPieChart data={chartData} />
                    </div>
                )}
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        onClick={deleteHandler}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 font-poppins"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setShowTab(!showTab)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center space-x-2"
                    >
                        {showTab ? <HiChevronUp className="h-5 w-5" /> : <HiChevronDown className="h-5 w-5" />}
                        <span>Edit Student</span>
                    </button>
                </div>
                {showTab && (
                    <div className="mt-4">
                        <form
                            onSubmit={submitHandler}
                            className="bg-gray-200/50 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-slideIn font-poppins"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                                Edit Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter student's name..."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="w-full px-4 py-2 bg-gray-300/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Roll Number</label>
                                    <input
                                        type="number"
                                        placeholder="Enter student's roll number..."
                                        value={rollNum}
                                        onChange={(event) => setRollNum(event.target.value)}
                                        className="w-full px-4 py-2 bg-gray-300/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Password (Optional)</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password (optional)..."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className="w-full px-4 py-2 bg-gray-300/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 font-poppins text-lg">
                    Error: {error.message || "Failed to load student details"}
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
                                Attendance
                            </button>
                            <button
                                onClick={() => handleChange('3')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                                    value === '3'
                                        ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                                }`}
                            >
                                Marks
                            </button>
                        </div>
                    </div>
                    <div className="mt-16">
                        {value === '1' && <StudentDetailsSection />}
                        {value === '2' && <StudentAttendanceSection />}
                        {value === '3' && <StudentMarksSection />}
                    </div>
                </div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default ViewStudent;