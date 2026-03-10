import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/products')
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1>My Shop</h1>
      {products.map(p => <p key={p.id}>{p.name} - ${p.price}</p>)}
    </div>
  );
}