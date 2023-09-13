import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  photo: String,
  gender: String || null,
    age: Number || null,
    lastLogin: Date,
    onboardingData: {
        hasCompletedOnboarding: {
            type: Boolean,
            default: false,
            required: true,
        },
  },
  chats: [{
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat', // Reference to the Chat model
    },
    participants: [{
        expertId: {
            type: Schema.Types.ObjectId,
            ref: 'Expert', // Reference to the Expert model
        },
        expertFullName: String,
        expertPhoto: String,
    }],
    lastMessage: String,
    lastMessageDate: Date,
  }],
  appointments: [{
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment', // Reference to the Appointmend model
    },
    participants: [{
        expertId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        expertFullName: String
    }],
    appointmentDate: Date,
    appointmentCreationDate: Date,
  }],
  allProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;
