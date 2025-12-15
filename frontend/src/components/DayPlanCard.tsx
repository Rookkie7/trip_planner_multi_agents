import React from 'react';
import { Calendar, Car, MapPin } from 'lucide-react';
import type { DayPlan } from '../types';
import AttractionCard from './AttractionCard';
import MealCard from './MealCard';
import HotelCard from './HotelCard';
import WeatherInfo from './WeatherInfo';

interface DayPlanCardProps {
  day: DayPlan;
  weather?: any;
}

const DayPlanCard: React.FC<DayPlanCardProps> = ({ day, weather }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                第 {day.day_index + 1} 天
              </h2>
            </div>
            <p className="text-gray-600">
              {new Date(day.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Car className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{day.transportation}</span>
          </div>
        </div>

        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{day.description}</p>
      </div>

      {weather && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            天气预报
          </h3>
          <WeatherInfo weather={weather} />
        </div>
      )}

      {day.hotel && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            推荐住宿
          </h3>
          <HotelCard hotel={day.hotel} />
        </div>
      )}

      {day.attractions && day.attractions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            景点游览 ({day.attractions.length}个)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {day.attractions.map((attraction, index) => (
              <AttractionCard key={index} attraction={attraction} />
            ))}
          </div>
        </div>
      )}

      {day.meals && day.meals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            餐饮推荐
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {day.meals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayPlanCard;
