import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Páginas
import HomePage from "./pages/HomePage.jsx";
import LojaPage from "./pages/LojaPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import CarrinhoPage from "./pages/CarrinhoPage.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import ClubePage from "./pages/ClubePage.jsx";
import SobrePage from "./pages/SobrePage.jsx";
import ContatoPage from "./pages/ContatoPage.jsx";

// Contextos (auth, carrinho, tema, etc.)
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
          <Header />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/loja" element={<LojaPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/clube" element={<ClubePage />} />
                  <Route path="/carrinho" element={<CarrinhoPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/sobre" element={<SobrePage />} />
                  <Route path="/contato" element={<ContatoPage />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
