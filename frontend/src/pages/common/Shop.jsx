import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  Eye,
  Plus,
  Minus,
  X,
  Package,
  DollarSign,
  Truck,
  Tag,
  TrendingUp
} from 'lucide-react';
import api from '../../axiosConfig';
import './Shop.css';

const Shop = () => {
  const { currentUser, userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have a shop API yet
      // In a real app, this would be: const response = await api.get('/shop/products');
      
      const mockProducts = [
        {
          id: '1',
          name: 'Premium Protein Powder',
          category: 'supplements',
          price: 45.99,
          originalPrice: 59.99,
          rating: 4.8,
          reviews: 124,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
          description: 'High-quality whey protein isolate with 25g protein per serving.',
          inStock: true,
          stockCount: 15,
          tags: ['protein', 'muscle-building', 'recovery']
        },
        {
          id: '2',
          name: 'Resistance Bands Set',
          category: 'equipment',
          price: 29.99,
          originalPrice: 39.99,
          rating: 4.6,
          reviews: 89,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
          description: 'Complete set of 5 resistance bands for home workouts.',
          inStock: true,
          stockCount: 23,
          tags: ['resistance', 'home-workout', 'strength']
        },
        {
          id: '3',
          name: 'Gym Water Bottle',
          category: 'accessories',
          price: 19.99,
          originalPrice: 24.99,
          rating: 4.9,
          reviews: 256,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
          description: 'Insulated 32oz water bottle with time markers.',
          inStock: true,
          stockCount: 42,
          tags: ['hydration', 'insulated', 'motivation']
        },
        {
          id: '4',
          name: 'Yoga Mat Premium',
          category: 'equipment',
          price: 34.99,
          originalPrice: 44.99,
          rating: 4.7,
          reviews: 167,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
          description: 'Non-slip yoga mat with alignment lines.',
          inStock: true,
          stockCount: 18,
          tags: ['yoga', 'non-slip', 'alignment']
        },
        {
          id: '5',
          name: 'BCAA Amino Acids',
          category: 'supplements',
          price: 32.99,
          originalPrice: 42.99,
          rating: 4.5,
          reviews: 93,
          image: 'https://images.unsplash.com/photo-1584017911761-bea6a6d096b1?w=400&h=400&fit=crop',
          description: 'Branched-chain amino acids for muscle recovery.',
          inStock: true,
          stockCount: 27,
          tags: ['bcaa', 'recovery', 'amino-acids']
        },
        {
          id: '6',
          name: 'Gym Towel Set',
          category: 'accessories',
          price: 24.99,
          originalPrice: 29.99,
          rating: 4.4,
          reviews: 78,
          image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop',
          description: 'Set of 3 microfiber gym towels.',
          inStock: true,
          stockCount: 35,
          tags: ['towels', 'microfiber', 'hygiene']
        },
        {
          id: '7',
          name: 'Dumbbell Set',
          category: 'equipment',
          price: 89.99,
          originalPrice: 119.99,
          rating: 4.8,
          reviews: 203,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
          description: 'Adjustable dumbbell set 5-50 lbs.',
          inStock: false,
          stockCount: 0,
          tags: ['dumbbells', 'adjustable', 'strength']
        },
        {
          id: '8',
          name: 'Pre-Workout Energy',
          category: 'supplements',
          price: 38.99,
          originalPrice: 48.99,
          rating: 4.6,
          reviews: 145,
          image: 'https://images.unsplash.com/photo-1584017911761-bea6a6d096b1?w=400&h=400&fit=crop',
          description: 'High-energy pre-workout formula.',
          inStock: true,
          stockCount: 12,
          tags: ['pre-workout', 'energy', 'performance']
        }
      ];

      setProducts(mockProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'supplements', name: 'Supplements', icon: TrendingUp },
    { id: 'equipment', name: 'Equipment', icon: ShoppingBag },
    { id: 'accessories', name: 'Accessories', icon: Tag }
  ];

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchProducts}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div className="header-content">
          <h1>Gym Shop</h1>
          <p>Premium fitness equipment, supplements, and accessories</p>
        </div>
        <div className="header-actions">
          <button 
            className="cart-btn"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={20} />
            Cart ({getCartCount()})
          </button>
        </div>
      </div>

      <div className="shop-content">
        <div className="filters-section">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-controls">
            <div className="category-filters">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent size={16} />
                    {category.name}
                  </button>
                );
              })}
            </div>

            <div className="sort-filter">
              <Filter size={16} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {sortedProducts.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={48} />
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            sortedProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button 
                      className="wishlist-btn"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart 
                        size={20} 
                        fill={wishlist.includes(product.id) ? '#ff6b7a' : 'none'}
                        color={wishlist.includes(product.id) ? '#ff6b7a' : 'white'}
                      />
                    </button>
                    <button 
                      className="quick-view-btn"
                      onClick={() => {/* Quick view modal */}}
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                  {!product.inStock && (
                    <div className="out-of-stock">
                      Out of Stock
                    </div>
                  )}
                  {product.originalPrice > product.price && (
                    <div className="discount-badge">
                      -{getDiscountPercentage(product.originalPrice, product.price)}%
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating) ? '#ffd700' : 'none'}
                          color="#ffd700"
                        />
                      ))}
                    </div>
                    <span className="rating-text">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice}</span>
                    )}
                  </div>

                  <div className="product-stock">
                    {product.inStock ? (
                      <span className="in-stock">In Stock ({product.stockCount})</span>
                    ) : (
                      <span className="out-of-stock-text">Out of Stock</span>
                    )}
                  </div>

                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button 
              className="close-cart-btn"
              onClick={() => setShowCart(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price}</p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <button className="checkout-btn">
                <DollarSign size={20} />
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop; 