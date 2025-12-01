import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch wishlist
    const { data: wishlistItems = [] } = useQuery({
        queryKey: ['wishlist'],
        queryFn: wishlistService.getMyWishlist,
        enabled: !!user,
    });

    // Add to wishlist
    const addMutation = useMutation({
        mutationFn: ({ productId, options }) => wishlistService.addToWishlist(productId, options),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
            toast.success('Adicionado à lista de desejos!');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erro ao adicionar';
            toast.error(message);
        },
    });

    // Remove from wishlist
    const removeMutation = useMutation({
        mutationFn: (wishlistId) => wishlistService.removeFromWishlist(wishlistId),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
            toast.success('Removido da lista de desejos');
        },
        onError: () => {
            toast.error('Erro ao remover');
        },
    });

    // Toggle notification
    const toggleNotificationMutation = useMutation({
        mutationFn: ({ wishlistId, type, enabled }) =>
            wishlistService.toggleNotification(wishlistId, type, enabled),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
        },
    });

    // Helper to check if product is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product.id === productId);
    };

    // Helper to get wishlist item for a product
    const getWishlistItem = (productId) => {
        return wishlistItems.find(item => item.product.id === productId);
    };

    const value = {
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist: addMutation.mutate,
        removeFromWishlist: removeMutation.mutate,
        toggleNotification: toggleNotificationMutation.mutate,
        isInWishlist,
        getWishlistItem,
        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}
