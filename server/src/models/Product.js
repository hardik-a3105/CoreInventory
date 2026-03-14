import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'Please provide a SKU'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category ID'],
    },
    unit: {
      type: String,
      default: 'pcs',
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    minimumStock: {
      type: Number,
      default: 10,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Please provide a warehouse ID'],
    },
  },
  { timestamps: true }
);

// Indexes
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ warehouseId: 1 });

export default mongoose.model('Product', ProductSchema);
