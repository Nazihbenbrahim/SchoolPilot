import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    };

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance };

    const submitHandler = (event) => {
        event.preventDefault();
        if (sclassName === "") {
            setMessage("Please select a class");
            setShowPopup(true);
        } else {
            setLoader(true);
            dispatch(registerUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-6">
            <form
                onSubmit={submitHandler}
                className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 md:p-8 max-w-md w-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-fadeIn font-poppins"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
                    Add Student
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Enter student's name..."
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                            autoComplete="name"
                            required
                        />
                    </div>
                    {situation === "Student" && (
                        <div>
                            <label className="block text-gray-700 mb-2">Class</label>
                            <select
                                value={className}
                                onChange={changeHandler}
                                className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                required
                            >
                                <option value="Select Class">Select Class</option>
                                {sclassesList.map((classItem, index) => (
                                    <option key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 mb-2">Roll Number</label>
                        <input
                            type="number"
                            placeholder="Enter student's roll number..."
                            value={rollNum}
                            onChange={(event) => setRollNum(event.target.value)}
                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter student's password..."
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={loader}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center"
                    >
                        {loader ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></div>
                        ) : (
                            'Add'
                        )}
                    </button>
                </div>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddStudent;