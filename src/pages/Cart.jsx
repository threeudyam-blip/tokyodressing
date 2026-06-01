import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeItem, updateQty, clearCart, totalItems, subtotal, savings, shipping, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛍️</div>
          <h1>Your Cart is Empty</h1>
          <p>Looks like you haven't added anything yet. Explore our Tokyo collection!</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>{totalItems} {totalItems === 1 ? 'item' : 'items'} — carefully selected</p>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div>
          {cart.map(item => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
              <div className="cart-item-image">
                <img src={item.images[0]} alt={item.name} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-top">
                  <div>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-name">{item.name}</p>
                    <div className="cart-item-meta">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id, item.size, item.color)} aria-label="Remove item">✕</button>
                </div>
                <div className="cart-item-bottom">
                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}>+</button>
                  </div>
                  <div className="cart-item-pricing">
                    <span className="cart-item-total">₹{(item.price * item.qty).toLocaleString()}</span>
                    {item.originalPrice && <span className="cart-item-original">₹{(item.originalPrice * item.qty).toLocaleString()}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="cart-clear-btn" onClick={clearCart}>Clear all items</button>
        </div>

        {/* Summary */}
        <div>
          <div className="cart-summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div className="summary-row savings">
                <span>Your Savings</span>
                <span>− ₹{savings.toLocaleString()}</span>
              </div>
            )}
            {shipping === 0
              ? <p className="free-delivery-hint">🎉 You qualify for FREE delivery!</p>
              : <p className="free-delivery-hint">Add ₹{(999 - subtotal).toLocaleString()} more for free delivery</p>
            }
            <div className="summary-row">
              <span>Delivery</span>
              <span className={shipping === 0 ? 'free-delivery' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>

            <Link to="/shop" className="cart-continue-shopping">← Continue Shopping</Link>

            <div className="cart-payment-icons">
              <span>Secured by</span>
              <div className="payment-methods-mini">
                <span title="Razorpay">💳</span>
                <span title="Cashfree">🏦</span>
                <span title="UPI">📱</span>
                <span title="Net Banking">🌐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
