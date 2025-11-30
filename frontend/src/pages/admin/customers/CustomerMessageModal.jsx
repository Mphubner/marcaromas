import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CustomerMessageModal({ open, onClose, customer }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const handleSend = async () => {
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      alert("Mensagem enviada!");
      setMessage("");
      onClose();
    }, 1000);
  };
  return (
    <Dialog open={open} onClose={onClose} title={`Enviar mensagem para ${customer?.name || ''}`}>
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite sua mensagem..." className="w-full border rounded p-2 mb-4" rows={4} />
      <Button onClick={handleSend} disabled={sending || !message}>{sending ? "Enviando..." : "Enviar"}</Button>
    </Dialog>
  );
}
