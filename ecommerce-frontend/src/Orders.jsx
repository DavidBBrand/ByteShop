import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/orders/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading your history...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-orange-500">Order History</h2>

      {orders.length === 0 ? (
        <div className="bg-gray-800 p-10 rounded-2xl text-center">
          <p className="text-gray-400 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link to="/" className="text-orange-400 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg"
            >
              <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                <div>
                  <p className="text-xs text-gray-300 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="font-mono text-orange-300">#00{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rose-200 uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    {/* Access the nested product title! */}
                    <span className="text-amber-300 font-medium">
                      {item.product?.title || `Product #${item.product_id}`}
                    </span>
                    <span className="text-gray-300">
                      Product ID: {item.product_id}{" "}
                      <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="font-bold">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase text-xs">
                  Total Paid
                </span>
                <span className="text-2xl font-black text-white">
                  ${order.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
