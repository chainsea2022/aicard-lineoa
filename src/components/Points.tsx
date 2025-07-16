import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, History, TrendingUp, Award, Coins, Users, FileText, Camera, Mail, CheckCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'upgrade' | 'history'>('overview');
  const [milestones, setMilestones] = useState<Milestone[]>([{
    cardCount: 10,
    points: 30,
    achieved: false
  }, {
    cardCount: 30,
    points: 60,
    achieved: false
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
    title: '完成電子名片註冊',
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
    completed: true // Check if profile is complete
  }, {
    id: 'invite-others',
    title: '邀請好友完成電子名片註冊 (1人)',
    description: '邀請好友完成電子名片註冊',
    points: 50,
    icon: <Users className="w-5 h-5 text-white" />,
    bgGradient: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-500',
    textColor: 'text-orange-900',
    completed: false // Check based on actual data
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
    title: '分享好友OCR 名片掃描加入名片夾 (1人)',
    description: '分享好友OCR 名片掃描加入名片夾',
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
      }, {
        id: 3,
        type: 'earn',
        points: 50,
        description: '邀請好友完成電子名片註冊 (1人)',
        date: new Date(Date.now() - 172800000)
      }];
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
    setEarningMethods(prev => prev.map(method => {
      if (method.id === 'invite-others') {
        const hasInvitedOthers = transactions.some(t => t.description === '邀請好友完成電子名片註冊 (1人)');
        return {
          ...method,
          completed: hasInvitedOthers
        };
      }
      return method;
    }));
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
  return <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">會員點數</h1>
        </div>
      </div>

      <div className="flex bg-white border-b border-gray-200">
        <button onClick={() => setActiveTab('overview')} className={`flex-1 py-3 text-center font-medium ${activeTab === 'overview' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'}`}>
          <TrendingUp className="w-4 h-4 inline-block mr-1" />
          點數總覽
        </button>
        <button onClick={() => setActiveTab('upgrade')} className={`flex-1 py-3 text-center font-medium ${activeTab === 'upgrade' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'}`}>
          <Award className="w-4 h-4 inline-block mr-1" />
          兑點升級
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 text-center font-medium ${activeTab === 'history' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'}`}>
          <History className="w-4 h-4 inline-block mr-1" />
          累兌歷程
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'overview' ? <>
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
                
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  {canRedeemTrial ? <div className="text-green-600">
                      <Award className="w-5 h-5 inline-block mr-1" />
                      <span className="font-medium">可兌換商務版試用！</span>
                    </div> : <div className="text-gray-600">
                      <span className="text-sm">
                        還需 {50 - currentPoints} 點即可兌換商務版試用
                      </span>
                    </div>}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Gift className="w-5 h-5 mr-2 text-green-600" />
                  獲得點數方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {earningMethods.map(method => <div key={method.id} className={`relative flex items-center justify-between p-4 bg-gradient-to-r ${method.bgGradient} rounded-xl border ${method.borderColor} shadow-sm`}>
                      {method.completed && <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                        </div>}
                      
                      <div className="flex items-center flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 ${method.iconBg} rounded-full mr-3`}>
                          {method.icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${method.textColor}`}>{method.title}</h4>
                          
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white font-bold px-3 py-1">
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
                      {milestone.achieved && <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                        </div>}
                      
                      <div className="flex items-center flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 ${milestone.achieved ? 'bg-green-500' : 'bg-gray-400'}`}>
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${milestone.achieved ? 'text-green-900' : 'text-gray-700'}`}>
                            分享好友電子名片卡或掃描加入名片夾 {milestone.cardCount} 人
                          </h4>
                          
                        </div>
                      </div>
                      <div className="flex items-center">
                        {milestone.achieved && <Award className="w-4 h-4 text-green-600 mr-2" />}
                        <Badge className={`font-bold px-3 py-1 ${milestone.achieved ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                          +{milestone.points}點
                        </Badge>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </> : activeTab === 'upgrade' ? <>
            {/* 兑點方案說明 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  兑點方案說明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">功能/方案</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold text-green-600">新手方案</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold text-blue-600">菁英方案</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold text-purple-600">首席方案</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">智慧人脈記錄</td>
                        <td className="border border-gray-300 p-3 text-center">１次免費，30點/張</td>
                        <td className="border border-gray-300 p-3 text-center">10張</td>
                        <td className="border border-gray-300 p-3 text-center">30張</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">完整數據分析</td>
                        <td className="border border-gray-300 p-3 text-center">50點/次</td>
                        <td className="border border-gray-300 p-3 text-center">解鎖</td>
                        <td className="border border-gray-300 p-3 text-center">解鎖</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">行程管理：新增行程</td>
                        <td className="border border-gray-300 p-3 text-center">１次免費，30點/次</td>
                        <td className="border border-gray-300 p-3 text-center">10次</td>
                        <td className="border border-gray-300 p-3 text-center">20次</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">行程管理：語音記錄</td>
                        <td className="border border-gray-300 p-3 text-center">１次免費，50點/次</td>
                        <td className="border border-gray-300 p-3 text-center">5次</td>
                        <td className="border border-gray-300 p-3 text-center">15次</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">行程管理：發送信件</td>
                        <td className="border border-gray-300 p-3 text-center">１次免費，50點/次</td>
                        <td className="border border-gray-300 p-3 text-center">5次</td>
                        <td className="border border-gray-300 p-3 text-center">15次</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">建立自訂名片樣式</td>
                        <td className="border border-gray-300 p-3 text-center">50點</td>
                        <td className="border border-gray-300 p-3 text-center">X</td>
                        <td className="border border-gray-300 p-3 text-center">解鎖</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium bg-yellow-50">月價格</td>
                        <td className="border border-gray-300 p-3 text-center font-bold text-green-600">Free</td>
                        <td className="border border-gray-300 p-3 text-center font-bold text-blue-600">$399</td>
                        <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">$999</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">年優惠</td>
                        <td className="border border-gray-300 p-3 text-center">-</td>
                        <td className="border border-gray-300 p-3 text-center font-bold text-blue-600">$4,500</td>
                        <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">$11,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 特別優惠 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-100 border-2 border-orange-200 rounded-xl">
                  <h3 className="font-bold text-lg text-orange-800 mb-3">特別優惠</h3>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-700 mb-2">「超值群募解鎖包」 $7200/年</h4>
                    <p className="text-sm text-orange-600">每月只要＄600，預繳一年＄7200，一年不限次數全功能解鎖</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 更多AI生態圈方案 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Gift className="w-5 h-5 mr-2 text-blue-600" />
                  更多AI生態圈方案
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Aipower PRO商業名片</h4>
                    <p className="text-sm text-blue-700 mb-3">100點/1個月試用。可建立商家名片，品牌地圖互動交流平台</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      100點兌換
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">Aile 商務版</h4>
                    <p className="text-sm text-green-700 mb-3">100點/1個月試用，無縫轉接、通路整合，打造專屬商務助手</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      100點兌換
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
                    <h4 className="font-semibold text-purple-800 mb-2">Aile PRO企業版</h4>
                    <p className="text-sm text-purple-700 mb-3">300點/1個月試用，內外協作，顧客管理，一站掌握商機節奏</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      300點兌換
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl">
                    <h4 className="font-semibold text-pink-800 mb-2">Aiwow集點商城</h4>
                    <p className="text-sm text-pink-700 mb-3">更多優惠兌點　點點累積，驚喜無限。打造互動導購與點數流通的智慧入口</p>
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                      前往商城
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </> : <div className="space-y-3">
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