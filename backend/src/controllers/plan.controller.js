import * as PlanService from "../services/plan.service.js";

export const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 1,
        name: "Essencial",
        price: 89.9,
        description: "1 vela artesanal + mimo surpresa + frete grátis.",
        features: ["100% natural", "Feito à mão", "Entrega mensal"],
      },
      {
        id: 2,
        name: "Premium",
        price: 129.9,
        description: "2 velas + incenso + item extra de bem-estar.",
        features: ["Aromas exclusivos", "Cancelamento flexível", "Brinde mensal"],
      },
      {
        id: 3,
        name: "Luxury",
        price: 189.9,
        description: "3 velas grandes + difusor + presente especial.",
        features: ["Box de luxo", "Curadoria personalizada", "Edição limitada"],
      },
    ];

    res.json(plans);
  } catch (error) {
    console.error("Erro ao carregar planos:", error);
    res.status(500).json({ message: "Erro ao carregar planos de assinatura" });
  }
};
