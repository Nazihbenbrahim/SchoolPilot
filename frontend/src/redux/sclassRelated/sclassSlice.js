import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sclassesList: [],
    sclassStudents: [],
    sclassDetails: [],
    subjectsList: [],
    subjectDetails: [],
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
    marksLoading: false,
    marksError: null,
    attendanceLoading: false,
    attendanceError: null,
};

const sclassSlice = createSlice({
    name: 'sclass',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSubDetailsRequest: (state) => {
            state.subloading = true;
        },
        getSuccess: (state, action) => {
            state.sclassesList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getStudentsSuccess: (state, action) => {
            state.sclassStudents = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getSubjectsSuccess: (state, action) => {
            state.subjectsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.subjectsList = [];
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailedTwo: (state, action) => {
            state.sclassesList = [];
            state.sclassStudents = [];
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        detailsSuccess: (state, action) => {
            state.sclassDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        getSubDetailsSuccess: (state, action) => {
            state.subjectDetails = action.payload;
            state.subloading = false;
            state.error = null;
        },
        resetSubjects: (state) => {
            state.subjectsList = [];
            state.sclassesList = [];
        },
        updateStudentMarksRequest: (state) => {
            state.marksLoading = true;
            state.marksError = null;
        },
        updateStudentMarksSuccess: (state, action) => {
            const { studentID, subName, marksObtained } = action.payload;
            const studentIndex = state.sclassStudents.findIndex(student => student._id === studentID);
            if (studentIndex !== -1) {
                const examResultIndex = state.sclassStudents[studentIndex].examResult.findIndex(
                    result => result.subName === subName
                );
                if (examResultIndex !== -1) {
                    state.sclassStudents[studentIndex].examResult[examResultIndex].marksObtained = marksObtained;
                } else {
                    state.sclassStudents[studentIndex].examResult.push({ subName, marksObtained });
                }
            }
            state.marksLoading = false;
            state.marksError = null;
        },
        updateStudentMarksFail: (state, action) => {
            state.marksLoading = false;
            state.marksError = action.payload;
        },
        updateStudentAttendanceRequest: (state) => {
            state.attendanceLoading = true;
            state.attendanceError = null;
        },
        updateStudentAttendanceSuccess: (state, action) => {
            const { studentID, subName, status, date } = action.payload;
            const studentIndex = state.sclassStudents.findIndex(student => student._id === studentID);
            if (studentIndex !== -1) {
                const attendanceIndex = state.sclassStudents[studentIndex].attendance.findIndex(
                    att => att.subName === subName && new Date(att.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
                );
                if (attendanceIndex !== -1) {
                    state.sclassStudents[studentIndex].attendance[attendanceIndex].status = status;
                } else {
                    state.sclassStudents[studentIndex].attendance.push({ subName, status, date: new Date(date) });
                }
            }
            state.attendanceLoading = false;
            state.attendanceError = null;
        },
        updateStudentAttendanceFail: (state, action) => {
            state.attendanceLoading = false;
            state.attendanceError = action.payload;
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    getSubjectsSuccess,
    detailsSuccess,
    getFailedTwo,
    resetSubjects,
    getSubDetailsSuccess,
    getSubDetailsRequest,
    updateStudentMarksRequest,
    updateStudentMarksSuccess,
    updateStudentMarksFail,
    updateStudentAttendanceRequest,
    updateStudentAttendanceSuccess,
    updateStudentAttendanceFail,
} = sclassSlice.actions;

export const sclassReducer = sclassSlice.reducer;