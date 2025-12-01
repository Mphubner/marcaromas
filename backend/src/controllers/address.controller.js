import { prisma } from '../lib/prisma.js';

// Get all addresses for logged user
export const getMyAddresses = async (req, res, next) => {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: req.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.json(addresses);
    } catch (error) {
        next(error);
    }
};

// Get single address by ID (user must own it)
export const getAddressById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const address = await prisma.address.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }

        res.json(address);
    } catch (error) {
        next(error);
    }
};

// Create new address
export const createAddress = async (req, res, next) => {
    try {
        const { label, zipCode, street, number, complement, neighborhood, city, state, country, isDefault } = req.body;

        // If this is set as default, unset all other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: req.user.id },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: req.user.id,
                label,
                zipCode,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                country: country || 'Brasil',
                isDefault: isDefault || false
            }
        });

        res.status(201).json(address);
    } catch (error) {
        next(error);
    }
};

// Update address
export const updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { label, zipCode, street, number, complement, neighborhood, city, state, country, isDefault } = req.body;

        // Check if address belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if (!existingAddress) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }

        // If setting as default, unset all others
        if (isDefault && !existingAddress.isDefault) {
            await prisma.address.updateMany({
                where: { userId: req.user.id },
                data: { isDefault: false }
            });
        }

        const updatedAddress = await prisma.address.update({
            where: { id: parseInt(id) },
            data: {
                label,
                zipCode,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                country,
                isDefault
            }
        });

        res.json(updatedAddress);
    } catch (error) {
        next(error);
    }
};

// Delete address
export const deleteAddress = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if address belongs to user
        const address = await prisma.address.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }

        await prisma.address.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Endereço removido com sucesso' });
    } catch (error) {
        next(error);
    }
};

// Set address as default
export const setDefaultAddress = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if address belongs to user
        const address = await prisma.address.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }

        // Unset all defaults
        await prisma.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false }
        });

        // Set this one as default
        const updatedAddress = await prisma.address.update({
            where: { id: parseInt(id) },
            data: { isDefault: true }
        });

        res.json(updatedAddress);
    } catch (error) {
        next(error);
    }
};
