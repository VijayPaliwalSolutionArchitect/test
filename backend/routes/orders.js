const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} = require('../controllers/orderController');

/**
 * Order Routes
 * All routes for order management
 */

// User order routes (require authentication)
router.get('/', auth, getUserOrders);
router.post('/', auth, createOrder);
router.get('/:id', auth, getOrder);
router.delete('/:id', auth, cancelOrder);

// Admin order routes
router.put('/:id', auth, adminAuth, updateOrderStatus);
router.get('/admin/all', auth, adminAuth, getAllOrders);

module.exports = router;
