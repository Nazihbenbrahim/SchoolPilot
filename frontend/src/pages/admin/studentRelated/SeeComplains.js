import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';

const SeeComplains = () => {
    const dispatch = useDispatch();
    const { complainsList, loading, error, response } = useSelector((state) => state.complain);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllComplains(currentUser._id, "Complain"));
    }, [currentUser._id, dispatch]);

    const [selectedComplains, setSelectedComplains] = useState([]);

    const handleCheckboxChange = (complainId) => {
        setSelectedComplains((prev) =>
            prev.includes(complainId)
                ? prev.filter((id) => id !== complainId)
                : [...prev, complainId]
        );
    };

    const complainColumns = [
        { id: 'user', label: 'USER' },
        { id: 'complaint', label: 'COMPLAINT' },
        { id: 'date', label: 'DATE' },
    ];

    const complainRows = Array.isArray(complainsList) && complainsList.length > 0
        ? complainsList.map((complain) => {
              const date = new Date(complain.date);
              const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
              return {
                  user: complain.user?.name || 'N/A',
                  complaint: complain.complaint,
                  date: dateString,
                  id: complain._id,
              };
          })
        : [];

    const ComplainButtonHaver = ({ row }) => {
        return (
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={selectedComplains.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
            </label>
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
                    Error: {error.message || "Failed to load complains"}
                </div>
            ) : response ? (
                <div className="text-center text-gray-700 font-poppins text-lg mt-4 animate-fadeIn">
                    No Complains Right Now
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                        Complains List
                    </h3>
                    {complainRows.length === 0 ? (
                        <p className="text-center text-gray-700 font-poppins">No complains found.</p>
                    ) : (
                        <div className="relative">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-200/50">
                                        {complainColumns.map((column) => (
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
                                    {complainRows.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 font-poppins ${
                                                index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-gray-900">{row.user}</td>
                                            <td className="px-4 py-3 text-gray-900">{row.complaint}</td>
                                            <td className="px-4 py-3 text-gray-900">{row.date}</td>
                                            <td className="px-4 py-3">{<ComplainButtonHaver row={row} />}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeeComplains;