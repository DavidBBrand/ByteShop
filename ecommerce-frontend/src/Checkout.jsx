import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  // 1. MATCH THESE NAMES TO YOUR CONTEXT
  const { cartItems, cartTotal, clearCart } = useCart(); 
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderPayload = {
      customer_name: customer.name,
      email: customer.email,
      shipping_address: customer.address,
      total_price: cartTotal, // Use cartTotal
      items: cartItems.map(item => ({ // Use cartItems
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`🚀 Success! Order #${result.order_id} placed.`);
        clearCart();
        navigate('/');
      } else {
        alert("Checkout failed. Check stock or details.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-6 bg-linear-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
        Checkout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <input 
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-orange-500 outline-none transition-all"
          placeholder="Full Name" 
          onChange={(e) => setCustomer({...customer, name: e.target.value})} 
          required 
        />
        <input 
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-orange-500 outline-none transition-all"
          placeholder="Email" 
          type="email"
          onChange={(e) => setCustomer({...customer, email: e.target.value})} 
          required 
        />
        <textarea 
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 h-32 focus:border-orange-500 outline-none transition-all"
          placeholder="Shipping Address" 
          onChange={(e) => setCustomer({...customer, address: e.target.value})} 
          required 
        />
        
        <div className="pt-6 border-t border-gray-700 mt-6">
          <h3 className="text-xl font-bold mb-4">
            Total: <span className="text-orange-400">${cartTotal.toFixed(2)}</span>
          </h3>
          <button 
            type="submit"
            className="w-full py-4 bg-linear-to-r from-orange-600 via-rose-800 to-indigo-800 rounded-xl font-bold uppercase hover:opacity-90 transition-opacity"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;