import React, { useState, useEffect } from 'react';
import { Gift, History, TrendingUp, Award, Coins, Users, FileText, Camera, Mail, CheckCircle, Lock, Unlock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UpgradeSection from './Points/UpgradeSection';
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
const Points: React.FC<PointsProps> = ({
  onClose
}) => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'upgrade' | 'history'>('upgrade');
  const [milestones, setMilestones] = useState<Milestone[]>([{
    cardCount: 10,
    points: 30,
    achieved: true // Show first milestone as achieved for demo
  }, {
    cardCount: 30,
    points: 60,
    achieved: true // Show second milestone as achieved for demo
  }, {
    cardCount: 60,
    points: 100,
    achieved: false
  }, {
    cardCount: 100,
    points: 150,
    achieved: false
  }]);
  const [earningMethods, setEarningMethods] = useState<EarningMethod[]>([{
    id: 'register',
    title: '完成名片註冊',
    description: '完成電子名片註冊',
    points: 50,
    icon: <FileText className="w-5 h-5 text-white" />,
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-900',
    completed: true // Assume registration is completed
  }, {
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
    completed: true // Show as completed for demo
  }, {
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
  }, {
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
  }]);
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
      const initialTransactions: PointTransaction[] = [{
        id: 1,
        type: 'earn',
        points: 50,
        description: '完成電子名片註冊',
        date: new Date()
      }, {
        id: 2,
        type: 'earn',
        points: 50,
        description: '完整電子名片個人資料(70%以上)',
        date: new Date(Date.now() - 86400000)
      }];
      setTransactions(initialTransactions);
      setCurrentPoints(100);
      localStorage.setItem('aile-user-points', '100');
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
  }, [transactions]);
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
  return <div className="absolute inset-0 bg-white overflow-y-auto">
      {/* 緊湊的目前點數區塊 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500">目前點數</div>
              <div className="text-lg font-semibold text-gray-900">{currentPoints.toLocaleString()}</div>
            </div>
          </div>
          {canRedeemTrial && (
            <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
              <div className="flex items-center text-xs text-blue-600 font-medium">
                <Award className="w-3 h-3 mr-1" />
                可兌換試用
              </div>
            </div>
          )}
        </div>
      </div>

      {/* iOS風格分頁標籤 */}
      <div className="flex bg-gray-50 mx-4 mt-3 mb-4 rounded-xl p-1">
        <button 
          onClick={() => setActiveTab('upgrade')} 
          className={`flex-1 py-2 px-3 text-center font-medium rounded-lg text-sm transition-all ${
            activeTab === 'upgrade' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          兌點升級
        </button>
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`flex-1 py-2 px-3 text-center font-medium rounded-lg text-sm transition-all ${
            activeTab === 'overview' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          點數總覽
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 py-2 px-3 text-center font-medium rounded-lg text-sm transition-all ${
            activeTab === 'history' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          歷程記錄
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'overview' ? <>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Gift className="w-5 h-5 mr-2 text-green-600" />
                  獲得點數方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {earningMethods.map(method => <div key={method.id} className={`relative flex items-center justify-between p-4 bg-gradient-to-r ${method.bgGradient} rounded-xl border ${method.borderColor} shadow-sm ${method.completed ? 'opacity-90' : ''}`}>
                      {/* 完成狀態指示器 */}
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
                          <h4 className={`font-semibold ${method.textColor} ${method.completed ? 'opacity-75' : ''}`}>{method.title}</h4>
                          {method.completed && (
                            <p className="text-xs text-green-600 font-medium mt-1">✓ 已完成</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`font-bold px-3 py-1 ${method.completed ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                        +{method.points}點
                      </Badge>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  名片分享里程碑
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {milestones.map((milestone, index) => <div key={index} className={`relative flex items-center justify-between p-4 rounded-xl border shadow-sm ${milestone.achieved ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'}`}>
                      {/* 里程碑達成指示器 */}
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
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* 兌點規則 */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                  兌點規則
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                      <span className="text-gray-700">免費獲得點數：2年有效期</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                      <span className="text-gray-700">會員購買點數：永久有效</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                      <span className="text-gray-700">點數不可轉讓給其他用戶</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                      <span className="text-gray-700">已兌換之商品或服務不可退換</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </> : activeTab === 'upgrade' ? <UpgradeSection /> : <div className="space-y-3">
            {transactions.length === 0 ? <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">暫無點數記錄</p>
              </div> : transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).map(transaction => <Card key={transaction.id} className="shadow-sm">
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
                          <span className={`font-bold text-lg ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'earn' ? '+' : '-'}
                            {transaction.points}
                          </span>
                          <p className="text-xs text-gray-500">點</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
          </div>}
      </div>
    </div>;
};
export default Points;