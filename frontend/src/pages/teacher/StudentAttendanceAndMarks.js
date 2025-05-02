import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Checkbox,
    TextField,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents } from '../../redux/sclassRelated/sclassHandle';
import axios from 'axios';

const StudentAttendanceAndMarks = () => {
    const dispatch = useDispatch();
    const { sclassStudents } = useSelector((state) => state.sclass);
    const { selectedClass } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);
    
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    
    // Récupérer les étudiants de la classe sélectionnée
    useEffect(() => {
        if (selectedClass?._id) {
            dispatch(getClassStudents(selectedClass._id));
        }
    }, [dispatch, selectedClass]);
    
    // Récupérer les matières pour la classe sélectionnée
    useEffect(() => {
        if (currentUser?.classSubjectMappings && selectedClass) {
            const classMapping = currentUser.classSubjectMappings.find(
                mapping => mapping.class._id === selectedClass._id
            );
            
            if (classMapping && classMapping.subjects.length > 0) {
                setSelectedSubject(classMapping.subjects[0]);
            } else {
                setSelectedSubject(null);
            }
        }
    }, [currentUser, selectedClass]);
    
    // Initialiser les données des étudiants avec l'assiduité et les notes
    useEffect(() => {
        if (sclassStudents && selectedSubject) {
            setLoading(true);
            
            // Créer un tableau avec les données des étudiants
            const studentsData = sclassStudents.map(student => ({
                _id: student._id,
                name: student.name,
                rollNum: student.rollNum,
                attendance: 'present', // Par défaut, tous les étudiants sont présents
                marks: '',             // Notes vides par défaut
                attendanceLoaded: false,
                marksLoaded: false
            }));
            
            setStudents(studentsData);
            
            // Récupérer les données d'assiduité pour la date et la matière sélectionnées
            fetchAttendanceData(studentsData, selectedSubject._id, attendanceDate);
            
            // Récupérer les notes pour la matière sélectionnée
            fetchMarksData(studentsData, selectedSubject._id);
        }
    }, [sclassStudents, selectedSubject, attendanceDate]);
    
    // Récupérer les données d'assiduité depuis le serveur
    const fetchAttendanceData = async (studentsData, subjectId, date) => {
        try {
            // Initialiser les étudiants avec des valeurs par défaut
            const updatedStudents = studentsData.map(student => ({
                ...student,
                attendance: 'Present', // Valeur par défaut
                attendanceLoaded: true
            }));
            
            // Récupérer les détails de chaque étudiant individuellement
            const attendancePromises = updatedStudents.map(async (student) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Student/${student._id}`);
                    
                    if (response.data && response.data.attendance && response.data.attendance.length > 0) {
                        // Filtrer les enregistrements d'assiduité pour cette matière et cette date
                        const formattedDate = new Date(date).toISOString().split('T')[0];
                        const attendanceRecord = response.data.attendance.find(record => 
                            record.subName.toString() === subjectId &&
                            new Date(record.date).toISOString().split('T')[0] === formattedDate
                        );
                        
                        if (attendanceRecord) {
                            return {
                                ...student,
                                attendance: attendanceRecord.status,
                                attendanceLoaded: true
                            };
                        }
                    }
                    return student;
                } catch (error) {
                    console.error(`Erreur lors de la récupération des données d'assiduité pour l'étudiant ${student._id}:`, error);
                    return student;
                }
            });
            
            const finalStudents = await Promise.all(attendancePromises);
            setStudents(finalStudents);
        } catch (error) {
            console.error("Erreur lors de la récupération des données d'assiduité:", error);
            showSnackbar("Erreur lors de la récupération des données d'assiduité", "error");
            
            // Marquer tous les étudiants comme chargés même en cas d'erreur
            const updatedStudents = studentsData.map(student => ({
                ...student,
                attendanceLoaded: true
            }));
            
            setStudents(updatedStudents);
        }
    };
    
    // Récupérer les notes depuis le serveur
    const fetchMarksData = async (studentsData, subjectId) => {
        try {
            console.log("Récupération des notes pour la matière:", subjectId);
            
            // Initialiser les étudiants avec des valeurs par défaut
            const updatedStudents = studentsData.map(student => ({
                ...student,
                marks: '',
                marksLoaded: false // Initialiser à false pour suivre le chargement
            }));
            
            // Récupérer les détails de chaque étudiant individuellement
            const marksPromises = updatedStudents.map(async (student) => {
                try {
                    console.log(`Récupération des notes pour l'étudiant ${student._id}`);
                    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Student/${student._id}`);
                    
                    console.log(`Données reçues pour l'étudiant ${student._id}:`, response.data);
                    
                    if (response.data && response.data.examResult && response.data.examResult.length > 0) {
                        console.log(`Résultats d'examen trouvés pour l'étudiant ${student._id}:`, response.data.examResult);
                        
                        // Filtrer les notes pour cette matière
                        const marksRecord = response.data.examResult.find(record => {
                            // Vérifier si subName est un objet ou une chaîne
                            const recordSubId = record.subName._id || record.subName;
                            console.log(`Comparaison: ${recordSubId} === ${subjectId}`);
                            return recordSubId.toString() === subjectId.toString();
                        });
                        
                        if (marksRecord) {
                            console.log(`Note trouvée pour l'étudiant ${student._id}:`, marksRecord.marksObtained);
                            return {
                                ...student,
                                marks: marksRecord.marksObtained.toString(),
                                marksLoaded: true
                            };
                        } else {
                            console.log(`Aucune note trouvée pour l'étudiant ${student._id} dans la matière ${subjectId}`);
                        }
                    } else {
                        console.log(`Aucun résultat d'examen trouvé pour l'étudiant ${student._id}`);
                    }
                    return {
                        ...student,
                        marksLoaded: true // Marquer comme chargé même s'il n'y a pas de note
                    };
                } catch (error) {
                    console.error(`Erreur lors de la récupération des notes pour l'étudiant ${student._id}:`, error);
                    return {
                        ...student,
                        marksLoaded: true // Marquer comme chargé même en cas d'erreur
                    };
                }
            });
            
            const finalStudents = await Promise.all(marksPromises);
            setStudents(finalStudents);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des notes:", error);
            showSnackbar("Erreur lors de la récupération des notes", "error");
            
            // Marquer tous les étudiants comme chargés même en cas d'erreur
            const updatedStudents = studentsData.map(student => ({
                ...student,
                marksLoaded: true
            }));
            
            setStudents(updatedStudents);
            setLoading(false);
        }
    };
    
    // Gérer le changement d'assiduité d'un étudiant
    const handleAttendanceChange = (studentId, value) => {
        setStudents(students.map(student => 
            student._id === studentId ? { ...student, attendance: value } : student
        ));
    };
    
    // Gérer le changement de note d'un étudiant
    const handleMarksChange = (studentId, value) => {
        // Vérifier que la valeur est un nombre ou vide
        if (value === '' || (!isNaN(value) && value >= 0 && value <= 100)) {
            setStudents(students.map(student => 
                student._id === studentId ? { ...student, marks: value } : student
            ));
        }
    };
    
    // Enregistrer l'assiduité pour tous les étudiants
    const saveAttendance = async () => {
        if (!selectedSubject) {
            showSnackbar("Veuillez sélectionner une matière", "error");
            return;
        }
        
        setLoading(true);
        
        try {
            // Utiliser Promise.all pour traiter toutes les requêtes d'assiduité en parallèle
            const attendancePromises = students.map(async (student) => {
                // S'assurer que le statut a la bonne casse (Present ou Absent avec majuscule)
                let status = student.attendance || 'Present';
                
                // Normaliser le statut pour qu'il corresponde à l'enum du schéma
                if (status.toLowerCase() === 'present') {
                    status = 'Present';
                } else if (status.toLowerCase() === 'absent') {
                    status = 'Absent';
                }
                
                const fields = {
                    subName: selectedSubject._id,
                    status: status,
                    date: new Date(attendanceDate).toISOString()
                };
                
                console.log(`Enregistrement de l'assiduité pour l'étudiant ${student._id}:`, fields);
                
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_BASE_URL}/StudentAttendance/${student._id}`,
                        fields,
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    console.log(`Réponse pour l'étudiant ${student._id}:`, response.data);
                    return { success: true, studentId: student._id };
                } catch (err) {
                    // Afficher l'erreur complète pour le débogage
                    console.error(`Erreur pour l'étudiant ${student._id}:`, err);
                    console.error("Détails de la réponse:", err.response?.data);
                    console.error("Message d'erreur:", err.message);
                    console.error("Stack trace:", err.stack);
                    
                    // Créer un message d'erreur détaillé
                    const errorDetails = err.response?.data?.error || err.response?.data?.message || err.message;
                    return { 
                        success: false, 
                        studentId: student._id, 
                        error: errorDetails,
                        fullError: err.response?.data || err.message 
                    };
                }
            });
            
            const results = await Promise.all(attendancePromises);
            const failures = results.filter(r => !r.success);
            
            if (failures.length === 0) {
                showSnackbar("Assiduité enregistrée avec succès", "success");
            } else {
                // Afficher les détails des erreurs
                failures.forEach(failure => {
                    console.error(`Détail de l'erreur pour l'étudiant ${failure.studentId}:`, failure.fullError);
                });
                
                // Afficher un message d'erreur plus détaillé
                const errorMessage = failures.map(f => `Étudiant ${f.studentId}: ${f.error}`).join('; ');
                showSnackbar(`Erreur: ${errorMessage}`, "error");
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'assiduité:", error);
            console.error("Détails de la réponse:", error.response?.data);
            console.error("Message d'erreur:", error.message);
            console.error("Stack trace:", error.stack);
            
            showSnackbar(`Erreur: ${error.response?.data?.message || error.message}`, "error");
        }
        
        setLoading(false);
    };
    
    // Enregistrer les notes pour tous les étudiants
    const saveMarks = async () => {
        if (!selectedSubject) {
            showSnackbar("Veuillez sélectionner une matière", "error");
            return;
        }
        
        setLoading(true);
        
        try {
            // Utiliser Promise.all pour traiter toutes les requêtes de notes en parallèle
            const marksPromises = students.map(async (student) => {
                // S'assurer que la note est un nombre valide
                const marksValue = student.marks === '' ? 0 : Number(student.marks);
                
                const fields = {
                    subName: selectedSubject._id,
                    marksObtained: marksValue
                };
                
                console.log(`Enregistrement des notes pour l'étudiant ${student._id}:`, fields);
                
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_BASE_URL}/UpdateExamResult/${student._id}`,
                        fields,
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    return { success: true, studentId: student._id };
                } catch (err) {
                    console.error(`Erreur pour l'étudiant ${student._id}:`, err.response?.data || err.message);
                    return { success: false, studentId: student._id, error: err.response?.data?.message || err.message };
                }
            });
            
            const results = await Promise.all(marksPromises);
            const failures = results.filter(r => !r.success);
            
            if (failures.length === 0) {
                showSnackbar("Notes enregistrées avec succès", "success");
            } else {
                showSnackbar(`Erreur pour ${failures.length} étudiant(s)`, "warning");
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des notes:", error);
            showSnackbar("Erreur lors de l'enregistrement des notes", "error");
        }
        
        setLoading(false);
    };
    
    // Afficher un message de notification
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };
    
    // Fermer la notification
    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };
    
    // Changer de matière
    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
    };
    
    // Changer de date pour l'assiduité
    const handleDateChange = (event) => {
        setAttendanceDate(event.target.value);
    };
    
    if (!selectedClass) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">
                    Veuillez sélectionner une classe pour voir les étudiants
                </Typography>
            </Box>
        );
    }
    
    if (!selectedSubject) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">
                    Aucune matière disponible pour cette classe
                </Typography>
            </Box>
        );
    }
    
    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Gestion des présences et des notes
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    {/* Sélecteur de matière */}
                    <Box sx={{ minWidth: 200 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Matière:
                        </Typography>
                        <RadioGroup
                            value={selectedSubject?._id || ''}
                            onChange={(e) => {
                                const subject = currentUser.classSubjectMappings
                                    .find(m => m.class._id === selectedClass._id)
                                    ?.subjects.find(s => s._id === e.target.value);
                                handleSubjectChange(subject);
                            }}
                        >
                            {currentUser?.classSubjectMappings
                                ?.find(mapping => mapping.class._id === selectedClass._id)
                                ?.subjects.map(subject => (
                                    <FormControlLabel
                                        key={subject._id}
                                        value={subject._id}
                                        control={<Radio />}
                                        label={subject.subName}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </Box>
                    
                    {/* Sélecteur de date pour l'assiduité */}
                    <Box sx={{ minWidth: 200 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Date d'assiduité:
                        </Typography>
                        <TextField
                            type="date"
                            value={attendanceDate}
                            onChange={handleDateChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                </Box>
                
                {/* Boutons d'action */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={saveAttendance}
                        disabled={loading}
                    >
                        Enregistrer l'assiduité
                    </Button>
                    
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SaveIcon />}
                        onClick={saveMarks}
                        disabled={loading}
                    >
                        Enregistrer les notes
                    </Button>
                </Box>
                
                {/* Tableau des étudiants */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                                    <TableCell>N° d'inscription</TableCell>
                                    <TableCell>Nom de l'étudiant</TableCell>
                                    <TableCell align="center">Présent</TableCell>
                                    <TableCell align="center">Absent</TableCell>
                                    <TableCell align="center">Note (/100)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <TableRow key={student._id} hover>
                                            <TableCell>{student.rollNum}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell align="center">
                                                <Radio
                                                    checked={student.attendance?.toLowerCase() === 'present'}
                                                    onChange={() => handleAttendanceChange(student._id, 'Present')}
                                                    value="Present"
                                                    name={`attendance-${student._id}`}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Radio
                                                    checked={student.attendance?.toLowerCase() === 'absent'}
                                                    onChange={() => handleAttendanceChange(student._id, 'Absent')}
                                                    value="Absent"
                                                    name={`attendance-${student._id}`}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    type="number"
                                                    value={student.marks}
                                                    onChange={(e) => handleMarksChange(student._id, e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    inputProps={{ 
                                                        min: 0, 
                                                        max: 100,
                                                        style: { textAlign: 'center' }
                                                    }}
                                                    sx={{ width: '80px' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Aucun étudiant trouvé pour cette classe
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
            
            {/* Notification */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StudentAttendanceAndMarks;
