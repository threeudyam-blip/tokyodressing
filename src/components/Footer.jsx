import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h2>Tokyo<span>Dressing</span></h2>
          <p>Curated urban fashion inspired by the streets of Tokyo. Bringing you the finest contemporary pieces delivered across India.</p>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,.6)', fontSize: '0.85rem' }}>Sector 68, Sohna Road, Gurugram, Haryana 122101</p>
          <div className="footer-social">
            {['📸', '🐦', '📌', '▶️'].map((icon, i) => (
              <span key={i} className="social-link" style={{ cursor: 'default' }}>{icon}</span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop">Sale</Link></li>
            <li><Link to="/about">Our Story</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="footer-col">
          <h3>Help</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/refund">Cancellation & Refund</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h3>Stay In The Loop</h3>
          <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.5)', marginBottom: '1rem', lineHeight: 1.65 }}>
            Get early access to drops, exclusive deals, and style guides.
          </p>
          <div className="newsletter-input">
            <input type="email" placeholder="your@email.com" />
            <button type="button">Subscribe</button>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', marginBottom: '.65rem', fontFamily: 'var(--font-head)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Secured Payments</p>
            <div className="payment-logos">
              <span className="payment-logo-badge">Razorpay</span>
              <span className="payment-logo-badge">Cashfree</span>
              <span className="payment-logo-badge">UPI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tokyo Dressing. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
