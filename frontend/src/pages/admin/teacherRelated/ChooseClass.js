import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID);
        } else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID);
        }
    };

    const sclassColumns = [
        { id: 'name', label: 'CLASS NAME' },
    ];

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    });

    const SclassButtonHaver = ({ row }) => {
        return (
            <button
                onClick={() => navigateHandler(row.id)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 font-poppins"
            >
                Choose
            </button>
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
                    Error: {error.message || "Failed to load classes"}
                </div>
            ) : getresponse ? (
                <div className="flex justify-end mt-4 animate-fadeIn">
                    <button
                        onClick={() => navigate("/Admin/addclass")}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                    >
                        Add Class
                    </button>
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Choose a Class
                    </h3>
                    <div className="relative">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-200/50">
                                    {sclassColumns.map((column) => (
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
                                {sclassRows.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${
                                            index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                                        }`}
                                    >
                                        <td className="px-4 py-3 text-gray-900">{row.name}</td>
                                        <td className="px-4 py-3">{<SclassButtonHaver row={row} />}</td>
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

export default ChooseClass;