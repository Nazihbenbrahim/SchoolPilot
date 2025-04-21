import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { HiOutlineUsers, HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineCurrencyDollar } from 'react-icons/hi';
import SeeNotice from '../../components/SeeNotice';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { Link } from 'react-router-dom';

// Sample data for charts (replace with real API data)
const attendanceData = [
  { name: 'Jan', attendance: 80 },
  { name: 'Feb', attendance: 85 },
  { name: 'Mar', attendance: 90 },
  { name: 'Apr', attendance: 95 },
  { name: 'May', attendance: 88 },
  { name: 'Jun', attendance: 92 },
];

const performanceData = [
  { name: 'Math', score: 85 },
  { name: 'Science', score: 90 },
  { name: 'English', score: 78 },
  { name: 'History', score: 88 },
  { name: 'Art', score: 92 },
];

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList, loading: studentsLoading } = useSelector((state) => state.student);
  const { sclassesList, loading: classesLoading } = useSelector((state) => state.sclass);
  const { teachersList, loading: teachersLoading } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  const [timeFilter, setTimeFilter] = useState('30 days');

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList?.length || 0;
  const numberOfClasses = sclassesList?.length || 0;
  const numberOfTeachers = teachersList?.length || 0;

  return (
    <div className="p-4 md:p-6">
      {/* Welcome Message */}
      <div className="mb-8 animate-fadeIn">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-wide">
          Welcome, {currentUser.name}!
        </h2>
        <p className="text-gray-600 mt-2">Here’s an overview of your school’s performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 backdrop-blur-lg border border-gray-400 rounded-xl p-6 text-center animate-fadeIn hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <HiOutlineUsers className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{studentsLoading ? '...' : numberOfStudents}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 backdrop-blur-lg border border-gray-400 rounded-xl p-6 text-center animate-fadeIn hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <HiOutlineBookOpen className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Total Classes</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{classesLoading ? '...' : numberOfClasses}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 backdrop-blur-lg border border-gray-400 rounded-xl p-6 text-center animate-fadeIn hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <HiOutlineAcademicCap className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Total Teachers</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{teachersLoading ? '...' : numberOfTeachers}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 backdrop-blur-lg border border-gray-400 rounded-xl p-6 text-center animate-fadeIn hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <HiOutlineCurrencyDollar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Fees Collection</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">$23,000</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-200 backdrop-blur-lg border border-gray-400 rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Student Attendance</h3>
            <div className="space-x-2">
              <button
                onClick={() => setTimeFilter('Today')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  timeFilter === 'Today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeFilter('7 days')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  timeFilter === '7 days'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setTimeFilter('30 days')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  timeFilter === '30 days'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                30 days
              </button>
            </div>
          </div>
          <LineChart width={500} height={300} data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="name" stroke="#4b5563" />
            <YAxis stroke="#4b5563" />
            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', color: '#1f2937' }} />
            <Legend />
            <Line type="monotone" dataKey="attendance" stroke="#3b82f6" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
        <div className="bg-gray-200 backdrop-blur-lg border border-gray-400 rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Exam Performance</h3>
            <div className="space-x-2">
              <button
                onClick={() => setTimeFilter('Today')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  timeFilter === 'Today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeFilter('7 days')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  timeFilter === '7 days'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setTimeFilter('30 days')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  timeFilter === '30 days'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                30 days
              </button>
            </div>
          </div>
          <BarChart width={500} height={300} data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="name" stroke="#4b5563" />
            <YAxis stroke="#4b5563" />
            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', color: '#1f2937' }} />
            <Legend />
            <Bar dataKey="score" fill="#10b981" />
          </BarChart>
        </div>
      </div>

      {/* Notices */}
      <div className="bg-gray-200 backdrop-blur-lg border border-gray-400 rounded-xl p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Latest Notices</h3>
          <Link
            to="/Admin/addnotice"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            Add Notice
          </Link>
        </div>
        <div className="text-center">
          <SeeNotice />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;