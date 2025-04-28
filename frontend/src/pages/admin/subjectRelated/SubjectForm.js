import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoader(false);
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
                className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 md:p-8 max-w-2xl w-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-fadeIn font-poppins"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
                    Add Subjects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {subjects.map((subject, index) => (
                        <React.Fragment key={index}>
                            <div className="col-span-1">
                                <label className="block text-gray-700 mb-2">Subject Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter subject name..."
                                    value={subject.subName}
                                    onChange={handleSubjectNameChange(index)}
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 mb-2">Subject Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter subject code..."
                                    value={subject.subCode}
                                    onChange={handleSubjectCodeChange(index)}
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 mb-2">Sessions</label>
                                <input
                                    type="number"
                                    placeholder="Enter number of sessions..."
                                    value={subject.sessions}
                                    onChange={handleSessionsChange(index)}
                                    min="0"
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    required
                                />
                            </div>
                            <div className="col-span-1 flex items-end">
                                {index === 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleAddSubject}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins"
                                    >
                                        Add Subject
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleRemoveSubject(index)}
                                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 font-poppins"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loader}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-poppins flex items-center"
                    >
                        {loader ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></div>
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>
                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </form>
        </div>
    );
};

export default SubjectForm;