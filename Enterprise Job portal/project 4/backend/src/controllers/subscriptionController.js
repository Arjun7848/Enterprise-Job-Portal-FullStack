import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

const PLANS = {
  free: { name: 'Free Tier', price: 0, duration: 0 },
  pro: { name: 'Pro Member', price: 999, duration: 30 },
  enterprise: { name: 'Enterprise Plan', price: 4999, duration: 365 }
};

export const createOrder = async (req, res) => {
  const { planKey } = req.body;
  const plan = PLANS[planKey];
  
  if (!plan) return res.status(400).json({ message: 'Invalid plan selected' });

  try {
    const orderId = `order_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.run(
      'INSERT INTO payments (user_id, amount, order_id, status, plan_name) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, plan.price, orderId, 'pending', plan.name]
    );

    res.status(201).json({ 
      orderId, 
      amount: plan.price, 
      currency: 'INR',
      key: 'rzp_test_stub_key' // Razorpay Stub Key
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { orderId, paymentId, planKey } = req.body;
  const plan = PLANS[planKey];

  try {
    // Simulated verification logic
    await db.run(
      'UPDATE payments SET status = ?, payment_id = ? WHERE order_id = ?',
      ['captured', paymentId, orderId]
    );

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    await db.run(
      'INSERT INTO subscriptions (user_id, plan_name, status, end_date) VALUES (?, ?, ?, ?)',
      [req.user.id, plan.name, 'active', endDate.toISOString()]
    );

    res.json({ message: 'Payment verified and subscription activated', plan: plan.name });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const sub = await db.get(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ? ORDER BY created_at DESC',
      [req.user.id, 'active']
    );
    res.json(sub || { plan_name: 'Free Tier', status: 'active' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
};
