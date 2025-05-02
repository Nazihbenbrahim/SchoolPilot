const mongoose = require('mongoose');

const teacherClassSubjectSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    }]
}, { timestamps: true });

// Ensure that a teacher can only have one entry per class
teacherClassSubjectSchema.index({ teacher: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('teacherClassSubject', teacherClassSubjectSchema);
