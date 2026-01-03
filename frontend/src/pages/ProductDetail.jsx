import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice, getRatingStars } from '../utils/helpers';
import { useCartStore } from '../stores/cartStore';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Product Detail Page Component
 * Displays detailed product information
 */
function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-3xl font-bold">Product not found</h2>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <img
            src={product.images?.[0] || product.image || '/placeholder.png'}
            alt={product.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex">
                {getRatingStars(product.rating).map((type, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={type === 'full' || type === 'half' 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(displayPrice)}
            </span>
            {product.discountPrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p className={`mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-6">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
