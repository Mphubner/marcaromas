import React from "react";
import { X } from "lucide-react"; // Precisa do ícone de fechar

// Este é um componente de Diálogo/Modal "stub" mais inteligente.
// Ele agora lida com o estado de abertura, centralização e fechamento.

/**
 * O componente principal que controla a visibilidade
 * @param {boolean} open - Se o modal está aberto
 * @param {function} onOpenChange - Função para alterar o estado de 'open' (ex: setShowQuiz)
 * @param {React.ReactNode} children - O conteúdo a ser renderizado dentro (ex: <DialogContent />)
 */
export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) {
    return null; // Se não estiver aberto, não renderiza nada
  }

  // O 'fundo' escuro (backdrop)
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      // Fecha o modal ao clicar no fundo
      onClick={() => onOpenChange(false)}
    >
      {/* O conteúdo do modal. 
        e.stopPropagation() impede que o clique *dentro* do modal
        se propague para o fundo e feche o modal.
      */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl" // max-w-3xl como no PDF original
        onClick={(e) => e.stopPropagation()}
      >
        {/* Passamos a função onOpenChange para os filhos (como o DialogContent)
          para que eles também possam fechar o modal.
        */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onOpenChange });
          }
          return child;
        })}
      </div>
    </div>
  );
};

// O container do conteúdo, que recebe o botão de fechar
export const DialogContent = ({ className, children, onOpenChange }) => {
  return (
    <div className={`relative p-6 ${className || ''}`}>
      {/* Botão de Fechar */}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      {children}
    </div>
  );
};

// O cabeçalho
export const DialogHeader = ({ className, children }) => {
  return <div className={`mb-4 ${className || ''}`}>{children}</div>;
};

// O título
export const DialogTitle = ({ className, children }) => {
  return <h2 className={`text-xl font-semibold text-brand-dark ${className || ''}`}>{children}</h2>;
};

// A descrição
export const DialogDescription = ({ className, children }) => {
  return <p className={`text-sm text-gray-500 ${className || ''}`}>{children}</p>;
};