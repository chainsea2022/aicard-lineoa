import React from 'react';
import { X, Download, Smartphone, Apple, PlayCircle, Star, Shield, Zap, Users, BarChart3, Bell, Camera, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UpgradeExperienceProps {
  onClose: () => void;
}

const UpgradeExperience: React.FC<UpgradeExperienceProps> = ({ onClose }) => {
  const appFeatures = [
    {
      icon: <Bell className="w-6 h-6 text-blue-500" />,
      title: '即時推播通知',
      description: '重要聯絡人動態即時提醒'
    },
    {
      icon: <Camera className="w-6 h-6 text-green-500" />,
      title: '快速名片掃描',
      description: '一鍵拍照自動識別名片資訊'
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: '離線名片分享',
      description: '無網路環境也能交換聯絡資訊'
    },
    {
      icon: <Globe className="w-6 h-6 text-orange-500" />,
      title: '跨平台同步',
      description: '手機、平板、電腦資料完美同步'
    },
    {
      icon: <Shield className="w-6 h-6 text-red-500" />,
      title: '安全加密保護',
      description: '企業級加密技術保護個人隱私'
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: '智能推薦功能',
      description: 'AI 智能分析人脈關係網'
    }
  ];

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl flex items-center">
            <Download className="w-6 h-6 mr-2" />
            下載 APP
          </h1>
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

      <div className="p-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg mb-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full shadow-lg">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              AiCard APP
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              開啟人脈的通行證<br />
              Unlock Your Smart Network
            </p>
            <div className="flex items-center justify-center space-x-2 text-yellow-500 mb-4">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <span className="text-gray-600 ml-2">4.9 顆星評價</span>
            </div>
            <p className="text-sm text-gray-500">超過 100,000+ 用戶推薦使用</p>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-4 mb-8">
          <Card className="bg-gradient-to-r from-gray-900 to-black text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-xl">
                  <Apple className="w-8 h-8 text-black" />
                </div>
                <div className="flex-1">
                  <div className="text-sm opacity-90">Download on the</div>
                  <div className="text-xl font-bold">App Store</div>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white text-black hover:bg-gray-100 font-semibold"
                  onClick={() => window.open('#', '_blank')}
                >
                  下載
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-xl">
                  <PlayCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm opacity-90">GET IT ON</div>
                  <div className="text-xl font-bold">Google Play</div>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
                  onClick={() => window.open('#', '_blank')}
                >
                  下載
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Features */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            APP 專屬功能
          </h3>
          <div className="grid gap-4">
            {appFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-xl border border-blue-200">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* QR Code Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              掃描 QR Code 快速下載
            </h3>
            <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md inline-block mb-4">
              {/* QR Code placeholder */}
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs text-blue-600 font-medium">QR Code</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              使用手機相機掃描即可下載
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-blue-500 text-white px-3 py-1">iOS</Badge>
              <Badge className="bg-green-500 text-white px-3 py-1">Android</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
            🎉 下載 APP 專屬優惠
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">新用戶註冊即送 <strong className="text-orange-600">100 點數</strong></span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">APP 限定功能 <strong className="text-orange-600">免費體驗 7 天</strong></span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">推薦好友再送 <strong className="text-orange-600">50 點數</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeExperience;