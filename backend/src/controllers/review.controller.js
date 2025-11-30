import { prisma } from '../lib/prisma.js';

// (Admin) Listar todas as reviews com filtros
export const getAllReviews = async (req, res, next) => {
  try {
    const { search, status, rating, reported, productId } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { userEmail: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'approved') {
      where.is_approved = true;
    } else if (status === 'pending') {
      where.is_approved = false;
    }

    if (rating) {
      where.rating = parseInt(rating);
    }

    if (reported === 'true') {
      where.reported = true;
    }

    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// (Admin) Obter estatísticas de reviews
export const getReviewStats = async (req, res, next) => {
  try {
    const totalReviews = await prisma.review.count();
    const pendingReviews = await prisma.review.count({
      where: { is_approved: false, reported: false },
    });
    const reportedReviews = await prisma.review.count({
      where: { reported: true },
    });

    const reviews = await prisma.review.findMany({
      select: { rating: true },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      totalReviews,
      pendingReviews,
      reportedReviews,
      avgRating: parseFloat(avgRating.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

// (Público) Buscar reviews aprovadas (geral ou por produto)
export const getApprovedReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const where = { is_approved: true, reported: false };

    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: productId ? undefined : 6, // Limit to 6 for homepage
    });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// (Admin) Aprovar uma review
export const approveReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { is_approved: true },
    });
    res.json(review);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Review não encontrada' });
    }
    next(error);
  }
};

// (Admin) Responder a uma review
export const respondToReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { adminResponse, respondedBy } = req.body;

    if (!adminResponse) {
      return res.status(400).json({ message: 'Resposta é obrigatória' });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        adminResponse,
        respondedBy: respondedBy || 'admin',
        respondedAt: new Date(),
      },
    });

    res.json(review);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Review não encontrada' });
    }
    next(error);
  }
};

// (Admin) Marcar review como reportada
export const reportReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reportReason } = req.body;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        reported: true,
        reportReason,
        reportedAt: new Date(),
      },
    });

    res.json(review);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Review não encontrada' });
    }
    next(error);
  }
};

// (Admin) Aprovar múltiplas reviews
export const bulkApprove = async (req, res, next) => {
  try {
    const { reviewIds } = req.body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({ error: 'Nenhuma review fornecida' });
    }

    await prisma.review.updateMany({
      where: { id: { in: reviewIds } },
      data: { is_approved: true },
    });

    res.json({ approved: reviewIds.length });
  } catch (error) {
    next(error);
  }
};

// (Admin) Rejeitar/deletar múltiplas reviews
export const bulkReject = async (req, res, next) => {
  try {
    const { reviewIds } = req.body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({ error: 'Nenhuma review fornecida' });
    }

    await prisma.review.deleteMany({
      where: { id: { in: reviewIds } },
    });

    res.json({ deleted: reviewIds.length });
  } catch (error) {
    next(error);
  }
};

// (Admin) Deletar uma review
export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    await prisma.review.delete({
      where: { id: reviewId },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Review não encontrada' });
    }
    next(error);
  }
};
