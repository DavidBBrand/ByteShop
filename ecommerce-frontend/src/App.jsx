import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; // Since it's in the same folder

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 1. STICKY GRADIENT NAVBAR */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-4 border-b border-orange-500/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* GRADIENT LOGO */}

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent tracking-tighter">
              ByteShop
            </h1>
            <img
              src="/byteshop.png"
              alt="ByteShop Logo"
              className="w-24 h-24 object-cover rounded-full border-2 border-orange-500/50 animate-pulse-slow shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            />
          </div>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-all border border-gray-700">
            🛒 Cart:{" "}
            <span className="text-orange-400 font-bold">{cart.length}</span>{" "}
            items
          </button>
        </div>
      </nav>

      {/* 2. MAIN PRODUCT GRID */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
