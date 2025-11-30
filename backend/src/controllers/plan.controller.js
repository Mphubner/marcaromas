import { prisma } from '../lib/prisma.js';

export const getAllPlans = async (req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { is_active: true },
      orderBy: { price: 'asc' },
    });
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

// Admin: listar todos (inclui inativos)
export const getAllPlansAdmin = async (req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const newPlan = await prisma.plan.create({ data: payload });
    res.status(201).json(newPlan);
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.plan.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.plan.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Toggle plan active status (pause/activate)
export const togglePlanStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const updated = await prisma.plan.update({
      where: { id },
      data: { is_active: !plan.is_active }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

