import React, { Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Layout from "./components/Layout.jsx";

// Páginas
// Páginas (Lazy Loading)
const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const LojaPage = React.lazy(() => import("./pages/LojaPage.jsx"));
const CarrinhoPage = React.lazy(() => import("./pages/CarrinhoPage.jsx"));
const CheckoutPage = React.lazy(() => import("./pages/Checkout.jsx"));
const CheckoutProduto = React.lazy(() => import("./pages/CheckoutProduto.jsx"));
const ClubePage = React.lazy(() => import("./pages/ClubePage.jsx"));
const SobrePage = React.lazy(() => import("./pages/SobrePage.jsx"));
const ContatoPage = React.lazy(() => import("./pages/ContatoPage.jsx"));
const AromaterapiaPage = React.lazy(() => import("./pages/AromaterapiaPage.jsx"));
const PresentePage = React.lazy(() => import("./pages/PresentePage.jsx"));
const ProdutoPage = React.lazy(() => import("./pages/ProdutoPage.jsx"));
const BoxProductPage = React.lazy(() => import("./pages/BoxProductPage.jsx"));
const BlogPostPage = React.lazy(() => import("./pages/BlogPostPage.jsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const PerfilPage = React.lazy(() => import("./pages/PerfilPage.jsx"));
const PaymentSuccessPage = React.lazy(() => import("./pages/PaymentSuccessPage.jsx"));
const PaymentFailurePage = React.lazy(() => import("./pages/PaymentFailurePage.jsx"));
const PaymentPendingPage = React.lazy(() => import("./pages/PaymentPendingPage.jsx"));
const SubscriptionSuccessPage = React.lazy(() => import("./pages/SubscriptionSuccessPage.jsx"));
const SubscriptionFailurePage = React.lazy(() => import("./pages/SubscriptionFailurePage.jsx"));
const DiagnosticsPage = React.lazy(() => import("./pages/DiagnosticsPage.jsx"));
const Dashboard = React.lazy(() => import("./pages/Dashboard.jsx"));
const MinhaAssinatura = React.lazy(() => import("./pages/MinhaAssinatura.jsx"));
const MinhasCompras = React.lazy(() => import("./pages/MinhasCompras.jsx"));
const MinhasConquistas = React.lazy(() => import("./pages/MinhasConquistas.jsx"));
const Indicacoes = React.lazy(() => import("./pages/Indicacoes.jsx"));
const PerfilAromas = React.lazy(() => import("./pages/PerfilAromas.jsx"));
const ConteudoExclusivo = React.lazy(() => import("./pages/ConteudoExclusivo.jsx"));
const ExclusiveContentPost = React.lazy(() => import("./pages/ExclusiveContentPost.jsx"));
const Admin = React.lazy(() => import("./pages/admin/Admin.jsx"));

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

// Contextos (auth, carrinho, tema, etc.)
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserPreferencesProvider } from "./context/UserPreferencesContext.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
                    </div>
                  }>
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<Layout><HomePage /></Layout>} />
                      <Route path="/loja" element={<Layout><LojaPage /></Layout>} />
                      <Route path="/blog" element={<Navigate to="/aromaterapia" replace />} />
                      <Route path="/clube" element={<Layout><ClubePage /></Layout>} />
                      <Route path="/aromaterapia" element={<Layout><AromaterapiaPage /></Layout>} />
                      <Route path="/produto/:slug" element={<Layout><ProdutoPage /></Layout>} />
                      <Route path="/box/:slug" element={<Layout><BoxProductPage /></Layout>} />
                      <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />
                      <Route path="/carrinho" element={<Layout><CarrinhoPage /></Layout>} />
                      <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
                      <Route path="/checkout-produto" element={<Layout><CheckoutProduto /></Layout>} />
                      <Route path="/sobre" element={<Layout><SobrePage /></Layout>} />
                      <Route path="/contato" element={<Layout><ContatoPage /></Layout>} />
                      <Route path="/presentear" element={<Layout><PresentePage /></Layout>} />
                      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                      <Route path="/perfil" element={<Layout><ProtectedRoute><PerfilPage /></ProtectedRoute></Layout>} />
                      <Route path="/payment/success" element={<Layout><PaymentSuccessPage /></Layout>} />
                      <Route path="/payment/failure" element={<Layout><PaymentFailurePage /></Layout>} />
                      <Route path="/payment/pending" element={<Layout><PaymentPendingPage /></Layout>} />
                      <Route path="/subscription/success" element={<Layout><SubscriptionSuccessPage /></Layout>} />
                      <Route path="/subscription/failure" element={<Layout><SubscriptionFailurePage /></Layout>} />
                      <Route path="/diagnostics" element={<Layout><DiagnosticsPage /></Layout>} />
                      <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                      <Route path="/minha-assinatura" element={<Layout><ProtectedRoute><MinhaAssinatura /></ProtectedRoute></Layout>} />
                      <Route path="/minhas-compras" element={<Layout><ProtectedRoute><MinhasCompras /></ProtectedRoute></Layout>} />
                      <Route path="/minhas-conquistas" element={<Layout><ProtectedRoute><MinhasConquistas /></ProtectedRoute></Layout>} />
                      <Route path="/indicacoes" element={<Layout><ProtectedRoute><Indicacoes /></ProtectedRoute></Layout>} />
                      <Route path="/perfil-aromas" element={<Layout><ProtectedRoute><PerfilAromas /></ProtectedRoute></Layout>} />
                      <Route path="/conteudo-exclusivo" element={<Layout><ProtectedRoute><ConteudoExclusivo /></ProtectedRoute></Layout>} />
                      <Route path="/conteudo-exclusivo/:slug" element={<Layout><ProtectedRoute><ExclusiveContentPost /></ProtectedRoute></Layout>} />
                      <Route path="/admin/*" element={<Layout><AdminRoute><Admin /></AdminRoute></Layout>} />
                    </Routes>
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </CartProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}
