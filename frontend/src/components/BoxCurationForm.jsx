import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminService } from "../services/adminService"; // Supondo que o adminService será atualizado

export default function BoxCurationForm({ box, onSuccess }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(box || {
    month: "",
    theme: "",
    is_published: false,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (box) {
        return adminService.updateBox(box.id, data);
      }
      return adminService.createBox(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-boxes"]);
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Mês (Ex: Dezembro 2025)" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
      <Input placeholder="Tema da Box" value={formData.theme} onChange={(e) => setFormData({ ...formData, theme: e.target.value })} />
      <div className="flex items-center gap-2">
        <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
        <Label>Publicado</Label>
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
}
