import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/'); // Send them back to the store
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-orange-400">Welcome Back</h2>
        
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email (username)" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:border-orange-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:border-orange-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;