const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const TeacherClassSubject = require('../models/teacherClassSubjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubjects, teachSclasses, classSubjectMappings } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({ 
            name, 
            email, 
            password: hashedPass, 
            role, 
            school, 
            teachSubjects: teachSubjects || [], // Expect array
            teachSclasses: teachSclasses || []  // Expect array
        });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email already exists' });
        } else {
            let result = await teacher.save();
            
            // Update subjects to reference this teacher
            if (teachSubjects && teachSubjects.length > 0) {
                await Subject.updateMany(
                    { _id: { $in: teachSubjects } },
                    { $set: { teacher: teacher._id } }
                );
            }
            
            // Créer les associations classe-matière pour l'enseignant
            if (classSubjectMappings && classSubjectMappings.length > 0) {
                const mappingsToSave = classSubjectMappings.map(mapping => ({
                    teacher: teacher._id,
                    class: mapping.classId,
                    subjects: mapping.subjects || []
                }));
                
                await TeacherClassSubject.insertMany(mappingsToSave);
            }
            
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        console.error('Error in teacherRegister:', err);
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubjects", "subName sessions");
                teacher = await teacher.populate("school", "schoolName");
                teacher = await teacher.populate("teachSclasses", "sclassName");
                
                // Obtenir les associations classe-matière pour cet enseignant
                const classSubjectMappings = await TeacherClassSubject.find({ teacher: teacher._id })
                    .populate("class", "sclassName")
                    .populate("subjects", "subName");
                
                // Ajouter les mappings à l'objet enseignant
                const teacherObj = teacher.toObject();
                teacherObj.classSubjectMappings = classSubjectMappings;
                teacherObj.password = undefined;
                
                console.log(`Teacher logged in: ${teacher.name}, teachSclasses:`, teacher.teachSclasses);
                res.send(teacherObj);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        console.error("Error during teacher login:", err);
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubjects", "subName")
            .populate("teachSclasses", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubjects", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclasses", "sclassName");
            
        if (teacher) {
            // Obtenir les associations classe-matière pour cet enseignant
            const classSubjectMappings = await TeacherClassSubject.find({ teacher: teacher._id })
                .populate("class", "sclassName")
                .populate("subjects", "subName");
            
            // Ajouter les mappings à l'objet enseignant
            const teacherObj = teacher.toObject();
            teacherObj.classSubjectMappings = classSubjectMappings;
            teacherObj.password = undefined;
            
            res.send(teacherObj);
        } else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        console.error("Error in getTeacherDetail:", err);
        res.status(500).json(err);
    }
};

const updateTeacherSubjectsAndClasses = async (req, res) => {
    const { teacherId, teachSubjects, teachSclasses, classSubjectMappings } = req.body;
    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const removedSubjects = teacher.teachSubjects.filter(
            (subjectId) => !teachSubjects.includes(subjectId.toString())
        );
        if (removedSubjects.length > 0) {
            await Subject.updateMany(
                { _id: { $in: removedSubjects } },
                { $unset: { teacher: 1 } }
            );
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubjects, teachSclasses },
            { new: true }
        ).populate("teachSubjects", "subName sessions")
         .populate("teachSclasses", "sclassName");

        if (teachSubjects && teachSubjects.length > 0) {
            await Subject.updateMany(
                { _id: { $in: teachSubjects } },
                { $set: { teacher: updatedTeacher._id } }
            );
        }
        
        // Mettre à jour les associations classe-matière
        if (classSubjectMappings && classSubjectMappings.length > 0) {
            // Supprimer les anciennes associations
            await TeacherClassSubject.deleteMany({ teacher: teacherId });
            
            // Créer les nouvelles associations
            const mappingsToSave = classSubjectMappings.map(mapping => ({
                teacher: teacherId,
                class: mapping.classId,
                subjects: mapping.subjects || []
            }));
            
            await TeacherClassSubject.insertMany(mappingsToSave);
            
            // Récupérer les nouvelles associations pour les inclure dans la réponse
            const newMappings = await TeacherClassSubject.find({ teacher: teacherId })
                .populate("class", "sclassName")
                .populate("subjects", "subName");
                
            // Ajouter les mappings à l'objet enseignant
            const teacherObj = updatedTeacher.toObject();
            teacherObj.classSubjectMappings = newMappings;
            
            return res.send(teacherObj);
        }

        res.send(updatedTeacher);
    } catch (error) {
        console.error("Error in updateTeacherSubjectsAndClasses:", error);
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Supprimer les références dans les matières
        await Subject.updateMany(
            { teacher: deletedTeacher._id },
            { $unset: { teacher: 1 } }
        );
        
        // Supprimer les associations classe-matière
        await TeacherClassSubject.deleteMany({ teacher: req.params.id });

        res.send(deletedTeacher);
    } catch (error) {
        console.error("Error in deleteTeacher:", error);
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        await Subject.updateMany(
            { teacher: { $in: deletionResult.map(teacher => teacher._id) } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ teachSclasses: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ teachSclasses: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) => a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubjectsAndClasses,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};