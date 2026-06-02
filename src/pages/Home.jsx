import { useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';

const ticker = ['Free Delivery Over ₹999', 'New Tokyo Collection Dropped', 'Razorpay & Cashfree Accepted', 'Easy 30-Day Returns', 'Premium Urban Fashion', 'Same-Day Dispatch'];

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

export default function Home() {
  const navigate = useNavigate();

  const row1 = [...products.slice(0, 6), ...products.slice(0, 6)];
  const row2 = [...products.slice(6, 12), ...products.slice(6, 12)];

  return (
    <>
      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="marquee-item">
              {t}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="hero">

        <div className="hero-content">
          <h1>
            Dress Like<br />
            <em>Tokyo.</em><br />
            <span className="accent-indigo">Live Anywhere.</span>
          </h1>

          <p className="hero-sub">
            Curated street-to-studio fashion from the heart of urban culture. Discover pieces that speak louder than words.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/shop')}>Shop the Collection</button>
            <button className="btn-outline" onClick={() => navigate('/about')}>Our Story</button>
          </div>

        </div>

        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200" alt="Urban Fashion" loading="lazy" />
        </div>
      </section>

      {/* Auto-scroll product rows */}
      <section className="scroll-section">
        <div className="section-header">
          <p className="section-label">Trending Now</p>
          <h2 className="section-title">The Drop You've Been Waiting For</h2>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="scroll-row">
            {row1.map((p, i) => (
              <ProductCard key={`r1-${i}`} product={p} onClick={() => navigate(`/product/${p.id}`)} />
            ))}
          </div>
          <div className="scroll-row reverse" style={{ marginTop: '1.25rem' }}>
            {row2.map((p, i) => (
              <ProductCard key={`r2-${i}`} product={p} onClick={() => navigate(`/product/${p.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <p className="section-label">Browse by Style</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="categories-strip">
            {categories.map(cat => (
              <div key={cat.name} className="category-card" onClick={() => navigate('/shop')}>
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="category-overlay">
                  <div>
                    <span className="category-tag">{cat.tag}</span>
                    <span className="category-name">{cat.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Editor's Picks</p>
            <h2 className="section-title">Featured Pieces</h2>
          </div>
          <div className="products-grid">
            {products.slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} onClick={() => navigate(`/product/${p.id}`)} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-indigo" onClick={() => navigate('/shop')}>View All Products</button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: 'var(--ink)', padding: '3.5rem 3rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {[
            ['🚚', 'Free Delivery', 'On orders above ₹999'],
            ['🔄', 'Easy Returns', '30-day hassle-free returns'],
            ['🔒', 'Secure Payments', 'Razorpay & Cashfree protected'],
            ['⭐', 'Premium Quality', 'Curated & quality-checked'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{icon}</div>
              <h4 style={{ fontFamily: 'var(--font-head)', fontSize: '.95rem', fontWeight: 700, color: 'white', marginBottom: '.35rem' }}>{title}</h4>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
