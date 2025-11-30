import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CustomerExportModal({ open, onClose, customers }) {
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    // Simulate export
    setTimeout(() => {
      setExporting(false);
      alert("Segmento exportado!");
      onClose();
    }, 1000);
  };
  return (
    <Dialog open={open} onClose={onClose} title="Exportar Segmento">
      <div className="mb-4">Exportar {customers?.length || 0} clientes do segmento selecionado.</div>
      <Button onClick={handleExport} disabled={exporting}>{exporting ? "Exportando..." : "Exportar"}</Button>
    </Dialog>
  );
}
