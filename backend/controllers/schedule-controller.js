const Schedule = require('../models/scheduleSchema');
const mongoose = require('mongoose');

// Récupérer tous les emplois du temps
const getAllSchedules = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID d'école invalide" });
  }

  try {
    const schedules = await Schedule.find({ schoolId: id });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les emplois du temps par classe
const getClassSchedules = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID d'école invalide" });
  }

  try {
    const schedules = await Schedule.find({ 
      schoolId: id,
      targetType: 'class'
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les emplois du temps par enseignant
const getTeacherSchedules = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID d'école invalide" });
  }

  try {
    const schedules = await Schedule.find({ 
      schoolId: id,
      targetType: 'teacher'
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un emploi du temps spécifique
const getScheduleById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID d'emploi du temps invalide" });
  }

  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouvel emploi du temps
const createSchedule = async (req, res) => {
  const scheduleData = req.body;

  try {
    const newSchedule = new Schedule(scheduleData);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un emploi du temps
const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID d'emploi du temps invalide" });
  }

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un emploi du temps
const deleteSchedule = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID d'emploi du temps invalide" });
  }

  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }

    res.status(200).json({ message: "Emploi du temps supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSchedules,
  getClassSchedules,
  getTeacherSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
