import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import { Box, Container, Paper, Typography, TextField, Button, InputAdornment, IconButton, Checkbox, FormControlLabel, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import EnsitLogoHorizontal from '../assets/logos/EnsitLogoHorizontal';
import EnsitLogoUnesco from '../assets/logos/EnsitLogoUnesco';

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

  const theme = useTheme();

  // Styled components
  const LoginContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.main}10 100%)`,
  }));

  const LoginCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  }));

  const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }));

  const LoginButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    '&:hover': {
      background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    },
  }));

  const GuestButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}10`,
    },
  }));

  return (
    <LoginContainer>
      <LoginCard elevation={4}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <EnsitLogoHorizontal height={60} />
        </Box>

        <Typography variant="h5" component="h1" align="center" fontWeight="bold" gutterBottom>
          {role} Login
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Welcome back! Please enter your details
        </Typography>
        <form onSubmit={handleSubmit}>
          {role === 'Student' ? (
            <>
              <StyledTextField
                fullWidth
                id="rollNumber"
                name="rollNumber"
                label="Roll Number"
                type="number"
                error={rollNumberError}
                helperText={rollNumberError ? 'Roll Number is required' : ''}
                onChange={handleInputChange}
                autoFocus
                variant="outlined"
              />

              <StyledTextField
                fullWidth
                id="studentName"
                name="studentName"
                label="Name"
                type="text"
                error={studentNameError}
                helperText={studentNameError ? 'Name is required' : ''}
                onChange={handleInputChange}
                variant="outlined"
              />
            </>
          ) : (
            <StyledTextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              error={emailError}
              helperText={emailError ? 'Email is required' : ''}
              onChange={handleInputChange}
              autoFocus
              variant="outlined"
            />
          )}

          <StyledTextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={toggle ? 'text' : 'password'}
            error={passwordError}
            helperText={passwordError ? 'Password is required' : ''}
            onChange={handleInputChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setToggle(!toggle)}
                    edge="end"
                  >
                    {toggle ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />
            <Link
              to="#"
              style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          </Box>

          <LoginButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={loader}
            startIcon={
              loader && (
                <svg
                  className="animate-spin h-5 w-5"
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
              )
            }
          >
            {loader ? 'Logging in...' : 'Login'}
          </LoginButton>

          <GuestButton
            type="button"
            fullWidth
            variant="outlined"
            onClick={guestModeHandler}
            disabled={guestLoader}
          >
            Login as Guest
          </GuestButton>

          {role === 'Admin' && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" display="inline">
                Don't have an account?
              </Typography>
              <Link
                to="/Adminregister"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  marginLeft: '8px',
                  fontWeight: 500,
                }}
              >
                Sign up
              </Link>
            </Box>
          )}
        </form>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <EnsitLogoUnesco height={40} opacity={0.7} />
        </Box>
      </LoginCard>

      {guestLoader && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <svg
              className="animate-spin"
              style={{ height: '32px', width: '32px', marginRight: '12px', color: theme.palette.primary.main }}
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
            <Typography variant="h6" color="white">
              Please Wait
            </Typography>
          </Box>
        </Box>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </LoginContainer>
  );
};

export default LoginPage;