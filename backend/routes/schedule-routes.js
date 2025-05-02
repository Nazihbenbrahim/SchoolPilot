const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule-controller');

// Routes pour les emplois du temps
router.get('/schedules', scheduleController.getAllSchedules);
router.get('/schedules/class/:id', scheduleController.getClassSchedules);
router.get('/schedules/teacher/:id', scheduleController.getTeacherSchedules);
router.get('/schedules/:id', scheduleController.getScheduleById);
router.post('/schedules', scheduleController.createSchedule);
router.put('/schedules/:id', scheduleController.updateSchedule);
router.delete('/schedules/:id', scheduleController.deleteSchedule);

module.exports = router;
