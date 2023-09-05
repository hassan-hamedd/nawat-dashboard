import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  englishText: {
    type: String,
    required: false,
  },
  arabicText: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: true,
  },
  readTime: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
    required: true
  },
  photo: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const propertyModel = mongoose.model('Blog', PropertySchema);

export default propertyModel;
