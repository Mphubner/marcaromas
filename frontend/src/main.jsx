import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { UserPreferencesProvider } from "./context/UserPreferencesContext.jsx";
import "./index.css";


// ✅ Cria uma única instância global do QueryClient
const queryClient = new QueryClient();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "168078416745-nf9emaej1i4m0cv9eqj3tuac8i1u0juk.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <HelmetProvider>
        {/* ✅ Fornece o contexto global do React Query */}
        <QueryClientProvider client={queryClient}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <UserPreferencesProvider>
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 3000,
                        className: 'toast-custom'
                      }}
                    />
                    <App />
                  </UserPreferencesProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
