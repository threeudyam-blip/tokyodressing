import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/* ── Config: fill in your Razorpay key ID (client-safe) ── */
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';   // rzp_live_XXXX

/* Cashfree payment session is fetched from the backend (server.js)
   so the secret key never touches the browser. */
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

const STEPS = ['Address', 'Payment', 'Review'];

const stateList = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

function validate(form) {
  const errs = {};
  if (!form.firstName.trim()) errs.firstName = 'Required';
  if (!form.lastName.trim())  errs.lastName  = 'Required';
  if (!/^[6-9]\d{9}$/.test(form.phone))   errs.phone   = 'Enter valid 10-digit mobile number';
  if (!/\S+@\S+\.\S+/.test(form.email))   errs.email   = 'Enter valid email';
  if (!form.address.trim()) errs.address = 'Required';
  if (!form.city.trim())    errs.city    = 'Required';
  if (!form.state)          errs.state   = 'Required';
  if (!/^\d{6}$/.test(form.pincode))      errs.pincode = 'Enter 6-digit PIN code';
  return errs;
}

export default function Checkout() {
  const navigate  = useNavigate();
  const { cart, subtotal, savings, shipping, total, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '', landmark: '',
  });
  const [errors, setErrors]   = useState({});
  const [payment, setPayment] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function nextStep() {
    if (step === 0) {
      const errs = validate(form);
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    setStep(s => s + 1);
  }

  /* ── Razorpay payment handler ── */
  function openRazorpay() {
    const options = {
      key:         RAZORPAY_KEY_ID,
      amount:      total * 100,            // paise
      currency:    'INR',
      name:        'Tokyo Dressing',
      description: 'Fashion Purchase | GST: 06JCLPP1285E1ZB',
      image:       '/favicon.svg',
      handler: function (response) {
        clearCart();
        navigate('/order', {
          state: {
            orderId:   response.razorpay_payment_id,
            amount:    total,
            method:    'Razorpay',
            address:   `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
            name:      `${form.firstName} ${form.lastName}`,
            email:     form.email,
          },
        });
      },
      prefill:  { name: `${form.firstName} ${form.lastName}`, email: form.email, contact: form.phone },
      notes:    { address: form.address },
      theme:    { color: '#ff2d55' },
      modal:    { ondismiss: () => setLoading(false) },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => { setLoading(false); alert('Payment failed. Please try again.'); });
    rzp.open();
  }

  /* ── Cashfree payment handler ── */
  async function openCashfree() {
    /* Step 1: Ask our backend to create a Cashfree order → get paymentSessionId */
    let sessionId, orderId;
    try {
      const res = await fetch(`${SERVER_URL}/api/cashfree/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          amount:          total + (payment === 'cod' ? 50 : 0),
          customerName:    `${form.firstName} ${form.lastName}`,
          customerEmail:   form.email,
          customerPhone:   form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create Cashfree order');
      sessionId = data.paymentSessionId;
      orderId   = data.orderId;
    } catch (err) {
      setLoading(false);
      alert('Cashfree error: ' + err.message);
      return;
    }

    /* Step 2: Open Cashfree checkout with the real session ID */
    const mode     = import.meta.env.VITE_CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
    const cashfree = window.Cashfree({ mode });

    const result = await cashfree.checkout({
      paymentSessionId: sessionId,
      returnUrl: `${window.location.origin}/order?cf_order_id=${orderId}`,
    });

    if (result.error) {
      setLoading(false);
      alert('Payment failed: ' + result.error.message);
    } else if (result.paymentDetails) {
      clearCart();
      navigate('/order', {
        state: {
          orderId: orderId,
          amount:  total,
          method:  'Cashfree',
          address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          name:    `${form.firstName} ${form.lastName}`,
          email:   form.email,
        },
      });
    }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    if (payment === 'razorpay') {
      openRazorpay();
    } else if (payment === 'cashfree') {
      await openCashfree();
    } else {
      /* COD / other — skip gateway */
      await new Promise(r => setTimeout(r, 1800));
      clearCart();
      navigate('/order', {
        state: {
          orderId: 'TD' + Date.now(),
          amount:  total,
          method:  payment === 'cod' ? 'Cash on Delivery' : payment,
          address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          name:    `${form.firstName} ${form.lastName}`,
          email:   form.email,
        },
      });
    }
  }

  const Field = ({ name, label, placeholder, type = 'text', half }) => (
    <div className="form-group" style={half ? {} : {}}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange} className={errors[name] ? 'error' : ''} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step${i <= step ? ' active' : ''}${i === step ? ' current' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-layout">
        {/* Main section */}
        <div>
          {/* Step 0 — Shipping Address */}
          {step === 0 && (
            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="form-row">
                <Field name="firstName" label="First Name" placeholder="Ravi" />
                <Field name="lastName"  label="Last Name"  placeholder="Kumar" />
              </div>
              <div className="form-row">
                <Field name="phone" label="Mobile Number" placeholder="9876543210" type="tel" />
                <Field name="email" label="Email Address" placeholder="you@email.com" type="email" />
              </div>
              <Field name="address" label="Street Address" placeholder="Flat no, Building, Street" />
              <Field name="landmark" label="Landmark (Optional)" placeholder="Near metro station" />
              <div className="form-row form-row-3">
                <Field name="city"    label="City"     placeholder="Mumbai" />
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <select id="state" name="state" value={form.state} onChange={handleChange} className={errors.state ? 'error' : ''}>
                    <option value="">Select state</option>
                    {stateList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>
                <Field name="pincode" label="PIN Code" placeholder="400001" />
              </div>
              <div className="checkout-nav-btns">
                <button className="btn-outline" onClick={() => navigate('/cart')}>← Back to Cart</button>
                <button className="btn-primary" onClick={nextStep}>Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <div className="checkout-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                {[
                  { id: 'razorpay', icon: '💳', label: 'Razorpay', desc: 'UPI, Cards, Net Banking, Wallets — all in one' },
                  { id: 'cashfree', icon: '🏦', label: 'Cashfree', desc: 'Fast & secure checkout via Cashfree' },
                  { id: 'upi',      icon: '📱', label: 'UPI / BHIM', desc: 'Pay directly via any UPI app' },
                  { id: 'cod',      icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives (₹50 COD fee)' },
                ].map(opt => (
                  <label key={opt.id} className={`payment-option${payment === opt.id ? ' selected' : ''}`}>
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} />
                    <span className="payment-icon">{opt.icon}</span>
                    <div className="payment-label">
                      <strong>{opt.label}</strong>
                      <small>{opt.desc}</small>
                    </div>
                  </label>
                ))}
              </div>

              {(payment === 'razorpay' || payment === 'cashfree') && (
                <div className="payment-detail-form">
                  <h3>{payment === 'razorpay' ? '🔒 Razorpay Secure Checkout' : '🔒 Cashfree Secure Checkout'}</h3>
                  <p className="payment-hint">
                    {payment === 'razorpay'
                      ? 'You will be redirected to the Razorpay payment gateway. Supports UPI, Credit/Debit Cards, Net Banking, and Wallets. Your payment data is encrypted end-to-end.'
                      : 'You will be redirected to Cashfree\'s secure payment page. Supports UPI, Cards, Net Banking, and EMI options.'}
                  </p>
                </div>
              )}

              {payment === 'upi' && (
                <div className="payment-detail-form">
                  <h3>UPI Payment Details</h3>
                  <Field name="upiId" label="UPI ID" placeholder="yourname@upi" />
                  <p className="payment-hint">Enter your UPI VPA (e.g. name@okaxis, name@paytm). We'll send a payment request to your UPI app.</p>
                </div>
              )}

              <div className="checkout-nav-btns">
                <button className="btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" onClick={nextStep}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <div className="checkout-section">
              <h2>Review Your Order</h2>

              <div className="review-card">
                <h3>Delivery Address</h3>
                <p>{form.firstName} {form.lastName}<br />{form.address}{form.landmark ? ', ' + form.landmark : ''}<br />{form.city}, {form.state} — {form.pincode}<br />📞 {form.phone} · ✉️ {form.email}</p>
                <button className="review-edit-btn" onClick={() => setStep(0)}>Edit</button>
              </div>

              <div className="review-card">
                <h3>Payment Method</h3>
                <p>{payment === 'razorpay' ? '💳 Razorpay' : payment === 'cashfree' ? '🏦 Cashfree' : payment === 'upi' ? '📱 UPI' : '💵 Cash on Delivery'}</p>
                <button className="review-edit-btn" onClick={() => setStep(1)}>Edit</button>
              </div>

              <div className="review-card">
                <h3>Items ({cart.length})</h3>
                <div className="review-items">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="review-item">
                      <img src={item.images[0]} alt={item.name} />
                      <div style={{ flex: 1 }}>
                        <p className="review-item-name">{item.name}</p>
                        <small>{item.size && `Size: ${item.size}`}{item.color && ` · ${item.color}`} · Qty: {item.qty}</small>
                      </div>
                      <span className="review-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="checkout-nav-btns">
                <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                  {loading
                    ? <span className="processing-text"><span className="spinner" />Processing…</span>
                    : `Place Order — ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <div className="checkout-sidebar">
          <div className="cart-summary-card">
            <h2>Order Summary</h2>
            <div className="checkout-items-preview">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="checkout-preview-item">
                  <div className="checkout-preview-img">
                    <img src={item.images[0]} alt={item.name} />
                    <span className="checkout-preview-qty">{item.qty}</span>
                  </div>
                  <div className="checkout-preview-info">
                    <p>{item.name}</p>
                    <span>₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            {savings > 0 && <div className="summary-row savings"><span>Savings</span><span>− ₹{savings.toLocaleString()}</span></div>}
            <div className="summary-row"><span>Delivery</span><span className={shipping === 0 ? 'free-delivery' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            {payment === 'cod' && <div className="summary-row"><span>COD Fee</span><span>₹50</span></div>}
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>₹{(total + (payment === 'cod' ? 50 : 0)).toLocaleString()}</span></div>

            <div className="cart-payment-icons">
              <span>Accepted Payments</span>
              <div className="payment-methods-mini">
                <span>💳</span><span>🏦</span><span>📱</span><span>💵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
