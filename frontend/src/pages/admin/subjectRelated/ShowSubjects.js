import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { HiPlus, HiTrash } from 'react-icons/hi';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [deleteAddress, setDeleteAddress] = useState(null);

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        setSubjectToDelete(deleteID);
        setDeleteAddress(address);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        dispatch(deleteUser(subjectToDelete, deleteAddress)).then(() => {
            dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            setShowDeleteDialog(false);
            setSubjectToDelete(null);
            setDeleteAddress(null);
        });
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setSubjectToDelete(null);
        setDeleteAddress(null);
    };

    const subjectColumns = [
        { id: 'subName', label: 'SUB NAME' },
        { id: 'sessions', label: 'SESSIONS' },
        { id: 'sclassName', label: 'CLASS' },
    ];

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    });

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <div className="flex space-x-2">
                <button
                    onClick={() => deleteHandler(row.id, "Subject")}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300 animate-slideIn"
                >
                    <HiTrash className="h-5 w-5" />
                </button>
                <button
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
                >
                    View
                </button>
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
                    Error: {error.message || "Failed to load subjects"}
                </div>
            ) : response ? (
                <div className="flex justify-end mt-4 animate-fadeIn">
                    <button
                        onClick={() => navigate("/Admin/subjects/chooseclass")}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn"
                    >
                        Add Subjects
                    </button>
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Subjects List
                    </h3>
                    <div className="relative">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-200/50">
                                    {subjectColumns.map((column) => (
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
                                {subjectRows.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${
                                            index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                                        }`}
                                    >
                                        <td className="px-4 py-3 text-gray-900">{row.subName}</td>
                                        <td className="px-4 py-3 text-gray-900">{row.sessions}</td>
                                        <td className="px-4 py-3 text-gray-900">{row.sclassName}</td>
                                        <td className="px-4 py-3">{<SubjectsButtonHaver row={row} />}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="fixed bottom-6 right-6 space-x-3">
                        <div className="relative group inline-block">
                            <button
                                className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}
                            >
                                <HiPlus className="h-6 w-6" />
                            </button>
                            <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Add New Subject
                            </div>
                        </div>
                        <div className="relative group inline-block">
                            <button
                                className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 animate-slideIn"
                                onClick={() => deleteHandler(currentUser._id, "Subjects")}
                            >
                                <HiTrash className="h-6 w-6" />
                            </button>
                            <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Delete All Subjects
                            </div>
                        </div>
                    </div>
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
                            Are you sure you want to delete {deleteAddress === "Subjects" ? "all subjects" : "this subject"}? This action cannot be undone.
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
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 font-poppins"
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

export default ShowSubjects;