import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const segments = ["VIP", "Novos", "Recorrentes", "Inativos"];

export default function CustomerSegmentModal({ open, onClose, customer }) {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert(`Cliente adicionado ao segmento ${selected}`);
      onClose();
    }, 1000);
  };
  return (
    <Dialog open={open} onClose={onClose} title={`Segmentar ${customer?.name || ''}`}>
      <div className="mb-4">
        <select value={selected} onChange={e => setSelected(e.target.value)} className="border rounded p-2 w-full">
          <option value="">Selecione um segmento</option>
          {segments.map(seg => <option key={seg} value={seg}>{seg}</option>)}
        </select>
      </div>
      <Button onClick={handleSave} disabled={saving || !selected}>{saving ? "Salvando..." : "Salvar"}</Button>
    </Dialog>
  );
}
