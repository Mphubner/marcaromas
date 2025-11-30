import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

// Meus serviços
import { reviewService } from "../services/reviewService"; // Supondo que exista
import { useAuth } from "../context/AuthContext";

export default function ProductReviews({ productId }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => reviewService.getApprovedReviews(productId),
  });

  const createReviewMutation = useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["product-reviews", productId]);
      alert("Avaliação enviada para moderação!");
    },
  });

  const handleSubmit = () => {
    createReviewMutation.mutate({ productId, rating, comment, userEmail: user.email });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Avaliações</CardTitle></CardHeader>
      <CardContent>
        {/* Lista de reviews */}
        {user && (
          <div className="mt-6">
            <h3 className="font-bold">Deixe sua avaliação</h3>
            {/* Formulário de avaliação */}
            <Button onClick={handleSubmit}>Enviar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
