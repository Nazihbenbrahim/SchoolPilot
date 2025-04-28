const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubjects, teachSclasses } = req.body;
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
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
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
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
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
            teacher.password = undefined;
            res.send(teacher);
        } else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateTeacherSubjectsAndClasses = async (req, res) => {
    const { teacherId, teachSubjects, teachSclasses } = req.body;
    try {
        // Find the teacher to get the current subjects
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Remove teacher reference from subjects that are no longer assigned
        const removedSubjects = teacher.teachSubjects.filter(
            (subjectId) => !teachSubjects.includes(subjectId.toString())
        );
        if (removedSubjects.length > 0) {
            await Subject.updateMany(
                { _id: { $in: removedSubjects } },
                { $unset: { teacher: 1 } }
            );
        }

        // Update the teacher with new subjects and classes
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubjects, teachSclasses },
            { new: true }
        ).populate("teachSubjects", "subName sessions")
         .populate("teachSclasses", "sclassName");

        // Add teacher reference to newly assigned subjects
        if (teachSubjects && teachSubjects.length > 0) {
            await Subject.updateMany(
                { _id: { $in: teachSubjects } },
                { $set: { teacher: updatedTeacher._id } }
            );
        }

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        await Subject.updateMany(
            { teacher: deletedTeacher._id },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
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