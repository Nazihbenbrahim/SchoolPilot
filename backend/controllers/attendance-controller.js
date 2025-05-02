const Attendance = require('../models/attendanceSchema');
const Student = require('../models/studentSchema');

// Enregistrer l'assiduité pour un étudiant
const recordAttendance = async (req, res) => {
    const { student, subject, date, status } = req.body;
    
    try {
        // Vérifier si un enregistrement d'assiduité existe déjà pour cet étudiant, cette matière et cette date
        const existingAttendance = await Attendance.findOne({
            student,
            subject,
            date: new Date(date)
        });
        
        if (existingAttendance) {
            // Mettre à jour l'enregistrement existant
            existingAttendance.status = status;
            await existingAttendance.save();
            res.status(200).json(existingAttendance);
        } else {
            // Créer un nouvel enregistrement
            const newAttendance = new Attendance({
                student,
                subject,
                date: new Date(date),
                status
            });
            
            await newAttendance.save();
            res.status(201).json(newAttendance);
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'assiduité:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Enregistrer l'assiduité pour plusieurs étudiants à la fois
const recordBulkAttendance = async (req, res) => {
    const { attendanceRecords } = req.body;
    
    if (!attendanceRecords || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
        return res.status(400).json({ message: 'Données d\'assiduité invalides' });
    }
    
    try {
        const results = [];
        
        for (const record of attendanceRecords) {
            const { student, subject, date, status } = record;
            
            // Vérifier si un enregistrement existe déjà
            const existingAttendance = await Attendance.findOne({
                student,
                subject,
                date: new Date(date)
            });
            
            if (existingAttendance) {
                // Mettre à jour l'enregistrement existant
                existingAttendance.status = status;
                const updated = await existingAttendance.save();
                results.push(updated);
            } else {
                // Créer un nouvel enregistrement
                const newAttendance = new Attendance({
                    student,
                    subject,
                    date: new Date(date),
                    status
                });
                
                const saved = await newAttendance.save();
                results.push(saved);
            }
        }
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement en masse de l\'assiduité:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Obtenir l'assiduité pour une matière et une date spécifiques
const getAttendanceBySubjectAndDate = async (req, res) => {
    const { subjectId, date } = req.params;
    
    try {
        // Convertir la date en objet Date
        const targetDate = new Date(date);
        
        // Définir les limites de la date pour trouver les enregistrements du jour spécifié
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const attendanceRecords = await Attendance.find({
            subject: subjectId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('student', 'name rollNum');
        
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'assiduité:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Obtenir l'assiduité pour un étudiant et une matière spécifiques
const getAttendanceByStudentAndSubject = async (req, res) => {
    const { studentId, subjectId } = req.params;
    
    try {
        const attendanceRecords = await Attendance.find({
            student: studentId,
            subject: subjectId
        }).sort({ date: -1 });
        
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'assiduité:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

module.exports = {
    recordAttendance,
    recordBulkAttendance,
    getAttendanceBySubjectAndDate,
    getAttendanceByStudentAndSubject
};
