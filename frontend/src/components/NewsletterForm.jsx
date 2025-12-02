import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '../lib/api';

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Digite um e-mail válido');
      return;
    }

    setLoading(true);

    try {
      await api.post('/newsletter', formData);
      toast.success('Inscrito com sucesso! Verifique seu e-mail.');
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error('Este e-mail já está cadastrado');
      } else {
        toast.error('Erro ao inscrever. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#8B7355] via-[#7A6548] to-[#6B5845] py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Mail className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-4">
          Receba Novidades e Dicas de Bem-Estar
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Cadastre-se e ganhe 10% de desconto na primeira compra
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome"
            className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:ring-4 focus:ring-white/30 outline-none font-medium no-round"
            required
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Seu melhor email"
            className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:ring-4 focus:ring-white/30 outline-none font-medium no-round"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-white text-[#8B7355] hover:bg-gray-100 px-8 py-6 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all no-round"
          >
            {loading ? 'Enviando...' : 'Inscrever'}
          </Button>
        </form>

        <p className="text-white/70 text-sm mt-6">
          Ao se inscrever, você concorda em receber emails da Marc Aromas
        </p>
      </div>
    </section>
  );
}
