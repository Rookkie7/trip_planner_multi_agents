import React from 'react';
import { MapPin, Clock, Star, Ticket } from 'lucide-react';
import type { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const imageUrl = attraction.photos && attraction.photos.length > 0
    ? attraction.photos[0]
    : attraction.image_url
    || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';

  return (
    <div className="card overflow-hidden">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={attraction.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
          }}
        />
        {attraction.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
            {attraction.category}
          </span>
        )}
        {attraction.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">{attraction.rating}</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{attraction.name}</h3>

        <p className="text-sm text-gray-600 line-clamp-2">{attraction.description}</p>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-1">{attraction.address}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{attraction.visit_duration}分钟</span>
          </div>

          {attraction.ticket_price !== undefined && attraction.ticket_price > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium text-primary-600">
              <Ticket className="w-4 h-4" />
              <span>{attraction.ticket_price}元</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
