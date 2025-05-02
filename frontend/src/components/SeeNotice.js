import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices, getNoticesByClass } from '../redux/noticeRelated/noticeHandle';
import { Paper, Typography, Chip } from '@mui/material';
import TableViewTemplate from './TableViewTemplate';

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    // Pour les enseignants, récupérer les notices spécifiques à la classe sélectionnée
    const { selectedClass } = useSelector(state => state.teacher);

    useEffect(() => {
        if (currentRole === "Admin") {
            // Pour l'admin, récupérer toutes les notices
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else if (currentRole === "Teacher" && selectedClass) {
            // Pour les enseignants, récupérer les notices spécifiques à la classe sélectionnée
            dispatch(getNoticesByClass(currentUser.school._id, selectedClass._id));
        }
        else if (currentRole === "Student") {
            // Pour les étudiants, récupérer les notices spécifiques à leur classe
            dispatch(getNoticesByClass(currentUser.school._id, currentUser.sclass._id));
        }
        else {
            // Fallback pour les autres cas
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch, currentRole, currentUser, selectedClass]);

    if (error) {
        console.log(error);
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
        { id: 'targetClass', label: 'Classe', minWidth: 100 },
    ];

    const noticeRows = noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            targetClass: notice.isGeneral ? 'Toutes les classes' : (notice.targetClass?.sclassName || 'Non spécifiée'),
            id: notice._id,
        };
    });
    return (
        <div style={{ marginTop: '50px', marginRight: '20px' }}>
            {loading ? (
                <div style={{ fontSize: '20px' }}>Loading...</div>
            ) : response ? (
                <div style={{ fontSize: '20px' }}>No Notices to Show Right Now</div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '30px' }}>Notices</h3>
                        {currentRole === "Teacher" && selectedClass && (
                            <Chip 
                                label={`Classe: ${selectedClass.sclassName}`} 
                                color="primary" 
                                variant="outlined" 
                            />
                        )}
                    </div>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {Array.isArray(noticesList) && noticesList.length > 0 &&
                            <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
                        }
                    </Paper>
                </>
            )}
        </div>

    )
}

export default SeeNotice