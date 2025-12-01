// /marcaromas - Copia/frontend/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Heart,
} from "lucide-react";
import { useCart } from "../context/CartContext"; // mantém o uso de contexto existente
import { cn } from "@/lib/utils";;

/**
 * Header / Navbar
 * - muda cores baseado em scroll (isScrolled)
 * - usa classes com boas cores para evitar texto branco sobre fundo branco
 * - fecha menu mobile ao navegar
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // se preferir persistir tema no localStorage
    const saved = localStorage.getItem("marcaromas_theme");
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("marcaromas_theme", next);
    // se o app tiver provider de tema, disparar lá.
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Marc Club", to: "/clube" },
    { name: "Marc Store", to: "/loja" },
    { name: "Essenza Blog", to: "/aromaterapia" },
    { name: "Presentear", to: "/presentear" },
  ];

  return (
    <motion.header
      initial={false}
      style={{ background: "linear-gradient(to right, #8B7355, #5e4e3a)" }}
      className={cn(
        "fixed w-full z-50 transition-all duration-300 text-white shadow-md",
        { "py-2": isScrolled, "py-4": !isScrolled }
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" onClick={() => window.scrollTo({ top: 0 })} className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-full">
              <img src="/logo192.png" alt="Marc Aromas" style={{ height: 32 }} />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              Marc Aromas
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("px-4 py-2 rounded-full transition-all text-sm font-medium", {
                  "bg-white/20 text-white shadow-sm backdrop-blur-sm": isActive,
                  "text-white/80 hover:bg-white/10 hover:text-white": !isActive,
                })
              }
              onClick={() => window.scrollTo({ top: 0 })}
            >
              {item.name}
            </NavLink>
          ))}

          <div className="h-6 w-px bg-white/20 mx-2" />

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            title="Alternar tema"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            onClick={() => navigate("/wishlist")}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            title="Lista de Desejos"
          >
            <Heart size={18} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            title="Perfil"
          >
            <User size={18} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/carrinho")}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors relative"
            title="Carrinho"
          >
            <ShoppingBag size={18} />
            {cart && cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {cart.length}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setMenuOpen((s) => !s)} className="text-white p-2">
            {!menuOpen ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#5e4e3a] border-t border-white/10 text-white shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn("px-4 py-3 rounded-lg transition-colors", {
                      "bg-white/20 text-white font-medium": isActive,
                      "text-white/80 hover:bg-white/10": !isActive
                    })
                  }
                  onClick={() => {
                    setMenuOpen(false);
                    window.scrollTo({ top: 0 });
                  }}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="flex flex-wrap items-center justify-between px-2 gap-2">
                <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="flex items-center gap-2 text-white/80 hover:text-white py-2">
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  <span>Tema</span>
                </button>
                <button onClick={() => { navigate("/wishlist"); setMenuOpen(false); }} className="flex items-center gap-2 text-white/80 hover:text-white py-2">
                  <Heart size={18} />
                  <span>Wishlist</span>
                </button>
                <button onClick={() => { navigate("/carrinho"); setMenuOpen(false); }} className="flex items-center gap-2 text-white/80 hover:text-white py-2 relative">
                  <ShoppingBag size={18} />
                  <span>Carrinho ({cart ? cart.length : 0})</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
