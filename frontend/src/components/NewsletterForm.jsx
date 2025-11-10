// src/components/NewsletterForm.jsx
import React from "react";
import { Button } from "./ui/button";

export default function NewsletterForm() {
  return (
    <div className="p-4 bg-brand-light-alt rounded-lg border border-gray-100">
      <label className="block text-sm font-semibold text-brand-dark mb-2">Assine nossa newsletter</label>
      <input
        type="email"
        placeholder="Seu melhor email"
        className="w-full p-2 rounded border border-gray-200 bg-white text-brand-dark placeholder:opacity-60"
        aria-label="Email"
      />
      <Button className="w-full mt-3" variant="default">
        Inscrever
      </Button>
      <p className="mt-2 text-xs text-gray-500">Em breve novidades e descontos exclusivos.</p>
    </div>
  );
}
