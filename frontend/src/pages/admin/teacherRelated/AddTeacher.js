import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllSclasses, getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { registerUser, updateTeacherSubjectsAndClasses } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const AddTeacher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { status, response, error } = useSelector(state => state.user);
    const { sclassesList, subjectsList } = useSelector((state) => state.sclass);
    const { teacherDetails } = useSelector(state => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const teacherID = params.id;

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getAllSclasses(currentUser._id, "Sclass"));
            dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            if (teacherID) {
                dispatch(getTeacherDetails(teacherID));
            }
        }
    }, [dispatch, currentUser, teacherID]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [teachClasses, setTeachClasses] = useState([]); // [{ classId, subjects: [] }]

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (teacherID && teacherDetails) {
            setName(teacherDetails.name || '');
            setEmail(teacherDetails.email || '');
            // Check localStorage for the class-subject mapping
            const storedMapping = localStorage.getItem(`teacherMapping_${teacherID}`);
            if (storedMapping) {
                setTeachClasses(JSON.parse(storedMapping));
            } else {
                setTeachClasses(
                    teacherDetails.teachClasses?.map(cls => ({
                        classId: cls.classId || cls._id,
                        subjects: cls.subjects?.map(subject => subject._id || subject) || []
                    })) || teacherDetails.teachSclasses?.map(cls => ({
                        classId: cls._id || cls,
                        subjects: teacherDetails.teachSubjects?.map(subject => subject._id || subject) || []
                    })) || []
                );
            }
        }
    }, [teacherDetails, teacherID]);

    const role = "Teacher";
    const school = currentUser?._id;

    // Convert teachClasses to teachSclasses and teachSubjects for backend compatibility
    const teachSclasses = teachClasses.map(cls => cls.classId);
    const teachSubjects = [...new Set(teachClasses.flatMap(cls => cls.subjects))]; // Flatten and deduplicate subjects

    const fields = teacherID
        ? { teacherId: teacherID, teachSclasses, teachSubjects }
        : { name, email, password, role, school, teachSclasses, teachSubjects };

    const handleClassChange = (classId) => {
        if (teachClasses.some(cls => cls.classId === classId)) {
            setTeachClasses(teachClasses.filter(cls => cls.classId !== classId));
        } else {
            setTeachClasses([...teachClasses, { classId, subjects: [] }]);
        }
    };

    const handleSubjectChange = (classId, subjectId) => {
        setTeachClasses(teachClasses.map(cls => {
            if (cls.classId === classId) {
                const updatedSubjects = cls.subjects.includes(subjectId)
                    ? cls.subjects.filter(id => id !== subjectId)
                    : [...cls.subjects, subjectId];
                return { ...cls, subjects: updatedSubjects };
            }
            return cls;
        }));
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (!currentUser?._id) {
            setMessage("User not logged in");
            setShowPopup(true);
            return;
        }
        setLoader(true);
        if (teacherID) {
            dispatch(updateTeacherSubjectsAndClasses(fields));
        } else {
            dispatch(registerUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added' || status === 'success') {
            // Store the class-subject mapping in localStorage
            if (teacherID) {
                localStorage.setItem(`teacherMapping_${teacherID}`, JSON.stringify(teachClasses));
            }
            dispatch(underControl());
            navigate("/Admin/teachers");
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch, teacherID, teachClasses]);

    if (!currentUser) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-6">
            <form
                onSubmit={submitHandler}
                className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 md:p-8 max-w-md w-full shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-fadeIn font-poppins"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
                    {teacherID ? "Edit Teacher" : "Add Teacher"}
                </h2>
                <div className="space-y-4">
                    {!teacherID && (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter teacher's name..."
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter teacher's email..."
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter teacher's password..."
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-gray-700 mb-2">Classes and Subjects</label>
                        {sclassesList.map((sclass) => (
                            <div key={sclass._id} className="mb-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={teachClasses.some(cls => cls.classId === sclass._id)}
                                        onChange={() => handleClassChange(sclass._id)}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span>{sclass.sclassName}</span>
                                </label>
                                {teachClasses.some(cls => cls.classId === sclass._id) && (
                                    <div className="mt-2 ml-6">
                                        <label className="block text-gray-600 text-sm mb-1">Select Subjects for {sclass.sclassName}</label>
                                        <select
                                            multiple
                                            value={teachClasses.find(cls => cls.classId === sclass._id)?.subjects || []}
                                            onChange={(event) => {
                                                const selectedSubjects = Array.from(event.target.selectedOptions, option => option.value);
                                                selectedSubjects.forEach(subjectId => handleSubjectChange(sclass._id, subjectId));
                                            }}
                                            className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins h-32"
                                        >
                                            {subjectsList.map((subject) => (
                                                <option key={subject._id} value={subject._id}>
                                                    {subject.subName}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-sm text-gray-500 mt-1 font-poppins">
                                            Hold Ctrl (or Command on Mac) to select multiple subjects.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
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
                            teacherID ? 'Update' : 'Register'
                        )}
                    </button>
                </div>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddTeacher;