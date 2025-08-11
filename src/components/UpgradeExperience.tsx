import React, { useState } from 'react';
import { ArrowLeft, Crown, Star, Shield, CheckCircle, Gift, Zap, Users, X, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UpgradeExperienceProps {
  onClose: () => void;
}

const UpgradeExperience: React.FC<UpgradeExperienceProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'compare' | 'trial' | 'premium'>('compare');

  const plans = [
    {
      id: 'free',
      name: '免費版',
      price: '免費',
      icon: <Shield className="w-6 h-6 text-gray-500" />,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      features: [
        { name: '建立電子名片', included: true },
        { name: '基礎名片夾管理', included: true },
        { name: '數量限制 (最多 50 張)', included: true },
        { name: '基礎分析功能', included: true },
        { name: '廣告顯示', included: true },
        { name: '進階分析報告', included: false },
        { name: '無限制名片夾', included: false },
        { name: '客製化名片樣式', included: false },
        { name: '優先客服支援', included: false },
      ]
    },
    {
      id: 'trial',
      name: '體驗版',
      price: '50 點數',
      originalPrice: '$300',
      icon: <Star className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      popular: true,
      duration: '7 天試用',
      features: [
        { name: '完整免費版功能', included: true },
        { name: '進階分析報告', included: true },
        { name: '無限制名片夾', included: true },
        { name: '移除廣告', included: true },
        { name: '客製化名片樣式', included: true },
        { name: '優先客服支援', included: true },
        { name: '專屬徽章顯示', included: true },
        { name: '批量匯出功能', included: true },
        { name: '高級權限管理', included: true },
      ]
    },
    {
      id: 'premium',
      name: '商務版',
      price: '$7,200',
      originalPrice: '$14,400',
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      duration: '年繳方案',
      discount: '50% OFF',
      features: [
        { name: '完整體驗版功能', included: true },
        { name: '團隊協作功能', included: true },
        { name: 'API 整合服務', included: true },
        { name: '專屬客戶經理', included: true },
        { name: '白標客製化', included: true },
        { name: '數據備份保護', included: true },
        { name: '進階安全設定', included: true },
        { name: '無限制用戶數', included: true },
        { name: '24/7 技術支援', included: true },
      ]
    }
  ];

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">升級體驗</h1>
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

      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('compare')} 
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'compare' 
              ? 'text-purple-600 border-b-2 border-purple-600' 
              : 'text-gray-600'
          }`}
        >
          <Shield className="w-4 h-4 inline-block mr-1" />
          方案比較
        </button>
        <button 
          onClick={() => setActiveTab('trial')} 
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'trial' 
              ? 'text-purple-600 border-b-2 border-purple-600' 
              : 'text-gray-600'
          }`}
        >
          <Star className="w-4 h-4 inline-block mr-1" />
          體驗版
        </button>
        <button 
          onClick={() => setActiveTab('premium')} 
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'premium' 
              ? 'text-purple-600 border-b-2 border-purple-600' 
              : 'text-gray-600'
          }`}
        >
          <Crown className="w-4 h-4 inline-block mr-1" />
          商務版
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'compare' && (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`${plan.bgColor} ${plan.borderColor} border-2 relative overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    推薦
                  </div>
                )}
                {plan.discount && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                    {plan.discount}
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {plan.icon}
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.duration && (
                          <p className="text-sm text-gray-600">{plan.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">{plan.price}</div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {plan.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {feature.included ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-800' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.id !== 'free' && (
                    <Button 
                      className={`w-full mt-4 ${
                        plan.id === 'trial' 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white font-semibold`}
                    >
                      {plan.id === 'trial' ? '立即體驗' : '立即購買'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'trial' && (
          <div className="space-y-6">
            {/* Trial Offer Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
              <CardContent className="p-6 text-center">
                <Star className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                <h2 className="text-2xl font-bold text-orange-800 mb-2">體驗版 7 天免費試用</h2>
                <p className="text-orange-700 mb-4">使用 50 點數即可解鎖所有進階功能</p>
                
                <div className="bg-white p-4 rounded-lg mb-4">
                  <div className="text-3xl font-bold text-orange-600">50 點數</div>
                  <div className="text-sm text-gray-600">原價 $300</div>
                </div>
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-lg">
                  <Gift className="w-5 h-5 mr-2" />
                  立即兌換體驗
                </Button>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-500" />
                  體驗版專屬功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    '進階數據分析報告',
                    '無限制名片夾容量',
                    '移除所有廣告',
                    '客製化名片樣式',
                    '優先客服支援',
                    '專屬會員徽章',
                    '批量匯出功能'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Unlock className="w-4 h-4 text-green-500" />
                      <span className="text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="space-y-6">
            {/* Premium Offer Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardContent className="p-6 text-center">
                <Crown className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold text-purple-800 mb-2">商務版年繳方案</h2>
                <p className="text-purple-700 mb-4">專業團隊的最佳選擇</p>
                
                <div className="bg-white p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold text-purple-600">$7,200</span>
                    <span className="text-lg text-purple-600">/年</span>
                  </div>
                  <div className="text-sm text-gray-600 line-through">原價 $14,400</div>
                  <Badge className="bg-red-500 text-white mt-2">限時 50% OFF</Badge>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg">
                  <Crown className="w-5 h-5 mr-2" />
                  立即購買
                </Button>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  商務版專屬功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    '團隊協作與管理',
                    'API 整合服務',
                    '專屬客戶經理',
                    '白標客製化方案',
                    '數據備份與保護',
                    '進階安全設定',
                    '無限制用戶數量',
                    '24/7 技術支援'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gray-50">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">需要客製化方案？</h3>
                <p className="text-sm text-gray-600 mb-3">
                  聯繫我們的業務團隊，為您量身打造專屬解決方案
                </p>
                <Button variant="outline" className="w-full">
                  聯繫業務團隊
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeExperience;