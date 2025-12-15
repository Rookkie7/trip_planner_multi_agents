import React from 'react';
import { Cloud, Sun, Wind } from 'lucide-react';
import type { WeatherInfo as WeatherInfoType } from '../types';

interface WeatherInfoProps {
  weather: WeatherInfoType;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {new Date(weather.date).toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
                <Sun className="w-3 h-3" />
                <span>白天</span>
              </div>
              <p className="text-sm text-blue-900">{weather.day_weather}</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {weather.day_temp}°
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
                <Cloud className="w-3 h-3" />
                <span>夜间</span>
              </div>
              <p className="text-sm text-blue-900">{weather.night_weather}</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {weather.night_temp}°
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-blue-700">
            <Wind className="w-3 h-3" />
            <span>风力</span>
          </div>
          <p className="text-sm text-blue-900 mt-1">{weather.wind_direction}</p>
          <p className="text-sm text-blue-900">{weather.wind_power}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
