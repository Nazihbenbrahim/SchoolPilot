const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    marks: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        required: true
    }
}, { timestamps: true });

// Créer un index composé pour éviter les doublons
marksSchema.index({ student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('marks', marksSchema);
