import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Supondo que o adminService tenha um método getSubscriptionById
// import { adminService } from "../services/adminService";

export default function AdminAssinaturaDetalhes() {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();

  // const { data: subscription, isLoading } = useQuery({
  //   queryKey: ["subscription-details", subscriptionId],
  //   queryFn: () => adminService.getSubscriptionById(subscriptionId),
  // });

  // if (isLoading) return <div>Carregando...</div>;
  // if (!subscription) return <div>Assinatura não encontrada.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mb-6">Detalhes da Assinatura</h1>
        <Card>
          <CardHeader><CardTitle>Assinatura #{subscriptionId}</CardTitle></CardHeader>
          <CardContent>
            {/* Detalhes da assinatura aqui */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
