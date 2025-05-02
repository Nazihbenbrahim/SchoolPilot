import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography, Alert, AlertTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import WarningIcon from '@mui/icons-material/Warning';

import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        // Vérifier si currentUser existe avant d'accéder à _id
        if (currentUser && currentUser._id) {
            console.log("Récupération des détails de l'étudiant pour l'assiduité:", currentUser._id);
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            console.log("Détails de l'étudiant reçus pour l'assiduité:", userDetails);
            
            if (userDetails.attendance && userDetails.attendance.length > 0) {
                console.log("Données d'assiduité trouvées:", userDetails.attendance);
                setSubjectAttendance(userDetails.attendance);
            } else {
                console.log("Aucune donnée d'assiduité trouvée");
                setSubjectAttendance([]);
            }
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    
    // Calculer le nombre d'absences par matière
    const calculateAbsencesPerSubject = (attendanceBySubject) => {
        const absencesPerSubject = {};
        
        Object.entries(attendanceBySubject).forEach(([subName, { allData, subId }]) => {
            const absences = allData.filter(data => data.status === 'Absent').length;
            absencesPerSubject[subId] = {
                subName,
                absences,
                isAtRisk: absences >= 3,
                isEliminated: absences >= 4
            };
        });
        
        return absencesPerSubject;
    };
    
    const absencesPerSubject = calculateAbsencesPerSubject(attendanceBySubject);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    // Composant d'alerte pour les étudiants à risque d'élimination
    const renderAbsenceAlerts = () => {
        const atRiskSubjects = Object.values(absencesPerSubject).filter(subject => subject.isAtRisk && !subject.isEliminated);
        const eliminatedSubjects = Object.values(absencesPerSubject).filter(subject => subject.isEliminated);
        
        return (
            <Box sx={{ mb: 3 }}>
                {atRiskSubjects.length > 0 && (
                    <Alert 
                        severity="warning" 
                        icon={<WarningIcon />}
                        sx={{ mb: 2 }}
                    >
                        <AlertTitle>Avertissement d'absence</AlertTitle>
                        <Typography variant="body1">
                            Vous avez atteint 3 absences dans {atRiskSubjects.length > 1 ? 'les matières suivantes' : 'la matière suivante'} :
                            <ul>
                                {atRiskSubjects.map((subject, index) => (
                                    <li key={index}><strong>{subject.subName}</strong> - 3 absences</li>
                                ))}
                            </ul>
                            <strong>Attention :</strong> À la 4ème absence, vous serez éliminé(e) de cette matière.
                        </Typography>
                    </Alert>
                )}
                
                {eliminatedSubjects.length > 0 && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 2 }}
                    >
                        <AlertTitle>Alerte d'élimination</AlertTitle>
                        <Typography variant="body1">
                            Vous avez atteint ou dépassé 4 absences dans {eliminatedSubjects.length > 1 ? 'les matières suivantes' : 'la matière suivante'} :
                            <ul>
                                {eliminatedSubjects.map((subject, index) => (
                                    <li key={index}><strong>{subject.subName}</strong> - {subject.absences} absences</li>
                                ))}
                            </ul>
                            <strong>Vous êtes éliminé(e) de {eliminatedSubjects.length > 1 ? 'ces matières' : 'cette matière'}.</strong> Veuillez contacter votre administration pour plus d'informations.
                        </Typography>
                    </Alert>
                )}
            </Box>
        );
    };
    
    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Attendance
                </Typography>
                
                {/* Afficher les alertes d'absence */}
                {renderAbsenceAlerts()}
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Present</StyledTableCell>
                            <StyledTableCell>Total Sessions</StyledTableCell>
                            <StyledTableCell>Attendance Percentage</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                        const absenceInfo = absencesPerSubject[subId] || { absences: 0, isAtRisk: false, isEliminated: false };
                        
                        // Déterminer le style de la ligne en fonction du nombre d'absences
                        const rowStyle = absenceInfo.isEliminated 
                            ? { backgroundColor: 'rgba(244, 67, 54, 0.15)' } // Rouge pour éliminé
                            : absenceInfo.isAtRisk 
                                ? { backgroundColor: 'rgba(255, 152, 0, 0.15)' } // Orange pour à risque
                                : {};

                        return (
                            <TableBody key={index}>
                                <StyledTableRow style={rowStyle}>
                                    <StyledTableCell>
                                        {subName}
                                        {absenceInfo.isEliminated && (
                                            <Typography variant="caption" color="error" display="block">
                                                Éliminé(e) - {absenceInfo.absences} absences
                                            </Typography>
                                        )}
                                        {absenceInfo.isAtRisk && !absenceInfo.isEliminated && (
                                            <Typography variant="caption" color="warning.main" display="block">
                                                Attention - {absenceInfo.absences} absences
                                            </Typography>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>{present}</StyledTableCell>
                                    <StyledTableCell>{sessions}</StyledTableCell>
                                    <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button variant="contained"
                                            onClick={() => handleOpen(subId)}>
                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Attendance Details
                                                </Typography>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>Date</StyledTableCell>
                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allData.map((data, index) => {
                                                            const date = new Date(data.date);
                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                            return (
                                                                <StyledTableRow key={index}>
                                                                    <StyledTableCell component="th" scope="row">
                                                                        {dateString}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                </StyledTableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        )
                    }
                    )}
                </Table>
                <div>
                    Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                </div>
            </>
        )
    }

    const renderChartSection = () => {
        return (
            <>
                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
            </>
        )
    };

    return (
        <>
            {loading
                ? (
                    <div>Loading...</div>
                )
                :
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ?
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                        :
                        <>
                            <Typography variant="h6" gutterBottom component="div">
                                Currently You Have No Attendance Details
                            </Typography>
                        </>
                    }
                </div>
            }
        </>
    )
}

export default ViewStdAttendance