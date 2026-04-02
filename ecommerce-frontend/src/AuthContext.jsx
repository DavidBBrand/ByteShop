import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const initAuth = () => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        // Decode the token to get the "sub" field (which is your email)
        const decoded = jwtDecode(savedToken);
        
        // FastAPI usually puts the email/username in the 'sub' field
        setUser({ email: decoded.sub }); 
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };
  initAuth();
}, []);

  const login = async (email, password) => {
    // IMPORTANT: FastAPI's OAuth2PasswordRequestForm expects 
    // "application/x-www-form-urlencoded" data, not JSON.
    const params = new URLSearchParams();
    params.append("username", email); // Backend expects "username" field for the email
    params.append("password", password);

    try {
      const response = await axios.post("http://127.0.0.1:8000/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token } = response.data;
      
      // Save to state and storage
      setToken(access_token);
      localStorage.setItem("token", access_token);
      
      // You can decode the JWT here to get user info, or just set a placeholder
      setUser({ email }); 
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err.response?.data?.detail || err.message);
      return { success: false, error: err.response?.data?.detail || "Login failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);