import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

// Buscar o perfil do usuário logado
export const getMyProfile = async (req, res, next) => {
  try {
    const { password, ...profile } = req.user;
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// Atualizar o perfil do usuário logado
export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email, password, address, phone, birthdate } = req.body;
    const userId = req.user.id;

    const dataToUpdate = {};

    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (phone) dataToUpdate.phone = phone;
    if (address) dataToUpdate.address = address;
    if (birthdate) dataToUpdate.birthdate = new Date(birthdate);

    if (password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const { password: _, ...profile } = updatedUser;
    res.json(profile);

  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Este email já está em uso.' });
    }
    next(error);
  }
};

// ===== ADMIN ROUTES =====

// (Admin) Listar todos os usuários com filtros e stats
export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const { search, status, isAdmin, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (isAdmin !== undefined) where.isAdmin = isAdmin === 'true';

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        isAdmin: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            orders: true,
            subscriptions: true,
          },
        },
      },
    });

    // Calcular stats agregadas
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderStats = await prisma.order.aggregate({
          where: { userId: user.id, status: { in: ['paid', 'delivered'] } },
          _sum: { total: true },
          _count: true,
        });

        return {
          ...user,
          totalOrders: user._count.orders,
          totalSubscriptions: user._count.subscriptions,
          totalSpent: orderStats._sum.total || 0,
          orderCount: orderStats._count || 0,
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    next(error);
  }
};

// (Admin) Buscar usuário por ID com detalhes completos
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        birthdate: true,
        address: true,
        status: true,
        isAdmin: true,
        createdAt: true,
        lastLoginAt: true,
        total_credits: true,
        googleId: true,
        notes: true,
        _count: {
          select: {
            orders: true,
            subscriptions: true,
            carts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Stats detalhadas
    const orderStats = await prisma.order.aggregate({
      where: { userId: user.id, status: { in: ['paid', 'delivered'] } },
      _sum: { total: true },
      _avg: { total: true },
      _count: true,
    });

    const lastOrder = await prisma.order.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, total: true, status: true },
    });

    const activeSubscriptions = await prisma.subscription.count({
      where: { userId: user.id, status: 'active' },
    });

    res.json({
      ...user,
      stats: {
        totalOrders: orderStats._count || 0,
        totalSpent: orderStats._sum.total || 0,
        avgOrderValue: orderStats._avg.total || 0,
        activeSubscriptions,
        lastOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

// (Admin) Atualizar usuário
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, cpf, birthdate, address, status, isAdmin, notes } = req.body;

    const dataToUpdate = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (cpf !== undefined) dataToUpdate.cpf = cpf;
    if (birthdate !== undefined) dataToUpdate.birthdate = birthdate ? new Date(birthdate) : null;
    if (address !== undefined) dataToUpdate.address = address;
    if (status !== undefined) dataToUpdate.status = status;
    if (isAdmin !== undefined) dataToUpdate.isAdmin = isAdmin;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        birthdate: true,
        address: true,
        status: true,
        isAdmin: true,
        notes: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return res.status(409).json({ message: `Este ${field} já está em uso.` });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    next(error);
  }
};

// (Admin) Deletar/Bloquear usuário
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { soft = true } = req.query;

    if (soft === 'true' || soft === true) {
      // Soft delete - apenas bloquear
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { status: 'blocked' },
      });
      res.json({ message: 'Usuário bloqueado com sucesso' });
    } else {
      // Hard delete
      await prisma.user.delete({
        where: { id: parseInt(userId) },
      });
      res.json({ message: 'Usuário deletado com sucesso' });
    }
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    if (error.code === 'P2003') {
      return res.status(409).json({ message: 'Não é possível deletar usuário com pedidos/assinaturas. Use bloqueio.' });
    }
    next(error);
  }
};

// (Admin) Buscar pedidos do usuário
export const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.order.count({
      where: { userId: parseInt(userId) },
    });

    res.json({ orders, total });
  } catch (error) {
    next(error);
  }
};

// (Admin) Buscar assinaturas do usuário
export const getUserSubscriptions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: parseInt(userId) },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

// Legacy - mantido para compatibilidade
export const getAllUsers = getAllUsersAdmin;
