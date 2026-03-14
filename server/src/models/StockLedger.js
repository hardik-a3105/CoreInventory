import mongoose from 'mongoose';

const StockLedgerSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
    type: {
      type: String,
      enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
      required: [true, 'Please provide a type'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
    },
    reference: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes
StockLedgerSchema.index({ productId: 1 });
StockLedgerSchema.index({ type: 1 });
StockLedgerSchema.index({ createdAt: -1 });

export default mongoose.model('StockLedger', StockLedgerSchema);
