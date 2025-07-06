
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Settings, Eye, EyeOff, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CreateCard from './CreateCard';
import { ProfileSettings } from './MyCustomers/ProfileSettings';
import Points from './Points';

interface MyCardProps {
  onClose: () => void;
}

const MyCard: React.FC<MyCardProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileSettings, setProfileSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: true
  });
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('aile-card-data');
    if (savedData) {
      setCardData(JSON.parse(savedData));
    }

    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      setProfileSettings(JSON.parse(savedSettings));
    }
  }, []);

  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} />;
  }

  if (showSettings) {
    return <ProfileSettings onClose={() => setShowSettings(false)} />;
  }

  if (showPoints) {
    return <Points onClose={() => setShowPoints(false)} />;
  }

  if (!cardData) {
    return (
      <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">我的電子名片</h1>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">尚未建立電子名片</h2>
            <p className="text-gray-600">建立您的專屬電子名片，讓更多人認識您</p>
          </div>

          <Button 
            onClick={() => setShowCreateCard(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            建立我的名片
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg">
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
            <h1 className="font-bold text-lg">我的電子名片</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 公開狀態顯示 */}
        <div className="mb-4">
          <Badge 
            variant={profileSettings.isPublicProfile ? "default" : "secondary"}
            className={`${
              profileSettings.isPublicProfile 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {profileSettings.isPublicProfile ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                公開名片
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                私人名片
              </>
            )}
          </Badge>
        </div>

        {/* 名片預覽 */}
        <Card className="mb-6 shadow-lg border-2 border-green-200">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-4">
                {cardData.photo && (
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={cardData.photo} alt="照片" />
                    <AvatarFallback className="bg-white text-green-600 font-bold">
                      {cardData.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{cardData.name}</h2>
                  <p className="text-green-100">{cardData.companyName}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {cardData.phone && <div>📱 {cardData.phone}</div>}
                {cardData.email && <div>✉️ {cardData.email}</div>}
                {cardData.website && <div>🌐 {cardData.website}</div>}
                {cardData.line && <div>💬 LINE: {cardData.line}</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按鈕 */}
        <div className="space-y-3">
          <Button 
            onClick={() => setShowCreateCard(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            編輯名片
          </Button>

          <Button 
            onClick={() => setShowSettings(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            公開設定
          </Button>

          <Button 
            onClick={() => setShowPoints(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Award className="w-4 h-4 mr-2" />
            會員點數
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="border-gray-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* 設定說明 */}
        <Card className="mt-6 bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">名片公開說明</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 公開名片：其他用戶可以在智能推薦中找到您</li>
              <li>• 私人名片：僅限您主動分享的人可以查看</li>
              <li>• 可隨時在公開設定中調整</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyCard;
