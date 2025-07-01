
import React from 'react';
import { ArrowLeft, TrendingUp, Users, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsProps {
  onClose: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onClose }) => {
  // 模擬數據
  const stats = {
    totalViews: 156,
    totalShares: 23,
    totalCustomers: 45,
    thisMonthViews: 89,
    topSources: [
      { source: 'QR Code 掃描', count: 78, percentage: 50 },
      { source: '直接分享', count: 39, percentage: 25 },
      { source: 'LINE 分享', count: 23, percentage: 15 },
      { source: '其他', count: 16, percentage: 10 },
    ]
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">數據分析</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">總瀏覽次數</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <div className="text-xs text-blue-100">本月 +{stats.thisMonthViews}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">分享次數</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalShares}</div>
            <div className="text-xs text-green-100">轉換率 14.7%</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">客戶總數</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="text-xs text-purple-100">本月 +12</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">成長率</span>
            </div>
            <div className="text-2xl font-bold">+28%</div>
            <div className="text-xs text-orange-100">較上月</div>
          </div>
        </div>

        {/* Client Sources */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">客戶來源分析</h3>
          <div className="space-y-4">
            {stats.topSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <span className="text-sm text-gray-500">{source.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">月度趨勢</h3>
          <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-2 p-4">
            {[45, 67, 23, 89, 56, 78, 92].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-blue-500 to-blue-400 w-6 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>7月</span>
            <span>8月</span>
            <span>9月</span>
            <span>10月</span>
            <span>11月</span>
            <span>12月</span>
            <span>1月</span>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">熱門互動內容</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">電子名片瀏覽</span>
              <span className="text-sm text-green-600 font-bold">126 次</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">聯絡資訊點擊</span>
              <span className="text-sm text-blue-600 font-bold">89 次</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">社群連結點擊</span>
              <span className="text-sm text-purple-600 font-bold">45 次</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 mb-2">💡 數據洞察</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• QR Code 掃描是最主要的客戶來源，建議多加推廣</li>
            <li>• 本月客戶成長率達 28%，表現優異</li>
            <li>• 電子名片的互動率持續提升</li>
            <li>• 建議增加社群媒體的曝光以提升分享次數</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
