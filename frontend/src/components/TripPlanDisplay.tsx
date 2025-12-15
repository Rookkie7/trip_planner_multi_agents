import React from 'react';
import { MapPin, Calendar, DollarSign, Lightbulb, Download } from 'lucide-react';
import type { TripPlan } from '../types';
import DayPlanCard from './DayPlanCard';

interface TripPlanDisplayProps {
  plan: TripPlan;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ plan }) => {
  const handleExport = () => {
    const text = generatePlanText(plan);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.city}旅行计划_${plan.start_date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePlanText = (plan: TripPlan): string => {
    let text = `${plan.city}旅行计划\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `日期：${plan.start_date} 至 ${plan.end_date}\n`;
    text += `天数：${plan.days.length}天\n\n`;

    if (plan.budget) {
      text += `预算总计：${plan.budget.total}元\n`;
      text += `- 景点门票：${plan.budget.total_attractions}元\n`;
      text += `- 酒店住宿：${plan.budget.total_hotels}元\n`;
      text += `- 餐饮费用：${plan.budget.total_meals}元\n`;
      text += `- 交通费用：${plan.budget.total_transportation}元\n\n`;
    }

    plan.days.forEach((day, index) => {
      text += `\n${'='.repeat(50)}\n`;
      text += `第${index + 1}天 - ${day.date}\n`;
      text += `${'='.repeat(50)}\n\n`;
      text += `${day.description}\n\n`;

      if (day.hotel) {
        text += `住宿：${day.hotel.name}\n`;
        text += `地址：${day.hotel.address}\n\n`;
      }

      if (day.attractions.length > 0) {
        text += `景点游览：\n`;
        day.attractions.forEach((attr, i) => {
          text += `${i + 1}. ${attr.name}\n`;
          text += `   地址：${attr.address}\n`;
          text += `   游览时长：${attr.visit_duration}分钟\n`;
          if (attr.ticket_price) {
            text += `   门票：${attr.ticket_price}元\n`;
          }
          text += `   ${attr.description}\n\n`;
        });
      }

      if (day.meals.length > 0) {
        text += `餐饮推荐：\n`;
        day.meals.forEach((meal) => {
          const typeMap: any = {
            breakfast: '早餐',
            lunch: '午餐',
            dinner: '晚餐',
            snack: '小吃',
          };
          text += `- ${typeMap[meal.type] || meal.type}：${meal.name}`;
          if (meal.estimated_cost) {
            text += ` (约${meal.estimated_cost}元)`;
          }
          text += `\n`;
        });
        text += `\n`;
      }
    });

    if (plan.overall_suggestions) {
      text += `\n${'='.repeat(50)}\n`;
      text += `旅行建议\n`;
      text += `${'='.repeat(50)}\n\n`;
      text += `${plan.overall_suggestions}\n`;
    }

    return text;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-8 h-8" />
              <h1 className="text-4xl font-bold">{plan.city}旅行计划</h1>
            </div>
            <div className="flex items-center gap-2 text-primary-100">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">
                {plan.start_date} 至 {plan.end_date} ({plan.days.length}天)
              </span>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>导出计划</span>
          </button>
        </div>

        {plan.budget && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-semibold">预算概览</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-primary-100 text-sm mb-1">景点门票</p>
                <p className="text-2xl font-bold">{plan.budget.total_attractions}元</p>
              </div>
              <div>
                <p className="text-primary-100 text-sm mb-1">酒店住宿</p>
                <p className="text-2xl font-bold">{plan.budget.total_hotels}元</p>
              </div>
              <div>
                <p className="text-primary-100 text-sm mb-1">餐饮费用</p>
                <p className="text-2xl font-bold">{plan.budget.total_meals}元</p>
              </div>
              <div>
                <p className="text-primary-100 text-sm mb-1">交通费用</p>
                <p className="text-2xl font-bold">{plan.budget.total_transportation}元</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-primary-100 text-sm mb-1">总计</p>
                <p className="text-3xl font-bold">{plan.budget.total}元</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {plan.days.map((day, index) => {
          const weather = plan.weather_info.find((w) => w.date === day.date);
          return (
            <div key={index} className="scroll-mt-8" id={`day-${index + 1}`}>
              <DayPlanCard day={day} weather={weather} />
            </div>
          );
        })}
      </div>

      {plan.overall_suggestions && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">旅行建议</h3>
              <p className="text-amber-800 leading-relaxed whitespace-pre-line">
                {plan.overall_suggestions}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-secondary"
        >
          返回顶部
        </button>
      </div>
    </div>
  );
};

export default TripPlanDisplay;
