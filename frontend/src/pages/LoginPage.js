import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector((state) => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === 'Student') {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'rollNumber') setRollNumberError(false);
    if (name === 'studentName') setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = 'zxc';

    if (role === 'Admin') {
      const email = 'yogendra@12';
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (role === 'Student') {
      const rollNum = '1';
      const studentName = 'Dipesh Awasthi';
      const fields = { rollNum, studentName, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (role === 'Teacher') {
      const email = 'tony@12';
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-gray-900 via-gray-900 to-blue-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-blue-gray-700/50 shadow-xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
        <h2 className="text-3xl font-poppins font-semibold text-blue-gray-100 mb-2 text-center tracking-wide">
          {role} Login
        </h2>
        <p className="text-center text-blue-gray-300 mb-6">
          Welcome back! Please enter your details
        </p>
        <form onSubmit={handleSubmit}>
          {role === 'Student' ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="rollNumber"
                  className="block text-blue-gray-200 font-poppins mb-2"
                >
                  Roll Number
                </label>
                <input
                  type="number"
                  id="rollNumber"
                  name="rollNumber"
                  className={`w-full p-3 bg-blue-gray-800/50 border border-blue-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder-blue-gray-400 transition-all duration-300 ${
                    rollNumberError ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your Roll Number"
                  autoComplete="off"
                  autoFocus
                  onChange={handleInputChange}
                />
                {rollNumberError && (
                  <p className="text-red-500 text-sm mt-1">Roll Number is required</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="studentName"
                  className="block text-blue-gray-200 font-poppins mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  className={`w-full p-3 bg-blue-gray-800/50 border border-blue-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder-blue-gray-400 transition-all duration-300 ${
                    studentNameError ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your name"
                  autoComplete="name"
                  autoFocus
                  onChange={handleInputChange}
                />
                {studentNameError && (
                  <p className="text-red-500 text-sm mt-1">Name is required</p>
                )}
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-blue-gray-200 font-poppins mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full p-3 bg-blue-gray-800/50 border border-blue-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder-blue-gray-400 transition-all duration-300 ${
                  emailError ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
                autoComplete="email"
                autoFocus
                onChange={handleInputChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-blue-gray-200 font-poppins mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={toggle ? 'text' : 'password'}
                id="password"
                name="password"
                className={`w-full p-3 bg-blue-gray-800/50 border border-blue-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder-blue-gray-400 transition-all duration-300 ${
                  passwordError ? 'border-red-500' : ''
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setToggle(!toggle)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-gray-400 hover:text-accent-blue transition-colors duration-300"
              >
                {toggle ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center text-blue-gray-300 font-poppins">
              <input type="checkbox" value="remember" className="mr-2 accent-accent-blue" />
              Remember me
            </label>
            <Link
              to="#"
              className="text-accent-blue hover:underline hover:text-blue-400 transition-colors duration-300"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent-blue to-blue-700 text-white font-poppins py-3 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/50"
            disabled={loader}
          >
            {loader ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
          <button
            type="button"
            onClick={guestModeHandler}
            className="w-full mt-3 bg-transparent border border-accent-blue text-accent-blue font-poppins py-3 rounded-md hover:bg-blue-800/50 hover:text-blue-400 transition-all duration-300"
            disabled={guestLoader}
          >
            Login as Guest
          </button>
          {role === 'Admin' && (
            <div className="mt-4 flex justify-center gap-2 text-blue-gray-300">
              <span>Don't have an account?</span>
              <Link
                to="/Adminregister"
                className="text-accent-blue hover:underline hover:text-blue-400 transition-colors duration-300"
              >
                Sign up
              </Link>
            </div>
          )}
        </form>
      </div>
      {guestLoader && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <svg
            className="animate-spin h-8 w-8 text-accent-blue mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="text-white font-poppins text-lg">Please Wait</span>
        </div>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default LoginPage;