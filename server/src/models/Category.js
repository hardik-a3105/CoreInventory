import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', CategorySchema);
