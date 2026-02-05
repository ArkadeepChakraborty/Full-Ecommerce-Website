import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

// Provide context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/get', {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("userName", res.data.user.fullname || res.data.user.name);
      } else {
        setUser(null);
        localStorage.removeItem("userName");
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("userName");
    }
  };

  const logout = async () => {
    await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
    setUser(null);
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Add this hook for accessing AuthContext easily
export const useAuth = () => useContext(AuthContext);
