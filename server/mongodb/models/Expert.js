import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ExpertSchema = new Schema({
    email: String,
    password: String,
    fullName: String,
    title: String,
    location: String,
    description: String,
    photo: String,
    offeredServices: [String],
    reviews: [{
        reviewDate: Date,
        userReview: String,   
    }],
    gender: String || null,
    age: Number || null,
    chats: [{
        chatId: {
            type: Schema.Types.ObjectId,
            ref: 'Chat', // Reference to the Chat model
        },
        participants: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
            },
            userPhoto: String,
        }],
        lastMessage: String,
        lastMessageDate: Date,
    }],
    lastLogin: Date,
    createdAt: Date,
});

const Expert = mongoose.model('Expert', ExpertSchema);

export default Expert;