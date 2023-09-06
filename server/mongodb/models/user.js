import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
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
  allProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;
