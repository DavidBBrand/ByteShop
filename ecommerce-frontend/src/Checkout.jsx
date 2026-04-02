import React, { useState } from "react";
import { useCart } from "./useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Checkout = () => {
  // HOOKS MUST BE HERE
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Submit button clicked");
    console.log("2. Current Token:", token);
    console.log("3. Customer Data:", customer);
    console.log("4. Cart Data:", cartItems);

    if (!token) {
      console.error("TOKEN MISSING: Redirecting to login...");
      alert("You must be logged in to checkout.");
      navigate("/login");
      return;
    }

    try {
      const orderPayload = {
        customer_name: customer.name,
        email: customer.email,
        shipping_address: customer.address,
        total_price: cartTotal,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      console.log("5. Payload created:", orderPayload);

      const response = await fetch("http://127.0.0.1:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      console.log("6. Response received:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("7. Success!", result);
        alert(`Success! Order #${result.order_id} placed.`);
        clearCart();
        navigate("/");
      } else {
        const errorText = await response.text();
        console.error("8. Server rejected request:", errorText);
        alert("Checkout failed. Check the console for details.");
      }
    } catch (err) {
      console.error("9. CRITICAL ERROR:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-orange-400">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <input
          className="w-full p-2 rounded"
          placeholder="Full Name"
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          required
        />
        <input
          className="w-full p-2 rounded"
          placeholder="Email"
          type="email"
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          required
        />
        <textarea
          className="w-full p-2 rounded"
          placeholder="Shipping Address"
          onChange={(e) =>
            setCustomer({ ...customer, address: e.target.value })
          }
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
