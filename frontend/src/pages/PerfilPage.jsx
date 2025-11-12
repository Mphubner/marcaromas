import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { User } from 'lucide-react';

export default function PerfilPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-brand-primary" />
          <h1 className="text-4xl font-bold text-brand-dark">Meu Perfil</h1>
        </div>
        <p className="text-gray-600 mb-8">Você precisa fazer login para acessar seu perfil.</p>
        <Link to="/login">
          <Button className="bg-brand-primary hover:bg-brand-dark">
            Fazer Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
