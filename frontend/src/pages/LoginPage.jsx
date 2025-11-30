import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, googleLoginWithToken, user } = useAuth();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Redirect if already logged in
  React.useEffect(() => {
    const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/loja';
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Preencha todos os campos");
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-brand-primary" />
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" ? "Faça Login" : "Crie sua Conta"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
              {mode === "register" && (
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white"
              >
                {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="mb-4">
              <GoogleSignInButton
                onSuccess={(credentialResponse) => {
                  googleLoginWithToken(credentialResponse.credential);
                }}
                onError={() => {
                  setError("Falha no login com o Google.");
                }}
              />
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              {mode === "login" ? (
                <>
                  Não tem conta?{" "}
                  <button
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setFormData({ name: "", email: "", password: "" });
                    }}
                    className="text-brand-primary hover:font-semibold transition-all"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setFormData({ name: "", email: "", password: "" });
                    }}
                    className="text-brand-primary hover:font-semibold transition-all"
                  >
                    Faça login
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
