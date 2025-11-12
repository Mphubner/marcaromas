import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * StarRating - Componente de UI para exibição e interação com classificação em estrelas
 * @component
 * @example
 * // Apenas exibição
 * <StarRating value={4} size="md" />
 *
 * // Interativo
 * <StarRating value={rating} onChange={setRating} interactive size="lg" />
 */
const StarRating = React.forwardRef(
  (
    {
      value = 0,
      onChange,
      interactive = false,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const handleStarClick = (rating) => {
      if (interactive && onChange) {
        onChange(rating);
      }
    };

    const handleStarHover = (rating) => {
      if (!interactive) return;
      // Aqui você pode adicionar lógica de preview ao passar o mouse
    };

    return (
      <div
        ref={ref}
        className={cn('flex gap-1', className)}
        {...props}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={!interactive}
            className={cn(
              sizeClasses[size],
              'transition-all duration-200',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';

export default StarRating;
