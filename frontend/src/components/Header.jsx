// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ui/themetoggle";
import Button from "./ui/button";

const categories = [
  { name: "Velas Aromáticas", path: "/loja?cat=velas" },
  { name: "Kits & Presentes", path: "/loja?cat=kits" },
  { name: "Bem-estar", path: "/loja?cat=bem-estar" },
];

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const [isSticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isSticky
          ? "bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700"
          : "bg-transparent"
      }`}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 5 }}
            className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white font-semibold"
          >
            MA
          </motion.div>
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
            Marc Aromas
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className="text-gray-700 dark:text-gray-200 hover:text-brand-primary transition"
          >
            Início
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-brand-primary"
            >
              Loja
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  {categories.map((cat) => (
                    <NavLink
                      key={cat.path}
                      to={cat.path}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink
            to="/clube"
            className="text-gray-700 dark:text-gray-200 hover:text-brand-primary"
          >
            Clube
          </NavLink>
          <NavLink
            to="/blog"
            className="text-gray-700 dark:text-gray-200 hover:text-brand-primary"
          >
            Blog
          </NavLink>
          <NavLink
            to="/sobre"
            className="text-gray-700 dark:text-gray-200 hover:text-brand-primary"
          >
            Sobre
          </NavLink>
          <NavLink
            to="/contato"
            className="text-gray-700 dark:text-gray-200 hover:text-brand-primary"
          >
            Contato
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative text-gray-700 dark:text-gray-200 hover:text-brand-primary"
            onClick={() => navigate("/carrinho")}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </motion.button>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                <User size={20} />
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => navigate("/perfil")}
                  className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                >
                  Minha conta
                </button>
                <button
                  onClick={logout}
                  className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left flex items-center gap-2"
                >
                  <LogOut size={14} /> Sair
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 pb-6 pt-2"
          >
            <nav className="flex flex-col gap-2 text-sm">
              {["Início", "Loja", "Clube", "Blog", "Sobre", "Contato"].map(
                (item) => (
                  <NavLink
                    key={item}
                    to={`/${item === "Início" ? "" : item.toLowerCase()}`}
                    className="py-2 text-gray-700 dark:text-gray-200 hover:text-brand-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </NavLink>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
