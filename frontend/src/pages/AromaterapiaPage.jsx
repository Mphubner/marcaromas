import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Link } from 'react-router-dom';
import { Sparkles, Droplets, Heart, Wind } from 'lucide-react';

export default function AromaterapiaPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-primary to-brand-dark text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Aromaterapia: <br/><span className="text-brand-accent">Bem-estar através dos aromas</span>
            </h1>
            <p className="text-xl opacity-90 mb-8">Descubra o poder curativo dos óleos essenciais</p>
            <Link to="/loja">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100">Explorar Produtos</Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-brand-dark mb-4 text-center">Benefícios</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[{icon: Heart, title: 'Redução de Estresse'}, {icon: Wind, title: 'Melhora do Sono'}, {icon: Sparkles, title: 'Energia'}, {icon: Droplets, title: 'Equilíbrio'}].map((b, i) => {const Icon = b.icon; return <Card key={i}><CardContent className="p-8"><Icon className="w-12 h-12 text-brand-primary mb-4" /><h3 className="text-xl font-bold text-brand-dark">{b.title}</h3></CardContent></Card>;})}
          </div>
        </div>
      </section>
    </div>
  );
}
