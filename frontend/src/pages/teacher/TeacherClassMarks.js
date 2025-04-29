import { useEffect, useState } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, updateStudentMarks } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, TextField } from '@mui/material';
import { BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";

const TeacherClassMarks = () => {
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclasses?.[0]?._id;
    const subjectID = currentUser.teachSubjects?.[0]?._id;

    const [marks, setMarks] = useState({});
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID]);

    useEffect(() => {
        if (sclassStudents.length > 0) {
            const initialMarks = sclassStudents.reduce((acc, student) => {
                const studentMark = student.examResult?.find(
                    (result) => result.subName === subjectID
                );
                acc[student._id] = studentMark?.marksObtained || 0;
                return acc;
            }, {});
            setMarks(initialMarks);
        }
    }, [sclassStudents, subjectID]);

    const handleMarksChange = (studentId, value) => {
        setMarks((prev) => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSaveMarks = async () => {
        setSaveError(null);
        try {
            const promises = Object.keys(marks).map((studentId) => {
                const marksObtained = parseInt(marks[studentId], 10);
                if (!isNaN(marksObtained)) {
                    return dispatch(updateStudentMarks({ studentID: studentId, subName: subjectID, marksObtained })).unwrap();
                }
                return Promise.resolve();
            });
            await Promise.all(promises);
            alert("Marks saved successfully!");
        } catch (error) {
            setSaveError(error || "Failed to save marks. Please try again.");
        }
    };

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        {
            id: 'marks',
            label: 'Marks Obtained',
            minWidth: 170,
            format: (value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        type="number"
                        value={marks[row.id] || 0}
                        onChange={(e) => handleMarksChange(row.id, e.target.value)}
                        size="small"
                        inputProps={{ min: 0, max: 100 }}
                        sx={{ width: 80 }}
                    />
                </Box>
            ),
        },
    ];

    const studentRows = sclassStudents.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    const StudentsButtonHaver = () => null;

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Marks
                    </Typography>
                    {error && (
                        <Typography color="error" align="center">
                            Error: {error}
                        </Typography>
                    )}
                    {saveError && (
                        <Typography color="error" align="center">
                            {saveError}
                        </Typography>
                    )}
                    {getresponse ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            {getresponse}
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Typography variant="h5" gutterBottom>
                                Students Marks:
                            </Typography>
                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 ? (
                                <>
                                    <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                        <BlueButton
                                            variant="contained"
                                            onClick={handleSaveMarks}
                                        >
                                            Save Marks
                                        </BlueButton>
                                    </Box>
                                </>
                            ) : (
                                <Typography align="center">No Students Available</Typography>
                            )}
                        </Paper>
                    )}
                </>
            )}
        </>
    );
};

export default TeacherClassMarks;