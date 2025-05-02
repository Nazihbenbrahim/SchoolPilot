import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  Chip,
  useTheme,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getClassSchedules, getTeacherSchedules, deleteSchedule } from '../../../redux/scheduleRelated/scheduleHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

const ShowSchedules = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  
  // Récupérer les données depuis le store Redux
  const { adminUser } = useSelector((state) => state.user);
  const { status, error, classSchedules, teacherSchedules } = useSelector((state) => state.schedule);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  
  // État pour les confirmations de suppression
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    if (adminUser?._id) {
      dispatch(getAllSclasses(adminUser?._id, 'Sclass'));
      dispatch(getAllTeachers(adminUser?._id));
      
      if (tabValue === 0) {
        dispatch(getClassSchedules(adminUser?._id));
      } else {
        dispatch(getTeacherSchedules(adminUser?._id));
      }
    }
  }, [dispatch, adminUser, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Charger les données appropriées en fonction de l'onglet sélectionné
    if (adminUser?._id) {
      if (newValue === 0) {
        dispatch(getClassSchedules(adminUser?._id));
      } else {
        dispatch(getTeacherSchedules(adminUser?._id));
      }
    }
  };

  const handleViewClassSchedule = (id) => {
    navigate(`/Admin/schedules/class/${id}`);
  };

  const handleEditClassSchedule = (id) => {
    navigate(`/Admin/schedules/class/edit/${id}`);
  };

  const handleDeleteClassSchedule = (id) => {
    setDeleteConfirmation({
      id,
      type: 'class'
    });
  };

  const handleViewTeacherSchedule = (id) => {
    navigate(`/Admin/schedules/teacher/${id}`);
  };

  const handleEditTeacherSchedule = (id) => {
    navigate(`/Admin/schedules/teacher/edit/${id}`);
  };

  const handleDeleteTeacherSchedule = (id) => {
    setDeleteConfirmation({
      id,
      type: 'teacher'
    });
  };
  
  const confirmDelete = () => {
    if (deleteConfirmation) {
      dispatch(deleteSchedule(deleteConfirmation.id));
      setDeleteConfirmation(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleAddSchedule = () => {
    if (tabValue === 0) {
      navigate('/Admin/schedules/class/add');
    } else {
      navigate('/Admin/schedules/teacher/add');
    }
  };

  // Afficher un message de chargement si les données sont en cours de chargement
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Une erreur s'est produite: {error.message}
        </Alert>
      )}
      
      {/* Confirmation de suppression */}
      {deleteConfirmation && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Box>
              <Button color="inherit" size="small" onClick={cancelDelete} sx={{ mr: 1 }}>
                Annuler
              </Button>
              <Button color="error" size="small" onClick={confirmDelete}>
                Confirmer
              </Button>
            </Box>
          }
        >
          Êtes-vous sûr de vouloir supprimer cet emploi du temps ? Cette action est irréversible.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Emplois du temps
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSchedule}
        >
          {tabValue === 0 ? "Ajouter un emploi du temps de classe" : "Ajouter un emploi du temps d'enseignant"}
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Emplois du temps par classe" />
          <Tab label="Emplois du temps par enseignant" />
        </Tabs>

        {tabValue === 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Classe</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Niveau</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Heures totales</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Dernière mise à jour</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classSchedules && classSchedules.length > 0 ? (
                  classSchedules.map((schedule) => {
                    // Trouver les informations de classe correspondantes
                    const classInfo = sclassesList.find(c => c._id === schedule.targetId) || {};
                    
                    return (
                      <TableRow key={schedule._id} hover>
                        <TableCell>{classInfo.sclassName || schedule.className}</TableCell>
                        <TableCell>{classInfo.sclassGrade || schedule.grade}</TableCell>
                        <TableCell>{schedule.totalHours || '0'} h</TableCell>
                        <TableCell>{new Date(schedule.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Tooltip title="Voir l'emploi du temps">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleViewClassSchedule(schedule._id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier l'emploi du temps">
                            <IconButton 
                              color="secondary" 
                              onClick={() => handleEditClassSchedule(schedule._id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer l'emploi du temps">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteClassSchedule(schedule._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucun emploi du temps de classe trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Enseignant</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Matière principale</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Heures totales</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Dernière mise à jour</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherSchedules && teacherSchedules.length > 0 ? (
                  teacherSchedules.map((schedule) => {
                    // Trouver les informations d'enseignant correspondantes
                    const teacherInfo = teachersList.find(t => t._id === schedule.targetId) || {};
                    
                    return (
                      <TableRow key={schedule._id} hover>
                        <TableCell>{teacherInfo.name || schedule.teacherName}</TableCell>
                        <TableCell>{teacherInfo.teachSubject?.[0] || schedule.subject}</TableCell>
                        <TableCell>{schedule.totalHours || '0'} h</TableCell>
                        <TableCell>{new Date(schedule.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Tooltip title="Voir l'emploi du temps">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleViewTeacherSchedule(schedule._id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier l'emploi du temps">
                            <IconButton 
                              color="secondary" 
                              onClick={() => handleEditTeacherSchedule(schedule._id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer l'emploi du temps">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteTeacherSchedule(schedule._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucun emploi du temps d'enseignant trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ShowSchedules;
