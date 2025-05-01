import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { HiPlus, HiTrash } from 'react-icons/hi';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser, status } = useSelector(state => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [deleteAddress, setDeleteAddress] = useState(null);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    useEffect(() => {
        if (status === 'success') {
            dispatch(getAllTeachers(currentUser._id));
        }
    }, [status, currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        setTeacherToDelete(deleteID);
        setDeleteAddress(address);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        dispatch(deleteUser(teacherToDelete, deleteAddress)).then(() => {
            dispatch(getAllTeachers(currentUser._id));
            setShowDeleteDialog(false);
            setTeacherToDelete(null);
            setDeleteAddress(null);
        });
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setTeacherToDelete(null);
        setDeleteAddress(null);
    };

    const columns = [
        { id: 'name', label: 'NAME' },
        { id: 'subjects', label: 'SUBJECTS' },
        { id: 'classes', label: 'CLASSES' },
    ];

    // Flatten teacher data into rows with class-subject mappings
    const rows = teachersList.flatMap((teacher) => {
        const teacherRows = [];
        // Load the class-subject mapping from localStorage
        const storedMapping = localStorage.getItem(`teacherMapping_${teacher._id}`);
        let teachClasses = [];

        try {
            teachClasses = storedMapping ? JSON.parse(storedMapping) : teacher.teachClasses || [];
            console.log(`Teacher ${teacher._id} mapping:`, teachClasses); // Debug log
        } catch (e) {
            console.error(`Error parsing teacher mapping for ${teacher._id}:`, e);
            teachClasses = teacher.teachClasses || [];
        }

        if (!teachClasses || teachClasses.length === 0) {
            // If no classes, show a single row with "None" for subjects and classes
            teacherRows.push({
                name: teacher.name,
                subjects: 'None',
                classes: 'None',
                id: teacher._id,
                isFirstRow: true,
            });
        } else {
            teachClasses.forEach((cls, index) => {
                const className = cls.className || teacher.teachSclasses?.find(c => c._id === cls.classId)?.sclassName || 'N/A';
                const subjects = cls.subjects?.length > 0
                    ? cls.subjects.map(subjectId => {
                          const subject = subjectsList.find(sub => sub._id === subjectId);
                          return subject?.subName || subjectId || 'Unknown';
                      }).filter(subject => subject !== 'Unknown').join(', ')
                    : 'None';
                
                teacherRows.push({
                    name: index === 0 ? teacher.name : '', // Show name only on the first row
                    subjects: subjects || 'None',
                    classes: className,
                    id: teacher._id,
                    isFirstRow: index === 0,
                });
            });
        }

        return teacherRows;
    });

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 font-poppins text-lg">
                    Error: {error.message || "Failed to load teachers"}
                </div>
            ) : response ? (
                <div className="flex justify-end mt-4 animate-fadeIn">
                    <button
                        onClick={() => navigate("/Admin/teachers/add")}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 font-poppins"
                    >
                        Add Teacher
                    </button>
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Teachers List
                    </h3>
                    {rows.length === 0 ? (
                        <p className="text-center text-gray-700 font-poppins">No teachers found.</p>
                    ) : (
                        <>
                            <div className="relative">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-200/50">
                                            {columns.map((column) => (
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
                                        {rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => (
                                                <tr
                                                    key={`${row.id}-${index}`}
                                                    className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${
                                                        index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                                                    }`}
                                                >
                                                    <td className="px-4 py-3 text-gray-900">{row.name}</td>
                                                    <td className="px-4 py-3 text-gray-900">{row.subjects}</td>
                                                    <td className="px-4 py-3 text-gray-900">{row.classes}</td>
                                                    <td className="px-4 py-3 flex space-x-2">
                                                        {row.isFirstRow && (
                                                            <>
                                                                <button
                                                                    onClick={() => deleteHandler(row.id, "Teacher")}
                                                                    className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300 animate-slideIn"
                                                                >
                                                                    <HiTrash className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => navigate(`/Admin/teachers/teacher/${row.id}`)}
                                                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn font-poppins"
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => navigate(`/Admin/teachers/edit/${row.id}`)}
                                                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn font-poppins"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-gray-600 font-poppins">
                                    Rows per page: {rowsPerPage} • {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 0}
                                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="fixed bottom-6 right-6 space-x-3">
                                <div className="relative group inline-block">
                                    <button
                                        className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
                                        onClick={() => navigate("/Admin/teachers/add")}
                                    >
                                        <HiPlus className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-poppins">
                                        Add New Teacher
                                    </div>
                                </div>
                                <div className="relative group inline-block">
                                    <button
                                        className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 animate-slideIn"
                                        onClick={() => deleteHandler(currentUser._id, "Teachers")}
                                    >
                                        <HiTrash className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-poppins">
                                        Delete All Teachers
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-700 mb-6 font-poppins">
                            Are you sure you want to delete {deleteAddress === "Teachers" ? "all teachers" : "this teacher"}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all duration-300 font-poppins"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 font-poppins"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowTeachers;