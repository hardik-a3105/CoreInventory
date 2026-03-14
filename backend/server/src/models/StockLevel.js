import mongoose from 'mongoose';

const StockLevelSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Please provide a location ID'],
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Please provide a warehouse ID'],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound unique index
StockLevelSchema.index({ productId: 1, locationId: 1 }, { unique: true });
StockLevelSchema.index({ warehouseId: 1 });

export default mongoose.model('StockLevel', StockLevelSchema);
