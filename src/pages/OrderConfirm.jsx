import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirm() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const order = state || {
    orderId: 'TD' + Date.now(),
    amount:  0,
    method:  'Online Payment',
    address: 'Your saved address',
    name:    'Valued Customer',
    email:   '—',
  };

  const estimatedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="order-confirm-page">
      <div className="confirm-wrapper">
        {/* Animated checkmark */}
        <div className="confirm-success-icon">
          <svg className="confirm-check-circle" viewBox="0 0 80 80">
            <circle className="confirm-checkmark" cx="40" cy="40" r="38" />
            <circle className="confirm-checkmark-circle" cx="40" cy="40" r="38" />
            <path className="confirm-checkmark-check" fill="none" d="M24 40l12 12 20-20" />
          </svg>
        </div>

        <h1 className="confirm-title">Order Confirmed! 🎉</h1>
        <p className="confirm-subtitle">
          Thank you, {order.name.split(' ')[0]}! Your order has been placed successfully.<br />
          A confirmation has been sent to <strong>{order.email}</strong>
        </p>

        <div className="confirm-order-card">
          <div className="confirm-order-header">
            <div>
              <span className="confirm-label">Order ID</span>
              <span className="confirm-order-id">#{order.orderId}</span>
            </div>
            <div>
              <span className="confirm-label">Amount Paid</span>
              <span className="confirm-amount">₹{Number(order.amount).toLocaleString()}</span>
            </div>
          </div>

          <div className="confirm-details-grid">
            <div className="confirm-detail-item">
              <span className="confirm-detail-icon">📦</span>
              <div>
                <span className="confirm-detail-label">Estimated Delivery</span>
                <p>{estimatedDelivery()}</p>
              </div>
            </div>
            <div className="confirm-detail-item">
              <span className="confirm-detail-icon">💳</span>
              <div>
                <span className="confirm-detail-label">Payment Method</span>
                <p>{order.method}</p>
              </div>
            </div>
            <div className="confirm-detail-item">
              <span className="confirm-detail-icon">📍</span>
              <div>
                <span className="confirm-detail-label">Delivery Address</span>
                <p>{order.address}</p>
              </div>
            </div>
            <div className="confirm-detail-item">
              <span className="confirm-detail-icon">✉️</span>
              <div>
                <span className="confirm-detail-label">Confirmation Sent To</span>
                <p>{order.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirm-info-bar">
          <p>🚚 Your order is being processed and will be dispatched within 24 hours. Track your delivery via the confirmation email.</p>
        </div>

        <div className="confirm-actions">
          <button className="btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
          <button className="btn-outline" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
