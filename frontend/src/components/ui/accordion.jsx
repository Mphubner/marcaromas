import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Stub simples para Accordion (sem Radix, por enquanto)
// Nota: 'type="single" collapsible' são ignorados neste stub
export const Accordion = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export const AccordionItem = ({ children, value, className = '' }) => {
  // Este stub não é 'collapsible', então todos começam abertos
  // Uma implementação real precisaria de Contexto para ser 'single'
  const [isOpen, setIsOpen] = useState(false);
  
  // Passamos o estado 'isOpen' e a função 'setIsOpen' para os filhos
  return (
    <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger = ({ children, isOpen, setIsOpen, className = '' }) => (
  <button 
    className={`flex justify-between items-center w-full p-6 font-semibold text-left text-brand-dark hover:no-underline ${className}`}
    onClick={() => setIsOpen(!isOpen)}
  >
    {children}
    <ChevronDown 
      className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
    />
  </button>
);

export const AccordionContent = ({ children, isOpen, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div className={`px-6 pb-6 text-gray-600 leading-relaxed ${className}`}>
      {children}
    </div>
  );
};