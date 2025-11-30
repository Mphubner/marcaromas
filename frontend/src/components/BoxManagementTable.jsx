import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { adminService } from "../services/adminService";

export default function BoxManagementTable() {
  const queryClient = useQueryClient();
  const { data: boxes = [] } = useQuery({
    queryKey: ["admin-boxes"],
    queryFn: adminService.getAllBoxes,
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteBox,
    onSuccess: () => queryClient.invalidateQueries(["admin-boxes"]),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th>Mês</th>
            <th>Tema</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {boxes.map((box) => (
            <tr key={box.id}>
              <td>{box.month}</td>
              <td>{box.theme}</td>
              <td>{box.is_published ? "Publicado" : "Rascunho"}</td>
              <td>
                <Button variant="ghost" size="sm">Editar</Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteMutation.mutate(box.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
