import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI imports
import { useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Subject';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Custom components
import EnsitLayout from '../../components/EnsitLayout';
import Logout from '../Logout';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';
import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';
import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';
import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';
import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';
import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';
// Composants pour les emplois du temps
import ShowSchedules from './scheduleRelated/ShowSchedules';
import ScheduleForm from './scheduleRelated/ScheduleForm';
import ViewSchedule from './scheduleRelated/ViewSchedule';

const AdminDashboard = () => {
  const theme = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which menu item is active based on current path
  const getActivePath = (path) => {
    return location.pathname.includes(path);
  };

  // Define sidebar menu items with icons
  const sidebarItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      onClick: () => navigate('/Admin/dashboard'),
      active: location.pathname === '/Admin/dashboard' || location.pathname === '/Admin'
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      onClick: () => navigate('/Admin/profile'),
      active: getActivePath('/profile')
    },
    {
      text: 'Classes',
      icon: <ClassIcon />,
      onClick: () => navigate('/Admin/classes'),
      active: getActivePath('/classes') || getActivePath('/addclass')
    },
    {
      text: 'Subjects',
      icon: <SubjectIcon />,
      onClick: () => navigate('/Admin/subjects'),
      active: getActivePath('/subjects') || getActivePath('/addsubject')
    },
    {
      text: 'Teachers',
      icon: <PeopleIcon />,
      onClick: () => navigate('/Admin/teachers'),
      active: getActivePath('/teachers')
    },
    {
      text: 'Students',
      icon: <SchoolIcon />,
      onClick: () => navigate('/Admin/students'),
      active: getActivePath('/students') || getActivePath('/addstudents')
    },
    {
      text: 'Emplois du temps',
      icon: <CalendarMonthIcon />,
      onClick: () => navigate('/Admin/schedules'),
      active: getActivePath('/schedules')
    },
    {
      text: 'Notices',
      icon: <NotificationsIcon />,
      onClick: () => navigate('/Admin/notices'),
      active: getActivePath('/notices') || getActivePath('/addnotice')
    },
    {
      text: 'Complaints',
      icon: <ReportProblemIcon />,
      onClick: () => navigate('/Admin/complains'),
      active: getActivePath('/complains')
    },
  ];

  return (
    <EnsitLayout 
      sideList={sidebarItems} 
      title="Admin Dashboard" 
      user={currentUser}
    >
      <Routes>
        <Route path="/" element={<AdminHomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
        <Route path="/Admin/profile" element={<AdminProfile />} />
        <Route path="/Admin/complains" element={<SeeComplains />} />
        <Route path="/Admin/addnotice" element={<AddNotice />} />
        <Route path="/Admin/notices" element={<ShowNotices />} />
        <Route path="/Admin/subjects" element={<ShowSubjects />} />
        <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
        <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />
        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
        <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />
        <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
        <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
        <Route path="/Admin/addclass" element={<AddClass />} />
        <Route path="/Admin/classes" element={<ShowClasses />} />
        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
        <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />
        <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
        <Route path="/Admin/students" element={<ShowStudents />} />
        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
        <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
        <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />
        <Route path="/Admin/teachers" element={<ShowTeachers />} />
        <Route path="/Admin/teachers/add" element={<AddTeacher />} />
        <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
        <Route path="/Admin/teachers/edit/:id" element={<AddTeacher />} />
        <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
        <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
        <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />
        
        {/* Routes pour les emplois du temps */}
        <Route path="/Admin/schedules" element={<ShowSchedules />} />
        <Route path="/Admin/schedules/class/add" element={<ScheduleForm />} />
        <Route path="/Admin/schedules/teacher/add" element={<ScheduleForm />} />
        <Route path="/Admin/schedules/class/:id" element={<ViewSchedule type="class" />} />
        <Route path="/Admin/schedules/teacher/:id" element={<ViewSchedule type="teacher" />} />
        <Route path="/Admin/schedules/class/edit/:id" element={<ScheduleForm />} />
        <Route path="/Admin/schedules/teacher/edit/:id" element={<ScheduleForm />} />
        
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </EnsitLayout>
  );
};

export default AdminDashboard;