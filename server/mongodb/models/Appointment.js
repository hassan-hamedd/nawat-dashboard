import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  participants: [
    {
      expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert', // Replace with the actual name of your Expert model
        // required: true,
      },
      expertFullName: {
        type: String,
        // required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace with the actual name of your User model
      },
    }
  ],
  appointmentCreationDate: {
    type: Date,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
