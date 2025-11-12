import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for token in URL (from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlUser = params.get("userId");
    const urlName = params.get("name");
    const urlEmail = params.get("email");

    if (urlToken) {
      const userData = {
        id: parseInt(urlUser),
        name: decodeURIComponent(urlName),
        email: decodeURIComponent(urlEmail),
      };
      setToken(urlToken);
      setUser(userData);
      localStorage.setItem("token", urlToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Try to restore from localStorage
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user", e);
        }
      }
    }
  }, []);

  async function login(email, password) {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
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
      return { success: false, error: err.message };
    }
  }

  async function googleLoginWithToken(googleToken) {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });
      const data = await res.json();
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
      return { success: false, error: err.message };
    }
  }

  async function register(name, email, password) {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
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
      return { success: false, error: err.message };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, googleLoginWithToken, register }}>
      {children}
    </AuthContext.Provider>
  );
}
