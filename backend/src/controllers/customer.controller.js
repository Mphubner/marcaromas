import { prisma } from '../lib/prisma.js';

// List all customers (admin)
export const getAllCustomersAdmin = async (req, res, next) => {
  try {
    const customers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

// Get customer by ID
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// Create customer (admin/manual)
export const createCustomer = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const newCustomer = await prisma.user.create({ data: payload });
    res.status(201).json(newCustomer);
  } catch (err) {
    next(err);
  }
};

// Update customer
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.user.update({ where: { id: Number(id) }, data: req.body });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete customer
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
