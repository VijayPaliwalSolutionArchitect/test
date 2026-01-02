import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { formatDate, truncateText } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Blog Page Component
 * Displays blog posts list
 */
function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data || []);
    } catch (error) {
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Blog & News</h1>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog._id}`} className="group">
              <div className="card hover:shadow-xl transition-all">
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="space-y-2">
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-600 rounded text-sm">
                    {blog.category}
                  </span>
                  <h2 className="text-xl font-semibold group-hover:text-primary-600 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {truncateText(blog.excerpt || '', 100)}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(blog.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      {blog.author?.name}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;
