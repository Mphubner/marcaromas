import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Send } from "lucide-react";
import Button from "./ui/button";
import Input from "./ui/input";
import Textarea from "./ui/textarea";
import { API_URL } from "../utils/api";

export default function GiftSubscriptionForm() {
  const [form, setForm] = useState({
    sender: "",
    recipient: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/gifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {
      alert("Erro ao enviar o presente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Gift className="text-brand-primary" /> Envie um presente aromático 🎁
      </h3>

      <Input
        label="Seu nome"
        name="sender"
        value={form.sender}
        onChange={handleChange}
        required
      />
      <Input
        label="Nome do presenteado"
        name="recipient"
        value={form.recipient}
        onChange={handleChange}
        required
      />
      <Textarea
        label="Mensagem"
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Escreva uma mensagem personalizada..."
        rows={3}
      />

      <Button
        type="submit"
        variant="default"
        className="mt-3 w-full"
        disabled={loading}
      >
        {loading ? "Enviando..." : <><Send size={16} /> Enviar Presente</>}
      </Button>

      {sent && (
        <motion.p
          className="mt-3 text-sm text-green-600 dark:text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Presente enviado com sucesso! 🌿
        </motion.p>
      )}
    </motion.form>
  );
}
