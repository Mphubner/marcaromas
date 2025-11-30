import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Mail, Gift, Users, CheckCircle } from "lucide-react";

// Meus serviços e contexto
import { referralService } from "../services/referralService";
import { useAuth } from "../context/AuthContext";

export default function ReferralProgram() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: referrals = [] } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: referralService.getMyReferrals,
    enabled: !!user,
  });

  const referralLink = user ? `${window.location.origin}/?ref=${user.id}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-gradient-to-br from-[#8B7355] to-[#D4A574] text-white">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-2">Indique e Ganhe</h2>
          <p className="text-white/90">Para cada amigo que assinar, você ganha R$ 30 em créditos!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Compartilhe seu Link</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly />
            <Button onClick={handleCopy} variant="outline">
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {referrals.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Suas Indicações</CardTitle></CardHeader>
          <CardContent>
            {referrals.map(r => (
              <div key={r.id} className="flex justify-between items-center p-2 border-b">
                <p>{r.referred_email || "Pendente"}</p>
                <Badge>{r.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
