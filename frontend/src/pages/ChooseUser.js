import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdminPanelSettings, School, Person } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import EnsitLogoHorizontal from '../assets/logos/EnsitLogoHorizontal';
import EnsitLogoUnesco from '../assets/logos/EnsitLogoUnesco';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Adminlogin');
      }
    }

    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1"
        const studentName = "Dipesh Awasthi"
        const fields = { rollNum, studentName, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Studentlogin');
      }
    }

    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Teacherlogin');
      }
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      }
      else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    }
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <RootContainer>
      <LogoContainer>
        <EnsitLogoHorizontal height={80} />
      </LogoContainer>
      
      <Typography variant="h4" component="h1" align="center" sx={{
        fontWeight: 'bold',
        color: 'white',
        mb: 1,
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      }}>
        SchoolPilot
      </Typography>
      
      <Typography variant="h6" align="center" sx={{
        color: 'rgba(255, 255, 255, 0.8)',
        mb: 6,
        maxWidth: '600px',
        mx: 'auto',
        px: 2,
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      }}>
        Comprehensive School Management System
      </Typography>
      
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <RoleCard onClick={() => navigateHandler("Admin")}>
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconWrapper color={theme.palette.error.main}>
                    <AdminPanelSettings fontSize="large" />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    Admin
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Login as an administrator to access the dashboard to manage app data.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </RoleCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <RoleCard onClick={() => navigateHandler("Student")}>
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconWrapper color={theme.palette.primary.main}>
                    <School fontSize="large" />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    Student
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Login as a student to explore course materials and assignments.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </RoleCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <RoleCard onClick={() => navigateHandler("Teacher")}>
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconWrapper color={theme.palette.success.main}>
                    <Person fontSize="large" />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    Teacher
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Login as a teacher to create courses, assignments, and track student progress.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </RoleCard>
          </Grid>
        </Grid>
      </Container>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
        <EnsitLogoUnesco height={50} opacity={0.7} />
      </Box>
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }}
        open={loader}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress color="primary" size={50} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Please Wait
          </Typography>
        </Box>
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </RootContainer>
  );
};

export default ChooseUser;

// Styled components using MUI styled API
const RootContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)',
    pointerEvents: 'none',
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
}));

const RoleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(color, 0.1),
  color: color,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: 40,
  },
}));