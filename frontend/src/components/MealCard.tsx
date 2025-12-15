import React from 'react';
import { Utensils, Coffee, Sun, Moon } from 'lucide-react';
import type { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const getIcon = () => {
    switch (meal.type) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sun className="w-5 h-5" />;
      case 'dinner':
        return <Moon className="w-5 h-5" />;
      default:
        return <Utensils className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    const labels = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '小吃',
    };
    return labels[meal.type] || meal.type;
  };

  const getTypeColor = () => {
    const colors = {
      breakfast: 'bg-amber-100 text-amber-700',
      lunch: 'bg-green-100 text-green-700',
      dinner: 'bg-blue-100 text-blue-700',
      snack: 'bg-pink-100 text-pink-700',
    };
    return colors[meal.type] || 'bg-gray-100 text-gray-700';
  };

  const imageUrl = meal.photos && meal.photos.length > 0
    ? meal.photos[0]
    : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';

  return (
    <div className="card overflow-hidden">
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';
          }}
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 ${getTypeColor()} backdrop-blur-sm text-xs font-medium rounded-full flex items-center gap-1`}
        >
          {getIcon()}
          {getTypeLabel()}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h4 className="font-medium text-gray-900">{meal.name}</h4>

        {meal.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{meal.description}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {meal.address && (
            <p className="text-xs text-gray-500 line-clamp-1 flex-1">{meal.address}</p>
          )}

          {meal.estimated_cost !== undefined && meal.estimated_cost > 0 && (
            <span className="text-sm font-medium text-accent-600 ml-2">约{meal.estimated_cost}元</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
