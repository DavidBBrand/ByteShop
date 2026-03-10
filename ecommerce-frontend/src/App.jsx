import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; // Since it's in the same folder

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Define the fetch function
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Connection failed:", err);
        setError("Could not connect to the store. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    // 2. Call the fetch function
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.title} added to cart!`);
  };
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading ByteShop...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ByteShop</h1>
        <div className="bg-gray-800 text-white px-4 py-2 rounded-full">
          🛒 Cart: {cart.length} items
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => addToCart(product)} // Pass the function down
          />
        ))}
      </div>
    </div>
  );
}

export default App;
