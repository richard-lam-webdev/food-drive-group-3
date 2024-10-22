import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          { name: 'Produit 1', quantity: 1, price: 1500 }, 
          { name: 'Produit 2', quantity: 2, price: 2500 },
        ],
      }),
    });

    const session = await response.json();

    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    if (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Commande</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <p className="text-xl mb-4">Total : 65€</p>
        <button
          onClick={handleCheckout}
          className={`bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Payer'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
