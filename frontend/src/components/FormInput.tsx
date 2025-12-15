import React, { useState } from 'react';
import { Calendar, MapPin, Plane, Hotel, Tag, Plus, X } from 'lucide-react';
import type { TripRequest } from '../types';

interface FormInputProps {
  onSubmit: (request: TripRequest) => void;
  isLoading: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TripRequest>({
    city: '',
    start_date: '',
    end_date: '',
    travel_days: 1,
    transportation: '公共交通',
    accommodation: '经济型酒店',
    preferences: [],
    free_text_input: '',
  });

  const [currentPreference, setCurrentPreference] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'travel_days' ? parseInt(value) || 1 : value,
    }));
  };

  const addPreference = () => {
    if (currentPreference.trim() && !formData.preferences.includes(currentPreference.trim())) {
      setFormData((prev) => ({
        ...prev,
        preferences: [...prev.preferences, currentPreference.trim()],
      }));
      setCurrentPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((p) => p !== preference),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const quickPreferences = ['历史文化', '自然风光', '美食', '购物', '休闲', '冒险'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            目的地城市
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="例如：北京"
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            旅行天数
          </label>
          <input
            type="number"
            name="travel_days"
            value={formData.travel_days}
            onChange={handleChange}
            required
            min="1"
            max="30"
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            开始日期
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            结束日期
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Plane className="w-4 h-4" />
            交通方式
          </label>
          <select
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            className="input-field"
          >
            <option value="公共交通">公共交通</option>
            <option value="自驾">自驾</option>
            <option value="包车">包车</option>
            <option value="步行">步行</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Hotel className="w-4 h-4" />
            住宿类型
          </label>
          <select
            name="accommodation"
            value={formData.accommodation}
            onChange={handleChange}
            className="input-field"
          >
            <option value="经济型酒店">经济型酒店</option>
            <option value="舒适型酒店">舒适型酒店</option>
            <option value="高档型酒店">高档型酒店</option>
            <option value="民宿">民宿</option>
            <option value="青旅">青旅</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Tag className="w-4 h-4" />
          旅行偏好
        </label>
        <div className="flex gap-2 mb-3 flex-wrap">
          {quickPreferences.map((pref) => (
            <button
              key={pref}
              type="button"
              onClick={() => {
                if (!formData.preferences.includes(pref)) {
                  setFormData((prev) => ({
                    ...prev,
                    preferences: [...prev.preferences, pref],
                  }));
                }
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              {pref}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentPreference}
            onChange={(e) => setCurrentPreference(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
            placeholder="输入自定义偏好，按回车添加"
            className="input-field"
          />
          <button
            type="button"
            onClick={addPreference}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.preferences.map((pref) => (
            <span
              key={pref}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {pref}
              <button
                type="button"
                onClick={() => removePreference(pref)}
                className="hover:text-primary-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          额外要求（可选）
        </label>
        <textarea
          name="free_text_input"
          value={formData.free_text_input}
          onChange={handleChange}
          rows={3}
          placeholder="例如：希望多安排一些博物馆，避开人多的景点等"
          className="input-field resize-none"
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full">
        {isLoading ? '正在生成计划...' : '生成旅行计划'}
      </button>
    </form>
  );
};

export default FormInput;
