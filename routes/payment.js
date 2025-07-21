import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {

     const { amount } = req.body;
  try { 

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    console.error("❌ Errore Stripe server:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
