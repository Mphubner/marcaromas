import * as ReviewService from "../services/review.service.js";

export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = [
      {
        id: 1,
        name: "Ana Paula",
        rating: 5,
        comment: "As velas são maravilhosas! O aroma fica na casa inteira.",
        date: "2025-10-15",
      },
      {
        id: 2,
        name: "Marina Souza",
        rating: 4,
        comment: "Entrega rápida e produtos lindos, recomendo!",
        date: "2025-09-02",
      },
      {
        id: 3,
        name: "Lucas Ferreira",
        rating: 5,
        comment: "O box de assinatura é sensacional, vem tudo muito bem embalado.",
        date: "2025-08-10",
      },
    ];

    res.json(reviews);
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
    res.status(500).json({ message: "Erro ao carregar avaliações" });
  }
};
