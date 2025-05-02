import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  error: null,
  schedules: [],
  currentSchedule: null,
  classSchedules: [],
  teacherSchedules: [],
  message: null,
  response: null
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.status = 'loading';
    },
    getSuccess: (state, action) => {
      state.status = 'succeeded';
      state.schedules = action.payload;
      state.error = null;
    },
    getClassSchedulesSuccess: (state, action) => {
      state.status = 'succeeded';
      state.classSchedules = action.payload;
      state.error = null;
    },
    getTeacherSchedulesSuccess: (state, action) => {
      state.status = 'succeeded';
      state.teacherSchedules = action.payload;
      state.error = null;
    },
    getScheduleDetailsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.currentSchedule = action.payload;
      state.error = null;
    },
    createScheduleSuccess: (state, action) => {
      state.status = 'succeeded';
      state.response = action.payload;
      state.error = null;
    },
    updateScheduleSuccess: (state, action) => {
      state.status = 'succeeded';
      state.response = action.payload;
      state.error = null;
    },
    deleteScheduleSuccess: (state, action) => {
      state.status = 'succeeded';
      state.response = action.payload;
      state.error = null;
    },
    getFailed: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    getError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload.message;
    },
    resetScheduleStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.response = null;
    }
  }
});

export const {
  getRequest,
  getSuccess,
  getClassSchedulesSuccess,
  getTeacherSchedulesSuccess,
  getScheduleDetailsSuccess,
  createScheduleSuccess,
  updateScheduleSuccess,
  deleteScheduleSuccess,
  getFailed,
  getError,
  resetScheduleStatus
} = scheduleSlice.actions;

export default scheduleSlice.reducer;

// Actions pour les emplois du temps
export const getClassSchedules = (schoolId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/schedules/class/${schoolId}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getClassSchedulesSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getTeacherSchedules = (schoolId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/schedules/teacher/${schoolId}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getTeacherSchedulesSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getScheduleDetails = (scheduleId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/schedules/detail/${scheduleId}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getScheduleDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const createSchedule = (scheduleData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/schedules`, scheduleData);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(createScheduleSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateSchedule = (scheduleId, scheduleData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/schedules/${scheduleId}`, scheduleData);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(updateScheduleSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteSchedule = (scheduleId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/schedules/${scheduleId}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(deleteScheduleSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
