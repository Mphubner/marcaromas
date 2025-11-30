import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const actions = [
  { label: "Ver Pedidos Pendentes", description: "Filtra e exibe pedidos pendentes para ação rápida." },
  { label: "Pausar Todas Assinaturas", description: "Pausa todas assinaturas e exibe impacto estimado (MRR lost)." },
  { label: "Cobrar Assinaturas Pendentes", description: "Realiza retry de cobrança em lote para assinaturas com falha." },
  { label: "Gerar Etiquetas em Lote", description: "Seleciona pedidos e gera etiquetas para envio." },
  { label: "Enviar E-mail em Massa", description: "Dispara e-mail para segmento selecionado." },
  { label: "Aplicar Cupom a Grupo", description: "Aplica cupom a pedidos selecionados." },
];
export default function QuickActionsDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Ações Rápidas</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {actions.map(a => (
          <Card key={a.label} className="p-4 flex flex-col justify-between">
            <div>
              <div className="font-semibold mb-2">{a.label}</div>
              <div className="text-sm text-gray-600 mb-4">{a.description}</div>
            </div>
            <Button variant="primary">Executar</Button>
          </Card>
        ))}
      </div>
      <Card className="p-4 mb-6">
        <div className="font-semibold mb-2">Histórico de Execução</div>
        <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400">[Tabela de logs/auditoria]</div>
      </Card>
    </div>
  );
}
