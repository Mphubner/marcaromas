import React from 'react';

// Este é um componente "stub" (espaço reservado)
// Vamos implementar a lógica do quiz mais tarde.
export default function AromaQuiz({ onComplete }) {
  return (
    <div className="p-8 bg-gray-100 rounded-lg text-center">
      <h3 className="text-lg font-semibold text-brand-dark mb-4">
        Quiz de Aromas (Em Breve)
      </h3>
      <button
        onClick={onComplete}
        className="bg-brand-primary text-white px-4 py-2 rounded-lg"
      >
        Fechar Quiz (Simulação)
      </button>
    </div>
  );
}