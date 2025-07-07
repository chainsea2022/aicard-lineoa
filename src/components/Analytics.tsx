
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, Eye, Share2, Calendar, QrCode, Nfc, UserPlus, MousePointer, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  onClose: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  // 模擬數據
  const cardStats = {
    today: { new: 8, total: 156 },
    week: { new: 23, total: 156 },
    month: { new: 45, total: 156 }
  };

  const sourceData = [
    { name: 'QR Code 掃描', value: 45, color: '#3B82F6' },
    { name: 'NFC 感應', value: 28, color: '#10B981' },
    { name: '直接分享', value: 18, color: '#F59E0B' },
    { name: '邀請註冊', value: 9, color: '#EF4444' },
  ];

  const dailyNewCards = [
    { date: '1/1', cards: 3 },
    { date: '1/2', cards: 5 },
    { date: '1/3', cards: 2 },
    { date: '1/4', cards: 8 },
    { date: '1/5', cards: 4 },
    { date: '1/6', cards: 6 },
    { date: '1/7', cards: 7 },
  ];

  const flexMessageStats = {
    totalClicks: 234,
    uniqueUsers: 89,
    topMessages: [
      { title: '產品介紹', clicks: 78 },
      { title: '聯絡資訊', clicks: 56 },
      { title: '服務項目', clicks: 43 },
      { title: '公司位置', clicks: 32 }
    ]
  };

  const eventStats = {
    totalEvents: 12,
    totalParticipants: 234,
    networkConnections: 89,
    events: [
      { name: '商業交流會', participants: 45, connections: 23 },
      { name: '產品發表會', participants: 67, connections: 34 },
      { name: '行銷研討會', participants: 32, connections: 18 },
    ]
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'today': return '今日';
      case 'week': return '本週';
      case 'month': return '本月';
      default: return '今日';
    }
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
        {/* Period Selector */}
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === 'today' ? '今日' : period === 'week' ? '本週' : '本月'}
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">總覽</TabsTrigger>
            <TabsTrigger value="cards">名片數據</TabsTrigger>
            <TabsTrigger value="engagement">互動分析</TabsTrigger>
            <TabsTrigger value="network">關係網路</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <UserPlus className="w-5 h-5" />
                  <span className="text-sm font-medium">{getPeriodText()}新增名片</span>
                </div>
                <div className="text-2xl font-bold">{cardStats[selectedPeriod].new}</div>
                <div className="text-xs text-blue-100">總計 {cardStats[selectedPeriod].total}</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">分享轉換率</span>
                </div>
                <div className="text-2xl font-bold">24.5%</div>
                <div className="text-xs text-green-100">共 78 次分享</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="w-5 h-5" />
                  <span className="text-sm font-medium">Flex Message 點擊</span>
                </div>
                <div className="text-2xl font-bold">{flexMessageStats.totalClicks}</div>
                <div className="text-xs text-purple-100">{flexMessageStats.uniqueUsers} 名用戶</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Network className="w-5 h-5" />
                  <span className="text-sm font-medium">關係網連結</span>
                </div>
                <div className="text-2xl font-bold">{eventStats.networkConnections}</div>
                <div className="text-xs text-orange-100">活動參與 {eventStats.totalParticipants}</div>
              </div>
            </div>

            {/* Charts Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">名片來源比例</h3>
                <ChartContainer config={{}} className="h-48">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">每日新增趨勢</h3>
                <ChartContainer config={{}} className="h-48">
                  <LineChart data={dailyNewCards}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Line type="monotone" dataKey="cards" stroke="#3B82F6" strokeWidth={2} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">名片來源詳細分析</h3>
              <div className="space-y-4">
                {sourceData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }}></div>
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{source.value}</div>
                      <div className="text-sm text-gray-500">{((source.value / sourceData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">分享與轉換統計</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">78</div>
                  <div className="text-sm text-gray-600">總分享次數</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">19</div>
                  <div className="text-sm text-gray-600">成功註冊</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">24.5%</div>
                  <div className="text-sm text-gray-600">轉換率</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Flex Message 互動統計</h3>
              <div className="space-y-3">
                {flexMessageStats.topMessages.map((message, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{message.title}</span>
                    <span className="text-blue-600 font-bold">{message.clicks} 次</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{flexMessageStats.totalClicks}</div>
                  <div className="text-sm text-gray-600">總點擊數 · {flexMessageStats.uniqueUsers} 名獨立用戶</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">活動參與與關係網</h3>
              <div className="space-y-4">
                {eventStats.events.map((event, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{event.name}</h4>
                      <span className="text-sm text-gray-500">參與者 {event.participants}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Network className="w-4 h-4 text-green-600" />
                        <span>新建立連結: {event.connections}</span>
                      </div>
                      <div className="text-gray-500">
                        關聯度: {((event.connections / event.participants) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">關係網路總覽</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{eventStats.totalEvents}</div>
                  <div className="text-sm text-gray-600">參與活動數</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{eventStats.networkConnections}</div>
                  <div className="text-sm text-gray-600">關係網連結</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
