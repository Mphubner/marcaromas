import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { Home, Sparkles, ShoppingBag, BookOpen, Heart, Mail, User, Package, LogOut, Gift, X, Menu, ShoppingCart, Trophy, Lock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Toaster } from 'sonner';

const publicPages = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Marc Club', path: '/clube', icon: Sparkles },
  { name: 'Marc Store', path: '/loja', icon: ShoppingBag },
  { name: 'Essenza Blog', path: '/aromaterapia', icon: BookOpen },
  { name: 'Sobre', path: '/sobre', icon: Heart },
  { name: 'Contato', path: '/contato', icon: Mail },
];

const userPages = [
  { name: 'Meu Painel', path: '/dashboard', icon: Package },
  { name: 'Minha Assinatura', path: '/minha-assinatura', icon: Sparkles },
  { name: 'Minhas Comprar', path: '/minhas-compras', icon: ShoppingBag },
  { name: 'Minhas Conquistas', path: '/minhas-conquistas', icon: Trophy },
  { name: 'Conteúdo Exclusivo', path: '/conteudo-exclusivo', icon: Lock },
  { name: 'Indicar Amigos', path: '/indicacoes', icon: Users },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* White Header with Brown Text */}
      <header className="sticky top-0 z-50 bg-white text-[#8B7355] shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Circular */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={settings?.general?.logo || "/Logo Marc.svg"}
                  alt={settings?.general?.storeName || "Marc Aromas"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#8B7355] tracking-wide">{settings?.general?.storeName || "Marc Aromas"}</h1>
                <p className="text-xs text-[#8B7355]/70 font-medium tracking-wider">{settings?.general?.description || "Clube de Velas Artesanais"}</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {publicPages.map((page) => (
                <NavLink
                  key={page.path}
                  to={page.path}
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-full transition-all text-sm font-medium ${isActive
                      ? "bg-[#8B7355] text-white shadow-md"
                      : "text-[#8B7355] hover:bg-[#8B7355]/10"
                    }`
                  }
                >
                  {page.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Gift Button */}
              <Link to="/presentear">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                >
                  <Gift className="w-4 h-4" />
                  Presentear
                </Button>
              </Link>

              {/* Cart with Count */}
              <Link to="/carrinho" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8B7355] hover:bg-[#8B7355]/10"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                {cart?.length > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg border-2 border-white z-10">
                      {cart.length}
                    </span>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 blur-md opacity-50 z-0"></span>
                  </>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 text-[#8B7355] hover:bg-[#8B7355]/10"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B7355] to-[#7A6548] flex items-center justify-center text-white font-bold shadow-md">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <span className="hidden md:inline text-sm font-medium">{user.name?.split(' ')[0] || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl">
                    {userPages.map((page) => (
                      <DropdownMenuItem
                        key={page.path}
                        asChild
                        className="cursor-pointer hover:bg-[#8B7355]/10 focus:bg-[#8B7355]/20"
                      >
                        <Link to={page.path} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 font-medium">
                          <page.icon className="w-4 h-4 text-[#8B7355]" />
                          {page.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {user.isAdmin && (
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-[#8B7355]/10 focus:bg-[#8B7355]/20"
                      >
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 font-medium">
                          <Lock className="w-4 h-4 text-[#8B7355]" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1"></div>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer hover:bg-red-50 focus:bg-red-100 text-red-600 font-medium px-3 py-2.5"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => window.location.href = '/login'}
                  className="bg-[#8B7355] hover:bg-[#7A6548] text-white font-medium shadow-md"
                >
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#8B7355] hover:bg-[#8B7355]/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2">
                {publicPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg flex items-center gap-3 text-[#8B7355] hover:bg-[#8B7355]/10 hover:pl-6 transition-all"
                  >
                    <page.icon className="w-5 h-5" />
                    {page.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">{children}</main>
      <Toaster position="top-center" richColors />

      {/* Footer */}
      <footer className="bg-[#2C2419] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[#8B7355]" />
                <span className="font-bold text-lg">{settings?.general?.storeName || "Marc Aromas"}</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">{settings?.general?.description || "Velas artesanais feitas à mão para transformar sua rotina em ritual."}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {publicPages.map(p => <li key={p.path}><Link to={p.path} className="hover:text-white">{p.name}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacidade" className="hover:text-white">Política de Privacidade</Link></li>
                <li><Link to="/termos" className="hover:text-white">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>contato@marcaromas.com</li>
                <li>(11) 99999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
              <div className="mt-4">
                <Link to="/presentear"><Button className="bg-white text-[#2C2419] hover:bg-gray-100 w-full font-bold">Presentear</Button></Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>{settings?.cms_footer?.copyrightText || "© 2025 Marc Aromas. Todos os direitos reservados."}</p>
            <p className="mt-2 text-xs">Feito com 💜 em São Paulo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
