import React, { createContext, useContext, useEffect, useState } from "react";
import api from '../lib/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Inicializa estado a partir do localStorage para manter sessão entre reloads
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // If token exists, validate it with backend and fetch fresh user
      (async () => {
        if (storedToken) {
          try {
            const { data } = await api.get('/auth/me');
            if (data?.user) {
              setUser(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              // token invalid or expired
              setUser(null);
              setToken(null);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (err) {
            console.warn('auth me failed', err?.response?.data || err.message);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        setIsLoadingAuth(false);
      })();
    } catch (err) {
      console.error("Erro ao inicializar autenticação:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoadingAuth(false);
    }
  }, []);

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data?.error || "Login failed" };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  }

  async function googleLoginWithToken(googleToken) {
    try {
      const { data } = await api.post('/auth/google', { token: googleToken });
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data?.error || "Google login failed" };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  }

  async function register(name, email, password) {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data?.error || "Registration failed" };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Prefer backend-provided flag if available
  const isAdmin = !!(user && (user.isAdmin || (user.email && user.email.toLowerCase() === "mpereirah15@gmail.com")));

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoadingAuth, login, logout, googleLoginWithToken, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
