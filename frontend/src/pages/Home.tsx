import React, { useState } from 'react';
import { Plane, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tripApi } from '../services/api';
import type { TripRequest } from '../types';
import FormInput from '../components/FormInput';
import NaturalInput from '../components/NaturalInput';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<'form' | 'natural'>('natural');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await tripApi.createPlan(request);

      if (response.success && response.data) {
        navigate('/plan', { state: { plan: response.data } });
      } else {
        setError(response.message || '生成计划失败，请重试');
      }
    } catch (err: any) {
      console.error('生成计划失败:', err);
      setError(err.response?.data?.detail || err.message || '生成计划失败，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleParse = async (userInput: string) => {
    const response = await tripApi.parseRequest(userInput);
    return {
      status: response.status,
      trip_request: response.trip_request,
      missing_fields: response.missing_fields,
      suggestions: response.suggestions,
      partial_data: response.partial_data,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            智能旅行规划助手
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            使用AI技术为您量身定制完美的旅行计划，包含景点推荐、餐饮建议、天气信息和预算规划
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setInputMode('natural')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                inputMode === 'natural'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              自然语言输入
            </button>
            <button
              onClick={() => setInputMode('form')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                inputMode === 'form'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              表单输入
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {inputMode === 'form' ? (
            <FormInput onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <NaturalInput onSubmit={handleSubmit} onParse={handleParse} isLoading={isLoading} />
          )}
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">正在生成旅行计划</h3>
              <p className="text-gray-600">
                AI正在为您规划最佳路线和行程，这可能需要几十秒时间...
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">智能景点推荐</h3>
            <p className="text-gray-600 text-sm">
              基于您的偏好和位置，推荐最合适的景点，包含详细信息和图片
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">详细行程规划</h3>
            <p className="text-gray-600 text-sm">
              每日行程安排合理，包含景点、餐饮、住宿和交通方式
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">预算管理</h3>
            <p className="text-gray-600 text-sm">
              清晰的费用预估，帮助您控制旅行预算，避免超支
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapPin: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Calendar: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const DollarSign: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default Home;
