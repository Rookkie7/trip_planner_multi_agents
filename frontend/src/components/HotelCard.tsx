import React from 'react';
import { Hotel as HotelIcon, MapPin, Star, DollarSign } from 'lucide-react';
import type { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <HotelIcon className="w-6 h-6 text-primary-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
            {hotel.rating && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">{hotel.rating}</span>
              </div>
            )}
          </div>

          {hotel.type && (
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mb-2">
              {hotel.type}
            </span>
          )}

          {hotel.address && (
            <div className="flex items-start gap-1.5 text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <span className="line-clamp-1">{hotel.address}</span>
            </div>
          )}

          {hotel.distance && (
            <p className="text-xs text-gray-500 mb-2">{hotel.distance}</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {hotel.price_range && (
              <span className="text-sm text-gray-600">{hotel.price_range}</span>
            )}
            {hotel.estimated_cost && hotel.estimated_cost > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-primary-600">
                <DollarSign className="w-4 h-4" />
                <span>约{hotel.estimated_cost}元/晚</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
