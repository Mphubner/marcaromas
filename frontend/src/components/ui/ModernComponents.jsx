import React from 'react';

/**
 * Modern Loading Spinner Component
 * Uses smooth animations and glassmorphism
 */
export const LoadingSpinner = ({ size = 'default', className = '' }) => {
    const sizes = {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return (
        <div className={`inline-block ${sizes[size]} ${className}`}>
            <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );
};

/**
 * Skeleton Loading Component
 * For content placeholders
 */
export const Skeleton = ({ className = '', variant = 'line' }) => {
    const variants = {
        line: 'skeleton-line',
        circle: 'skeleton-circle',
        rect: 'skeleton',
    };

    return <div className={`${variants[variant]} ${className}`} />;
};

/**
 * Premium Card Component with Glass Effect
 */
export const Card = ({ children, className = '', variant = 'default', hover = true }) => {
    const variants = {
        default: 'card-premium',
        glass: 'card-glass',
    };

    const hoverClass = hover ? 'hover-lift' : '';

    return (
        <div className={`${variants[variant]} ${hoverClass} ${className}`}>
            {children}
        </div>
    );
};

/**
 * Premium Button Component
 */
export const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
    };

    const sizes = {
        small: 'px-4 py-2 text-xs',
        default: 'px-6 py-3 text-sm',
        large: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={`${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

/**
 * Modern Input Component
 */
export const Input = React.forwardRef(({
    className = '',
    type = 'text',
    error = false,
    ...props
}, ref) => {
    const errorClass = error ? 'border-destructive focus:ring-destructive' : '';

    return (
        <input
            type={type}
            ref={ref}
            className={`input-modern ${errorClass} ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-2 border-primary text-primary bg-transparent',
        success: 'bg-emerald text-white',
        warning: 'bg-amber text-white',
        danger: 'bg-destructive text-destructive-foreground',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-smooth ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

/**
 * Modern Alert Component
 */
export const Alert = ({ children, variant = 'info', className = '' }) => {
    const variants = {
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
        success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
        warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
        danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    };

    return (
        <div className={`p-4 rounded-lg border animate-slide-down ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

/**
 * Modern Hero Section Component
 */
export const HeroSection = ({
    title,
    subtitle,
    cta,
    backgroundImage,
    className = ''
}) => {
    return (
        <section className={`relative min-h-[600px] flex items-center justify-center overflow-hidden ${className}`}>
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 gradient-radial-warm opacity-30" />

            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Glassmorphism content container */}
            <div className="relative z-10 glass-strong rounded-2xl p-12 max-w-4xl mx-4 animate-scale-in">
                <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 text-gradient-warm">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                        {subtitle}
                    </p>
                )}

                {cta && (
                    <div className="flex gap-4">
                        {cta}
                    </div>
                )}
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </section>
    );
};

/**
 * Modern Product Card Component
 */
export const ProductCard = ({
    image,
    title,
    price,
    originalPrice,
    badge,
    onAddToCart,
    onViewDetails,
    className = ''
}) => {
    return (
        <div className={`card-premium group cursor-pointer ${className}`}>
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {badge && (
                    <div className="absolute top-3 left-3">
                        <Badge variant={badge.variant}>{badge.text}</Badge>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="small" onClick={onViewDetails}>
                        Ver Detalhes
                    </Button>
                    <Button size="small" variant="secondary" onClick={onAddToCart}>
                        Adicionar
                    </Button>
                </div>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>

            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                    R$ {price.toFixed(2)}
                </span>

                {originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                        R$ {originalPrice.toFixed(2)}
                    </span>
                )}
            </div>
        </div>
    );
};

/**
 * Toast Notification Component
 */
export const Toast = ({ message, type = 'info', onClose, className = '' }) => {
    const types = {
        success: 'bg-emerald text-white',
        error: 'bg-destructive text-destructive-foreground',
        warning: 'bg-amber text-white',
        info: 'bg-primary text-primary-foreground',
    };

    return (
        <div className={`glass-strong ${types[type]} px-6 py-4 rounded-lg shadow-strong flex items-center gap-4 animate-slide-in-right ${className}`}>
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="text-current hover:opacity-70 transition-opacity"
                aria-label="Close"
            >
                ✕
            </button>
        </div>
    );
};

export default {
    LoadingSpinner,
    Skeleton,
    Card,
    Button,
    Input,
    Badge,
    Alert,
    HeroSection,
    ProductCard,
    Toast,
};
