import { useState, FormEvent, ChangeEvent } from 'react';
import { useCart } from './useCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { API_URL } from './api';
import toast from 'react-hot-toast';

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
}

interface OrderPayload {
  customer_name: string;
  email: string;
  shipping_address: string;
  total_price: number;
  items: { product_id: number; quantity: number; price: number }[];
}

interface OrderResponse {
  order_id: number;
}

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', email: '', address: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error('You must be logged in to checkout.');
      navigate('/login');
      return;
    }

    try {
      const orderPayload: OrderPayload = {
        customer_name: customer.name,
        email: customer.email,
        shipping_address: customer.address,
        total_price: cartTotal,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = (await response.json()) as OrderResponse;
        toast.success(`Order #${result.order_id} placed!`);
        clearCart();
        navigate('/');
      } else {
        const errorText = await response.text();
        console.error('Server rejected request:', errorText);
        toast.error('Checkout failed. Check the console for details.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-orange-400">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <input
          name="name"
          className="w-full p-2 rounded"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          className="w-full p-2 rounded"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          className="w-full p-2 rounded"
          placeholder="Shipping Address"
          onChange={handleChange}
          required
        />
        <div className="mt-6 text-white">
          <h3 className="text-xl">Total: ${cartTotal.toFixed(2)}</h3>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 p-3 rounded-lg font-bold mt-4"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
