import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Serviço
import { scentProfileService } from "../services/scentProfileService";

const questions = [
  {
    id: "aroma_preference",
    title: "Qual família de aromas você mais aprecia?",
    options: [
      { value: "Floral", label: "Floral", desc: "Delicado e romântico" },
      { value: "Fresco", label: "Fresco", desc: "Leve e revigorante" },
      { value: "Amadeirado", label: "Amadeirado", desc: "Quente e acolhedor" },
      { value: "Cítrico", label: "Cítrico", desc: "Energizante e vibrante" },
    ],
  },
  {
    id: "intensity",
    title: "Qual intensidade você prefere?",
    options: [
      { value: "Suave", label: "Suave", desc: "Discreto e sutil" },
      { value: "Médio", label: "Médio", desc: "Presente mas não marcante" },
      { value: "Intenso", label: "Intenso", desc: "Marcante e duradouro" },
    ],
  },
  {
    id: "moment",
    title: "Em que momento você mais usa velas?",
    options: [
      { value: "Relaxamento", label: "Relaxamento", desc: "Final do dia" },
      { value: "Trabalho", label: "Trabalho/Estudo", desc: "Para focar" },
      { value: "Ocasiões especiais", label: "Ocasiões Especiais", desc: "Jantares, eventos" },
      { value: "Meditação", label: "Meditação", desc: "Práticas espirituais" },
    ],
  },
  {
    id: "mood",
    title: "Que sensação você busca?",
    options: [
      { value: "Calma", label: "Calm a e Tranquilidade" },
      { value: "Energia", label: "Energia e Motivação" },
      { value: "Romance", label: "Romance e Aconchego" },
      { value: "Foco", label: "Foco e Concentração" },
    ],
  },
];

export default function AromaQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const updateProfileMutation = useMutation({
    mutationFn: scentProfileService.updateMyProfile,
    onSuccess: () => {
      toast.success("✨ Perfil aromático salvo com sucesso!");
      if (onComplete) onComplete();
    },
    onError: (error) => {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar perfil. Por favor, tente novamente.");
    },
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Por favor, selecione uma opção");
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar quiz e salvar perfil
      const profileData = {
        aroma_families: [answers.aroma_preference],
        intensity_preference: answers.intensity,
        occasions: [answers.moment],
        mood_preference: answers.mood,
      };
      updateProfileMutation.mutate(profileData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="py-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            Pergunta {currentStep + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium text-[#8B7355]">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-[#2C2419] mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#8B7355]" />
            {currentQuestion.title}
          </h3>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${isSelected
                      ? "border-[#8B7355] bg-[#8B7355]/5"
                      : "border-gray-200 hover:border-[#8B7355]/50"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2C2419]">{option.label}</p>
                      {option.desc && (
                        <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#8B7355] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id] || updateProfileMutation.isPending}
          className="flex items-center gap-2 bg-[#8B7355] hover:bg-[#7A6548]"
        >
          {currentStep === questions.length - 1 ? (
            <>
              {updateProfileMutation.isPending ? "Salvando..." : "Finalizar"}
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Próxima
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}