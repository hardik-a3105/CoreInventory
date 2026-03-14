import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema(
  {
    deliveryNumber: {
      type: String,
      required: [true, 'Please provide a delivery number'],
      unique: true,
      trim: true,
    },
    customerId: {
      type: String,
      default: '',
    },
    customerName: {
      type: String,
      default: '',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'PACKING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'DRAFT',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
  },
  { timestamps: true }
);

// Indexes
DeliverySchema.index({ productId: 1 });
DeliverySchema.index({ status: 1 });

export default mongoose.model('Delivery', DeliverySchema);
