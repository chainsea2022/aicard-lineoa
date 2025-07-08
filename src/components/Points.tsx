
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, History, TrendingUp, Award, Coins } from 'lucide-react';
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

const Points: React.FC<PointsProps> = ({ onClose }) => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

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
      // Initialize with some sample data
      const initialTransactions: PointTransaction[] = [
        { id: 1, type: 'earn', points: 100, description: '註冊電子名片', date: new Date() },
        { id: 2, type: 'earn', points: 50, description: '完成個人資料', date: new Date(Date.now() - 86400000) },
        { id: 3, type: 'earn', points: 30, description: '分享名片', date: new Date(Date.now() - 172800000) },
      ];
      setTransactions(initialTransactions);
      setCurrentPoints(180);
      
      // Save to localStorage
      localStorage.setItem('aile-user-points', '180');
      localStorage.setItem('aile-points-history', JSON.stringify(initialTransactions));
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
              </CardContent>
            </Card>

            {/* Points Rules Section */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-green-600" />
                  點數規則
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">獲得點數方式</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>註冊電子名片</span>
                        <Badge className="bg-green-100 text-green-800">+100點</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>完成個人資料</span>
                        <Badge className="bg-blue-100 text-blue-800">+50點</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>分享名片</span>
                        <Badge className="bg-purple-100 text-purple-800">+30點</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>掃描他人名片</span>
                        <Badge className="bg-orange-100 text-orange-800">+20點</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>每日登入</span>
                        <Badge className="bg-yellow-100 text-yellow-800">+10點</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">消耗點數方式</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>兌換禮品</span>
                        <Badge className="bg-red-100 text-red-800">視禮品而定</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>升級功能</span>
                        <Badge className="bg-red-100 text-red-800">視功能而定</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">注意事項</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 點數有效期限為獲得日起一年</li>
                      <li>• 點數不可轉讓給其他用戶</li>
                      <li>• 違規行為將扣除相應點數</li>
                      <li>• 點數規則可能會調整，以最新公告為準</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  點數兌換
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">敬請期待更多兌換選項</p>
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
