import { useEffect, useState } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents, updateStudentAttendance } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

// Utility function to format date to YYYY-MM-DD
const formatDateToString = (date) => {
    if (!date) return null;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null; // Invalid date
    return parsedDate.toISOString().split('T')[0];
};

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse, attendanceError } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclasses?.[0]?._id;
    const subjectID = currentUser.teachSubjects?.[0]?._id;

    const [attendance, setAttendance] = useState({});
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date in YYYY-MM-DD format

    useEffect(() => {
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID]);

    useEffect(() => {
        if (sclassStudents.length > 0) {
            const initialAttendance = sclassStudents.reduce((acc, student) => {
                console.log(`Processing student ${student.name} (${student._id}):`, student);

                const validAttendance = Array.isArray(student.attendance)
                    ? student.attendance.filter(att => {
                        if (!att || typeof att !== 'object') {
                            console.warn(`Invalid attendance entry (not an object) for student ${student.name}:`, att);
                            return false;
                        }
                        if (!att.date || typeof att.date !== 'string' || att.date.trim() === '') {
                            console.warn(`Invalid or missing date in attendance for student ${student.name}:`, att);
                            return false;
                        }
                        const dateObj = new Date(att.date);
                        if (isNaN(dateObj.getTime())) {
                            console.warn(`Invalid date format in attendance for student ${student.name}:`, att.date);
                            return false;
                        }
                        if (!att.subName || !att.status || !['Present', 'Absent'].includes(att.status)) {
                            console.warn(`Invalid subName or status in attendance for student ${student.name}:`, att);
                            return false;
                        }
                        return true;
                    })
                    : [];

                console.log(`Filtered valid attendance for student ${student.name}:`, validAttendance);

                const formattedSelectedDate = formatDateToString(selectedDate);
                if (!formattedSelectedDate) {
                    console.warn(`Invalid selected date: ${selectedDate}`);
                    return acc;
                }

                const studentAttendance = validAttendance.find((att) => {
                    const attDate = formatDateToString(att.date);
                    return (
                        att.subName === subjectID &&
                        attDate === formattedSelectedDate
                    );
                });

                acc[student._id] = {
                    present: studentAttendance?.status === 'Present' || false,
                    absent: studentAttendance?.status === 'Absent' || false,
                };
                return acc;
            }, {});
            setAttendance(initialAttendance);
        }
    }, [sclassStudents, subjectID, selectedDate]);

    const handleSaveAttendance = async () => {
        setSaveError(null);
        setSaveSuccess(null);
        const formattedDate = formatDateToString(selectedDate);
        if (!formattedDate) {
            setSaveError("Invalid date selected. Please choose a valid date.");
            return;
        }

        try {
            const promises = Object.keys(attendance).map((studentId) => {
                const status = attendance[studentId].present ? 'Present' : attendance[studentId].absent ? 'Absent' : null;
                if (status) {
                    console.log(`Dispatching update for student ${studentId}:`, { studentID: studentId, subName: subjectID, status, date: formattedDate });
                    return dispatch(updateStudentAttendance({ studentID: studentId, subName: subjectID, status, date: formattedDate }))
                        .unwrap()
                        .catch((err) => {
                            console.error(`Failed to update attendance for student ${studentId}:`, err);
                            throw err;
                        });
                }
                return Promise.resolve();
            });
            const results = await Promise.all(promises);
            console.log("Attendance update results:", results);
            setSaveSuccess("Attendance saved successfully!");
            dispatch(getClassStudents(classID));
        } catch (error) {
            console.error("Error saving attendance:", error);
            setSaveError(error.message || "Failed to save attendance. Please try again.");
        }
    };

    const studentColumns = [
        {
            id: 'name',
            label: 'Name',
            minWidth: 170,
            format: (value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography>{value}</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={attendance[row.id]?.present || false}
                                onChange={() => {
                                    setAttendance((prev) => ({
                                        ...prev,
                                        [row.id]: { present: true, absent: false }
                                    }));
                                }}
                                disabled={attendance[row.id]?.absent || false}
                                size="small"
                            />
                        }
                        label="Present"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={attendance[row.id]?.absent || false}
                                onChange={() => {
                                    setAttendance((prev) => ({
                                        ...prev,
                                        [row.id]: { present: false, absent: true }
                                    }));
                                }}
                                disabled={attendance[row.id]?.present || false}
                                size="small"
                            />
                        }
                        label="Absent"
                    />
                </Box>
            ),
        },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    });

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Provide Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) {
                handleMarks();
            }
        };

        const handleMarks = () => {
            navigate(`/Teacher/class/marks`);
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        };

        return (
            <>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Teacher/class/student/" + row.id)}
                >
                    View
                </BlueButton>
                <React.Fragment>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <BlackButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </BlackButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Details
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <label htmlFor="attendance-date" style={{ marginRight: '10px', alignSelf: 'center' }}>
                            Select Date:
                        </label>
                        <input
                            type="date"
                            id="attendance-date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ padding: '8px', fontSize: '16px' }}
                        />
                    </Box>
                    {error && (
                        <Typography color="error" align="center">
                            Error: {error}
                        </Typography>
                    )}
                    {attendanceError && (
                        <Typography color="error" align="center">
                            Attendance Error: {attendanceError}
                        </Typography>
                    )}
                    {saveError && (
                        <Typography color="error" align="center">
                            {saveError}
                        </Typography>
                    )}
                    {saveSuccess && (
                        <Typography color="green" align="center">
                            {saveSuccess}
                        </Typography>
                    )}
                    {getresponse ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            {getresponse}
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Typography variant="h5" gutterBottom>
                                Students List:
                            </Typography>
                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 ? (
                                <>
                                    <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                        <BlueButton
                                            variant="contained"
                                            onClick={handleSaveAttendance}
                                        >
                                            Save Attendance
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

export default TeacherClassDetails;