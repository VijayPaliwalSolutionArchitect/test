const mongoose = require('mongoose');

/**
 * Order Schema
 * Manages customer orders and order fulfillment
 * Tracks products, quantities, delivery details, and order status
 */
const OrderSchema = new mongoose.Schema({
  // Reference to the customer who placed the order
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Array of products in the order
  products: [
    {
      // Reference to the product
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
      },
      
      // Quantity ordered
      quantity: { 
        type: Number, 
        required: true,
        min: 1,
        default: 1 
      },
      
      // Price at time of purchase (snapshot for historical accuracy)
      price: {
        type: Number,
        required: true
      }
    }
  ],
  
  // Total order amount
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  // Delivery address
  address: { 
    type: String, 
    required: true 
  },
  
  // Payment method used
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card', 'PayPal', 'Other'],
    default: 'COD'
  },
  
  // Order status for tracking fulfillment
  status: { 
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Indexes for efficient querying
 */
OrderSchema.index({ userId: 1, createdAt: -1 }); // User's orders sorted by date
OrderSchema.index({ status: 1 }); // Filter by status

module.exports = mongoose.model('Order', OrderSchema);