const mongoose = require('mongoose');

/**
 * Cart Schema
 * Manages user shopping cart items
 * Each cart item references a product and tracks quantity
 */
const CartSchema = new mongoose.Schema({
  // Reference to the user who owns this cart
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Array of products in the cart
  items: [
    {
      // Reference to the product
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      
      // Quantity of this product in cart
      quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
      },
      
      // Price at the time of adding to cart (snapshot)
      price: { 
        type: Number, 
        required: true 
      }
    }
  ],
  
  // Total amount of all items in cart
  totalAmount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Pre-save hook to calculate total amount
 * This ensures totalAmount is always in sync with items
 */
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
