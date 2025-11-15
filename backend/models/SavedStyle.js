import mongoose from 'mongoose';

const savedStyleSchema = new mongoose.Schema({
  styleName: {
    type: String,
    required: true
  },
  styleType: {
    type: String,
    enum: ['cabelo', 'barba', 'ambos'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  faceShape: {
    type: String,
    required: true
  },
  originalImageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SavedStyle', savedStyleSchema);

