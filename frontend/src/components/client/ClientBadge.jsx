import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

/**
 * Premium Badge Component for Status Indicators
 * Variants: success, warning, error, info, pending
 */
export function ClientBadge({
    children,
    variant = 'default',
    className,
    ...props
}) {
    const variants = {
        success: "bg-green-100 text-green-700 border-green-200",
        warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
        error: "bg-red-100 text-red-700 border-red-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
        pending: "bg-gray-100 text-gray-700 border-gray-200",
        active: "bg-gradient-to-r from-[#8B7355] to-[#7A6548] text-white border-none",
        default: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
        <Badge
            className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold border shadow-sm",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </Badge>
    );
}

/**
 * Status Badge Mapping Helper
 */
export function getStatusBadge(status) {
    const statusMap = {
        // Orders
        'CONFIRMED': { variant: 'success', label: 'Confirmado' },
        'PENDING_PAYMENT': { variant: 'warning', label: 'Pagamento Pendente' },
        'PAID': { variant: 'success', label: 'Pago' },
        'SHIPPED': { variant: 'info', label: 'Enviado' },
        'DELIVERED': { variant: 'success', label: 'Entregue' },
        'CANCELLED': { variant: 'error', label: 'Cancelado' },

        // Subscriptions
        'ACTIVE': { variant: 'active', label: 'Ativa' },
        'PAUSED': { variant: 'warning', label: 'Pausada' },
        'CANCELED': { variant: 'error', label: 'Cancelada' },
        'EXPIRED': { variant: 'error', label: 'Expirada' },

        // Default
        'default': { variant: 'default', label: status }
    };

    return statusMap[status] || statusMap['default'];
}
