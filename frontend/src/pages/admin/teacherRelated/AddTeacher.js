import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllSclasses, getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { registerUser, updateTeacherSubjectsAndClasses } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import Popup from '../../../components/Popup';

const AddTeacher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { status, response, error } = useSelector(state => state.user);
    const { sclassesList, subjectsList } = useSelector((state) => state.sclass);
    const { teacherDetails } = useSelector(state => state.teacher); // Correct selector for teacher slice
    const { currentUser } = useSelector(state => state.user); // Correct selector for user slice

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
    const [teachSubjects, setTeachSubjects] = useState([]);
    const [teachSclasses, setTeachSclasses] = useState([]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (teacherID && teacherDetails) {
            setName(teacherDetails.name || '');
            setEmail(teacherDetails.email || '');
            setTeachSubjects(teacherDetails.teachSubjects?.map(subject => subject._id) || []);
            setTeachSclasses(teacherDetails.teachSclasses?.map(sclass => sclass._id) || []);
        }
    }, [teacherDetails, teacherID]);

    const role = "Teacher";
    const school = currentUser?._id;

    const fields = teacherID
        ? { teacherId: teacherID, teachSubjects, teachSclasses }
        : { name, email, password, role, school, teachSubjects, teachSclasses };

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
    }, [status, navigate, error, response, dispatch]);

    if (!currentUser) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">{teacherID ? "Edit Teacher" : "Add Teacher"}</span>
                    <br />
                    {!teacherID && (
                        <>
                            <label>Name</label>
                            <TextField
                                className="registerInput"
                                type="text"
                                placeholder="Enter teacher's name..."
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name"
                                required
                                fullWidth
                            />
                            <label>Email</label>
                            <TextField
                                className="registerInput"
                                type="email"
                                placeholder="Enter teacher's email..."
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                                fullWidth
                            />
                            <label>Password</label>
                            <TextField
                                className="registerInput"
                                type="password"
                                placeholder="Enter teacher's password..."
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                                fullWidth
                            />
                        </>
                    )}
                    <FormControl fullWidth>
                        <InputLabel>Classes</InputLabel>
                        <Select
                            multiple
                            value={teachSclasses}
                            onChange={(event) => setTeachSclasses(event.target.value)}
                        >
                            {sclassesList.map((sclass) => (
                                <MenuItem key={sclass._id} value={sclass._id}>
                                    {sclass.sclassName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Subjects</InputLabel>
                        <Select
                            multiple
                            value={teachSubjects}
                            onChange={(event) => setTeachSubjects(event.target.value)}
                        >
                            {subjectsList.map((subject) => (
                                <MenuItem key={subject._id} value={subject._id}>
                                    {subject.subName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            teacherID ? 'Update' : 'Register'
                        )}
                    </Button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddTeacher;