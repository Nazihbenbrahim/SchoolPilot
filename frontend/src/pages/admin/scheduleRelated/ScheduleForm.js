import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Card,
  CardContent,
  FormHelperText,
  useTheme,
  Autocomplete,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
// Utilisation de TextField standard au lieu de TimePicker
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { getScheduleDetails, createSchedule, updateSchedule } from '../../../redux/scheduleRelated/scheduleHandle';
// Nous ajouterons les actions Redux plus tard

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const ScheduleForm = () => {
  const { id, type = 'class' } = useParams(); // type sera 'class' ou 'teacher'
  const isEditMode = !!id;
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Récupérer les données depuis le store Redux
  const { adminUser } = useSelector((state) => state.user);
  const { status, error, currentSchedule, response } = useSelector((state) => state.schedule);
  const { sclassesList, subjectsList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  
  // États pour les données du formulaire
  const [scheduleData, setScheduleData] = useState({
    title: '',
    description: '',
    targetId: '', // ID de la classe ou de l'enseignant
    targetName: '', // Nom de la classe ou de l'enseignant
    targetType: type, // 'class' ou 'teacher'
    schoolId: adminUser?._id,
    timeSlots: []
  });
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // État pour les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Chargement des données pour l'édition
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getScheduleDetails(id));
    }
  }, [isEditMode, id, dispatch]);
  
  // Mettre à jour les données du formulaire lorsque currentSchedule change
  useEffect(() => {
    if (currentSchedule && isEditMode) {
      setScheduleData({
        ...currentSchedule,
        targetType: currentSchedule.targetType || type,
        timeSlots: currentSchedule.timeSlots.map(slot => ({
          ...slot,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
        }))
      });
    }
  }, [currentSchedule, isEditMode, type]);

  // Chargement des données pour les listes déroulantes
  useEffect(() => {
    if (adminUser?._id) {
      dispatch(getAllSclasses(adminUser._id, 'Sclass'));
      dispatch(getAllTeachers(adminUser._id));
      dispatch(getSubjectList(adminUser._id, 'Subject'));
    }
  }, [dispatch, adminUser]);
  
  // Gérer la réponse après la création ou la mise à jour
  useEffect(() => {
    if (status === 'succeeded' && response) {
      setNotification({
        open: true,
        message: isEditMode ? 'Emploi du temps mis à jour avec succès' : 'Emploi du temps créé avec succès',
        severity: 'success'
      });
      
      // Redirection après un court délai
      setTimeout(() => {
        navigate('/Admin/schedules');
      }, 2000);
    } else if (status === 'failed') {
      setNotification({
        open: true,
        message: 'Erreur: ' + error?.message || 'Une erreur est survenue',
        severity: 'error'
      });
    }
  }, [status, response, error, navigate, isEditMode]);

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value
    });
    
    // Réinitialiser l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Gestion du changement de classe ou d'enseignant
  const handleTargetChange = (e) => {
    const { value } = e.target;
    const targetList = type === 'class' ? sclassesList : teachersList;
    const selectedTarget = targetList.find(item => item._id === value);
    
    setScheduleData({
      ...scheduleData,
      targetId: value,
      targetName: selectedTarget ? selectedTarget.name : ''
    });
    
    if (errors.targetId) {
      setErrors({
        ...errors,
        targetId: null
      });
    }
  };

  // Ajout d'un nouveau créneau horaire
  const handleAddTimeSlot = () => {
    const newTimeSlot = {
      id: Date.now().toString(), // ID temporaire
      day: 'Lundi',
      startTime: new Date('2023-01-01T08:00:00'),
      endTime: new Date('2023-01-01T09:00:00'),
      subject: '',
      teacher: type === 'class' ? '' : scheduleData.targetName,
      room: '',
    };
    
    setScheduleData({
      ...scheduleData,
      timeSlots: [...scheduleData.timeSlots, newTimeSlot]
    });
  };

  // Suppression d'un créneau horaire
  const handleDeleteTimeSlot = (id) => {
    setScheduleData({
      ...scheduleData,
      timeSlots: scheduleData.timeSlots.filter(slot => slot.id !== id)
    });
  };

  // Mise à jour d'un créneau horaire
  const handleTimeSlotChange = (id, field, value) => {
    setScheduleData({
      ...scheduleData,
      timeSlots: scheduleData.timeSlots.map(slot => {
        if (slot.id === id) {
          return { ...slot, [field]: value };
        }
        return slot;
      })
    });
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!scheduleData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!scheduleData.targetId) {
      newErrors.targetId = type === 'class' 
        ? 'Veuillez sélectionner une classe' 
        : 'Veuillez sélectionner un enseignant';
    }
    
    if (scheduleData.timeSlots.length === 0) {
      newErrors.timeSlots = 'Au moins un créneau horaire est requis';
    } else {
      scheduleData.timeSlots.forEach((slot, index) => {
        if (!slot.subject) {
          newErrors[`timeSlots[${index}].subject`] = 'La matière est requise';
        }
        if (type === 'class' && !slot.teacher) {
          newErrors[`timeSlots[${index}].teacher`] = 'L\'enseignant est requis';
        }
        if (!slot.room) {
          newErrors[`timeSlots[${index}].room`] = 'La salle est requise';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const dataToSubmit = {
      ...scheduleData,
      schoolId: adminUser?._id,
      timeSlots: scheduleData.timeSlots.map(slot => ({
        ...slot,
        // Convertir les dates en chaînes ISO pour l'API
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
      }))
    };
    
    if (isEditMode) {
      dispatch(updateSchedule(id, dataToSubmit));
    } else {
      dispatch(createSchedule(dataToSubmit));
    }
  };
  
  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
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
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Message d'erreur */}
      {error && status !== 'loading' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Une erreur s'est produite: {error.message}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          {isEditMode 
            ? `Modifier l'emploi du temps ${type === 'class' ? 'de classe' : 'd\'enseignant'}`
            : `Ajouter un emploi du temps ${type === 'class' ? 'de classe' : 'd\'enseignant'}`
          }
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/Admin/schedules')}
        >
          Retour
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Titre"
                name="title"
                value={scheduleData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.targetId} required>
                <InputLabel id="target-select-label">
                  {type === 'class' ? 'Classe' : 'Enseignant'}
                </InputLabel>
                <Select
                  labelId="target-select-label"
                  name="targetId"
                  value={scheduleData.targetId}
                  onChange={handleTargetChange}
                  label={type === 'class' ? 'Classe' : 'Enseignant'}
                >
                  {type === 'class' ? (
                    sclassesList && sclassesList.length > 0 ? (
                      sclassesList.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.sclassName} ({item.sclassGrade || 'Non spécifié'})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Aucune classe disponible</MenuItem>
                    )
                  ) : (
                    teachersList && teachersList.length > 0 ? (
                      teachersList.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name} ({item.teachSubject?.[0] || 'Non spécifié'})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Aucun enseignant disponible</MenuItem>
                    )
                  )}
                </Select>
                {errors.targetId && <FormHelperText>{errors.targetId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={scheduleData.description}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Créneaux horaires
            </Typography>
            {errors.timeSlots && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.timeSlots}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTimeSlot}
              sx={{ mb: 2 }}
            >
              Ajouter un créneau
            </Button>
          </Box>

          {/* Conteneur des créneaux horaires */}
            <Grid container spacing={2}>
              {scheduleData.timeSlots.map((slot, index) => (
                <Grid item xs={12} key={slot.id}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={2}>
                          <FormControl fullWidth>
                            <InputLabel id={`day-select-label-${index}`}>Jour</InputLabel>
                            <Select
                              labelId={`day-select-label-${index}`}
                              value={slot.day}
                              onChange={(e) => handleTimeSlotChange(slot.id, 'day', e.target.value)}
                              label="Jour"
                            >
                              {days.map((day) => (
                                <MenuItem key={day} value={day}>
                                  {day}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            fullWidth
                            label="Heure début"
                            type="time"
                            value={slot.startTime ? `${new Date(slot.startTime).getHours().toString().padStart(2, '0')}:${new Date(slot.startTime).getMinutes().toString().padStart(2, '0')}` : '08:00'}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newDate = new Date();
                              newDate.setHours(hours, minutes, 0);
                              handleTimeSlotChange(slot.id, 'startTime', newDate);
                            }}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            fullWidth
                            label="Heure fin"
                            type="time"
                            value={slot.endTime ? `${new Date(slot.endTime).getHours().toString().padStart(2, '0')}:${new Date(slot.endTime).getMinutes().toString().padStart(2, '0')}` : '09:00'}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newDate = new Date();
                              newDate.setHours(hours, minutes, 0);
                              handleTimeSlotChange(slot.id, 'endTime', newDate);
                            }}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <FormControl fullWidth error={!!errors[`timeSlots[${index}].subject`]}>
                            <InputLabel id={`subject-select-label-${index}`}>Matière</InputLabel>
                            <Select
                              labelId={`subject-select-label-${index}`}
                              value={slot.subject}
                              onChange={(e) => handleTimeSlotChange(slot.id, 'subject', e.target.value)}
                              label="Matière"
                              required
                            >
                              {subjectsList && subjectsList.length > 0 ? (
                                subjectsList.map((subject) => (
                                  <MenuItem key={subject._id} value={subject.subName}>
                                    {subject.subName}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>Aucune matière disponible</MenuItem>
                              )}
                            </Select>
                            {errors[`timeSlots[${index}].subject`] && (
                              <FormHelperText>{errors[`timeSlots[${index}].subject`]}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        {type === 'class' && (
                          <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth error={!!errors[`timeSlots[${index}].teacher`]}>
                              <InputLabel id={`teacher-select-label-${index}`}>Enseignant</InputLabel>
                              <Select
                                labelId={`teacher-select-label-${index}`}
                                value={slot.teacher}
                                onChange={(e) => handleTimeSlotChange(slot.id, 'teacher', e.target.value)}
                                label="Enseignant"
                                required
                              >
                                {teachersList && teachersList.length > 0 ? (
                                  teachersList.map((teacher) => (
                                    <MenuItem key={teacher._id} value={teacher.name}>
                                      {teacher.name} ({teacher.teachSubject?.[0] || 'Non spécifié'})
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>Aucun enseignant disponible</MenuItem>
                                )}
                              </Select>
                              {errors[`timeSlots[${index}].teacher`] && (
                                <FormHelperText>{errors[`timeSlots[${index}].teacher`]}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        )}
                        <Grid item xs={12} sm={6} md={type === 'class' ? 1 : 2}>
                          <TextField
                            fullWidth
                            label="Salle"
                            value={slot.room}
                            onChange={(e) => handleTimeSlotChange(slot.id, 'room', e.target.value)}
                            error={!!errors[`timeSlots[${index}].room`]}
                            helperText={errors[`timeSlots[${index}].room`]}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteTimeSlot(slot.id)}
                            aria-label="supprimer le créneau"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          {/* Fin du conteneur des créneaux horaires */}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon />}
              size="large"
            >
              {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ScheduleForm;
