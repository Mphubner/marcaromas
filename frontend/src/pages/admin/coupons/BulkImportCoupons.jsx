import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
export default function BulkImportCoupons() {
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const handleImport = async () => {
    setLoading(true);
    try {
      await api.post("/coupons/bulk-import", { codes: codes.split(/\s|,|;/).filter(Boolean) });
      alert("Cupons importados!");
      setCodes("");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <textarea value={codes} onChange={e => setCodes(e.target.value)} placeholder="Cole códigos separados por espaço, vírgula ou enter" className="border rounded px-2 py-1 w-64" />
      <Button onClick={handleImport} disabled={loading}>{loading ? "Importando..." : "Importar"}</Button>
    </div>
  );
}
