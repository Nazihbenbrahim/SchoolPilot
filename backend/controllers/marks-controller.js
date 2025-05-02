const Marks = require('../models/marksSchema');
const Student = require('../models/studentSchema');

// Enregistrer les notes pour un étudiant
const recordMarks = async (req, res) => {
    const { student, subject, marks } = req.body;
    
    if (marks < 0 || marks > 100) {
        return res.status(400).json({ message: 'Les notes doivent être comprises entre 0 et 100' });
    }
    
    try {
        // Vérifier si un enregistrement de notes existe déjà pour cet étudiant et cette matière
        const existingMarks = await Marks.findOne({
            student,
            subject
        });
        
        if (existingMarks) {
            // Mettre à jour l'enregistrement existant
            existingMarks.marks = marks;
            await existingMarks.save();
            res.status(200).json(existingMarks);
        } else {
            // Créer un nouvel enregistrement
            const newMarks = new Marks({
                student,
                subject,
                marks
            });
            
            await newMarks.save();
            res.status(201).json(newMarks);
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des notes:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Enregistrer les notes pour plusieurs étudiants à la fois
const recordBulkMarks = async (req, res) => {
    const { marksRecords } = req.body;
    
    if (!marksRecords || !Array.isArray(marksRecords) || marksRecords.length === 0) {
        return res.status(400).json({ message: 'Données de notes invalides' });
    }
    
    try {
        const results = [];
        
        for (const record of marksRecords) {
            const { student, subject, marks } = record;
            
            if (marks < 0 || marks > 100) {
                return res.status(400).json({ 
                    message: `Les notes pour l'étudiant ${student} doivent être comprises entre 0 et 100` 
                });
            }
            
            // Vérifier si un enregistrement existe déjà
            const existingMarks = await Marks.findOne({
                student,
                subject
            });
            
            if (existingMarks) {
                // Mettre à jour l'enregistrement existant
                existingMarks.marks = marks;
                const updated = await existingMarks.save();
                results.push(updated);
            } else {
                // Créer un nouvel enregistrement
                const newMarks = new Marks({
                    student,
                    subject,
                    marks
                });
                
                const saved = await newMarks.save();
                results.push(saved);
            }
        }
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement en masse des notes:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Obtenir les notes pour une matière spécifique
const getMarksBySubject = async (req, res) => {
    const { subjectId } = req.params;
    
    try {
        const marksRecords = await Marks.find({
            subject: subjectId
        }).populate('student', 'name rollNum');
        
        res.status(200).json(marksRecords);
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Obtenir les notes pour un étudiant et une matière spécifiques
const getMarksByStudentAndSubject = async (req, res) => {
    const { studentId, subjectId } = req.params;
    
    try {
        const marksRecord = await Marks.findOne({
            student: studentId,
            subject: subjectId
        });
        
        if (!marksRecord) {
            return res.status(404).json({ message: 'Aucune note trouvée pour cet étudiant dans cette matière' });
        }
        
        res.status(200).json(marksRecord);
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Obtenir toutes les notes pour un étudiant
const getMarksByStudent = async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const marksRecords = await Marks.find({
            student: studentId
        }).populate('subject', 'subName');
        
        res.status(200).json(marksRecords);
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

module.exports = {
    recordMarks,
    recordBulkMarks,
    getMarksBySubject,
    getMarksByStudentAndSubject,
    getMarksByStudent
};
