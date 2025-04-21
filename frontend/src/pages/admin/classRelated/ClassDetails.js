import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassDetails, getClassStudents, getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { resetSubjects } from '../../../redux/sclassRelated/sclassSlice';
import TableTemplate from '../../../components/TableTemplate';
import Popup from '../../../components/Popup';
import { HiPlus } from 'react-icons/hi';

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector(
    (state) => state.sclass
  );

  const classID = params.id;

  useEffect(() => {
    dispatch(getClassDetails(classID, 'Sclass'));
    dispatch(getSubjectList(classID, 'ClassSubjects'));
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState('1');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const deleteHandler = (deleteID, address) => {
    setMessage('Sorry, the delete function has been disabled for now.');
    setShowPopup(true);
  };

  const subjectColumns = [
    { id: 'name', label: 'Subject Name', minWidth: 170 },
    { id: 'code', label: 'Subject Code', minWidth: 100 },
  ];

  const subjectRows =
    subjectsList &&
    subjectsList.length > 0 &&
    subjectsList.map((subject) => ({
      name: subject.subName,
      code: subject.subCode,
      id: subject._id,
    }));

  const SubjectsButtonHaver = ({ row }) => (
    <div className="flex space-x-2">
      <button
        onClick={() => deleteHandler(row.id, 'Subject')}
        className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300 animate-slideIn"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <button
        onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
      >
        View
      </button>
    </div>
  );

  const subjectActions = [
    {
      icon: <HiPlus className="h-6 w-6 text-blue-600" />,
      name: 'Add New Subject',
      action: () => navigate('/Admin/addsubject/' + classID),
    },
    {
      icon: <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
      name: 'Delete All Subjects',
      action: () => deleteHandler(classID, 'SubjectsClass'),
    },
  ];

  const ClassSubjectsSection = () => (
    <div>
      {response ? (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate('/Admin/addsubject/' + classID)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn"
          >
            Add Subjects
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
            Subjects List
          </h3>
          <div className="relative">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200/50">
                  {subjectColumns.map((column) => (
                    <th
                      key={column.id}
                      className="px-4 py-3 text-gray-900 font-semibold"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-gray-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjectRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 ${
                      index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-gray-900">{row.code}</td>
                    <td className="px-4 py-3">{<SubjectsButtonHaver row={row} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-6 right-6 group">
            <button
              className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
              onClick={() => subjectActions[0].action()}
            >
              <HiPlus className="h-6 w-6" />
            </button>
            <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Add New Subject
            </div>
          </div>
        </>
      )}
    </div>
  );

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
  ];

  const studentRows =
    sclassStudents &&
    sclassStudents.map((student) => ({
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    }));

  const StudentsButtonHaver = ({ row }) => (
    <div className="flex space-x-2">
      <button
        onClick={() => deleteHandler(row.id, 'Student')}
        className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300 animate-slideIn"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <button
        onClick={() => navigate('/Admin/students/student/' + row.id)}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
      >
        View
      </button>
      <button
        onClick={() => navigate('/Admin/students/student/attendance/' + row.id)}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 animate-slideIn"
      >
        Attendance
      </button>
    </div>
  );

  const studentActions = [
    {
      icon: <HiPlus className="h-6 w-6 text-blue-600" />,
      name: 'Add New Student',
      action: () => navigate('/Admin/class/addstudents/' + classID),
    },
    {
      icon: <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
      name: 'Delete All Students',
      action: () => deleteHandler(classID, 'StudentsClass'),
    },
  ];

  const ClassStudentsSection = () => (
    <div>
      {getresponse ? (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate('/Admin/class/addstudents/' + classID)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn"
          >
            Add Students
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
            Students List
          </h3>
          <div className="relative">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200/50">
                  {studentColumns.map((column) => (
                    <th
                      key={column.id}
                      className="px-4 py-3 text-gray-900 font-semibold"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-gray-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 ${
                      index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-gray-900">{row.rollNum}</td>
                    <td className="px-4 py-3">{<StudentsButtonHaver row={row} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-6 right-6 group">
            <button
              className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
              onClick={() => studentActions[0].action()}
            >
              <HiPlus className="h-6 w-6" />
            </button>
            <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Add New Student
            </div>
          </div>
        </>
      )}
    </div>
  );

  const ClassTeachersSection = () => (
    <div className="text-gray-900">
      <h3 className="text-xl font-semibold mb-4 font-poppins">Teachers</h3>
      <p className="text-gray-700">Teachers section is under development.</p>
    </div>
  );

  const ClassDetailsSection = () => {
    const numberOfSubjects = subjectsList.length;
    const numberOfStudents = sclassStudents.length;

    return (
      <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 text-center animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 font-poppins">
          Class Details
        </h2>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Class: {sclassDetails && sclassDetails.sclassName}
        </h3>
        <p className="text-lg text-gray-700 mb-2">
          Number of Subjects: {numberOfSubjects}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Number of Students: {numberOfStudents}
        </p>
        <div className="flex justify-center space-x-4">
          {getresponse && (
            <button
              onClick={() => navigate('/Admin/class/addstudents/' + classID)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn"
            >
              Add Students
            </button>
          )}
          {response && (
            <button
              onClick={() => navigate('/Admin/addsubject/' + classID)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn"
            >
              Add Subjects
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {loading ? (
        <div className="text-center text-gray-900">Loading...</div>
      ) : (
        <div>
          <div className="fixed top-16 left-0 right-0 z-10 bg-gray-100/80 backdrop-blur-lg border-b border-gray-300/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <div className="flex space-x-4 p-4 overflow-x-auto">
              <button
                onClick={() => handleChange('1')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                  value === '1'
                    ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => handleChange('2')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                  value === '2'
                    ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                }`}
              >
                Subjects
              </button>
              <button
                onClick={() => handleChange('3')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                  value === '3'
                    ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => handleChange('4')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-poppins ${
                  value === '4'
                    ? 'bg-accent-blue/50 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'text-gray-900 hover:bg-blue-gray-200 hover:text-accent-blue'
                }`}
              >
                Teachers
              </button>
            </div>
          </div>
          <div className="mt-16">
            {value === '1' && <ClassDetailsSection />}
            {value === '2' && <ClassSubjectsSection />}
            {value === '3' && <ClassStudentsSection />}
            {value === '4' && <ClassTeachersSection />}
          </div>
        </div>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ClassDetails;