const Blog = require('../models/Blog');

/**
 * Blog Controller
 * Handles blog/content management operations
 */

/**
 * Get all published blogs
 * @route GET /api/blogs
 * @access Public
 */
exports.getBlogs = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag,
      search,
      sort = '-publishedAt'
    } = req.query;

    // Build filter - only show published blogs to public
    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get blogs with author details
    const blogs = await Blog.find(filter)
      .populate('author', 'name')
      .select('-content') // Exclude full content in list view
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: blogs,
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
 * Get single blog by ID or slug
 * @route GET /api/blogs/:id
 * @access Public
 */
exports.getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let blog = await Blog.findById(id).populate('author', 'name');

    if (!blog) {
      blog = await Blog.findOne({ slug: id }).populate('author', 'name');
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Only show published blogs to non-admin users
    if (blog.status !== 'published' && !req.isAdmin) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    blog.viewCount += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new blog post
 * @route POST /api/blogs
 * @access Private/Admin
 */
exports.createBlog = async (req, res, next) => {
  try {
    const blogData = {
      ...req.body,
      author: req.userId
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog post
 * @route PUT /api/blogs/:id
 * @access Private/Admin
 */
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: blog,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete blog post
 * @route DELETE /api/blogs/:id
 * @access Private/Admin
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blogs including drafts (Admin only)
 * @route GET /api/admin/blogs
 * @access Private/Admin
 */
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate('author', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: blogs,
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
 * Get blog categories with post counts
 * @route GET /api/blogs/categories
 * @access Public
 */
exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    next(error);
  }
};
