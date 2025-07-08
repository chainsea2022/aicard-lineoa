
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, History, TrendingUp, Award, Coins, Users, FileText, Camera, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PointsProps {
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

const Points: React.FC<PointsProps> = ({ onClose }) => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { cardCount: 10, points: 10, achieved: false },
    { cardCount: 30, points: 20, achieved: false },
    { cardCount: 50, points: 30, achieved: false },
    { cardCount: 100, points: 50, achieved: false }
  ]);

  useEffect(() => {
    // Load points data from localStorage
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
      // Initialize with updated sample data
      const initialTransactions: PointTransaction[] = [
        { id: 1, type: 'earn', points: 30, description: '註冊電子名片', date: new Date() },
        { id: 2, type: 'earn', points: 30, description: '完成電子名片資料', date: new Date(Date.now() - 86400000) },
        { id: 3, type: 'earn', points: 10, description: '他人加入您的電子名片', date: new Date(Date.now() - 172800000) },
      ];
      setTransactions(initialTransactions);
      setCurrentPoints(70);
      
      // Save to localStorage
      localStorage.setItem('aile-user-points', '70');
      localStorage.setItem('aile-points-history', JSON.stringify(initialTransactions));
    }

    // Check saved customers to update milestones
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
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">會員點數</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'overview'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-600'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-1" />
          點數總覽
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'history'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-600'
          }`}
        >
          <History className="w-4 h-4 inline-block mr-1" />
          累兌歷程
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'overview' ? (
          <>
            {/* Current Points Card */}
            <Card className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Coins className="w-16 h-16 mx-auto text-orange-500 mb-2" />
                  <h2 className="text-2xl font-bold text-gray-800">目前點數</h2>
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {currentPoints.toLocaleString()}
                </div>
                <p className="text-gray-600">點</p>
                
                {/* Premium Trial Status */}
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

            {/* Points Rules Section */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-green-600" />
                  獲得點數方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="font-medium">註冊電子名片</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+30點</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-3">
                        <Users className="w-4 h-4 text-purple-600" />
                        <Camera className="w-4 h-4 text-purple-600" />
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-medium block">完成電子名片資料</span>
                        <span className="text-xs text-gray-600">包含公司、姓名、照片、手機、信箱</span>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">+30點</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-orange-600" />
                      <span className="font-medium">他人加入您的電子名片</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">每人+10點</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones Section */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  名片收藏里程碑
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        milestone.achieved 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <FileText className={`w-5 h-5 mr-3 ${
                          milestone.achieved ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          milestone.achieved ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          收藏 {milestone.cardCount} 筆名片
                        </span>
                      </div>
                      <div className="flex items-center">
                        {milestone.achieved && (
                          <Award className="w-4 h-4 text-green-600 mr-2" />
                        )}
                        <Badge className={
                          milestone.achieved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }>
                          +{milestone.points}點
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Redemption Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-red-600" />
                  兌點方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Premium Trial Offer */}
                  <div className={`p-4 rounded-lg border-2 ${
                    canRedeemTrial 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Award className={`w-6 h-6 mr-3 ${
                          canRedeemTrial ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <h4 className={`font-semibold ${
                            canRedeemTrial ? 'text-green-800' : 'text-gray-600'
                          }`}>
                            Aile商務全功能試用
                          </h4>
                          <p className="text-sm text-gray-600">免費試用1個月</p>
                        </div>
                      </div>
                      <Badge className={
                        canRedeemTrial 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-600'
                      }>
                        50點
                      </Badge>
                    </div>
                    <Button 
                      className={`w-full ${
                        canRedeemTrial 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!canRedeemTrial}
                    >
                      {canRedeemTrial ? '立即兌換' : `還需 ${50 - currentPoints} 點`}
                    </Button>
                  </div>

                  {/* Aiwow App Promotion */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                      <Gift className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <h4 className="font-semibold text-blue-800 mb-1">更多兌點優惠</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        請至 Aiwow APP 兌換更多好禮！
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        前往 Aiwow APP
                      </Button>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">兌點說明</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 點數有效期限為獲得日起一年</li>
                      <li>• 點數不可轉讓給其他用戶</li>
                      <li>• 兌換後的服務或商品不可退換</li>
                      <li>• 兌點規則可能會調整，以最新公告為準</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* History Tab */
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">暫無點數記錄</p>
              </div>
            ) : (
              transactions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((transaction) => (
                  <Card key={transaction.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {transaction.description}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-bold text-lg ${
                              transaction.type === 'earn'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'earn' ? '+' : '-'}
                            {transaction.points}
                          </span>
                          <p className="text-xs text-gray-500">點</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Points;
