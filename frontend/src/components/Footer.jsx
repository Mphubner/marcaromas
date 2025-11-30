import React from "react";
import { Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-light dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
            Marc Aromas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Velas artesanais e experiências aromáticas.
          </p>
        </motion.div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Navegação
          </h4>
          <nav className="flex flex-col gap-1 text-sm">
            <Link to="/clube">Marc Club</Link>
            <Link to="/loja">Marc Store</Link>
            <Link to="/aromaterapia">Essenza Blog</Link>
            <Link to="/sobre">Sobre</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Redes sociais
          </h4>
          <div className="flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
        © {new Date().getFullYear()} Marc Aromas — Todos os direitos reservados
      </p>
    </footer>
  );
}
