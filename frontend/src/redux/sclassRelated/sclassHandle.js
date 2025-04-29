import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    getSubjectsSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest,
    updateStudentMarksRequest,
    updateStudentMarksSuccess,
    updateStudentMarksFail,
    updateStudentAttendanceRequest,
    updateStudentAttendanceSuccess,
    updateStudentAttendanceFail,
} from './sclassSlice';

const BASE_URL = "http://localhost:5000";

export const updateStudentMarks = createAsyncThunk(
    'sclass/updateStudentMarks',
    async ({ studentID, subName, marksObtained }, { dispatch, rejectWithValue }) => {
        dispatch(updateStudentMarksRequest());
        try {
            const { data } = await axios.put(`${BASE_URL}/UpdateExamResult/${studentID}`, { subName, marksObtained });
            if (data.message) {
                throw new Error(data.message);
            }
            dispatch(updateStudentMarksSuccess({ studentID, subName, marksObtained }));
            return data;
        } catch (error) {
            console.error("Error updating marks:", error.message);
            dispatch(updateStudentMarksFail(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const updateStudentAttendance = createAsyncThunk(
    'sclass/updateStudentAttendance',
    async ({ studentID, subName, status, date }, { dispatch, rejectWithValue }) => {
        dispatch(updateStudentAttendanceRequest());
        try {
            const { data } = await axios.post(`${BASE_URL}/StudentAttendance/${studentID}`, { subName, status, date });
            if (data.message) {
                throw new Error(data.message);
            }
            dispatch(updateStudentAttendanceSuccess({ studentID, subName, status, date }));
            return data;
        } catch (error) {
            console.error("Error updating attendance:", error.message);
            dispatch(updateStudentAttendanceFail(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const getAllSclasses = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const getClassStudents = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/Sclass/Students/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getStudentsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const getClassDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(detailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSubjectsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/FreeSubjectList/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSubjectsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());
    try {
        const result = await axios.get(`${BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(getSubDetailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};