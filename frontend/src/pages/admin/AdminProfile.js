import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../../redux/userRelated/userHandle'; // Adjusted path
import Popup from '../../components/Popup'; // Adjusted path
import { HiChevronUp, HiChevronDown } from 'react-icons/hi';

const AdminProfile = () => {
    const dispatch = useDispatch();
    const { userDetails, loading, error, status, response } = useSelector((state) => state.user);
    const { currentUser } = useSelector(state => state.user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Admin"));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setEmail(userDetails.email || '');
        }
    }, [userDetails]);

    const fields = { name, email };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(updateUser(fields, currentUser._id, "Admin")).then(() => {
            dispatch(getUserDetails(currentUser._id, "Admin"));
            setShowEditForm(false);
        });
    };

    useEffect(() => {
        if (status === 'success') {
            setMessage("Profile updated successfully");
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, response, error]);

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 font-poppins text-lg">
                    Error: {error.message || "Failed to load profile"}
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn max-w-md mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 font-poppins">
                        Admin Profile
                    </h2>
                    <p className="text-lg text-gray-700 mb-2 font-poppins">
                        Name: {userDetails?.name || 'N/A'}
                    </p>
                    <p className="text-lg text-gray-700 mb-2 font-poppins">
                        Email: {userDetails?.email || 'N/A'}
                    </p>
                    <p className="text-lg text-gray-700 mb-4 font-poppins">
                        School: {userDetails?.school?.schoolName || 'N/A'}
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowEditForm(!showEditForm)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center space-x-2"
                        >
                            {showEditForm ? <HiChevronUp className="h-5 w-5" /> : <HiChevronDown className="h-5 w-5" />}
                            <span>Edit Profile</span>
                        </button>
                    </div>
                    {showEditForm && (
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
                                            placeholder="Enter your name..."
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            className="w-full px-4 py-2 bg-gray-300/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                            autoComplete="name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email..."
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            className="w-full px-4 py-2 bg-gray-300/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={loader}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center"
                                    >
                                        {loader ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></div>
                                        ) : (
                                            'Update'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AdminProfile;