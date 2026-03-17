import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 1. Persist Session: If a token exists on load, we should probably 
  // fetch the user's profile to make sure the token is still valid.
useEffect(() => {
  const initAuth = async () => {
    try {
      if (token) {
        // Even if we don't have a /me endpoint yet, 
        // we set a placeholder user so the UI updates
        setUser({ email: "Loading..." }); 
      }
    } catch (err) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // <--- THIS MUST RUN
    }
  };
  initAuth();
}, [token]);

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