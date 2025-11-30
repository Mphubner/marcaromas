import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

// Meu serviço
import { scentProfileService } from "../services/scentProfileService";

const questions = [
  {
    id: "aroma_preference",
    title: "Qual o aroma que você mais gosta?",
    options: ["Floral", "Fresco", "Fumegante", "Aromatico", "Outro"],
  },
  {
    id: "intensity",
    title: "Qual a intensidade do aroma que você mais gosta?",
    options: ["Fraco", "Médio", "Intenso", "Extremo"],
  },
  {
    id: "moment",
    title: "Em que momento você mais gosta de usar o aroma?",
    options: ["Em casa", "No trabalho", "Em eventos", "Outro"],
  },
];

export default function AromaQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const updateProfileMutation = useMutation({
    mutationFn: scentProfileService.updateMyProfile,
    onSuccess: () => {
      if (onComplete) onComplete();
    },
  });

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Transforma as respostas no formato do ScentProfile
      const profileData = {
        aroma_families: [answers.aroma_preference],
        intensity_preference: answers.intensity,
        occasions: [answers.moment],
        // ...
      };
      updateProfileMutation.mutate(profileData);
    }
  };

  return (
    <div>
      {/* UI do Quiz */}
    </div>
  );
}