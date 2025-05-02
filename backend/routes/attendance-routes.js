const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance-controller');

// Route pour enregistrer l'assiduité d'un étudiant
router.post('/', attendanceController.recordAttendance);

// Route pour enregistrer l'assiduité de plusieurs étudiants à la fois
router.post('/bulk', attendanceController.recordBulkAttendance);

// Route pour obtenir l'assiduité par matière et date
router.get('/subject/:subjectId/date/:date', attendanceController.getAttendanceBySubjectAndDate);

// Route pour obtenir l'assiduité par étudiant et matière
router.get('/student/:studentId/subject/:subjectId', attendanceController.getAttendanceByStudentAndSubject);

module.exports = router;
