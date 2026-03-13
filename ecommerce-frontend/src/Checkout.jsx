import React, { useState } from 'react';
import { useCart } from './CartContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart(); // Grab what you need from Context
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
      total_price: totalPrice,
      items: cart.map(item => ({
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
        alert(`Success! Order #${result.order_id} placed.`);
        clearCart(); // Clean up the context
        navigate('/'); // Send them home
      } else {
        alert("Checkout failed. Check stock or details.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Full Name" 
          onChange={(e) => setCustomer({...customer, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Email" 
          type="email"
          onChange={(e) => setCustomer({...customer, email: e.target.value})} 
          required 
        />
        <textarea 
          placeholder="Shipping Address" 
          onChange={(e) => setCustomer({...customer, address: e.target.value})} 
          required 
        />
        
        <div className="summary">
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button type="submit">Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;