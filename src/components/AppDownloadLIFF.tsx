import React from 'react';
import { X, Download, Smartphone, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AppDownloadLIFFProps {
  onClose: () => void;
}

const AppDownloadLIFF: React.FC<AppDownloadLIFFProps> = ({ onClose }) => {
  const handleDownload = (platform: 'ios' | 'android') => {
    // 這裡可以添加實際的下載連結或追蹤邏輯
    console.log(`Downloading for ${platform}`);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">下載專屬APP</h1>
            <p className="text-xs text-gray-600">解鎖完整功能體驗</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-4">
        {/* App Preview */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">AI Card 專屬APP</h2>
          <p className="text-gray-600 text-xs leading-relaxed px-2">
            專為現代商務人士打造的智能名片管理平台，讓您的人脈管理更高效、更智能。
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">APP 專屬功能</h3>
          
          <Card className="border border-blue-100 bg-blue-50/50">
            <CardContent className="p-2.5">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs">進階名片管理</h4>
                  <p className="text-xs text-gray-600 mt-0.5">無限制標籤分類、批量管理、智能搜尋</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-100 bg-green-50/50">
            <CardContent className="p-2.5">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs">AI 智能推薦</h4>
                  <p className="text-xs text-gray-600 mt-0.5">基於業務場景的精準人脈推薦</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-100 bg-purple-50/50">
            <CardContent className="p-2.5">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs">企業級安全</h4>
                  <p className="text-xs text-gray-600 mt-0.5">資料加密保護、隱私控制設定</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={() => handleDownload('ios')}
            className="w-full bg-black hover:bg-gray-800 text-white h-10 rounded-xl flex items-center justify-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-300">Download on the</div>
                <div className="text-xs font-semibold">App Store</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleDownload('android')}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-10 rounded-xl flex items-center justify-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-green-200">GET IT ON</div>
                <div className="text-xs font-semibold">Google Play</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Special Offer */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <span className="text-base">🎉</span>
            <span className="font-semibold text-gray-900 text-xs">限時優惠</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            現在下載APP即享 <span className="font-semibold text-orange-600">30天免費試用</span> 所有進階功能！
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadLIFF;