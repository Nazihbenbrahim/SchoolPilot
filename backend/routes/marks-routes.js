const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marks-controller');

// Route pour enregistrer les notes d'un étudiant
router.post('/', marksController.recordMarks);

// Route pour enregistrer les notes de plusieurs étudiants à la fois
router.post('/bulk', marksController.recordBulkMarks);

// Route pour obtenir les notes par matière
router.get('/subject/:subjectId', marksController.getMarksBySubject);

// Route pour obtenir les notes par étudiant et matière
router.get('/student/:studentId/subject/:subjectId', marksController.getMarksByStudentAndSubject);

// Route pour obtenir toutes les notes d'un étudiant
router.get('/student/:studentId', marksController.getMarksByStudent);

module.exports = router;
