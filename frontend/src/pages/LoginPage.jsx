import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "../components/ui/button.jsx"; // Caminho relativo
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";

/**
 * Página de placeholder para Login.
 * No futuro, aqui ficará o formulário de login/cadastro.
 */
export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-light py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-brand-primary" />
        </div>
        
        <h1 className="text-4xl font-bold text-brand-dark mb-4">
          Login (Em Breve)
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Esta página abrigará o formulário de login e criação de conta. Por enquanto, você pode voltar para a Home.
        </p>

        <Button
          onClick={() => navigate("/")} // Volta para a Home
          className="bg-brand-primary hover:bg-brand-dark"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a Home
        </Button>
      </div>
    </div>
  );
}