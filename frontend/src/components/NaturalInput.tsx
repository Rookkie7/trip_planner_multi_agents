import React, { useState } from 'react';
import { MessageCircle, Send, AlertCircle, CheckCircle } from 'lucide-react';
import type { TripRequest } from '../types';

interface NaturalInputProps {
  onSubmit: (request: TripRequest) => void;
  onParse: (input: string) => Promise<{
    status: string;
    trip_request?: TripRequest;
    missing_fields?: string[];
    suggestions?: string;
    partial_data?: Partial<TripRequest>;
  }>;
  isLoading: boolean;
}

const NaturalInput: React.FC<NaturalInputProps> = ({ onSubmit, onParse, isLoading }) => {
  const [input, setInput] = useState('');
  const [parseResult, setParseResult] = useState<any>(null);
  const [isParsingLoading, setIsParsingLoading] = useState(false);

  const handleParse = async () => {
    if (!input.trim()) return;

    setIsParsingLoading(true);
    try {
      const result = await onParse(input);
      setParseResult(result);

      if (result.status === 'complete' && result.trip_request) {
        onSubmit(result.trip_request);
      }
    } catch (error) {
      console.error('解析失败:', error);
      setParseResult({
        status: 'error',
        message: '解析失败，请重试',
      });
    } finally {
      setIsParsingLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleParse();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2 items-start">
          <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">用自然语言描述您的旅行计划</p>
            <p className="text-blue-600">
              例如："我想下周去北京玩3天，6月1日到6月3日，喜欢历史文化景点和美食"
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="描述您的旅行计划..."
          rows={4}
          className="input-field pr-12 resize-none"
          disabled={isLoading || isParsingLoading}
        />
        <button
          onClick={handleParse}
          disabled={!input.trim() || isLoading || isParsingLoading}
          className="absolute right-3 bottom-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {parseResult && (
        <div
          className={`rounded-lg p-4 ${
            parseResult.status === 'complete'
              ? 'bg-green-50 border border-green-200'
              : parseResult.status === 'incomplete'
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex gap-2 items-start">
            {parseResult.status === 'complete' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle
                className={`w-5 h-5 mt-0.5 ${
                  parseResult.status === 'incomplete' ? 'text-amber-600' : 'text-red-600'
                }`}
              />
            )}
            <div className="flex-1">
              {parseResult.status === 'complete' && (
                <div className="text-green-800">
                  <p className="font-medium mb-2">信息已完整，正在生成旅行计划...</p>
                  {parseResult.trip_request && (
                    <div className="text-sm space-y-1 bg-white rounded p-3">
                      <p>
                        <span className="font-medium">目的地：</span>
                        {parseResult.trip_request.city}
                      </p>
                      <p>
                        <span className="font-medium">日期：</span>
                        {parseResult.trip_request.start_date} 至{' '}
                        {parseResult.trip_request.end_date}
                      </p>
                      <p>
                        <span className="font-medium">天数：</span>
                        {parseResult.trip_request.travel_days}天
                      </p>
                      <p>
                        <span className="font-medium">交通：</span>
                        {parseResult.trip_request.transportation}
                      </p>
                      <p>
                        <span className="font-medium">住宿：</span>
                        {parseResult.trip_request.accommodation}
                      </p>
                      {parseResult.trip_request.preferences.length > 0 && (
                        <p>
                          <span className="font-medium">偏好：</span>
                          {parseResult.trip_request.preferences.join('、')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {parseResult.status === 'incomplete' && (
                <div className="text-amber-800">
                  <p className="font-medium mb-2">需要补充以下信息：</p>
                  {parseResult.missing_fields && parseResult.missing_fields.length > 0 && (
                    <ul className="list-disc list-inside text-sm mb-2 space-y-1">
                      {parseResult.missing_fields.map((field: string) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  )}
                  {parseResult.suggestions && (
                    <p className="text-sm bg-white rounded p-3">{parseResult.suggestions}</p>
                  )}
                  {parseResult.partial_data && Object.keys(parseResult.partial_data).length > 0 && (
                    <div className="mt-3 text-sm bg-white rounded p-3">
                      <p className="font-medium mb-1">已收集的信息：</p>
                      <div className="space-y-1 text-gray-700">
                        {parseResult.partial_data.city && (
                          <p>目的地：{parseResult.partial_data.city}</p>
                        )}
                        {parseResult.partial_data.travel_days && (
                          <p>天数：{parseResult.partial_data.travel_days}天</p>
                        )}
                        {parseResult.partial_data.preferences &&
                          parseResult.partial_data.preferences.length > 0 && (
                            <p>偏好：{parseResult.partial_data.preferences.join('、')}</p>
                          )}
                      </div>
                    </div>
                  )}
                  <p className="text-sm mt-2">请在上方补充缺失的信息后重新提交</p>
                </div>
              )}

              {parseResult.status === 'error' && (
                <div className="text-red-800">
                  <p className="font-medium">解析失败</p>
                  <p className="text-sm mt-1">
                    {parseResult.message || '请检查您的输入并重试'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isParsingLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-sm text-gray-600 mt-2">正在解析您的需求...</p>
        </div>
      )}
    </div>
  );
};

export default NaturalInput;
