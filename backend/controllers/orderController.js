const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Order Controller
 * Handles order management operations
 */

/**
 * Get all orders for logged-in user
 * @route GET /api/orders
 * @access Private
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build filter
    const filter = { userId: req.userId };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with populated product details
    const orders = await Order.find(filter)
      .populate('products.productId', 'title price image')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    // Get total count
    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.productId', 'title price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Ensure user can only access their own orders (unless admin)
    if (order.userId._id.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new order
 * @route POST /api/orders
 * @access Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { products, address, paymentMethod = 'COD' } = req.body;

    // Validate products array
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No products in order'
      });
    }

    // Validate address
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Delivery address is required'
      });
    }

    // Calculate total amount and validate stock
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.productId} not found or unavailable`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.title}. Only ${product.stock} available.`
        });
      }

      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;

      orderProducts.push({
        productId: item.productId,
        quantity: item.quantity,
        price
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      userId: req.userId,
      products: orderProducts,
      amount: totalAmount,
      address,
      paymentMethod,
      status: 'pending'
    });

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items: [] }
    );

    // Populate product details before sending response
    await order.populate('products.productId', 'title price image');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (Admin only)
 * @route PUT /api/orders/:id
 * @access Private/Admin
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('products.productId', 'title price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel order
 * @route DELETE /api/orders/:id
 * @access Private
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.userId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel order in current status'
      });
    }

    // Restore product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (Admin only)
 * @route GET /api/admin/orders
 * @access Private/Admin
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .populate('products.productId', 'title price image')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
