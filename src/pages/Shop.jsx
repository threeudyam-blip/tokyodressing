import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, filterOptions } from '../data/products';
import { useCart } from '../context/CartContext';

function ProductCard({ product, onClick }) {
  const { addToCart } = useCart();
  return (
    <div className="product-card" onClick={onClick}>
      <div className="img-container">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {product.badge && <span className={`product-badge ${product.badge}`}>{product.badge}</span>}
        {product.discount && <span className="discount-badge">{product.discount} OFF</span>}
        <div className="card-actions-overlay">
          <button className="card-action-btn card-cart-btn" onClick={e => { e.stopPropagation(); addToCart({ ...product, size: product.sizes[0], color: product.colors[0] }); }}>
            Add to Cart
          </button>
          <button className="card-action-btn card-buy-btn" onClick={e => { e.stopPropagation(); onClick(); }}>
            View Details
          </button>
        </div>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <p className="product-name">{product.name}</p>
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const navigate = useNavigate();
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? products : products.filter(p => p.category === active);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <p className="section-label">Our Collection</p>
        <h1>Tokyo Dressing Shop</h1>
        <p>{filtered.length} curated styles — free delivery over ₹999</p>
      </div>

      <div className="filter-bar">
        {filterOptions.map(opt => (
          <button key={opt} className={`filter-btn${active === opt ? ' active' : ''}`} onClick={() => setActive(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <div className="products-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onClick={() => navigate(`/product/${p.id}`)} />
        ))}
      </div>
    </div>
  );
}
