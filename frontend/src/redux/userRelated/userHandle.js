import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else if (result.data.school) {
            dispatch(stuffAdded());
        }
        else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        console.log(`Récupération des détails de l'utilisateur: ${address}/${id}`);
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        
        if (result.data) {
            console.log(`Données reçues pour ${address}/${id}:`, result.data);
            
            // Vérifier les données d'examen
            if (address === 'Student' && result.data.examResult) {
                console.log(`Résultats d'examen trouvés: ${result.data.examResult.length}`);
            }
            
            // Vérifier les données d'assiduité
            if (address === 'Student' && result.data.attendance) {
                console.log(`Données d'assiduité trouvées: ${result.data.attendance.length}`);
            }
            
            dispatch(doneSuccess(result.data));
        } else {
            console.log(`Aucune donnée reçue pour ${address}/${id}`);
            dispatch(getFailed("Aucune donnée trouvée"));
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails de ${address}/${id}:`, error);
        const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message || 'Une erreur est survenue';
        dispatch(getError(errorMessage));
    }
};

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${address}Create`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(error));
    }
};

export const updateTeacherSubjectsAndClasses = (fields) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/TeacherSubjectsAndClasses`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded()); // Use stuffAdded to indicate success
        }
    } catch (error) {
        dispatch(authError(error));
    }
};