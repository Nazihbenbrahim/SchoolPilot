import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { setSelectedClass } from '../../redux/teacherRelated/teacherSlice';

const ClassSelector = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { selectedClass } = useSelector((state) => state.teacher);
  
  const [classes, setClasses] = useState([]);
  
  useEffect(() => {
    if (currentUser && currentUser.teachSclasses) {
      setClasses(currentUser.teachSclasses);
      
      // If no class is selected yet and there are classes available, select the first one
      if (!selectedClass && currentUser.teachSclasses.length > 0) {
        dispatch(setSelectedClass(currentUser.teachSclasses[0]));
      }
    }
  }, [currentUser, dispatch, selectedClass]);
  
  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    const selectedClass = classes.find(cls => cls._id === selectedClassId);
    dispatch(setSelectedClass(selectedClass));
  };
  
  if (!classes || classes.length === 0) {
    return (
      <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="body1" color="error">
          No classes assigned to you. Please contact the administrator.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="class-selector-label">Select Class</InputLabel>
        <Select
          labelId="class-selector-label"
          id="class-selector"
          value={selectedClass ? selectedClass._id : ''}
          onChange={handleClassChange}
          label="Select Class"
        >
          {classes.map((cls) => (
            <MenuItem key={cls._id} value={cls._id}>
              {cls.sclassName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ClassSelector;
