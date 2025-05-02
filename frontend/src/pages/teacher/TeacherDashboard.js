import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI imports
import { Box, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// Custom components
import EnsitLayout from '../../components/EnsitLayout';
import ClassSelector from './ClassSelector';
import Logout from '../Logout';
import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import StudentAttendanceAndMarks from './StudentAttendanceAndMarks';

// Composant pour afficher le sélecteur de classe en haut des pages pertinentes
const ClassSelectorHeader = () => {
    const location = useLocation();
    const { teacherUser } = useSelector((state) => state.teacher);
    
    // Déterminer si nous devons afficher le sélecteur de classe sur cette page
    const shouldShowClassSelector = () => {
        // Pages où nous voulons afficher le sélecteur de classe
        const classRelatedPaths = [
            '/Teacher/dashboard',
            '/Teacher/class',
            '/',
            '/Teacher/class/student'
        ];
        
        return classRelatedPaths.some(path => location.pathname.startsWith(path));
    };
    
    if (!shouldShowClassSelector() || !teacherUser || !teacherUser.teachSclasses || teacherUser.teachSclasses.length === 0) {
        return null;
    }
    
    return (
        <Box sx={{ 
            py: 2, 
            px: 3, 
            mb: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
            <ClassSelector />
        </Box>
    );
};

const TeacherDashboard = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { teacherUser } = useSelector((state) => state.teacher);

    // Determine which menu item is active based on current path
    const getActivePath = (path) => {
        return location.pathname.includes(path);
    };

    // Define sidebar menu items with icons
    const sidebarItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            onClick: () => navigate('/Teacher/dashboard'),
            active: location.pathname === '/Teacher/dashboard' || location.pathname === '/Teacher' || location.pathname === '/'
        },
        {
            text: 'Profile',
            icon: <PersonIcon />,
            onClick: () => navigate('/Teacher/profile'),
            active: getActivePath('/profile')
        },
        {
            text: 'Class Details',
            icon: <ClassIcon />,
            onClick: () => navigate('/Teacher/class'),
            active: getActivePath('/class') && !getActivePath('/attendance-marks')
        },
        {
            text: 'Students',
            icon: <PeopleIcon />,
            onClick: () => navigate('/Teacher/class'),
            active: getActivePath('/student')
        },
        {
            text: 'Attendance & Marks',
            icon: <AssignmentIcon />,
            onClick: () => navigate('/Teacher/attendance-marks'),
            active: getActivePath('/attendance-marks') || getActivePath('/attendance') || getActivePath('/marks')
        },
        {
            text: 'Complaints',
            icon: <ReportProblemIcon />,
            onClick: () => navigate('/Teacher/complain'),
            active: getActivePath('/complain')
        },
    ];

    // Combine user data for the layout
    const userData = {
        ...currentUser,
        name: currentUser?.name,
        role: 'Teacher',
        // Add any additional teacher-specific info here
    };

    return (
        <EnsitLayout 
            sideList={sidebarItems} 
            title="Teacher Dashboard" 
            user={userData}
        >
            {/* Class selector appears only on relevant pages */}
            <ClassSelectorHeader />
            
            <Routes>
                <Route path="/" element={<TeacherHomePage />} />
                <Route path='*' element={<Navigate to="/" />} />
                <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                <Route path="/Teacher/profile" element={<TeacherProfile />} />
                <Route path="/Teacher/complain" element={<TeacherComplain />} />
                <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                <Route path="/Teacher/attendance-marks" element={<StudentAttendanceAndMarks />} />
                <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </EnsitLayout>
    );
}

export default TeacherDashboard;

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}