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
            res.status(400).json({ message: 'Roll Number already exists', success: false });
        } else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.status(201).json({ data: result, success: true });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message, success: false });
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName");
                student = await student.populate("sclassName", "sclassName");
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.status(200).json({ data: student, success: true });
            } else {
                res.status(401).json({ message: "Invalid password", success: false });
            }
        } else {
            res.status(404).json({ message: "Student not found", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message, success: false });
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.status(200).json({ data: modifiedStudents, success: true });
        } else {
            res.status(404).json({ message: "No students found", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message, success: false });
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.status(200).json({ data: student, success: true });
        } else {
            res.status(404).json({ message: "No student found", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message, success: false });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ data: result, success: true });
        } else {
            res.status(404).json({ message: "Student not found", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "No students found to delete", success: false });
        } else {
            res.status(200).json({ data: result, success: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "No students found to delete", success: false });
        } else {
            res.status(200).json({ data: result, success: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        let result = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (result) {
            result.password = undefined;
            res.status(200).json({ data: result, success: true });
        } else {
            res.status(404).json({ message: "Student not found", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found', success: false });
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
        return res.status(200).json({ data: result, success: true });
    } catch (error) {
        console.error("Error updating exam result:", error);
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        console.log(`Updating attendance for student ${req.params.id} on date ${date} for subject ${subName} with status ${status}`);

        const student = await Student.findById(req.params.id);
        if (!student) {
            console.error(`Student not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Student not found', success: false });
        }

        const subject = await Subject.findById(subName);
        if (!subject) {
            console.error(`Subject not found: ${subName}`);
            return res.status(404).json({ message: 'Subject not found', success: false });
        }

        const attendanceDate = new Date(date);
        if (isNaN(attendanceDate.getTime())) {
            console.error(`Invalid date format: ${date}`);
            return res.status(400).json({ message: 'Invalid date format', success: false });
        }

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toISOString().split('T')[0] === attendanceDate.toISOString().split('T')[0] &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            console.log(`Updating existing attendance for student ${student.name} on ${date}`);
            existingAttendance.status = status;
        } else {
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                console.warn(`Maximum attendance limit reached for student ${student.name} in subject ${subName}`);
                return res.status(400).json({ message: 'Maximum attendance limit reached', success: false });
            }

            console.log(`Adding new attendance for student ${student.name} on ${date}`);
            student.attendance.push({ date: attendanceDate, status, subName });
        }

        const result = await student.save();
        console.log(`Attendance updated successfully for student ${student.name}`);
        return res.status(200).json({ data: result, success: true });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id;

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );
        return res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );
        return res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
};

const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );
        return res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
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