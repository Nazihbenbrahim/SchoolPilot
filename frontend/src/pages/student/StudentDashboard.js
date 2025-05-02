import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';

// Material UI imports
import { Box, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// Custom components
import EnsitLayout from '../../components/EnsitLayout';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout';

const StudentDashboard = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, loading } = useSelector((state) => state.user);
    const { studentUser } = useSelector((state) => state.student);
    
    // S'assurer que les données de l'utilisateur sont chargées
    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser]);

    // Determine which menu item is active based on current path
    const getActivePath = (path) => {
        return location.pathname.includes(path);
    };

    // Define sidebar menu items with icons
    const sidebarItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            onClick: () => navigate('/Student/dashboard'),
            active: location.pathname === '/Student/dashboard' || location.pathname === '/Student' || location.pathname === '/'
        },
        {
            text: 'Profile',
            icon: <PersonIcon />,
            onClick: () => navigate('/Student/profile'),
            active: getActivePath('/profile')
        },
        {
            text: 'Subjects',
            icon: <MenuBookIcon />,
            onClick: () => navigate('/Student/subjects'),
            active: getActivePath('/subjects')
        },
        {
            text: 'Attendance',
            icon: <EventNoteIcon />,
            onClick: () => navigate('/Student/attendance'),
            active: getActivePath('/attendance')
        },
        {
            text: 'Complaints',
            icon: <ReportProblemIcon />,
            onClick: () => navigate('/Student/complain'),
            active: getActivePath('/complain')
        },
    ];

    // Combine user data for the layout
    const userData = {
        ...(currentUser || {}),
        name: currentUser?.name || '',
        role: 'Student',
        // Add any additional student-specific info here
        class: studentUser?.sclassName || ''
    };

    return (
        <EnsitLayout 
            sideList={sidebarItems} 
            title="Student Dashboard" 
            user={userData}
        >
            <Routes>
                <Route path="/" element={<StudentHomePage />} />
                <Route path='*' element={<Navigate to="/" />} />
                <Route path="/Student/dashboard" element={<StudentHomePage />} />
                <Route path="/Student/profile" element={<StudentProfile />} />
                <Route path="/Student/subjects" element={<StudentSubjects />} />
                <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                <Route path="/Student/complain" element={<StudentComplain />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </EnsitLayout>
    );
}

export default StudentDashboard;