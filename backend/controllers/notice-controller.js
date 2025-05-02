const Notice = require('../models/noticeSchema.js');

const noticeCreate = async (req, res) => {
    try {
        // Déterminer si la notice est générale ou spécifique à une classe
        const isGeneral = !req.body.targetClass;
        
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID,
            isGeneral: isGeneral
        })
        const result = await notice.save()
        res.send(result)
    } catch (err) {
        console.error('Erreur lors de la création de la notice:', err);
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await Notice.find({ school: req.params.id })
            .populate('targetClass', 'sclassName')
        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des notices:', err);
        res.status(500).json(err);
    }
};

// Récupérer les notices pour une classe spécifique
const noticeListByClass = async (req, res) => {
    try {
        const { schoolId, classId } = req.params;
        
        // Récupérer les notices générales et celles spécifiques à la classe
        let notices = await Notice.find({
            school: schoolId,
            $or: [
                { isGeneral: true },
                { targetClass: classId }
            ]
        }).populate('targetClass', 'sclassName');
        
        if (notices.length > 0) {
            res.send(notices);
        } else {
            res.send({ message: "No notices found for this class" });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des notices par classe:', err);
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, noticeListByClass, updateNotice, deleteNotice, deleteNotices };