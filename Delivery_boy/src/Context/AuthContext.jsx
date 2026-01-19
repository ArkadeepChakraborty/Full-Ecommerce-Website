import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Hook to use Auth
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/deliveryBoy/me', {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.deliveryBoy);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
