import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { Typography, Box, Paper, Grid } from '@mui/material';

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Tableau de bord étudiant
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Bienvenue dans votre espace étudiant
                </Typography>
                <Typography variant="body1">
                    Utilisez le menu de navigation pour accéder à vos cours, votre profil et d'autres fonctionnalités.
                </Typography>
            </Paper>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Informations personnelles
                        </Typography>
                        <Typography variant="body1">
                            Nom: {currentUser?.name || "Non disponible"}
                        </Typography>
                        <Typography variant="body1">
                            Email: {currentUser?.email || "Non disponible"}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Informations académiques
                        </Typography>
                        <Typography variant="body1">
                            Classe: {currentUser?.sclassName?.sclassName || "Non disponible"}
                        </Typography>
                        <Typography variant="body1">
                            École: {currentUser?.school?.schoolName || "Non disponible"}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// Les composants stylisés ont été supprimés car ils ne sont plus utilisés



export default StudentHomePage