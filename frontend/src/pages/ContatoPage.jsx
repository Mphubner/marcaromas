import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/ui/input";
import Textarea from "../components/ui/textarea";
import Button from "../components/ui/button";
import { API_URL } from "../utils/api";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSent(true);
  }

  return (
    <motion.section className="max-w-xl mx-auto px-4 mt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">Fale Conosco</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Nome" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Textarea label="Mensagem" name="message" value={form.message} onChange={handleChange} required rows={4} />
        <Button type="submit" className="w-full mt-3">
          Enviar
        </Button>
      </form>
      {sent && <p className="text-green-600 mt-3">Mensagem enviada com sucesso!</p>}
    </motion.section>
  );
}
