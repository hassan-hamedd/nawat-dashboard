import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderType: {
    type: String,
    enum: ['User', 'Expert'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  participants: [
    {
      expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert', // Replace with the actual name of your Expert model
        required: true,
      },
      expertFullName: {
        type: String,
        required: true,
      },
      expertPhoto: String,
    },
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace with the actual name of your User model
        required: true,
      },
      userPhoto: String,
    },
  ],
  messages: [messageSchema], // Messages array schema
  chatCreationDate: {
    type: Date,
    required: true,
  },
  chatEndDate: {
    type: Date,
    required: true,
  },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
