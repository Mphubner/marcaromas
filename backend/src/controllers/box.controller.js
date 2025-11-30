import { prisma } from '../lib/prisma.js';

export const getCurrentBox = async (req, res, next) => {
  try {
    const date = new Date();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonth = monthNames[date.getMonth()];

    // Tenta encontrar a box do mês atual que esteja publicada
    let currentBox = await prisma.box.findFirst({
      where: {
        is_published: true,
        month: { contains: currentMonth }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Se não encontrar, pega a última box publicada (fallback)
    if (!currentBox) {
      currentBox = await prisma.box.findFirst({
        where: { is_published: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!currentBox) {
      return res.status(404).json({ message: 'Nenhuma box publicada encontrada.' });
    }

    res.json(currentBox);
  } catch (error) {
    next(error);
  }
};

// Admin: listar todas as boxes
export const getAllBoxesAdmin = async (req, res, next) => {
  try {
    const boxes = await prisma.box.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(boxes);
  } catch (err) {
    next(err);
  }
};

export const getBoxById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Tenta converter para número, se falhar usa como string (para compatibilidade com UUID ou Int)
    const boxId = isNaN(Number(id)) ? id : Number(id);

    const box = await prisma.box.findUnique({ where: { id: boxId } });
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.json(box);
  } catch (err) {
    next(err);
  }
};

export const createBox = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const box = await prisma.box.create({ data: payload });
    res.status(201).json(box);
  } catch (err) {
    next(err);
  }
};

export const updateBox = async (req, res, next) => {
  try {
    const { id } = req.params;
    const boxId = isNaN(Number(id)) ? id : Number(id);

    const updated = await prisma.box.update({ where: { id: boxId }, data: req.body });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteBox = async (req, res, next) => {
  try {
    const { id } = req.params;
    const boxId = isNaN(Number(id)) ? id : Number(id);

    await prisma.box.delete({ where: { id: boxId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
