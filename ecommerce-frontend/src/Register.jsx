import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/register", {
        username,
        email,
        password
      });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.detail;
      alert(
        typeof errorMessage === "string"
          ? errorMessage
          : "Registration failed. Check console."
      );
      console.error("Registration Error:", err.response?.data);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-400">
          Create Account
        </h2>

        <div className="space-y-4">
          {/* 3. NEW USERNAME INPUT */}
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-orange-500"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-orange-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white outline-none focus:border-orange-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
