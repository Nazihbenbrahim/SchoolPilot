const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        console.log(`Récupération des détails de l'étudiant avec ID: ${req.params.id}`);
        
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        
        if (student) {
            // Masquer le mot de passe
            student.password = undefined;
            
            // Vérifier si les résultats d'examen existent
            if (student.examResult && student.examResult.length > 0) {
                console.log(`L'étudiant a ${student.examResult.length} résultats d'examen`);
            } else {
                console.log(`Aucun résultat d'examen trouvé pour l'étudiant`);
            }
            
            // Vérifier si les données d'assiduité existent
            if (student.attendance && student.attendance.length > 0) {
                console.log(`L'étudiant a ${student.attendance.length} enregistrements d'assiduité`);
            } else {
                console.log(`Aucune donnée d'assiduité trouvée pour l'étudiant`);
            }
            
            res.status(200).send(student);
        }
        else {
            console.log(`Aucun étudiant trouvé avec l'ID: ${req.params.id}`);
            res.status(404).send({ message: "No student found" });
        }
    } catch (err) {
        console.error(`Erreur lors de la récupération des détails de l'étudiant:`, err);
        res.status(500).json({ message: "Erreur lors de la récupération des détails de l'étudiant", error: err.message });
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        // Vérifier si l'ID de l'étudiant est valide
        if (!req.params.id) {
            return res.status(400).send({ message: 'Student ID is required' });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Vérifier si l'ID de la matière est valide
        if (!subName) {
            return res.status(400).send({ message: 'Subject ID is required' });
        }

        // Vérifier si les notes sont valides
        if (marksObtained === undefined || marksObtained === null) {
            return res.status(400).send({ message: 'Marks are required' });
        }

        // Vérifier si la matière existe
        const subject = await Subject.findById(subName);
        if (!subject) {
            return res.status(404).send({ message: 'Subject not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.status(200).send(result);
    } catch (error) {
        console.error('Error in updateExamResult:', error);
        return res.status(500).send({ message: 'Error updating exam result', error: error.message });
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        // Vérifier si l'ID de l'étudiant est valide
        if (!req.params.id) {
            return res.status(400).send({ message: 'Student ID is required' });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Vérifier si l'ID de la matière est valide
        if (!subName) {
            return res.status(400).send({ message: 'Subject ID is required' });
        }

        const subject = await Subject.findById(subName);

        if (!subject) {
            return res.status(404).send({ message: 'Subject not found' });
        }

        // Vérifier si la date est valide
        if (!date) {
            return res.status(400).send({ message: 'Date is required' });
        }

        // Ajouter des logs pour déboguer la comparaison des dates
        console.log('Date reçue:', date);
        console.log('Date formatée:', new Date(date).toISOString());
        
        // Utiliser une méthode plus fiable pour comparer les dates
        const formattedDate = new Date(date).toISOString().split('T')[0];
        
        const existingAttendance = student.attendance.find((a) => {
            // Convertir la date de l'enregistrement au même format pour la comparaison
            const attendanceDate = new Date(a.date).toISOString().split('T')[0];
            console.log('Comparaison de dates:', attendanceDate, formattedDate);
            console.log('Comparaison de matières:', a.subName.toString(), subName);
            
            return attendanceDate === formattedDate && a.subName.toString() === subName;
        });

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;
            
            console.log('Sessions assistées:', attendedSessions);
            console.log('Sessions totales de la matière:', subject.sessions);
            
            // Vérifier si le nombre de sessions est défini et est un nombre valide
            const maxSessions = subject.sessions ? parseInt(subject.sessions, 10) : 0;
            
            if (!isNaN(maxSessions) && maxSessions > 0 && attendedSessions >= maxSessions) {
                return res.status(400).send({ 
                    message: 'Maximum attendance limit reached', 
                    details: `L'étudiant a déjà assisté à ${attendedSessions} sessions sur ${maxSessions} autorisées.` 
                });
            }
            
            // Créer un nouvel enregistrement d'assiduité avec la date au format ISO
            const newAttendance = { 
                date: new Date(date), 
                status, 
                subName 
            };
            
            console.log('Ajout d\'un nouvel enregistrement d\'assiduité:', newAttendance);
            student.attendance.push(newAttendance);
        }

        try {
            const result = await student.save();
            console.log('Enregistrement réussi:', result);
            return res.status(200).send(result);
        } catch (saveError) {
            console.error('Erreur lors de l\'enregistrement de l\'assiduité:', saveError);
            
            // Gérer les erreurs de validation MongoDB
            if (saveError.name === 'ValidationError') {
                const validationErrors = {};
                
                // Extraire les messages d'erreur de validation
                Object.keys(saveError.errors).forEach(key => {
                    validationErrors[key] = saveError.errors[key].message;
                });
                
                return res.status(400).send({
                    message: 'Erreur de validation',
                    validationErrors,
                    error: saveError.message
                });
            }
            
            // Gérer les erreurs de duplication
            if (saveError.code === 11000) {
                return res.status(400).send({
                    message: 'Enregistrement en double',
                    error: 'Un enregistrement avec ces informations existe déjà.'
                });
            }
            
            return res.status(500).send({ 
                message: 'Erreur lors de l\'enregistrement de l\'assiduité', 
                error: saveError.message,
                stack: saveError.stack
            });
        }
    } catch (error) {
        console.error('Error in studentAttendance:', error);
        
        // Fournir des détails sur l'erreur
        const errorDetails = {
            message: 'Erreur lors de la mise à jour de l\'assiduité',
            error: error.message,
            stack: error.stack
        };
        
        // Ajouter des détails spécifiques en fonction du type d'erreur
        if (error.name === 'CastError') {
            errorDetails.details = `Valeur invalide pour le champ ${error.path}: ${error.value}`;
        }
        
        return res.status(500).send(errorDetails);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};