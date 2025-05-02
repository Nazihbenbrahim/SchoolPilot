import { Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import styled from 'styled-components';
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);
    const { selectedClass } = useSelector((state) => state.teacher);
    
    const [classSubjects, setClassSubjects] = useState([]);
    const [totalSessions, setTotalSessions] = useState(0);

    const classID = selectedClass?._id;

    // Récupérer les étudiants de la classe sélectionnée
    useEffect(() => {
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID]);
    
    // Filtrer les matières pour la classe sélectionnée
    useEffect(() => {
        if (currentUser && currentUser.classSubjectMappings && selectedClass) {
            // Trouver le mapping pour la classe sélectionnée
            const classMapping = currentUser.classSubjectMappings.find(
                mapping => mapping.class._id === selectedClass._id
            );
            
            if (classMapping) {
                setClassSubjects(classMapping.subjects || []);
                
                // Calculer le nombre total de sessions pour toutes les matières de cette classe
                const sessions = classMapping.subjects.reduce((total, subject) => {
                    return total + (subject.sessions || 0);
                }, 0);
                
                setTotalSessions(sessions);
            } else {
                setClassSubjects([]);
                setTotalSessions(0);
            }
        }
    }, [currentUser, selectedClass]);

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSubjects = classSubjects.length;
    const numberOfSessions = totalSessions;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {!classID && (
                    <Typography variant="h6" align="center" sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        Please select a class to view dashboard data
                    </Typography>
                )}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Students} alt="Students" />
                            <Title>
                                Class Students
                            </Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Lessons} alt="Lessons" />
                            <Title>
                                Matières
                            </Title>
                            <Data start={0} end={numberOfSubjects} duration={3} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Lessons} alt="Lessons" />
                            <Title>
                                Total Leçons
                            </Title>
                            <Data start={0} end={numberOfSessions} duration={5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={Time} alt="Time" />
                            <Title>
                                Heures Totales
                            </Title>
                            <Data start={0} end={numberOfSessions * 2} duration={4} suffix=" hrs"/>                        
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Matières pour {selectedClass?.sclassName || 'cette classe'}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {classSubjects.length > 0 ? (
                                <List>
                                    {classSubjects.map((subject) => (
                                        <ListItem key={subject._id}>
                                            <ListItemIcon>
                                                <MenuBookIcon />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={subject.subName} 
                                                secondary={`${subject.sessions || 0} sessions`} 
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {selectedClass ? 'Aucune matière assignée à cette classe' : 'Veuillez sélectionner une classe'}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default TeacherHomePage