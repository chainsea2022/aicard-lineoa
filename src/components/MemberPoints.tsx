import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, History, TrendingUp, Award, Coins, Users, FileText, Camera, Mail, CheckCircle, Info, Crown, Star, Shield, X, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MemberPointsProps {
  onClose: () => void;
}

interface PointTransaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  date: Date;
}

interface Milestone {
  cardCount: number;
  points: number;
  achieved: boolean;
}

const MemberPoints: React.FC<MemberPointsProps> = ({
  onClose
}) => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [pointsActiveTab, setPointsActiveTab] = useState<'overview' | 'upgrade' | 'history'>('overview');
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      cardCount: 10,
      points: 30,
      achieved: true
    },
    {
      cardCount: 30,
      points: 60,
      achieved: true
    },
    {
      cardCount: 60,
      points: 100,
      achieved: false
    },
    {
      cardCount: 100,
      points: 150,
      achieved: false
    }
  ]);

  useEffect(() => {
    const savedPoints = localStorage.getItem('aile-user-points');
    const savedTransactions = localStorage.getItem('aile-points-history');

    if (savedPoints) {
      setCurrentPoints(parseInt(savedPoints));
    }

    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
      setTransactions(parsedTransactions);
    } else {
      const initialTransactions: PointTransaction[] = [
        {
          id: 1,
          type: 'earn',
          points: 50,
          description: '完成電子名片註冊',
          date: new Date()
        },
        {
          id: 2,
          type: 'earn',
          points: 50,
          description: '完整電子名片個人資料(70%以上)',
          date: new Date(Date.now() - 86400000)
        },
        {
          id: 3,
          type: 'earn',
          points: 50,
          description: '邀請好友完成電子名片註冊 (1人)',
          date: new Date(Date.now() - 172800000)
        }
      ];
      setTransactions(initialTransactions);
      setCurrentPoints(150);
      localStorage.setItem('aile-user-points', '150');
      localStorage.setItem('aile-points-history', JSON.stringify(initialTransactions));
    }

    const savedCustomers = localStorage.getItem('aile-saved-customers');
    if (savedCustomers) {
      const customers = JSON.parse(savedCustomers);
      const cardCount = customers.length;
      setMilestones(prev => prev.map(milestone => ({
        ...milestone,
        achieved: cardCount >= milestone.cardCount
      })));
    }
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="absolute inset-0 bg-gray-50 z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">會員點數</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 固定的目前點數區塊 - 簡潔時尚設計 */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full -translate-y-12 translate-x-12 opacity-60"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">目前擁有點數</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-gray-900">{currentPoints.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">點</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {currentPoints >= 50 && (
                <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <Award className="w-3 h-3 mr-1" />
                  可兌換試用
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 點數頁籤導航 - 優化設計 */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button 
            onClick={() => setPointsActiveTab('overview')} 
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              pointsActiveTab === 'overview' 
                ? 'bg-white text-orange-600 shadow-md transform scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            點數總覽
          </button>
          <button 
            onClick={() => setPointsActiveTab('upgrade')} 
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              pointsActiveTab === 'upgrade' 
                ? 'bg-white text-orange-600 shadow-md transform scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            兑點升級
          </button>
          <button 
            onClick={() => setPointsActiveTab('history')} 
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              pointsActiveTab === 'history' 
                ? 'bg-white text-orange-600 shadow-md transform scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            累兌歷程
          </button>
        </div>

        {/* 點數總覽 */}
        {pointsActiveTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <Gift className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">獲得點數方式</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {/* 完成電子名片註冊 */}
                  <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm opacity-90">
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full mr-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900">完成電子名片註冊</h4>
                        <p className="text-xs text-green-600 font-medium mt-1">✓ 已完成</p>
                      </div>
                    </div>
                    <Badge className="font-bold px-3 py-1 bg-green-500 text-white">
                      +50點
                    </Badge>
                  </div>

                  {/* 完整電子名片個人資料 */}
                  <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm opacity-90">
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full mr-3">
                        <div className="flex space-x-0.5">
                          <Users className="w-3 h-3 text-white" />
                          <Camera className="w-3 h-3 text-white" />
                          <Mail className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900">完整電子名片個人資料(70%以上)</h4>
                        <p className="text-xs text-green-600 font-medium mt-1">✓ 已完成</p>
                      </div>
                    </div>
                    <Badge className="font-bold px-3 py-1 bg-green-500 text-white">
                      +50點
                    </Badge>
                  </div>

                  {/* 邀請好友完成電子名片註冊 */}
                  <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm opacity-90">
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full mr-3">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-900">邀請好友完成電子名片註冊 (1人)</h4>
                        <p className="text-xs text-green-600 font-medium mt-1">✓ 已完成</p>
                      </div>
                    </div>
                    <Badge className="font-bold px-3 py-1 bg-green-500 text-white">
                      +50點
                    </Badge>
                  </div>

                  {/* 分享好友電子名片卡加入名片夾 */}
                  <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full">
                        <Lock className="w-3 h-3 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full mr-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">分享好友電子名片卡加入名片夾 (1人)</h4>
                      </div>
                    </div>
                    <Badge className="font-bold px-3 py-1 bg-gray-400 text-white">
                      +10點
                    </Badge>
                  </div>

                  {/* 分享好友OCR 名片識別加入名片夾 */}
                  <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200 shadow-sm">
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full">
                        <Lock className="w-3 h-3 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-teal-500 rounded-full mr-3">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-teal-900">分享好友OCR 名片識別加入名片夾 (1人)</h4>
                      </div>
                    </div>
                    <Badge className="font-bold px-3 py-1 bg-gray-400 text-white">
                      +10點
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 名片分享里程碑 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">名片分享里程碑</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`relative flex items-center justify-between p-4 rounded-xl border shadow-sm ${
                      milestone.achieved 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                    }`}>
                      <div className="absolute top-2 right-2">
                        {milestone.achieved ? (
                          <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full shadow-lg border-2 border-white">
                            <Unlock className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-7 h-7 bg-gray-300 rounded-full border-2 border-gray-100">
                            <Lock className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center flex-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-3 ${
                          milestone.achieved ? 'bg-green-500 shadow-lg' : 'bg-gray-400'
                        } relative`}>
                          <FileText className="w-6 h-6 text-white" />
                          {milestone.achieved && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star className="w-2.5 h-2.5 text-yellow-800" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${milestone.achieved ? 'text-green-900' : 'text-gray-700'}`}>
                            分享好友加入名片夾 {milestone.cardCount} 人
                          </h4>
                          {milestone.achieved ? (
                            <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              里程碑已達成！
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">尚未達成</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className={`font-bold px-3 py-1 ${
                          milestone.achieved ? 'bg-green-500 text-white shadow-md' : 'bg-gray-400 text-white'
                        }`}>
                          {milestone.achieved ? '已獲得 ' : ''}{milestone.points}點
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 兑點升級 Tab */}
        {pointsActiveTab === 'upgrade' && (
          <div className="space-y-6">
            {/* 專屬大禮包 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-xl relative overflow-hidden">
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-20"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Gift className="w-6 h-6 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-lg text-gray-800">專屬大禮</h3>
                  </div>
                  <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    限時優惠
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border-2 border-orange-200 shadow-md">
                  <div className="text-center mb-4">
                    <h4 className="font-bold text-xl text-orange-700 mb-2">「超值群募解鎖包」</h4>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-orange-600">$7,200</span>
                      <span className="text-lg text-orange-600">/年</span>
                    </div>
                    <p className="text-orange-600 mt-2">每月只要＄600</p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                    立即搶購
                  </Button>
                </div>
              </div>
            </div>

            {/* 兑點方案說明 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  兑點方案說明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 新手方案 */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-green-800">新手方案</h3>
                        <Badge className="bg-green-100 text-green-800">免費</Badge>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">Free</div>
                          <div className="text-xs text-gray-500">永久免費</div>
                        </div>
                        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                          <span className="mr-1">✓</span>
                          目前方案
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>智慧人脈記錄</span>
                        <span className="font-medium text-green-600">10張</span>
                      </div>
                      <div className="flex justify-between">
                        <span>分享好友電子名片卡</span>
                        <span className="font-medium text-green-600">每張1點</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OCR 名片識別</span>
                        <span className="font-medium text-green-600">每張1點</span>
                      </div>
                      <div className="flex justify-between">
                        <span>基礎數據分析</span>
                        <span className="font-medium text-green-600">解鎖</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：新增行程</span>
                        <span className="font-medium text-green-600">1次</span>
                      </div>
                      <div className="flex justify-between">
                        <span>建立自訂名片樣式</span>
                        <span className="font-medium text-red-600">X</span>
                      </div>
                    </div>
                  </div>

                  {/* 商務方案 */}
                  <div className="p-4 border-2 border-blue-300 rounded-xl bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-blue-800">商務方案</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$399</div>
                        <div className="text-xs text-gray-500">月價格</div>
                        <div className="text-sm text-blue-600">年優惠: $4,500</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>智慧人脈記錄</span>
                        <span className="font-medium text-blue-600">100張</span>
                      </div>
                      <div className="flex justify-between">
                        <span>分享好友電子名片卡</span>
                        <span className="font-medium text-blue-600 text-right">
                          100張
                          <br />
                          {'>'}100張，10點/張
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>OCR 名片識別</span>
                        <span className="font-medium text-blue-600 text-right">
                          100張
                          <br />
                          {'>'}100張，10點/張
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>進階數據分析</span>
                        <span className="font-medium text-blue-600">解鎖</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：新增行程</span>
                        <span className="font-medium text-blue-600">5次</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：語音記錄</span>
                        <span className="font-medium text-blue-600">2次</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：發送信件</span>
                        <span className="font-medium text-blue-600">2次</span>
                      </div>
                      <div className="flex justify-between">
                        <span>建立自訂名片樣式</span>
                        <span className="font-medium text-blue-600">50點</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      立即升級
                    </Button>
                  </div>

                  {/* 首席方案 */}
                  <div className="p-4 border-2 border-purple-300 rounded-xl bg-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-purple-800">首席方案</h3>
                        <Badge className="bg-purple-100 text-purple-800">推薦</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">$999</div>
                        <div className="text-xs text-gray-500">月價格</div>
                        <div className="text-sm text-purple-600">年優惠: $11,000</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>智慧人脈記錄</span>
                        <span className="font-medium text-purple-600">500張</span>
                      </div>
                      <div className="flex justify-between">
                        <span>分享好友電子名片卡</span>
                        <span className="font-medium text-purple-600">無限制</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OCR 名片識別</span>
                        <span className="font-medium text-purple-600">無限制</span>
                      </div>
                      <div className="flex justify-between">
                        <span>進階數據分析</span>
                        <span className="font-medium text-purple-600">解鎖</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：新增行程</span>
                        <span className="font-medium text-purple-600">無限制</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：語音記錄</span>
                        <span className="font-medium text-purple-600">無限制</span>
                      </div>
                      <div className="flex justify-between">
                        <span>行程管理：發送信件</span>
                        <span className="font-medium text-purple-600">無限制</span>
                      </div>
                      <div className="flex justify-between">
                        <span>建立自訂名片樣式</span>
                        <span className="font-medium text-purple-600">解鎖</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                      立即升級
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 累兌歷程 Tab */}
        {pointsActiveTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">點數歷程</h3>
            </div>
            <div className="p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">尚無點數歷程記錄</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'earn' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <Award className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'earn' ? '+' : '-'}{transaction.points}點
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPoints;