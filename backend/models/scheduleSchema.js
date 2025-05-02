const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: String
  },
  room: {
    type: String
  }
});

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  targetType: {
    type: String,
    required: true,
    enum: ['class', 'teacher']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType',
    validate: {
      validator: function(v) {
        return this.targetType === 'class' || this.targetType === 'teacher';
      },
      message: props => `${props.value} is not a valid target type!`
    }
  },
  targetName: {
    type: String
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  timeSlots: [timeSlotSchema],
  totalHours: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Middleware pour calculer les heures totales avant de sauvegarder
scheduleSchema.pre('save', function(next) {
  if (this.timeSlots && this.timeSlots.length > 0) {
    let totalMinutes = 0;
    this.timeSlots.forEach(slot => {
      const startTime = new Date(slot.startTime);
      const endTime = new Date(slot.endTime);
      const durationMinutes = (endTime - startTime) / (1000 * 60);
      totalMinutes += durationMinutes;
    });
    this.totalHours = Math.round(totalMinutes / 60 * 10) / 10; // Arrondir à 1 décimale
  }
  next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
