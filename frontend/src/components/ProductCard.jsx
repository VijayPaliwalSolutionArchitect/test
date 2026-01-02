import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice, getRatingStars } from '../utils/helpers';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

/**
 * ProductCard Component
 * Displays product information in a card format
 * 
 * @param {Object} product - Product data
 */
function ProductCard({ product }) {
  const { addToCart } = useCartStore();

  /**
   * Handle add to cart
   */
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation to product detail
    
    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  // Get product image
  const imageUrl = product.images?.[0] || product.image || '/placeholder.png';
  
  // Check if product has discount
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="card hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg mb-4 aspect-square">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
          
          {/* Out of Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex">
                {getRatingStars(product.rating).map((type, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={
                      type === 'full'
                        ? 'fill-yellow-400 text-yellow-400'
                        : type === 'half'
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
