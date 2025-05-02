import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleDetails } from '../../../redux/scheduleRelated/scheduleHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

// Constantes pour les jours et heures
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const ViewSchedule = () => {
  const { id, type = 'class' } = useParams(); // type sera 'class' ou 'teacher'
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const printRef = useRef(null);

  // Récupérer les données depuis le store Redux
  const { adminUser } = useSelector((state) => state.user);
  const { status, error, currentSchedule } = useSelector((state) => state.schedule);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  
  // Fonction pour formater l'heure
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Chargement des données de l'emploi du temps
  useEffect(() => {
    if (id) {
      dispatch(getScheduleDetails(id));
    }
  }, [id, dispatch]);
  
  // Chargement des données pour les classes et les enseignants
  useEffect(() => {
    if (adminUser?._id) {
      dispatch(getAllSclasses(adminUser._id, 'Sclass'));
      dispatch(getAllTeachers(adminUser._id));
    }
  }, [dispatch, adminUser]);
  
  // Trouver les informations de la classe ou de l'enseignant
  const targetInfo = React.useMemo(() => {
    if (!currentSchedule) return null;
    
    const targetType = currentSchedule.targetType || type;
    
    if (targetType === 'class') {
      const classInfo = sclassesList.find(c => c._id === currentSchedule.targetId);
      return classInfo ? {
        name: classInfo.sclassName,
        grade: classInfo.sclassGrade,
        students: classInfo.strength || 0
      } : null;
    } else {
      const teacherInfo = teachersList.find(t => t._id === currentSchedule.targetId);
      return teacherInfo ? {
        name: teacherInfo.name,
        subject: teacherInfo.teachSubject?.[0] || 'Non spécifié',
        email: teacherInfo.email
      } : null;
    }
  }, [currentSchedule, sclassesList, teachersList, type]);

  // Organiser les créneaux par jour
  const timeSlotsByDay = React.useMemo(() => {
    if (!currentSchedule?.timeSlots) return {};
    
    const slotsByDay = {};
    DAYS.forEach(day => {
      slotsByDay[day] = currentSchedule.timeSlots
        .filter(slot => slot.day === day)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .map(slot => ({
          ...slot,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime)
        }));
    });
    
    return slotsByDay;
  }, [currentSchedule]);
  
  // Fonction pour imprimer l'emploi du temps
  const handlePrint = () => {
    window.print();
  };

  // Si les données sont en cours de chargement
  if (status === 'loading') {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Si une erreur s'est produite
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Une erreur s'est produite: {error.message}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/Admin/schedules')}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }
  
  // Si l'emploi du temps n'existe pas
  if (!currentSchedule) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          L'emploi du temps demandé n'existe pas ou a été supprimé.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/Admin/schedules')}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          {currentSchedule.title}
        </Typography>
        <Box>
          <Tooltip title="Imprimer l'emploi du temps">
            <IconButton color="primary" sx={{ mr: 1 }} onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier l'emploi du temps">
            <IconButton 
              color="secondary" 
              sx={{ mr: 1 }}
              onClick={() => navigate(`/Admin/schedules/${currentSchedule.targetType || type}/edit/${id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/Admin/schedules')}
          >
            Retour
          </Button>
        </Box>
      </Box>

      <div id="printSection" ref={printRef}>
        <Grid container spacing={3}>
          {/* Informations générales */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Informations générales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{currentSchedule.targetType === 'class' ? 'Classe' : 'Enseignant'}:</strong> {targetInfo?.name || currentSchedule.targetName}
                </Typography>
                
                {currentSchedule.targetType === 'class' ? (
                  <>
                    <Typography variant="body1" gutterBottom>
                      <strong>Niveau:</strong> {targetInfo?.grade || 'Non spécifié'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Nombre d'étudiants:</strong> {targetInfo?.students || 0}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" gutterBottom>
                      <strong>Matière principale:</strong> {targetInfo?.subject || 'Non spécifié'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Email:</strong> {targetInfo?.email || 'Non spécifié'}
                    </Typography>
                  </>
                )}
                
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong> {currentSchedule.description}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Dernière mise à jour: {new Date(currentSchedule.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Tableau d'emploi du temps */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.main, color: 'white' }}>
                        Horaire
                      </TableCell>
                      {DAYS.map(day => (
                        <TableCell 
                          key={day} 
                          align="center" 
                          sx={{ fontWeight: 'bold', backgroundColor: theme.palette.primary.main, color: 'white' }}
                        >
                          {day}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {HOURS.map((hour, index) => (
                      <TableRow key={hour} sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.primary.light,
                            color: 'white'
                          }}
                        >
                          {hour} - {HOURS[index + 1] || '19:00'}
                        </TableCell>
                        {DAYS.map(day => {
                          const slots = timeSlotsByDay[day];
                          const slot = slots?.find(slot => slot.startTime.getHours() === parseInt(hour.split(':')[0]));
                          
                          if (slot) {
                            return (
                              <TableCell 
                                key={`${day}-${hour}`} 
                                align="center"
                                sx={{ 
                                  backgroundColor: `${theme.palette.primary.main}20`,
                                  border: `1px solid ${theme.palette.primary.main}40`,
                                  p: 1
                                }}
                              >
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {slot.subject}
                                </Typography>
                                <Typography variant="body2">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </Typography>
                                {type === 'class' && (
                                  <Typography variant="body2">
                                    {slot.teacher}
                                  </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  Salle: {slot.room}
                                </Typography>
                              </TableCell>
                            );
                          } else {
                            return <TableCell key={`${day}-${hour}`} />;
                          }
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default ViewSchedule;