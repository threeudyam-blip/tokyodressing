/**
 * Tokyo Dressing — Backend Server
 * Handles Cashfree order creation (requires server-side secret key).
 * Razorpay checkout works client-side with just the key ID.
 *
 * Required env vars (copy .env.example → .env):
 *   CASHFREE_APP_ID        — from Cashfree dashboard → API Keys
 *   CASHFREE_SECRET_KEY    — from Cashfree dashboard → API Keys
 *   CASHFREE_ENV           — "SANDBOX" or "PRODUCTION"
 *   PORT                   — defaults to 3001
 */

import express from 'express';
import cors    from 'cors';
import crypto  from 'crypto';
import 'dotenv/config';

const app  = express();
const PORT = process.env.PORT || 3001;

const CF_APP_ID     = process.env.CASHFREE_APP_ID     || '';
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CF_ENV        = process.env.CASHFREE_ENV        || 'SANDBOX';

const CF_BASE_URL = CF_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173', process.env.FRONTEND_URL].filter(Boolean) }));
app.use(express.json());

/* ── Health check ── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok', env: CF_ENV }));

/* ──────────────────────────────────────────
   POST /api/cashfree/create-order
   Body: { amount, customerName, customerEmail, customerPhone }
   Returns: { paymentSessionId, orderId }
────────────────────────────────────────── */
app.post('/api/cashfree/create-order', async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: 'amount, customerEmail and customerPhone are required' });
    }
    if (!CF_APP_ID || !CF_SECRET_KEY) {
      return res.status(500).json({ error: 'Cashfree credentials not configured in .env' });
    }

    const orderId = 'TD_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

    const orderPayload = {
      order_id:        orderId,
      order_amount:    Number(amount),
      order_currency:  'INR',
      customer_details: {
        customer_id:    'cust_' + crypto.randomBytes(6).toString('hex'),
        customer_name:  customerName  || 'Customer',
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order?order_id={order_id}`,
      },
    };

    const response = await fetch(`${CF_BASE_URL}/orders`, {
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'x-api-version':  '2023-08-01',
        'x-client-id':    CF_APP_ID,
        'x-client-secret': CF_SECRET_KEY,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree API error:', data);
      return res.status(response.status).json({ error: data.message || 'Cashfree order creation failed' });
    }

    return res.json({
      paymentSessionId: data.payment_session_id,
      orderId:          data.order_id,
      cfOrderId:        data.cf_order_id,
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ── Cashfree webhook (optional — verify payment server-side) ── */
app.post('/api/cashfree/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature  = req.headers['x-webhook-signature'];
  const timestamp  = req.headers['x-webhook-timestamp'];
  const rawBody    = req.body.toString();
  const signedData = timestamp + rawBody;

  const expectedSig = crypto
    .createHmac('sha256', CF_SECRET_KEY)
    .update(signedData)
    .digest('base64');

  if (signature !== expectedSig) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = JSON.parse(rawBody);
  console.log('Cashfree webhook event:', event.type, event.data?.order?.order_id);
  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Tokyo Dressing server running on http://localhost:${PORT}`);
  console.log(`   Cashfree ENV : ${CF_ENV}`);
  console.log(`   App ID set   : ${CF_APP_ID ? 'YES ✅' : 'NO ❌  (set in .env)'}\n`);
});
