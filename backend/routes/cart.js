const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

/**
 * Cart Routes
 * All routes for shopping cart management
 * All cart routes require authentication
 */

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:itemId', auth, updateCartItem);
router.delete('/:itemId', auth, removeFromCart);
router.delete('/', auth, clearCart);

module.exports = router;
