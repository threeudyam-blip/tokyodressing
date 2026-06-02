import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h2>Tokyo<span>Dressing</span></h2>
          <p>Curated urban fashion inspired by the streets of Tokyo. Bringing you the finest contemporary pieces delivered across India.</p>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,.6)', fontSize: '0.82rem', lineHeight: 1.7 }}>
            building no. 161 ,Gurgaon road,Manesar<br />Gurugram,Haryana,122101,Teekli BO,Haryana<br />
            📞 +91 97837 83369
          </p>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,.4)', fontSize: '0.75rem' }}>
            GST: 06JCLPP1285E1ZB
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div className="footer-col">
          <h3>Policies</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/refund">Refund & Returns Policy</Link></li>
            <li><Link to="/shipping">Shipping & Delivery Policy</Link></li>
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
        <p>© {new Date().getFullYear()} Tokyo Dressing · GST: 06JCLPP1285E1ZB · All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
