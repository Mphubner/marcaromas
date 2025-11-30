import React from "react";
import { Dialog } from "@/components/ui/dialog";

export default function CustomerTimelineModal({ open, onClose, customer }) {
  // Dummy timeline data
  const timeline = [
    { date: "2025-11-01", action: "Cadastro", details: "Cliente criado." },
    { date: "2025-11-05", action: "Pedido", details: "Pedido #123 realizado." },
    { date: "2025-11-10", action: "Mensagem", details: "Mensagem enviada ao cliente." },
    { date: "2025-11-15", action: "Segmentação", details: "Cliente adicionado ao segmento VIP." },
  ];
  return (
    <Dialog open={open} onClose={onClose} title={`Timeline de ${customer?.name || ''}`}>
      <div className="space-y-4">
        {timeline.map((item, idx) => (
          <div key={idx} className="border-b pb-2">
            <div className="font-semibold">{item.date} - {item.action}</div>
            <div className="text-sm text-gray-600">{item.details}</div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
