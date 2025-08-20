import React, { useState, useEffect } from 'react';
import { Gift, History, TrendingUp, Award, Coins, Users, FileText, Camera, Mail, CheckCircle, Crown, Star, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface EarningMethod {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  textColor: string;
  completed: boolean;
}

const EmbeddedPoints: React.FC = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'upgrade' | 'history'>('overview');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { cardCount: 10, points: 30, achieved: true },
    { cardCount: 30, points: 60, achieved: true },
    { cardCount: 60, points: 100, achieved: false },
    { cardCount: 100, points: 150, achieved: false }
  ]);

  const [earningMethods, setEarningMethods] = useState<EarningMethod[]>([
    {
      id: 'register',
      title: '完成電子名片註冊',
      description: '完成電子名片註冊',
      points: 50,
      icon: <FileText className="w-5 h-5 text-white" />,
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-900',
      completed: true
    },
    {
      id: 'complete-profile',
      title: '完整電子名片個人資料(70%以上)',
      description: '包含公司名稱、姓名、大頭照、手機、信箱',
      points: 50,
      icon: <div className="flex space-x-0.5">
            <Users className="w-3 h-3 text-white" />
            <Camera className="w-3 h-3 text-white" />
            <Mail className="w-3 h-3 text-white" />
          </div>,
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-900',
      completed: true
    },
    {
      id: 'invite-others',
      title: '邀請好友完成電子名片註冊 (1人)',
      description: '邀請好友完成電子名片註冊',
      points: 50,
      icon: <Users className="w-5 h-5 text-white" />,
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-900',
      completed: true
    },
    {
      id: 'share-card',
      title: '分享好友電子名片卡加入名片夾 (1人)',
      description: '分享好友電子名片卡加入名片夾',
      points: 10,
      icon: <FileText className="w-5 h-5 text-white" />,
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-500',
      textColor: 'text-green-900',
      completed: false
    },
    {
      id: 'share-ocr',
      title: '分享好友OCR 名片識別加入名片夾 (1人)',
      description: '分享好友OCR 名片識別加入名片夾',
      points: 10,
      icon: <Camera className="w-5 h-5 text-white" />,
      bgGradient: 'from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-500',
      textColor: 'text-teal-900',
      completed: false
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
        { id: 1, type: 'earn', points: 50, description: '完成電子名片註冊', date: new Date() },
        { id: 2, type: 'earn', points: 50, description: '完整電子名片個人資料(70%以上)', date: new Date(Date.now() - 86400000) },
        { id: 3, type: 'earn', points: 50, description: '邀請好友完成電子名片註冊 (1人)', date: new Date(Date.now() - 172800000) }
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

  const canRedeemTrial = currentPoints >= 50;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200 -mx-6 px-6">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'overview' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-1" />
          點數總覽
        </button>
        <button 
          onClick={() => setActiveTab('upgrade')} 
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'upgrade' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
          }`}
        >
          <Award className="w-4 h-4 inline-block mr-1" />
          兑點升級
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'history' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
          }`}
        >
          <History className="w-4 h-4 inline-block mr-1" />
          累兌歷程
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Coins className="w-16 h-16 mx-auto text-orange-500 mb-2" />
                <h2 className="text-2xl font-bold text-gray-800">目前點數</h2>
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {currentPoints.toLocaleString()}
              </div>
              <p className="text-gray-600">點</p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                {canRedeemTrial ? (
                  <div className="text-green-600">
                    <Award className="w-5 h-5 inline-block mr-1" />
                    <span className="font-medium">可兌換商務版試用！</span>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <span className="text-sm">
                      還需 {50 - currentPoints} 點即可兌換商務版試用
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Gift className="w-5 h-5 mr-2 text-green-600" />
                獲得點數方式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {earningMethods.map(method => (
                  <div key={method.id} className={`relative flex items-center justify-between p-4 bg-gradient-to-r ${method.bgGradient} rounded-xl border ${method.borderColor} shadow-sm ${method.completed ? 'opacity-90' : ''}`}>
                    <div className="absolute top-2 right-2">
                      {method.completed ? (
                        <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full">
                          <Lock className="w-3 h-3 text-gray-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 ${method.iconBg} rounded-full mr-3`}>
                        {method.icon}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${method.textColor} ${method.completed ? 'line-through opacity-75' : ''}`}>{method.title}</h4>
                        {method.completed && (
                          <p className="text-xs text-green-600 font-medium mt-1">✓ 已完成</p>
                        )}
                      </div>
                    </div>
                    <Badge className={`font-bold px-3 py-1 ${method.completed ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                      +{method.points}點
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                名片分享里程碑
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center justify-between p-4 rounded-xl border shadow-sm ${milestone.achieved ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'}`}>
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
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-3 ${milestone.achieved ? 'bg-green-500 shadow-lg' : 'bg-gray-400'} relative`}>
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
                      <Badge className={`font-bold px-3 py-1 ${milestone.achieved ? 'bg-green-500 text-white shadow-md' : 'bg-gray-400 text-white'}`}>
                        {milestone.achieved ? '已獲得 ' : ''}{milestone.points}點
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'upgrade' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 border-4 border-orange-300 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full opacity-30 transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-30 transform -translate-x-8 translate-y-8"></div>
            
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-orange-600 mr-2" />
                <h3 className="font-bold text-2xl text-orange-800">專屬大禮</h3>
                <div className="ml-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
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
                  <p className="text-orange-600 mt-2">每月只要＄600，預繳一年$7,200</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <p className="text-center text-orange-700 font-semibold text-sm">
                    每月只要＄600，預繳一年＄7200
                  </p>
                  <p className="text-center text-orange-700 font-semibold mt-1">
                    🎉 一年不限次數全功能解鎖 🎉
                  </p>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                  立即搶購
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">點數歷程</h3>
          <div className="space-y-3">
            {transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).map(transaction => (
              <div key={transaction.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <Coins className="w-5 h-5 text-green-600" />
                      ) : (
                        <Gift className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.points} 點
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbeddedPoints;