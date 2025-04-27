import { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import Logout from '../Logout';
import SideBar from './SideBar';
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
import AccountMenu from '../../components/AccountMenu';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const [open, setOpen] = useState(window.innerWidth >= 768);
  const { currentUser } = useSelector((state) => state.user);

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen font-poppins relative overflow-hidden">
      {/* Background Overlay for Mobile Sidebar */}
      {open && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={toggleDrawer}
        ></div>
      )}

      {/* AppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-200/50 via-gray-300/50 to-gray-200/50 backdrop-blur-md border-b border-gray-300/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-gradient">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={toggleDrawer}
            className="text-gray-700 hover:text-accent-blue focus:outline-none transition-colors duration-300 md:hidden"
          >
            {open ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-wide animate-fadeIn">
              Admin Dashboard
            </h1>
            <span className="text-sm md:text-base text-gray-600 animate-slideIn">
              - Welcome, {currentUser?.name || 'Admin'}!
            </span>
          </div>
          <div className="flex items-center space-x-4 z-40">
            <AccountMenu />
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-100/80 backdrop-blur-lg border-r border-gray-300/50 transform transition-transform duration-300 ease-in-out ${
            open ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:inset-auto md:h-screen md:overflow-y-auto shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-slideInSidebar`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-300/50">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <button
              onClick={toggleDrawer}
              className="text-gray-900 hover:text-accent-blue focus:outline-none transition-colors duration-300 md:hidden"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-2">
            <SideBar open={open} />
          </nav>
        </aside>

        <main className="flex-1 pt-16 md:pl-64 min-h-screen bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-sm">
          <div className="p-4 md:p-6">
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
              <Route path="/Admin/teachers/edit/:id" element={<AddTeacher />} /> {/* New route */}
              <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
              <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
              <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
              <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;