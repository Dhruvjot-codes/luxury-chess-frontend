import React, { useState, useEffect } from 'react';
import { cardService, getImageUrl } from '../../services/api';
import './ProductSearch.css';

const ProductSearch = ({ onProductSelect, onWishlistToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, products, priceRange, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await cardService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.pricePerPiece >= priceRange.min && product.pricePerPiece <= priceRange.max
    );

    // Filter by category (if products have category field)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category === selectedCategory || 
        product.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerPiece - b.pricePerPiece;
        case 'price-high':
          return b.pricePerPiece - a.pricePerPiece;
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const toggleWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    if (onWishlistToggle) {
      onWishlistToggle(productId, index === -1);
    }
  };

  const isInWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.includes(productId);
  };

  const categories = ['all', 'chess set', 'luxury', 'tournament', 'decorative'];

  return (
    <div className="product-search">
      <div className="search-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for chess sets, accessories..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
        
        <button 
          className="filters-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters {showFilters ? '▲' : '▼'}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Searching products...</div>
      ) : (
        <div className="search-results">
          <p className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
          
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={getImageUrl(product.image)} alt={product.title} />
                  ) : (
                    <div className="placeholder-image">♟️</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-description">
                    {product.description || 'Premium chess set for enthusiasts'}
                  </p>
                  <div className="product-price">₹{product.pricePerPiece}</div>
                </div>

                <div className="product-actions">
                  <button 
                    className="wishlist-btn"
                    onClick={() => toggleWishlist(product._id)}
                  >
                    {isInWishlist(product._id) ? '❤️' : '🤍'}
                  </button>
                  <button 
                    className="order-btn"
                    onClick={() => onProductSelect && onProductSelect(product)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
