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
import AromaterapiaPage from "./pages/AromaterapiaPage.jsx";
import PresentePage from "./pages/PresentePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentFailurePage from "./pages/PaymentFailurePage.jsx";
import PaymentPendingPage from "./pages/PaymentPendingPage.jsx";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage.jsx";
import SubscriptionFailurePage from "./pages/SubscriptionFailurePage.jsx";
import DiagnosticsPage from "./pages/DiagnosticsPage.jsx";

// Contextos (auth, carrinho, tema, etc.)
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserPreferencesProvider } from "./context/UserPreferencesContext.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <CartProvider>
        <UserPreferencesProvider>
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
                  <Route path="/aromaterapia" element={<AromaterapiaPage />} />
                  <Route path="/carrinho" element={<CarrinhoPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/sobre" element={<SobrePage />} />
                  <Route path="/contato" element={<ContatoPage />} />
                  <Route path="/presentear" element={<PresentePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/perfil" element={<PerfilPage />} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/payment/failure" element={<PaymentFailurePage />} />
                  <Route path="/payment/pending" element={<PaymentPendingPage />} />
                  <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                  <Route path="/subscription/failure" element={<SubscriptionFailurePage />} />
                  <Route path="/diagnostics" element={<DiagnosticsPage />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
        </UserPreferencesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
