import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card.jsx';
import StarRating from './ui/starRating.jsx';
import { User } from 'lucide-react';

/**
 * ReviewCard - Componente para exibição de reviews/avaliações de clientes
 * Mostra estrelas, comentário e nome do autor em um card elegante
 * @component
 * @example
 * <ReviewCard 
 *   review={{ rating: 5, title: "Ótimo produto!", comment: "Adorei!", user_email: "client@example.com" }} 
 *   index={0} 
 * />
 */
const ReviewCard = ({ review, index = 0 }) => {
  const initials = review.user_email
    ? review.user_email.split('@')[0].slice(0, 2).toUpperCase()
    : 'AC';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="border-none shadow-lg h-full hover:shadow-xl transition-shadow">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Rating */}
          <div className="mb-3">
            <StarRating value={review.rating || 0} size="sm" />
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-bold text-brand-dark mb-2 line-clamp-1">
              {review.title}
            </h4>
          )}

          {/* Comment */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-4 flex-grow">
            {review.comment}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate">
                {review.user_email ? review.user_email.split('@')[0] : 'Anônimo'}
              </p>
              {review.user_name && (
                <p className="text-xs text-gray-500 truncate">{review.user_name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;
