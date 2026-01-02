import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, Eye } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * BlogPost Page Component
 * Displays single blog post with full content
 */
function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      toast.error('Failed to load blog post');
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

  if (!blog) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-3xl font-bold">Blog post not found</h2>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <article className="max-w-4xl mx-auto">
        {/* Featured Image */}
        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
          {blog.category}
        </span>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center space-x-6 text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center">
            <User size={18} className="mr-2" />
            <span>{blog.author?.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="mr-2" />
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <div className="flex items-center">
            <Eye size={18} className="mr-2" />
            <span>{blog.viewCount} views</span>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export default BlogPost;
