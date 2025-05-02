import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

// Composant qui vérifie si l'utilisateur est authentifié et si ses données sont chargées
const AuthGuard = ({ children, requiredRole }) => {
  const { currentUser, currentRole, loading } = useSelector((state) => state.user);

  // Si l'application est en train de charger les données
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  // Si l'utilisateur n'a pas d'ID (données incomplètes)
  if (!currentUser._id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error">
          Erreur de chargement
        </Typography>
        <Typography variant="body1">
          Impossible de charger vos informations. Veuillez vous reconnecter.
        </Typography>
      </Box>
    );
  }

  // Si un rôle spécifique est requis et que l'utilisateur n'a pas ce rôle
  if (requiredRole && currentRole !== requiredRole) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error">
          Accès non autorisé
        </Typography>
        <Typography variant="body1">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
      </Box>
    );
  }

  // Si tout est OK, rendre les composants enfants
  return children;
};

export default AuthGuard;
