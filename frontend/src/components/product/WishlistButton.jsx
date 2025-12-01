import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Wishlist Toggle Button
 * Shows filled/unfilled heart and handles add/remove
 */
export function WishlistButton({ productId, className, size = 'default' }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        isInWishlist,
        getWishlistItem,
        addToWishlist,
        removeFromWishlist,
        isAdding,
        isRemoving,
    } = useWishlist();

    const inWishlist = isInWishlist(productId);
    const wishlistItem = getWishlistItem(productId);
    const isLoading = isAdding || isRemoving;

    const sizeClasses = {
        sm: 'w-8 h-8',
        default: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        default: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate(`/login?redirect=/produto/${productId}`);
            return;
        }

        if (inWishlist) {
            removeFromWishlist(wishlistItem.id);
        } else {
            addToWishlist({ productId });
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
                'flex items-center justify-center rounded-full transition-all duration-300',
                'bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClasses[size],
                className
            )}
            aria-label={inWishlist ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
        >
            <Heart
                className={cn(
                    'transition-all duration-300',
                    iconSizes[size],
                    inWishlist
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                )}
            />
        </motion.button>
    );
}
