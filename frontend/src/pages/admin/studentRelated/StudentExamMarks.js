import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import Popup from '../../../components/Popup';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams();

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id;
            dispatch(getUserDetails(stdID, "Student"));
        } else if (situation === "Subject") {
            const { studentID, subjectID } = params;
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    };

    const validateForm = () => {
        if (!chosenSubName) {
            setMessage("Veuillez sélectionner une matière");
            setShowPopup(true);
            return false;
        }
        if (!marksObtained && marksObtained !== 0) {
            setMessage("Veuillez entrer une note valide");
            setShowPopup(true);
            return false;
        }
        // Vérifier que la note est un nombre
        if (isNaN(Number(marksObtained))) {
            setMessage("La note doit être un nombre");
            setShowPopup(true);
            return false;
        }
        return true;
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        // S'assurer que les données sont au bon format
        const fields = { 
            subName: chosenSubName, 
            marksObtained: Number(marksObtained) 
        };

        console.log("Sending exam marks data:", fields);
        setLoader(true);
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"));
    };

    useEffect(() => {
        if (response) {
            setLoader(false);
            setShowPopup(true);
            setMessage(response);
        } else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("Error occurred while updating marks");
        } else if (statestatus === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Done Successfully");
        }
    }, [response, statestatus, error]);

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 md:p-8 max-w-md w-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-fadeIn font-poppins">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                            Student Name: {userDetails?.name || 'N/A'}
                        </h2>
                        {currentUser.teachSubject && (
                            <h2 className="text-xl font-semibold text-gray-900 mt-2 font-poppins">
                                Subject Name: {currentUser.teachSubject?.subName || 'N/A'}
                            </h2>
                        )}
                    </div>
                    <form onSubmit={submitHandler} className="space-y-4">
                        {situation === "Student" && (
                            <div>
                                <label className="block text-gray-700 mb-2">Select Subject</label>
                                <select
                                    value={subjectName}
                                    onChange={changeHandler}
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjectsList ? (
                                        subjectsList.map((subject, index) => (
                                            <option key={index} value={subject.subName}>
                                                {subject.subName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Add Subjects For Marks</option>
                                    )}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 mb-2">Enter Marks</label>
                            <input
                                type="number"
                                value={marksObtained}
                                onChange={(e) => setMarksObtained(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                required
                            />
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
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </form>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </div>
            )}
        </div>
    );
};

export default StudentExamMarks;