import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../data/products';
import { useCart } from '../context/CartContext';

function RelatedCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="img-container">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {product.badge && <span className={`product-badge ${product.badge}`}>{product.badge}</span>}
        {product.discount && <span className="discount-badge">{product.discount} OFF</span>}
        <div className="card-actions-overlay">
          <button className="card-action-btn card-cart-btn" onClick={e => { e.stopPropagation(); addToCart({ ...product, size: product.sizes[0], color: product.colors[0] }); }}>
            Add to Cart
          </button>
          <button className="card-action-btn card-buy-btn" onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>
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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(id);

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="pd-not-found">
          <h1>Product Not Found</h1>
          <p>This item may have been removed or doesn't exist.</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  function handleAddToCart() {
    addToCart({ ...product, size: size || product.sizes[0], color: color || product.colors[0], qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart({ ...product, size: size || product.sizes[0], color: color || product.colors[0], qty });
    navigate('/cart');
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span className="pd-sep">/</span>
        <Link to="/shop">Shop</Link>
        <span className="pd-sep">/</span>
        <span style={{ color: 'var(--text)' }}>{product.name}</span>
      </div>

      <div className="pd-grid">
        {/* Image */}
        <div className="pd-main-image">
          <img src={product.images[0]} alt={product.name} />
          {product.discount && <span className="discount-badge pd-discount">{product.discount} OFF</span>}
        </div>

        {/* Info */}
        <div className="pd-info-section">
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-price-block">
            <span className="pd-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="pd-original-price">₹{product.originalPrice.toLocaleString()}</span>}
            {savings > 0 && <span className="pd-savings">You save ₹{savings.toLocaleString()}</span>}
          </div>

          <p className="pd-description">{product.description}</p>

          {/* Size */}
          <div className="pd-option-group">
            <span className="pd-option-label">Size</span>
            <div className="pd-option-chips">
              {product.sizes.map(s => (
                <button key={s} className={`pd-chip${size === s ? ' active' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="pd-option-group">
            <span className="pd-option-label">Color</span>
            <div className="pd-option-chips">
              {product.colors.map(c => (
                <button key={c} className={`pd-chip${color === c ? ' active' : ''}`} onClick={() => setColor(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="pd-option-group">
            <span className="pd-option-label">Quantity</span>
            <div className="pd-quantity">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="pd-actions">
            <button className="pd-add-cart-btn" onClick={handleAddToCart}>
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
            <button className="pd-buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>

          {/* Trust badges */}
          <div className="pd-trust-badges">
            <div className="pd-trust-item">
              <span>🚚</span>
              <div><strong>Free Delivery</strong><small>On orders above ₹999</small></div>
            </div>
            <div className="pd-trust-item">
              <span>🔄</span>
              <div><strong>30-Day Returns</strong><small>Easy, no-questions returns</small></div>
            </div>
            <div className="pd-trust-item">
              <span>🔒</span>
              <div><strong>Secure Payment</strong><small>Razorpay & Cashfree</small></div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="pd-related">
          <h2>You May Also Like</h2>
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {related.map(p => <RelatedCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
