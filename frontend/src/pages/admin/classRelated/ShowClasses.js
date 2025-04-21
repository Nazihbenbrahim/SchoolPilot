import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { HiPlus, HiTrash } from 'react-icons/hi';

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass'));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);

  const deleteHandler = (deleteID, address) => {
    setMessage('Sorry, the delete function has been disabled for now.');
    setShowPopup(true);
  };

  const handleDeleteAllClasses = () => {
    setShowDeletePopup(false);
    deleteHandler(adminID, 'Sclasses');
  };

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
    { id: 'actions', label: 'Actions', minWidth: 150 },
  ];

  const sclassRows =
    sclassesList &&
    sclassesList.length > 0 &&
    sclassesList.map((sclass) => ({
      name: sclass.sclassName,
      id: sclass._id,
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={() => deleteHandler(sclass._id, 'Sclass')}
            className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300 animate-slideIn"
          >
            <HiTrash className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('/Admin/classes/class/' + sclass._id)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
          >
            View
          </button>
          <div className="relative">
            <button
              onClick={() =>
                setShowActionsDropdown(show => (showActionsDropdown === sclass._id ? null : sclass._id))
              }
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all duration-300 animate-slideIn"
            >
              Add
            </button>
            {showActionsDropdown === sclass._id && (
              <div className="absolute top-full mt-2 right-0 bg-gray-100/90 backdrop-blur-md text-gray-900 text-sm rounded-md shadow-lg transition-opacity duration-300 z-50 min-w-[150px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/Admin/addsubject/' + sclass._id);
                    setShowActionsDropdown(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-t-md"
                >
                  Add Subjects
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/Admin/class/addstudents/' + sclass._id);
                    setShowActionsDropdown(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-b-md"
                >
                  Add Student
                </button>
              </div>
            )}
          </div>
        </div>
      ),
    }));

  return (
    <div className="p-4 md:p-6">
      {loading ? (
        <div className="text-center text-gray-900">Loading...</div>
      ) : (
        <>
          {getresponse ? (
            <div className="flex justify-end mt-4 animate-fadeIn">
              <button
                onClick={() => navigate('/Admin/addclass')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50 animate-slideIn"
              >
                Add Class
              </button>
            </div>
          ) : (
            <>
              {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
                    Classes List
                  </h3>
                  <div className="relative">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-200/50">
                          {sclassColumns.map((column) => (
                            <th
                              key={column.id}
                              className="px-4 py-3 text-gray-900 font-semibold"
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sclassRows.map((row, index) => (
                          <tr
                            key={row.id}
                            className={`border-b border-gray-300/50 hover:bg-gray-200/50 transition-all duration-300 ${
                              index % 2 === 0 ? 'bg-gray-50/50' : 'bg-gray-100/50'
                            }`}
                          >
                            <td className="px-4 py-3 text-gray-900">{row.name}</td>
                            <td className="px-4 py-3">{row.actions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">
                      Rows per page: 5 • 1-{sclassRows.length} of {sclassRows.length}
                    </p>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300">
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300">
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="fixed bottom-6 right-6 space-x-3">
                <div className="relative group inline-block">
                  <button
                    className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 animate-slideIn"
                    onClick={() => navigate('/Admin/addclass')}
                  >
                    <HiPlus className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Add New Class
                  </div>
                </div>
                <div className="relative group inline-block">
                  <button
                    className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 animate-slideIn"
                    onClick={() => setShowDeletePopup(true)}
                  >
                    <HiTrash className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-md text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Delete All Classes
                  </div>
                </div>
              </div>
              {showDeletePopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-100/80 backdrop-blur-lg border border-gray-300/50 rounded-xl p-6 max-w-sm w-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                      Confirm Deletion
                    </h3>
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete all classes? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDeletePopup(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAllClasses}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ShowClasses;