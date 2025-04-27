import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const handleAddSubjectAndClass = () => {
        navigate(`/Admin/teachers/edit/${teacherDetails?._id}`); // Updated route
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>
                        Teacher Details
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Teacher Name: {teacherDetails?.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Classes:
                    </Typography>
                    <List>
                        {teacherDetails?.teachSclasses?.length > 0 ? (
                            teacherDetails.teachSclasses.map((sclass, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={sclass.sclassName} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography>No classes assigned</Typography>
                        )}
                    </List>
                    <Typography variant="h6" gutterBottom>
                        Subjects:
                    </Typography>
                    <List>
                        {teacherDetails?.teachSubjects?.length > 0 ? (
                            teacherDetails.teachSubjects.map((subject, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`${subject.subName} (${subject.sessions} sessions)`} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography>No subjects assigned</Typography>
                        )}
                    </List>
                    <Button variant="contained" onClick={handleAddSubjectAndClass}>
                        Add Subjects and Classes
                    </Button>
                </Container>
            )}
        </>
    );
};

export default TeacherDetails;