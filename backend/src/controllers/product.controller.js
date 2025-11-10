import prisma from "../config/db.js";

export async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    const product = await prisma.product.findFirst({
      where: isNaN(Number(idOrSlug)) ? { slug: idOrSlug } : { id: Number(idOrSlug) },
    });
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const data = req.body;
    const product = await prisma.product.create({ data });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export const getCurrentBox = async (req, res) => {
  try {
    const box = {
      id: "Kit-presente:-Dezembro-2025",
      title: "Edição Dezembro – Intenção & Serenidade",
      description:
        "A box deste mês foi inspirada em momentos de pausa e gratidão. Inclui uma vela artesanal de lavanda e bergamota, um escalda pés e um box de chá e uma mensagem inspiradora.",
      image: "/images/box-novembro.webp",
      items: [
        { name: "Vela Lavanda & Bergamota", weight: "220g" },
        { name: "Escalda Pés", count: "10 varetas" },
        { name: "box de Chá", type: "cartão" },
      ],
    };

    res.json(box);
  } catch (error) {
    console.error("Erro ao carregar box atual:", error);
    res.status(500).json({ message: "Erro ao carregar box atual" });
  }
};
