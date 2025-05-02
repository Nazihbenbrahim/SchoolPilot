import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, Box, Button, Typography, useTheme, useMediaQuery,
  Card, CardContent, Fade, Grow, Slide, Zoom, Divider, IconButton
} from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import EnsitLogoHorizontal from '../assets/logos/EnsitLogoHorizontal';
import EnsitLogoUnesco from '../assets/logos/EnsitLogoUnesco';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Homepage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeLogoIndex, setActiveLogoIndex] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveLogoIndex((prev) => (prev === 0 ? 1 : 0));
        }, 10000); 

        const timer = setTimeout(() => {
            setShowContent(true);
        }, 500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    const features = [
        {
            icon: <SchoolIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
            title: "Academic Management",
            description: "Streamline class organization and curriculum planning"
        },
        {
            icon: <GroupIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
            title: "Student & Faculty Portal",
            description: "Centralized access for all educational stakeholders"
        },
        {
            icon: <AssignmentIcon fontSize="large" sx={{ color: theme.palette.accent1.main }} />,
            title: "Performance Tracking",
            description: "Comprehensive tools for attendance and assessment"
        }
    ];

    return (
        <MainContainer>
            <Header>
                <Box sx={{ width: isMobile ? '180px' : '250px' }}>
                    <Fade in={activeLogoIndex === 0} timeout={1000}>
                        <Box sx={{ display: activeLogoIndex === 0 ? 'block' : 'none', width: '100%' }}>
                            <EnsitLogoHorizontal />
                        </Box>
                    </Fade>
                    <Fade in={activeLogoIndex === 1} timeout={1000}>
                        <Box sx={{ display: activeLogoIndex === 1 ? 'block' : 'none', width: '100%' }}>
                            <EnsitLogoUnesco />
                        </Box>
                    </Fade>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <NavLink>Home</NavLink>
                    <NavLink>About</NavLink>
                    <NavLink>Contact</NavLink>
                </Box>
            </Header>

            <HeroSection>
                <Grid container spacing={0}>
                    <Grid item xs={12} md={6} sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: isMobile ? '2rem 1.5rem' : '4rem 3rem',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <Slide direction="right" in={showContent} timeout={800}>
                            <div>
                                <Typography variant="h1" sx={{
                                    fontWeight: 800,
                                    color: theme.palette.primary.main,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                    lineHeight: 1.2,
                                    mb: 2
                                }}>
                                    ENSIT School Management System
                                </Typography>
                            </div>
                        </Slide>
                        
                        <Slide direction="right" in={showContent} timeout={1000}>
                            <div>
                                <Typography variant="h5" sx={{ 
                                    color: theme.palette.text.secondary,
                                    mb: 4,
                                    maxWidth: '600px',
                                    lineHeight: 1.6
                                }}>
                                    A modern educational platform designed for the National School of Engineers of Tunis
                                </Typography>
                            </div>
                        </Slide>
                        
                        <Slide direction="right" in={showContent} timeout={1200}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <StyledLink to="/choose">
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ 
                                            py: 1.5, 
                                            px: 3,
                                            borderRadius: '30px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </StyledLink>
                                <StyledLink to="/chooseasguest">
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        size="large"
                                        sx={{ 
                                            py: 1.5, 
                                            px: 3,
                                            borderRadius: '30px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Guest Access
                                    </Button>
                                </StyledLink>
                            </Box>
                        </Slide>
                    </Grid>
                    
                    <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                        <Zoom in={showContent} timeout={1500}>
                            <HeroImageContainer>
                                <img 
                                    src={Students} 
                                    alt="ENSIT Students" 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: isMobile ? '0' : '0 0 0 100px'
                                    }} 
                                />
                                <HeroOverlay />
                            </HeroImageContainer>
                        </Zoom>
                    </Grid>
                </Grid>
            </HeroSection>

            <FeaturesSection>
                <Typography variant="h3" align="center" sx={{ 
                    mb: 6, 
                    color: theme.palette.secondary.main,
                    fontWeight: 600 
                }}>
                    Key Features
                </Typography>
                
                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Grow in={showContent} timeout={1000 + (index * 300)}>
                                <FeatureCard>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Box sx={{ mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </FeatureCard>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            </FeaturesSection>

            <LoginSection>
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Slide direction="right" in={showContent} timeout={1000}>
                            <Box sx={{ p: isMobile ? 3 : 6 }}>
                                <Typography variant="h3" sx={{ 
                                    mb: 3, 
                                    color: theme.palette.primary.main,
                                    fontWeight: 600 
                                }}>
                                    Access Your Account
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, maxWidth: '500px' }}>
                                    Login to access your personalized dashboard and take advantage of all the features available to you.
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px' }}>
                                    <StyledLink to="/choose">
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth
                                            size="large"
                                            sx={{ py: 1.5 }}
                                        >
                                            Login
                                        </Button>
                                    </StyledLink>
                                    <StyledLink to="/chooseasguest">
                                        <Button 
                                            variant="outlined" 
                                            color="secondary"
                                            fullWidth
                                            size="large"
                                            sx={{ py: 1.5 }}
                                        >
                                            Login as Guest
                                        </Button>
                                    </StyledLink>
                                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                        Don't have an account?{' '}
                                        <Link to="/Adminregister" style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                            Sign up
                                        </Link>
                                    </Typography>
                                </Box>
                            </Box>
                        </Slide>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ 
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4
                    }}>
                        <Zoom in={showContent} timeout={1500}>
                            <Box sx={{ 
                                width: '100%',
                                maxWidth: '500px',
                                height: '400px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}>
                                <Box sx={{ 
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    p: 4,
                                    zIndex: 2
                                }}>
                                    <Box sx={{ width: '200px', mb: 4 }}>
                                        <EnsitLogoHorizontal />
                                    </Box>
                                    <Typography variant="h4" align="center" sx={{ 
                                        color: theme.palette.text.primary,
                                        fontWeight: 600,
                                        mb: 2
                                    }}>
                                        Welcome Back
                                    </Typography>
                                    <Typography variant="body1" align="center" sx={{ color: theme.palette.text.secondary }}>
                                        Access your dashboard to manage classes, students, and more
                                    </Typography>
                                </Box>
                            </Box>
                        </Zoom>
                    </Grid>
                </Grid>
            </LoginSection>

            <Footer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ width: '150px' }}>
                        <EnsitLogoHorizontal />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        {new Date().getFullYear()} ENSIT School Management System. All rights reserved.
                    </Typography>
                </Box>
            </Footer>
        </MainContainer>
    );
};

export default Homepage;

const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #f5f7fa;
`;











const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavLink = styled.a`
  color: #3A5CAA;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    color: #E32726;
  }
`;

const HeroSection = styled.section`
  min-height: 85vh;
  background-color: white;
  position: relative;
`;

const HeroImageContainer = styled.div`
  height: 85vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(58,92,170,0.3) 100%);
  z-index: 1;
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background-color: #f5f7fa;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const LoginSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const Footer = styled.footer`
  padding: 2rem;
  background-color: #f5f7fa;
  border-top: 1px solid #e0e0e0;
`;
