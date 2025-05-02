const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    targetClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        default: null
    },
    // Si isGeneral est true, la notice est pour toutes les classes
    // Si isGeneral est false, la notice est seulement pour la classe spécifiée dans targetClass
    isGeneral: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("notice", noticeSchema)