import api from '../lib/api';

export const wishlistService = {
    /**
     * Get user's wishlist
     */
    getMyWishlist: async () => {
        const { data } = await api.get('/wishlist/my-wishlist');
        return data;
    },

    /**
     * Add product to wishlist
     */
    addToWishlist: async (productId, options = {}) => {
        const { notifyOnSale = true, notifyOnStock = true } = options;
        const { data } = await api.post('/wishlist/add', {
            productId,
            notifyOnSale,
            notifyOnStock,
        });
        return data;
    },

    /**
     * Remove from wishlist
     */
    removeFromWishlist: async (wishlistId) => {
        const { data } = await api.delete(`/wishlist/${wishlistId}`);
        return data;
    },

    /**
     * Toggle notification settings
     */
    toggleNotification: async (wishlistId, type, enabled) => {
        const { data } = await api.patch(`/wishlist/${wishlistId}/notifications`, {
            type, // 'sale' or 'stock'
            enabled,
        });
        return data;
    },

    /**
     * Check if product is in wishlist
     */
    checkInWishlist: async (productId) => {
        const { data } = await api.get(`/wishlist/check/${productId}`);
        return data;
    },

    /**
     * Get shareable link
     */
    getShareLink: async () => {
        const { data } = await api.get('/wishlist/share');
        return data;
    },

    /**
     * Get shared wishlist (public)
     */
    getSharedWishlist: async (shareCode) => {
        const { data } = await api.get(`/wishlist/shared/${shareCode}`);
        return data;
    },
};
