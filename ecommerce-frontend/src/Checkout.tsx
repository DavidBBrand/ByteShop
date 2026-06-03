import { useState, FormEvent, ChangeEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from './useCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api, API_URL } from './api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

// ─── Shipping form ────────────────────────────────────────────────────────────

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
}

interface ShippingFormProps {
  cartTotal: number;
  token: string;
  onReady: (clientSecret: string, shipping: ShippingInfo) => void;
}

function ShippingForm({ cartTotal, token, onReady }: ShippingFormProps) {
  const [shipping, setShipping] = useState<ShippingInfo>({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<{ client_secret: string }>(
        '/create-payment-intent',
        { amount: cartTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onReady(data.client_secret, shipping);
    } catch {
      toast.error('Could not initialise payment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-orange-400 mb-2">Shipping Info</h3>
      <input
        name="name"
        placeholder="Full Name"
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 outline-none"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 outline-none"
        onChange={handleChange}
        required
      />
      <textarea
        name="address"
        placeholder="Shipping Address"
        rows={3}
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 outline-none resize-none"
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50"
      >
        {loading ? 'Preparing payment…' : 'Continue to Payment →'}
      </button>
    </form>
  );
}

// ─── Payment form (rendered inside <Elements>) ────────────────────────────────

interface PaymentFormProps {
  shipping: ShippingInfo;
  cartTotal: number;
  token: string;
  onBack: () => void;
}

function PaymentForm({ shipping, cartTotal, token, onBack }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Confirm the Stripe payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message ?? 'Payment failed.');
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Record the order in our DB
      try {
        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_name: shipping.name,
            email: shipping.email,
            shipping_address: shipping.address,
            total_price: cartTotal,
            items: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        });

        if (response.ok) {
          const result = (await response.json()) as { order_id: number };
          toast.success(`Order #${result.order_id} confirmed!`);
          clearCart();
          navigate('/orders');
        } else {
          // Payment went through but order save failed — still clear cart
          toast.success('Payment successful!');
          clearCart();
          navigate('/');
        }
      } catch {
        toast.error('Payment succeeded but order recording failed.');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <button type="button" onClick={onBack} className="text-gray-400 hover:text-white text-sm">
          ← Back
        </button>
        <h3 className="text-lg font-bold text-orange-400">Payment Details</h3>
      </div>

      {/* Stripe's pre-built card UI */}
      <div className="rounded-xl overflow-hidden">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-400 pt-1">
        <span>Shipping to:</span>
        <span className="text-white">{shipping.name}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 rounded-xl bg-linear-to-r from-orange-400 to-rose-600 text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:scale-100"
      >
        {loading ? 'Processing…' : `Pay $${cartTotal.toFixed(2)}`}
      </button>

      <p className="text-center text-xs text-gray-500">
        Test card: <span className="font-mono text-gray-400">4242 4242 4242 4242</span> · any future date · any CVC
      </p>
    </form>
  );
}

// ─── Main Checkout page ───────────────────────────────────────────────────────

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [clientSecret, setClientSecret] = useState('');
  const [shipping, setShipping] = useState<ShippingInfo>({ name: '', email: '', address: '' });

  if (!token) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6 text-center mt-20">
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="text-orange-400 hover:underline">
          Back to store
        </button>
      </div>
    );
  }

  const handleShippingReady = (secret: string, info: ShippingInfo) => {
    setClientSecret(secret);
    setShipping(info);
    setStep('payment');
  };

  const stripeAppearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#f97316',
      colorBackground: '#1f2937',
      colorText: '#ffffff',
      colorDanger: '#f43f5e',
      borderRadius: '12px',
      fontFamily: 'inherit',
    },
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-1 text-white">Checkout</h2>
      <p className="text-gray-400 text-sm mb-6">
        {cartItems.length} item{cartItems.length > 1 ? 's' : ''} · ${cartTotal.toFixed(2)}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex-1 h-1 rounded-full ${step === 'shipping' ? 'bg-orange-500' : 'bg-orange-500'}`} />
        <div className={`flex-1 h-1 rounded-full ${step === 'payment' ? 'bg-orange-500' : 'bg-gray-700'}`} />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
        {step === 'shipping' && (
          <ShippingForm
            cartTotal={cartTotal}
            token={token}
            onReady={handleShippingReady}
          />
        )}

        {step === 'payment' && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: stripeAppearance }}
          >
            <PaymentForm
              shipping={shipping}
              cartTotal={cartTotal}
              token={token}
              onBack={() => setStep('shipping')}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Checkout;
