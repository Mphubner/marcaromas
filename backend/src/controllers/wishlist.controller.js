import { prisma } from '../lib/prisma.js';

/**
 * Get user's wishlist with product details
 */
export const getMyWishlist = async (req, res, next) => {
    try {
        const user = req.user;

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: user.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        compare_at_price: true,
                        images: true,
                        stock_quantity: true,
                        is_available: true,
                        short_description: true,
                        category: true,
                    },
                },
            },
            orderBy: { addedAt: 'desc' },
        });

        // Format response
        const formattedWishlist = wishlist.map(item => ({
            id: item.id,
            product: {
                ...item.product,
                inStock: item.product.stock_quantity > 0 && item.product.is_available,
            },
            addedAt: item.addedAt,
            notifyOnSale: item.notifyOnSale,
            notifyOnStock: item.notifyOnStock,
        }));

        res.json(formattedWishlist);
    } catch (error) {
        next(error);
    }
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId, notifyOnSale = true, notifyOnStock = true } = req.body;

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already in wishlist
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (existing) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add to wishlist
        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: user.id,
                productId,
                notifyOnSale,
                notifyOnStock,
            },
            include: {
                product: true,
            },
        });

        res.status(201).json({
            message: 'Product added to wishlist',
            wishlistItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        // Check if wishlist item exists and belongs to user
        const wishlistItem = await prisma.wishlist.findUnique({
            where: { id },
        });

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        if (wishlistItem.userId !== user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Remove from wishlist
        await prisma.wishlist.delete({
            where: { id },
        });

        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle notification settings for a wishlist item
 */
export const toggleNotification = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { type, enabled } = req.body; // type: 'sale' or 'stock', enabled: boolean

        // Check if wishlist item exists and belongs to user
        const wishlistItem = await prisma.wishlist.findUnique({
            where: { id },
        });

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        if (wishlistItem.userId !== user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update notification setting
        const updateData = {};
        if (type === 'sale') {
            updateData.notifyOnSale = enabled;
        } else if (type === 'stock') {
            updateData.notifyOnStock = enabled;
        } else {
            return res.status(400).json({ message: 'Invalid notification type' });
        }

        const updated = await prisma.wishlist.update({
            where: { id },
            data: updateData,
        });

        res.json({
            message: 'Notification settings updated',
            wishlistItem: updated,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Check if a product is in user's wishlist
 */
export const checkProductInWishlist = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId } = req.params;

        const wishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        res.json({
            inWishlist: !!wishlistItem,
            wishlistItemId: wishlistItem?.id || null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get shareable wishlist link
 */
export const getShareableLink = async (req, res, next) => {
    try {
        const user = req.user;

        // Generate a share code based on user ID (you can use a hash or encode it)
        const shareCode = Buffer.from(`user-${user.id}`).toString('base64url');

        const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/wishlist/shared/${shareCode}`;

        res.json({
            shareCode,
            shareUrl,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get public shared wishlist
 */
export const getSharedWishlist = async (req, res, next) => {
    try {
        const { shareCode } = req.params;

        // Decode share code to get user ID
        const decoded = Buffer.from(shareCode, 'base64url').toString();
        const userId = parseInt(decoded.replace('user-', ''));

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid share code' });
        }

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get wishlist
        const wishlist = await prisma.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        compare_at_price: true,
                        images: true,
                        stock_quantity: true,
                        is_available: true,
                        short_description: true,
                        category: true,
                    },
                },
            },
            orderBy: { addedAt: 'desc' },
        });

        res.json({
            user: {
                name: user.name,
            },
            items: wishlist.map(item => ({
                product: {
                    ...item.product,
                    inStock: item.product.stock_quantity > 0 && item.product.is_available,
                },
                addedAt: item.addedAt,
            })),
        });
    } catch (error) {
        next(error);
    }
};
