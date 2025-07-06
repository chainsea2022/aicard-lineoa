import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Settings, Eye, EyeOff, Award, User, Smartphone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CreateCard from './CreateCard';
import { ProfileSettings } from './MyCustomers/ProfileSettings';
import Points from './Points';
import OTPVerification from './OTPVerification';

interface MyCardProps {
  onClose: () => void;
}

const MyCard: React.FC<MyCardProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [profileSettings, setProfileSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: true
  });

  useEffect(() => {
    const savedCardData = localStorage.getItem('aile-card-data');
    const savedUserData = localStorage.getItem('aile-user-data');
    
    if (savedCardData) {
      setCardData(JSON.parse(savedCardData));
    }
    
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }

    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      setProfileSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleVerificationComplete = (phone: string) => {
    setShowOTPVerification(false);
    setShowCreateCard(true);
  };

  const handleLineLogin = () => {
    // 模擬 LINE 登入 - 生成模擬的 LINE 用戶資料
    const mockLineUser = {
      lineId: `line_${Math.random().toString(36).substr(2, 8)}`,
      displayName: '王小明',
      pictureUrl: null,
      loginMethod: 'line',
      registeredAt: new Date(),
      isVerified: true
    };

    // 儲存用戶登入資訊
    localStorage.setItem('aile-user-data', JSON.stringify(mockLineUser));
    setUserData(mockLineUser);
    
    // 直接進入名片建立
    setShowCreateCard(true);
  };

  const handleCardCreated = () => {
    setShowCreateCard(false);
    // 重新載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      setCardData(JSON.parse(savedCardData));
    }
  };

  const handleLogout = () => {
    // 清除所有用戶相關資料
    localStorage.removeItem('aile-card-data');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aile-profile-settings');
    
    // 重置狀態
    setCardData(null);
    setUserData(null);
    setShowCreateCard(false);
    setShowSettings(false);
    setShowPoints(false);
    setShowOTPVerification(false);
    setProfileSettings({
      isPublicProfile: false,
      allowDirectContact: true
    });
  };

  if (showOTPVerification) {
    return <OTPVerification onClose={() => setShowOTPVerification(false)} onVerificationComplete={handleVerificationComplete} />;
  }

  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} onRegistrationComplete={handleCardCreated} userData={userData} />;
  }

  if (showSettings) {
    return <ProfileSettings onClose={() => setShowSettings(false)} />;
  }

  if (showPoints) {
    return <Points onClose={() => setShowPoints(false)} />;
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-lg">
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
            <h1 className="font-bold text-lg">
              {userData && cardData ? '我的電子名片' : '快速註冊登入'}
            </h1>
          </div>
          {userData && cardData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-1" />
              登出
            </Button>
          )}
        </div>
      </div>

      {/* 如果沒有用戶資料或名片資料，顯示快速註冊登入介面 */}
      {(!userData || !cardData) && (
        <div className="p-6">
          {/* 歡迎區塊 */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">歡迎使用電子名片</h2>
            <p className="text-gray-600 text-sm">
              建立您的專屬電子名片，輕鬆分享聯絡資訊
            </p>
          </div>

          {/* 快速註冊登入選項 */}
          <div className="space-y-4 mb-6">
            <Card 
              className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => setShowOTPVerification(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">手機號碼註冊</h3>
                    <p className="text-sm text-gray-600">使用手機號碼快速註冊，安全可靠</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer"
              onClick={handleLineLogin}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">LINE 快速登入</h3>
                    <p className="text-sm text-gray-600">使用LINE帳號一鍵登入 (模擬)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 註冊按鈕 */}
          <div className="space-y-3">
            <Button 
              onClick={() => setShowOTPVerification(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg font-medium shadow-lg"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              開始手機註冊
            </Button>

            <Button 
              onClick={handleLineLogin}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-lg font-medium shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z"/>
              </svg>
              LINE 登入 (模擬)
            </Button>
          </div>

          {/* 功能說明 */}
          <Card className="mt-6 bg-blue-50 border border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-3">註冊後您可以：</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  建立專屬電子名片
                </li>
                <li className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  快速分享聯絡資訊
                </li>
                <li className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  獲得會員點數獎勵
                </li>
                <li className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  管理個人資料設定
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 服務條款 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              註冊即表示您同意我們的
              <span className="text-blue-500 underline cursor-pointer mx-1">服務條款</span>
              和
              <span className="text-blue-500 underline cursor-pointer mx-1">隱私政策</span>
            </p>
          </div>
        </div>
      )}

      {/* 已登入用戶的名片管理介面 */}
      {userData && cardData && (
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
      )}
    </div>
  );
};

export default MyCard;
