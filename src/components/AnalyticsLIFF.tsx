import React, { useState, useEffect } from 'react';
import { X, BarChart3, TrendingUp, Users, Eye, Share2, Download, Calendar, Clock, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalyticsLIFFProps {
  onClose: () => void;
}

const AnalyticsLIFF: React.FC<AnalyticsLIFFProps> = ({ onClose }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState({
    cardViews: 156,
    cardShares: 23,
    contactAdds: 18,
    qrScans: 34,
    profileVisits: 89,
    engagementRate: 78
  });

  const [weeklyData] = useState([
    { day: '週一', views: 22, shares: 3, contacts: 2 },
    { day: '週二', views: 18, shares: 1, contacts: 1 },
    { day: '週三', views: 25, shares: 4, contacts: 3 },
    { day: '週四', views: 31, shares: 6, contacts: 4 },
    { day: '週五', views: 28, shares: 5, contacts: 3 },
    { day: '週六', views: 19, shares: 2, contacts: 2 },
    { day: '週日', views: 13, shares: 2, contacts: 3 }
  ]);

  const [achievements] = useState([
    { id: 1, title: '首次分享', description: '成功分享您的第一張名片', unlocked: true, date: '2024-07-20' },
    { id: 2, title: '人氣新星', description: '名片被瀏覽超過100次', unlocked: true, date: '2024-07-22' },
    { id: 3, title: '社交達人', description: '累積獲得50個新聯絡人', unlocked: false, progress: 18, target: 50 },
    { id: 4, title: '影響力專家', description: '名片被分享超過50次', unlocked: false, progress: 23, target: 50 }
  ]);

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-variant text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">數據分析</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-2">
          {[
            { key: '7days', label: '最近7天' },
            { key: '30days', label: '最近30天' },
            { key: '90days', label: '最近90天' }
          ].map((range) => (
            <Button
              key={range.key}
              variant={timeRange === range.key ? 'liff' : 'liff-outline'}
              size="sm"
              onClick={() => setTimeRange(range.key)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 總覽統計 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-800">{analyticsData.cardViews}</p>
                  <p className="text-xs text-blue-600">名片瀏覽次數</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-800">{analyticsData.cardShares}</p>
                  <p className="text-xs text-green-600">分享次數</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-800">{analyticsData.contactAdds}</p>
                  <p className="text-xs text-purple-600">新增聯絡人</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-800">{analyticsData.qrScans}</p>
                  <p className="text-xs text-orange-600">QR Code 掃描</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 互動率 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              互動表現
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>整體互動率</span>
                  <span className="font-medium">{analyticsData.engagementRate}%</span>
                </div>
                <Progress value={analyticsData.engagementRate} className="h-3" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.profileVisits}</p>
                  <p className="text-xs text-gray-600">個人檔案訪問</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{Math.round(analyticsData.cardViews / 7)}</p>
                  <p className="text-xs text-gray-600">平均日瀏覽</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{Math.round((analyticsData.contactAdds / analyticsData.cardViews) * 100)}%</p>
                  <p className="text-xs text-gray-600">轉換率</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 每日數據圖表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              每日活動趨勢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-blue-600">瀏覽: {day.views}</span>
                      <span className="text-green-600">分享: {day.shares}</span>
                      <span className="text-purple-600">聯絡: {day.contacts}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1 h-2">
                    <div 
                      className="bg-blue-500 rounded-sm"
                      style={{ width: `${(day.views / getMaxValue(weeklyData, 'views')) * 70}%` }}
                    />
                    <div 
                      className="bg-green-500 rounded-sm"
                      style={{ width: `${(day.shares / getMaxValue(weeklyData, 'shares')) * 15}%` }}
                    />
                    <div 
                      className="bg-purple-500 rounded-sm"
                      style={{ width: `${(day.contacts / getMaxValue(weeklyData, 'contacts')) * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 成就系統 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="w-5 h-5 mr-2" />
              成就系統
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            已達成
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                      
                      {achievement.unlocked ? (
                        <p className="text-xs text-gray-500">達成日期: {achievement.date}</p>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>進度</span>
                            <span>{achievement.progress}/{achievement.target}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress! / achievement.target!) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {achievement.unlocked ? (
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-800" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 導出按鈕 */}
        <Card>
          <CardContent className="p-4">
            <Button variant="liff-outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              導出分析報告
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              將分析數據導出為PDF報告
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsLIFF;